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

  // Gmail Folders (Dummy)
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
    setShowGmailModal(false);
    setActiveTab("gmail");
  };

  return (
    <div className="flex h-full border-r border-[#2a3942]">
      
      {/* 1. THIN ICON BAR (Left Side) - Ab Asli Logos ke saath! */}
      <div className="w-20 bg-[#202c33] flex flex-col items-center py-4 gap-6 border-r border-[#2a3942]">
        
        {/* WhatsApp Icon */}
        <button 
          onClick={() => setActiveTab("whatsapp")}
          className={`p-3 rounded-xl transition-all duration-200 ${activeTab === "whatsapp" ? "bg-[#2a3942] scale-110" : "hover:bg-[#2a3942] opacity-70 hover:opacity-100"}`}
          title="WhatsApp"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
            alt="WhatsApp" 
            className="w-8 h-8"
          />
        </button>

        {/* Telegram Icon */}
        <button 
          onClick={() => setActiveTab("telegram")}
          className={`p-3 rounded-xl transition-all duration-200 ${activeTab === "telegram" ? "bg-[#2a3942] scale-110" : "hover:bg-[#2a3942] opacity-70 hover:opacity-100"}`}
          title="Telegram"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" 
            alt="Telegram" 
            className="w-8 h-8"
          />
        </button>

        {/* Gmail Icon */}
        <button 
          onClick={() => {
            if (!gmailToken) setShowGmailModal(true);
            else setActiveTab("gmail");
          }}
          className={`p-3 rounded-xl transition-all duration-200 ${activeTab === "gmail" ? "bg-[#2a3942] scale-110" : "hover:bg-[#2a3942] opacity-70 hover:opacity-100"}`}
          title="Gmail"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" 
            alt="Gmail" 
            className="w-8 h-8"
          />
        </button>

      </div>

      {/* 2. LIST AREA (Right Side) */}
      <div className="w-80 bg-[#111b21] flex flex-col">
        
        {/* Header */}
        <div className="h-16 bg-[#202c33] flex items-center px-4 border-b border-[#2a3942]">
          <h1 className="text-[#e9edef] text-xl font-bold flex items-center gap-2">
            {activeTab === "whatsapp" && <span className="text-green-500">WhatsApp Chat</span>}
            {activeTab === "telegram" && <span className="text-blue-400">Telegram Chat</span>}
            {activeTab === "gmail" && <span className="text-red-500">Gmail Inbox</span>}
          </h1>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto">
          
          {/* A. Agar Gmail Tab hai */}
          {activeTab === "gmail" && (
            <div>
              {!gmailToken ? (
                <div className="p-5 text-center text-gray-400 mt-10">
                  <p className="mb-4 text-sm">Connect your Google account to view emails.</p>
                  <button 
                    onClick={() => setShowGmailModal(true)}
                    className="bg-white text-gray-800 hover:bg-gray-200 px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 mx-auto transition"
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" className="w-4 h-4" />
                    Connect Gmail
                  </button>
                </div>
              ) : (
                <div className="p-2">
                  {gmailFolders.map((folder) => (
                    <div key={folder.name} className="flex justify-between p-3 hover:bg-[#202c33] cursor-pointer rounded-lg text-[#e9edef] transition">
                      <span className="flex items-center gap-3">
                        {folder.name === "Inbox" && "📥"}
                        {folder.name === "Starred" && "⭐"}
                        {folder.name === "Sent" && "📤"}
                        {folder.name === "Spam" && "🚫"}
                        {folder.name === "Trash" && "🗑️"}
                        {folder.name}
                      </span>
                      {folder.count > 0 && <span className="text-xs bg-[#00a884] text-black font-bold px-2 py-1 rounded-full">{folder.count}</span>}
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
                  className="p-3 border-b border-[#2a3942] hover:bg-[#202c33] cursor-pointer flex gap-3 items-center transition"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-lg">
                    {chat.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                       <h3 className="text-[#e9edef] font-medium">{chat.name}</h3>
                       <span className="text-xs text-gray-500">12:30 PM</span>
                    </div>
                    <p className="text-gray-400 text-sm truncate">{chat.msg}</p>
                  </div>
                </div>
            ))
          )}
        </div>
      </div>

      {/* 3. MODAL */}
      {showGmailModal && (
        <GmailConnectModal 
          onClose={() => setShowGmailModal(false)}
          onConnected={handleGmailConnected}
        />
      )}

    </div>
  );
}
