"use client";
import { useState } from "react";
import GmailConnectModal from "./GmailConnectModal";

export default function Sidebar({ onSelectChat }: any) {
  const [activeTab, setActiveTab] = useState("whatsapp"); // whatsapp, telegram, gmail
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [gmailToken, setGmailToken] = useState<string | null>(null);

  // Fake Contacts for Demo
  const chats = [
    { id: 1, name: "Rahul (WhatsApp)", msg: "Bhai code bhej de", type: "whatsapp" },
    { id: 2, name: "Telegram Bot", msg: "/start command working?", type: "telegram" },
  ];

  // Gmail Folders (Ye API se aayenge baad me, abhi dummy hain)
  const gmailFolders = [
    { name: "Inbox", count: 4 },
    { name: "Starred", count: 0 },
    { name: "Sent", count: 12 },
    { name: "Spam", count: 1 },
    { name: "Trash", count: 0 },
  ];

  // Jab Gmail Connect ho jaye
  const handleGmailConnected = (user: any, token: string) => {
    setGmailToken(token);
    setShowGmailModal(false); // Modal band karo
    setActiveTab("gmail");    // Gmail tab par le jao
  };

  return (
    <div className="flex h-full border-r border-[#2a3942]">
      
      {/* 1. THIN ICON BAR (Left Side) */}
      <div className="w-16 bg-[#202c33] flex flex-col items-center py-4 gap-6 border-r border-[#2a3942]">
        
        {/* WhatsApp Icon */}
        <button 
          onClick={() => setActiveTab("whatsapp")}
          className={`p-3 rounded-xl transition ${activeTab === "whatsapp" ? "bg-[#2a3942]" : "hover:bg-[#2a3942]"}`}
        >
          <span className="text-2xl">🟢</span>
        </button>

        {/* Telegram Icon */}
        <button 
          onClick={() => setActiveTab("telegram")}
          className={`p-3 rounded-xl transition ${activeTab === "telegram" ? "bg-[#2a3942]" : "hover:bg-[#2a3942]"}`}
        >
          <span className="text-2xl">🔵</span>
        </button>

        {/* Gmail Icon (Red) */}
        <button 
          onClick={() => {
            // Agar token nahi hai to connect karo, varna tab kholo
            if (!gmailToken) setShowGmailModal(true);
            else setActiveTab("gmail");
          }}
          className={`p-3 rounded-xl transition ${activeTab === "gmail" ? "bg-[#2a3942]" : "hover:bg-[#2a3942]"}`}
        >
          <span className="text-2xl">🔴</span>
        </button>

      </div>

      {/* 2. LIST AREA (Right Side) */}
      <div className="w-80 bg-[#111b21] flex flex-col">
        
        {/* Header */}
        <div className="h-16 bg-[#202c33] flex items-center px-4 border-b border-[#2a3942]">
          <h1 className="text-[#e9edef] text-xl font-bold">
            {activeTab === "whatsapp" && "WhatsApp"}
            {activeTab === "telegram" && "Telegram"}
            {activeTab === "gmail" && "Gmail Inbox"}
          </h1>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto">
          
          {/* A. Agar Gmail Tab hai */}
          {activeTab === "gmail" && (
            <div>
              {!gmailToken ? (
                <div className="p-5 text-center text-gray-400 mt-10">
                  <p className="mb-4">Gmail is not connected.</p>
                  <button 
                    onClick={() => setShowGmailModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold"
                  >
                    Connect Gmail
                  </button>
                </div>
              ) : (
                // Folder List (Jaisa screenshot me tha)
                <div className="p-2">
                  {gmailFolders.map((folder) => (
                    <div key={folder.name} className="flex justify-between p-3 hover:bg-[#202c33] cursor-pointer rounded-lg text-[#e9edef]">
                      <span>📁 {folder.name}</span>
                      {folder.count > 0 && <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">{folder.count}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* B. Agar WhatsApp/Telegram Tab hai */}
          {activeTab !== "gmail" && (
            chats
              .filter(c => c.type === activeTab)
              .map((chat) => (
                <div 
                  key={chat.id} 
                  onClick={() => onSelectChat(chat)}
                  className="p-3 border-b border-[#2a3942] hover:bg-[#202c33] cursor-pointer flex gap-3 items-center"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                    {chat.name[0]}
                  </div>
                  <div>
                    <h3 className="text-[#e9edef] font-medium">{chat.name}</h3>
                    <p className="text-gray-400 text-sm truncate">{chat.msg}</p>
                  </div>
                </div>
            ))
          )}
        </div>
      </div>

      {/* 3. MODAL (Ye tab dikhega jab showGmailModal true hoga) */}
      {showGmailModal && (
        <GmailConnectModal 
          onClose={() => setShowGmailModal(false)}
          onConnected={handleGmailConnected}
        />
      )}

    </div>
  );
}
