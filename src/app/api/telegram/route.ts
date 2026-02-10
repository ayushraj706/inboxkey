import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { chatId, message } = await request.json();

    // 1. चेक करें कि डेटा है या नहीं
    if (!chatId || !message) {
      return NextResponse.json({ error: "Chat ID and Message are required" }, { status: 400 });
    }

    // 2. Telegram API को कॉल करें
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId, // जिसे मैसेज भेजना है
        text: message
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      return NextResponse.json({ success: false, error: data.description }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

