/**
 * 🆓 Serverless Lead Processing - Vercel Function
 * Обработка лидов БЕЗ серверов с Supabase + Telegram!
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

// Схема валидации лида (152-ФЗ compliance)
const LeadSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+7\d{10}$/, 'Неверный формат телефона'),
  email: z.string().email().optional(),
  message: z.string().max(1000).optional(),
  calculationData: z.object({
    fromCity: z.string(),
    toCity: z.string(),
    cargoType: z.string(),
    weight: z.number(),
    volume: z.number(),
    price: z.number()
  }).optional(),
  
  // 152-ФЗ РФ обязательные поля
  consent: z.boolean().refine(val => val === true, {
    message: 'Необходимо согласие на обработку персональных данных'
  }),
  
  // UTM метки для аналитики
  utmData: z.object({
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
    term: z.string().optional(),
    content: z.string().optional()
  }).optional(),
  
  // Технические данные
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  timezone: z.string().optional()
});

// Создание Supabase клиента (edge-совместимый)
const createSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }
  
  return {
    url: supabaseUrl,
    key: supabaseKey,
    
    // Простой REST клиент для edge runtime
    async insert(table: string, data: any) {
      const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Supabase error: ${response.statusText}`);
      }
      
      return response.json();
    }
  };
};

// Отправка уведомления в Telegram
const sendTelegramNotification = async (leadData: any) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    console.warn('Telegram credentials not configured');
    return null;
  }
  
  const message = `
🔥 <b>НОВЫЙ ЛИД!</b>

👤 <b>Клиент:</b> ${leadData.name}
📞 <b>Телефон:</b> ${leadData.phone}
${leadData.email ? `📧 <b>Email:</b> ${leadData.email}` : ''}

${leadData.calculationData ? `
🚛 <b>ЗАЯВКА:</b>
📍 <b>Откуда:</b> ${leadData.calculationData.fromCity}
📍 <b>Куда:</b> ${leadData.calculationData.toCity}
📦 <b>Груз:</b> ${leadData.calculationData.cargoType}
⚖️ <b>Вес:</b> ${leadData.calculationData.weight} кг
📏 <b>Объем:</b> ${leadData.calculationData.volume} м³
💰 <b>Стоимость:</b> ${leadData.calculationData.price.toLocaleString()} ₽
` : ''}

${leadData.message ? `💬 <b>Сообщение:</b>\n${leadData.message}` : ''}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}

🎯 <b>ПЕРЕЗВОНИТЬ В ТЕЧЕНИЕ 15 МИНУТ!</b>
  `.trim();
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Telegram notification failed:', error);
    return null;
  }
};

// Отправка email через EmailJS (fallback)
const sendEmailNotification = async (leadData: any) => {
  // EmailJS отправляется с frontend для безопасности
  // Здесь только логируем для дублирования
  console.log('Email notification would be sent for lead:', leadData.name);
  return true;
};

// Обработка лида
const processLead = async (leadData: z.infer<typeof LeadSchema>, metadata: any) => {
  const supabase = createSupabaseClient();
  
  // Подготовка данных для сохранения
  const leadRecord = {
    name: leadData.name,
    phone: leadData.phone,
    email: leadData.email || null,
    message: leadData.message || null,
    calculation_data: leadData.calculationData || null,
    
    // 152-ФЗ поля
    consent_given: leadData.consent,
    consent_date: new Date().toISOString(),
    consent_ip: metadata.ip,
    consent_user_agent: metadata.userAgent || leadData.userAgent || null,
    
    // UTM метки
    utm_source: leadData.utmData?.source || null,
    utm_medium: leadData.utmData?.medium || null,
    utm_campaign: leadData.utmData?.campaign || null,
    utm_term: leadData.utmData?.term || null,
    utm_content: leadData.utmData?.content || null,
    
    // Метаданные
    referrer: leadData.referrer || null,
    timezone: leadData.timezone || 'Europe/Moscow',
    created_at: new Date().toISOString(),
    
    // Статус обработки
    status: 'NEW',
    priority: leadData.calculationData ? 'HIGH' : 'NORMAL'
  };
  
  // Сохранение в Supabase
  const savedLead = await supabase.insert('leads', leadRecord);
  
  // Отправка уведомлений
  const [telegramResult, emailResult] = await Promise.allSettled([
    sendTelegramNotification(leadData),
    sendEmailNotification(leadData)
  ]);
  
  return {
    leadId: savedLead[0]?.id || 'unknown',
    notifications: {
      telegram: telegramResult.status === 'fulfilled',
      email: emailResult.status === 'fulfilled'
    }
  };
};

// Rate limiting в памяти (простая реализация)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (ip: string, limit: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (entry.count >= limit) {
    return false;
  }
  
  entry.count++;
  return true;
};

// Edge Runtime
export const config = {
  runtime: 'edge',
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    // Получаем IP для rate limiting
    const clientIp = req.headers['x-forwarded-for']?.toString() || 
                     req.headers['x-real-ip']?.toString() || 
                     'unknown';
    
    // Rate limiting
    if (!checkRateLimit(clientIp)) {
      res.status(429).json({
        success: false,
        error: 'Слишком много заявок. Попробуйте через 15 минут.'
      });
      return;
    }
    
    // Валидация входных данных
    const leadData = LeadSchema.parse(req.body);
    
    // Метаданные запроса
    const metadata = {
      ip: clientIp,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    };
    
    // Обработка лида
    const result = await processLead(leadData, metadata);
    
    // Успешный ответ
    res.status(200).json({
      success: true,
      message: 'Заявка принята! Перезвоним в течение 15 минут.',
      leadId: result.leadId,
      notifications: result.notifications,
      timestamp: metadata.timestamp
    });
    
  } catch (error) {
    console.error('Lead processing error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Некорректные данные в заявке',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Ошибка при обработке заявки. Попробуйте позже.',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}