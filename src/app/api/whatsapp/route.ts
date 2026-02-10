import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone, message } = await request.json();

    // 1. अगर नंबर या मैसेज खाली है तो एरर दो
    if (!phone || !message) {
      return NextResponse.json({ error: "Phone and Message are required" }, { status: 400 });
    }

    // 2. Meta (WhatsApp) API को कॉल करें
    // नोट: ये टोकन हम .env फाइल में रखेंगे ताकि कोई चुरा न सके
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;

    const response = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phone, // जिस नंबर पर मैसेज भेजना है
        type: "text",
        text: { body: message }
      }),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ success: false, error: data.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

