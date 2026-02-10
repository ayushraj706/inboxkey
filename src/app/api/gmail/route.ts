import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, type, to, subject, message } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Access Token is missing" }, { status: 401 });
    }

    // --- CASE 1: ईमेल लिस्ट लाना (Inbox) ---
    if (type === 'list') {
      // 1. मैसेज की लिस्ट लाओ (सिर्फ IDs मिलेंगी)
      const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const listData = await listRes.json();

      if (!listData.messages) return NextResponse.json({ messages: [] });

      // 2. हर ID के लिए डिटेल लाओ (Snippet, Subject, Sender)
      const emails = await Promise.all(
        listData.messages.map(async (msg: any) => {
          const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const detail = await detailRes.json();
          
          // डेटा को साफ-सुथरा बनाना
          const headers = detail.payload.headers;
          const subject = headers.find((h: any) => h.name === 'Subject')?.value || "(No Subject)";
          const from = headers.find((h: any) => h.name === 'From')?.value || "Unknown";
          
          return {
            id: msg.id,
            text: detail.snippet, // ईमेल का छोटा हिस्सा
            sender: from,
            subject: subject,
            time: "Recently", // टाइम को बाद में फॉर्मेट कर सकते हैं
            status: 'received'
          };
        })
      );

      return NextResponse.json({ success: true, messages: emails });
    }

    // --- CASE 2: ईमेल भेजना (Sending) ---
    if (type === 'send') {
      // ईमेल को Gmail के फॉर्मेट (Base64) में बदलना पड़ता है
      const emailContent = [
        `To: ${to}`,
        `Subject: ${subject || "New Message from Ayush Hub"}`,
        `Content-Type: text/plain; charset="UTF-8"`,
        ``,
        message
      ].join('\n');

      const encodedEmail = Buffer.from(emailContent).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ raw: encodedEmail })
      });

      const sendData = await sendRes.json();
      return NextResponse.json({ success: true, data: sendData });
    }

    return NextResponse.json({ error: "Invalid Type" }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

