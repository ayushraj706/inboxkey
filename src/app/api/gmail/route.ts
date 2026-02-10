import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, to, subject, message } = await request.json();

    if (!token) return NextResponse.json({ error: "No Token" }, { status: 401 });

    // ईमेल को एक खास फॉर्मेट (Base64) में बदलना पड़ता है ताकि Google उसे पढ़ सके
    const emailContent = [
      `To: ${to}`,
      `Subject: ${subject || "Message from Ayush Hub"}`,
      `Content-Type: text/plain; charset="UTF-8"`,
      ``,
      message
    ].join('\n');

    const encodedEmail = Buffer.from(emailContent).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ raw: encodedEmail })
    });

    const data = await response.json();
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
