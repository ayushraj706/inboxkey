"use client";
import React, { useState, useEffect } from 'react';
// import { db } from '@/lib/firebase'; // बाद में जब कीज (Keys) डालेंगे तब इसे अन-कमेंट करेंगे

export default function ChatWindow({ selectedUser }: { selectedUser: any }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Real-time Data Fetching (Dummy Logic for now)
  useEffect(() => {
    if(!selectedUser) return;
    
    // यहाँ Firebase का onSnapshot कोड आएगा जो बिना रिफ्रेश किए मैसेज लाएगा
    // अभी के लिए हम डमी मैसेज दिखा रहे हैं
    setMessages([
      { id: 1, text: "Hello Ayush!", sender: "them", time: "10:00 AM" },
      { id: 2, text: "Project kaisa chal raha hai?", sender: "me", time: "10:05 AM" }
    ]);
  }, [selectedUser]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // मैसेज लिस्ट में अभी दिखाने के लिए (Optimistic Update)
    setMessages([...messages, { id: Date.now(), text: newMessage, sender: "me", time: "Just now" }]);
    setNewMessage("");

    // बाद में यहाँ Firebase और WhatsApp API का कोड आएगा
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 hidden md:flex items-center justify-center bg-[#222e35] text-gray-400 border-b-[6px] border-metaGreen flex-col">
        <h1 className="text-3xl font-light text-gray-200 mb-4">Ayush Hub Web</h1>
        <p>Send and receive messages without keeping your phone online.</p>
        <p className="mt-2 text-sm">Use WhatsApp, Gmail & Telegram from one place.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0b141a] relative">
       {/* Chat Header */}
      <div className="p-3 bg-[#202c33] flex items-center gap-4 border-l border-gray-700">
        <div className="w-10 h-10 rounded-full bg-gray-500"></div>
        <span className="text-white font-bold">{selectedUser.name}</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('/bg-chat-tile-dark.png')]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[60%] p-2 rounded-lg text-sm text-white ${msg.sender === 'me' ? 'bg-[#005c4b]' : 'bg-[#202c33]'}`}>
              <p>{msg.text}</p>
              <span className="text-[10px] text-gray-400 block text-right mt-1">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 bg-[#202c33] flex items-center gap-2">
        <button type="button" className="text-gray-400 hover:text-white p-2">📷</button>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message" 
          className="flex-1 bg-[#2a3942] text-white rounded-lg px-4 py-2 outline-none"
        />
        <button type="submit" className="text-metaGreen p-2 hover:bg-gray-800 rounded-full">➤</button>
      </form>
    </div>
  );
}

