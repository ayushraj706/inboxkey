"use client";
import React, { useState, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
  time: string;
  status: 'sending' | 'sent' | 'error';
}

interface ChatWindowProps {
  selectedUser: any;
  gmailToken: string | null;
}

export default function ChatWindow({ selectedUser, gmailToken }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setMessages([
        { id: 1, text: `Chat with ${selectedUser.name}`, sender: "them", time: "Start", status: 'sent' }
      ]);
    }
  }, [selectedUser]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    // 1. स्क्रीन पर मैसेज दिखाओ
    const tempId = Date.now();
    const tempMsg: Message = { 
      id: tempId, text: newMessage, sender: "me", time: "Just now", status: 'sending' 
    };
    
    setMessages((prev) => [...prev, tempMsg]);
    const msgToSend = newMessage;
    setNewMessage(""); 
    setSending(true);

    try {
      let endpoint = '';
      let bodyData = {};

      // --- LOGIC: कहाँ भेजना है? ---
      
      // Case A: Telegram
      if (selectedUser.platform === 'telegram') {
        endpoint = '/api/telegram';
        bodyData = { chatId: selectedUser.chatId, message: msgToSend };
      } 
      // Case B: Gmail (Email)
      else if (selectedUser.platform === 'email') {
        if (!gmailToken) {
          alert("Gmail Token नहीं मिला! कृपया Sidebar में 'Sync Gmail' बटन दोबारा दबाएं।");
          setSending(false);
          return;
        }
        endpoint = '/api/gmail';
        bodyData = { 
          token: gmailToken, // चाबी साथ भेजनी होगी
          to: selectedUser.email, // ईमेल एड्रेस
          message: msgToSend 
        };
      }
      // Case C: WhatsApp (Default)
      else {
        endpoint = '/api/whatsapp';
        bodyData = { phone: selectedUser.phone, message: msgToSend };
      }

      // API Call
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => prev.map(msg => msg.id === tempId ? { ...msg, status: 'sent' } : msg));
      } else {
        throw new Error(data.error || "Failed");
      }

    } catch (error) {
      console.error("Failed:", error);
      setMessages((prev) => prev.map(msg => msg.id === tempId ? { ...msg, status: 'error' } : msg));
      alert("⚠️ मैसेज/ईमेल फेल हो गया!");
    } finally {
      setSending(false);
    }
  };

  if (!selectedUser) return <div className="flex-1 bg-[#222e35] hidden md:block"></div>;

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0b141a] relative">
       {/* Header */}
      <div className="p-3 bg-[#202c33] flex items-center gap-4 border-l border-gray-700 shadow-sm z-10">
        <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">
          {selectedUser.name ? selectedUser.name[0] : "?"}
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold">{selectedUser.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {selectedUser.platform === 'email' ? selectedUser.email : selectedUser.phone}
            </span>
            {/* Tag displays platform */}
            <span className={`text-[10px] px-1 rounded text-white ${
              selectedUser.platform === 'telegram' ? 'bg-blue-500' : 
              selectedUser.platform === 'email' ? 'bg-red-500' : 'bg-green-600'
            }`}>
              {selectedUser.platform?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('/bg-chat-tile-dark.png')]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[60%] p-2 rounded-lg text-sm text-white shadow-md relative 
              ${msg.sender === 'me' ? 'bg-[#005c4b]' : 'bg-[#202c33]'} 
              ${msg.status === 'error' ? 'border border-red-500' : ''}`}
            >
              <p className="mr-4">{msg.text}</p>
              <span className="text-[10px] text-gray-300 block text-right mt-1 opacity-70">
                {msg.time} {msg.sender === 'me' && (msg.status === 'sent' ? '✓✓' : msg.status === 'sending' ? '🕒' : '⚠️')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-[#202c33] flex items-center gap-2 z-10">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={`Send to ${selectedUser.platform}...`} 
          className="flex-1 bg-[#2a3942] text-white rounded-lg px-4 py-2 outline-none border border-transparent focus:border-metaGreen"
        />
        <button type="submit" disabled={sending} className="text-metaGreen p-2 hover:bg-gray-800 rounded-full">
          {sending ? '⏳' : '➤'}
        </button>
      </form>
    </div>
  );
}
