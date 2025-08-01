import { NextResponse } from "next/server";

interface LeadInput {
  name: string;
  phone: string;
  email?: string;
  comment?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadInput & { consent?: boolean };
    if (!body.name || !body.phone) {
      return NextResponse.json({ message: "name and phone required" }, { status: 400 });
    }

    // Send to Telegram if env vars exist
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const text = `🚚 Новая заявка:\nИмя: ${body.name}\nТел: ${body.phone}\nEmail: ${body.email ?? "-"}\nКомментарий: ${body.comment ?? "-"}`;
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
    }

    // TODO: add CRM webhook integration here

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ message }, { status: 500 });
  }
}