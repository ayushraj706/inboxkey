"use client";
import React, { useState, useEffect } from 'react';

export default function ChatWindow({ selectedUser }: { selectedUser: any }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  // जब भी नया यूजर सेलेक्ट हो, पुरानी चैट साफ कर दो (बाद में यहाँ Firebase से डेटा आएगा)
  useEffect(() => {
    if (selectedUser) {
      setMessages([
        { id: 1, text: `Hello ${selectedUser.name}`, sender: "them", time: "10:00 AM" }
      ]);
    }
  }, [selectedUser]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // अगर मैसेज खाली है या कोई यूजर सेलेक्ट नहीं है, तो कुछ मत करो
    if (!newMessage.trim() || !selectedUser) return;

    // 1. स्क्रीन पर तुरंत मैसेज दिखाओ (ताकि ऐप फास्ट लगे)
    const tempMsg = { 
      id: Date.now(), 
      text: newMessage, 
      sender: "me", 
      time: "Just now" 
    };
    
    setMessages((prev) => [...prev, tempMsg]);
    const msgToSend = newMessage; // मैसेज को एक वेरिएबल में सेव कर लो
    setNewMessage(""); // इनपुट बॉक्स खाली कर दो
    setSending(true); // लोडिंग शुरू

    try {
      // 2. असली WhatsApp API को कॉल करो (जो आपने api/whatsapp/route.ts में बनाया है)
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: selectedUser.phone, // साइडबार से मिला हुआ फोन नंबर
          message: msgToSend
        })
      });

      const data = await res.json();

      if (data.success) {
        console.log("मैसेज सफलतापूर्वक भेज दिया गया!");
      } else {
        console.error("मैसेज फेल:", data.error);
        // अगर फेल हो जाए तो यूजर को बता सकते हैं (अभी अलर्ट लगा रहा हूँ)
        // alert("मैसेज नहीं गया: " + JSON.stringify(data.error));
      }
    } catch (error) {
      console.error("नेटवर्क एरर:", error);
      alert("इंटरनेट नहीं चल रहा या सर्वर में दिक्कत है");
    } finally {
      setSending(false); // लोडिंग बंद
    }
  };

  // अगर कोई यूजर सेलेक्ट नहीं है, तो वेलकम स्क्रीन दिखाओ
  if (!selectedUser) {
    return (
      <div className="flex-1 hidden md:flex items-center justify-center bg-[#222e35] text-gray-400 border-b-[6px] border-metaGreen flex-col text-center p-4">
        <h1 className="text-3xl font-light text-gray-200 mb-4">Ayush Hub Web</h1>
        <p>Send and receive messages without keeping your phone online.</p>
        <p className="mt-2 text-sm">Use WhatsApp, Gmail & Telegram from one place.</p>
        <div className="mt-10 text-xs text-gray-500">🔒 End-to-end encrypted</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0b141a] relative">
       {/* Chat Header */}
      <div className="p-3 bg-[#202c33] flex items-center gap-4 border-l border-gray-700 shadow-sm z-10">
        <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">
          {selectedUser.name ? selectedUser.name[0] : "?"}
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold">{selectedUser.name}</span>
          <span className="text-xs text-gray-400">{selectedUser.phone || "No Number"}</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('/bg-chat-tile-dark.png')] bg-fixed">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[60%] p-2 rounded-lg text-sm text-white shadow-md relative ${msg.sender === 'me' ? 'bg-[#005c4b]' : 'bg-[#202c33]'}`}>
              <p className="mr-4">{msg.text}</p>
              <span className="text-[10px] text-gray-300 block text-right mt-1 opacity-70">
                {msg.time} 
                {msg.sender === 'me' && <span className="ml-1 text-blue-400">✓✓</span>}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 bg-[#202c33] flex items-center gap-2 z-10">
        <button type="button" className="text-gray-400 hover:text-white p-2 transition-colors">📷</button>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message" 
          className="flex-1 bg-[#2a3942] text-white rounded-lg px-4 py-2 outline-none border border-transparent focus:border-metaGreen transition-all"
        />
        <button 
          type="submit" 
          disabled={sending}
          className={`p-2 rounded-full transition-all ${sending ? 'text-gray-500 cursor-not-allowed' : 'text-metaGreen hover:bg-gray-800'}`}
        >
          {sending ? '⏳' : '➤'}
        </button>
      </form>
    </div>
  );
}
