/**
 * 🆓 Serverless Calculator API - Vercel Function
 * Расчет стоимости БЕЗ серверов и подписок!
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

// Схема валидации входных данных
const CalculationSchema = z.object({
  fromCity: z.string().min(2).max(100),
  toCity: z.string().min(2).max(100),
  cargoType: z.enum(['GENERAL', 'FURNITURE', 'APPLIANCES', 'FRAGILE', 'HEAVY']),
  weight: z.number().min(1).max(20000),
  volume: z.number().min(0.1).max(100),
  urgent: z.boolean().optional(),
  insurance: z.boolean().optional()
});

// Тарифная сетка (статические данные)
const PRICING_MATRIX = {
  // Базовые расстояния (км)
  distances: {
    'Москва-Санкт-Петербург': 635,
    'Москва-Екатеринбург': 1416,
    'Москва-Казань': 719,
    'Москва-Нижний Новгород': 411,
    'Санкт-Петербург-Екатеринбург': 1766,
    // ... добавить все популярные маршруты
  },
  
  // Базовая стоимость за км (₽)
  pricePerKm: {
    GENERAL: 25,
    FURNITURE: 35,
    APPLIANCES: 40,
    FRAGILE: 45,
    HEAVY: 50
  },
  
  // Коэффициенты
  multipliers: {
    urgent: 1.5,
    insurance: 1.1,
    nightTime: 1.2,
    weekend: 1.15
  },
  
  // Минимальная стоимость
  minimumPrice: 3000
};

// Геокодинг (заглушка - в production использовать Nominatim)
const getCityCoordinates = async (city: string) => {
  const coordinates = {
    'Москва': { lat: 55.7558, lon: 37.6176 },
    'Санкт-Петербург': { lat: 59.9311, lon: 30.3609 },
    'Екатеринбург': { lat: 56.8431, lon: 60.6454 },
    'Казань': { lat: 55.8304, lon: 49.0661 },
    'Нижний Новгород': { lat: 56.2965, lon: 43.9361 }
  };
  
  return coordinates[city as keyof typeof coordinates] || null;
};

// Расчет расстояния между городами (формула гаверсинусов)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Радиус Земли в км
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Основной алгоритм расчета
const calculatePrice = async (data: z.infer<typeof CalculationSchema>) => {
  const { fromCity, toCity, cargoType, weight, volume, urgent, insurance } = data;
  
  // 1. Получаем координаты городов
  const fromCoords = await getCityCoordinates(fromCity);
  const toCoords = await getCityCoordinates(toCity);
  
  if (!fromCoords || !toCoords) {
    throw new Error('Город не найден в базе данных');
  }
  
  // 2. Рассчитываем расстояние
  const distance = calculateDistance(
    fromCoords.lat, fromCoords.lon,
    toCoords.lat, toCoords.lon
  );
  
  // 3. Базовая стоимость
  const pricePerKm = PRICING_MATRIX.pricePerKm[cargoType];
  let basePrice = distance * pricePerKm;
  
  // 4. Коэффициент за объем/вес
  const volumeCoeff = Math.max(1, volume / 10); // За каждые 10 м³
  const weightCoeff = Math.max(1, weight / 1000); // За каждую тонну
  basePrice *= Math.max(volumeCoeff, weightCoeff);
  
  // 5. Применяем множители
  if (urgent) {
    basePrice *= PRICING_MATRIX.multipliers.urgent;
  }
  
  if (insurance) {
    basePrice *= PRICING_MATRIX.multipliers.insurance;
  }
  
  // 6. Проверяем минимальную стоимость
  const finalPrice = Math.max(basePrice, PRICING_MATRIX.minimumPrice);
  
  // 7. Расчет времени доставки
  const deliveryTime = Math.ceil(distance / 500); // 500 км в день
  const urgentTime = urgent ? Math.ceil(deliveryTime / 2) : deliveryTime;
  
  return {
    price: Math.round(finalPrice),
    distance: Math.round(distance),
    deliveryTime: urgentTime,
    breakdown: {
      basePrice: Math.round(basePrice),
      urgentSurcharge: urgent ? Math.round(basePrice * 0.5) : 0,
      insuranceCost: insurance ? Math.round(basePrice * 0.1) : 0,
      minimumApplied: finalPrice === PRICING_MATRIX.minimumPrice
    },
    route: {
      from: fromCity,
      to: toCity,
      fromCoords,
      toCoords
    },
    cargo: {
      type: cargoType,
      weight,
      volume
    }
  };
};

// Edge Runtime для максимальной скорости
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
    // Валидация входных данных
    const data = CalculationSchema.parse(req.body);
    
    // Расчет стоимости
    const calculation = await calculatePrice(data);
    
    // Кэширование на 1 час
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    // Успешный ответ
    res.status(200).json({
      success: true,
      data: calculation,
      timestamp: new Date().toISOString(),
      cached: false
    });
    
  } catch (error) {
    console.error('Calculation error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Неверные входные данные',
        details: error.errors
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Ошибка при расчете стоимости',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}