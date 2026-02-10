"use client";
import React, { useState, useEffect } from 'react';

// मैसेज का स्ट्रक्चर (Status के साथ)
interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
  time: string;
  status: 'sending' | 'sent' | 'error'; // यहाँ नया जादुई फीचर है
}

export default function ChatWindow({ selectedUser }: { selectedUser: any }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // डमी डेटा (बाद में हटेगा)
  useEffect(() => {
    if (selectedUser) {
      setMessages([
        { id: 1, text: `Hello ${selectedUser.name}`, sender: "them", time: "10:00 AM", status: 'sent' }
      ]);
    }
  }, [selectedUser]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    // 1. मैसेज को "Sending" (पेंडिंग) स्टेट में लिस्ट में जोड़ें
    const tempId = Date.now();
    const tempMsg: Message = { 
      id: tempId, 
      text: newMessage, 
      sender: "me", 
      time: "Just now",
      status: 'sending' // अभी भेज रहे हैं...
    };
    
    setMessages((prev) => [...prev, tempMsg]);
    const msgToSend = newMessage;
    setNewMessage(""); 

    try {
      // 2. API कॉल करें
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: selectedUser.phone,
          message: msgToSend
        })
      });

      const data = await res.json();

      if (data.success) {
        // 3. अगर सफल हुआ, तो Status बदलकर "Sent" (हरा) कर दें
        setMessages((prev) => 
          prev.map(msg => msg.id === tempId ? { ...msg, status: 'sent' } : msg)
        );
      } else {
        throw new Error(data.error || "Unknown Error");
      }

    } catch (error) {
      console.error("Failed:", error);
      // 4. अगर फेल हुआ, तो Status बदलकर "Error" (लाल) कर दें
      setMessages((prev) => 
        prev.map(msg => msg.id === tempId ? { ...msg, status: 'error' } : msg)
      );
      // एक छोटा सा नोटिफिकेशन
      alert("⚠️ मैसेज नहीं जा पाया! लाल निशान पर चेक करें।");
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 hidden md:flex items-center justify-center bg-[#222e35] text-gray-400 border-b-[6px] border-metaGreen flex-col text-center p-4">
        <h1 className="text-3xl font-light text-gray-200 mb-4">Ayush Hub Web</h1>
        <p>WhatsApp API Connection Ready</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0b141a] relative">
       {/* Chat Header */}
      <div className="p-3 bg-[#202c33] flex items-center gap-4 border-l border-gray-700 shadow-sm z-10">
        <div className="w-10 h-10 rounded-full bg-metaGreen flex items-center justify-center text-white font-bold">
          {selectedUser.name ? selectedUser.name[0] : "?"}
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold">{selectedUser.name}</span>
          <span className="text-xs text-gray-400">{selectedUser.phone || "No Number"}</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('/bg-chat-tile-dark.png')]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[60%] p-2 rounded-lg text-sm text-white shadow-md relative 
              ${msg.sender === 'me' ? 'bg-[#005c4b]' : 'bg-[#202c33]'} 
              ${msg.status === 'error' ? 'border border-red-500' : ''}`} // एरर होने पर लाल बॉर्डर
            >
              <p className="mr-4">{msg.text}</p>
              
              {/* Status Icons Logic */}
              <span className="text-[10px] text-gray-300 block text-right mt-1 opacity-70 flex justify-end gap-1 items-center">
                {msg.time} 
                {msg.sender === 'me' && (
                  <>
                    {msg.status === 'sending' && <span>🕒</span>} {/* घड़ी */}
                    {msg.status === 'sent' && <span className="text-blue-400">✓✓</span>} {/* ब्लू टिक */}
                    {msg.status === 'error' && <span className="text-red-500 font-bold" title="Retry">⚠️ Failed</span>} {/* खतरा */}
                  </>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 bg-[#202c33] flex items-center gap-2 z-10">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..." 
          className="flex-1 bg-[#2a3942] text-white rounded-lg px-4 py-2 outline-none border border-transparent focus:border-metaGreen"
        />
        <button type="submit" className="text-metaGreen p-2 hover:bg-gray-800 rounded-full">➤</button>
      </form>
    </div>
  );
}
