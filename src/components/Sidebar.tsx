"use client";
import { useState } from "react";
import GmailConnectModal from "./GmailConnectModal";

export default function Sidebar({ onSelectChat }: any) {
  const [activeTab, setActiveTab] = useState("whatsapp"); // whatsapp, telegram, gmail
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [gmailToken, setGmailToken] = useState<string | null>(null);
  
  // Compose (Email Likhne ka Form) States
  const [showCompose, setShowCompose] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sending, setSending] = useState(false);

  // Fake Contacts for Demo
  const chats = [
    { id: 1, name: "Rahul (WhatsApp)", msg: "Bhai code bhej de", type: "whatsapp" },
    { id: 2, name: "Telegram Bot", msg: "/start command working?", type: "telegram" },
  ];

  // Dummy Folders
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

  // 🚀 ASLI EMAIL BHEJNE KA FUNCTION (Google API)
  const sendEmail = async () => {
    if (!gmailToken) return alert("Gmail connect nahi hai!");
    setSending(true);

    // 1. Email ko 'Raw' format me badalna padta hai (Base64)
    const messageParts = [
      `To: ${emailTo}`,
      "Subject: " + emailSubject,
      "",
      emailBody
    ];
    const message = messageParts.join("\n");
    
    // Encode to Base64 (Google ki requirement)
    const encodedMessage = btoa(message).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    try {
      // 2. Google ko bhejo
      const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${gmailToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: encodedMessage }),
      });

      if (response.ok) {
        alert("Email Sent Successfully! 🚀");
        setShowCompose(false); // Form band karo
        setEmailTo(""); setEmailSubject(""); setEmailBody(""); // Form saaf karo
      } else {
        alert("Error sending email. Check console.");
        console.error(await response.json());
      }
    } catch (error) {
      alert("Network Error!");
      console.error(error);
    }
    setSending(false);
  };

  return (
    <div className="flex h-full border-r border-[#2a3942]">
      
      {/* 1. THIN ICON BAR (Left Side) */}
      <div className="w-20 bg-[#202c33] flex flex-col items-center py-4 gap-6 border-r border-[#2a3942]">
        
        {/* WhatsApp Icon */}
        <button 
          onClick={() => setActiveTab("whatsapp")}
          className={`p-3 rounded-xl transition-all duration-200 ${activeTab === "whatsapp" ? "bg-[#2a3942] scale-110" : "hover:bg-[#2a3942] opacity-70 hover:opacity-100"}`}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-8 h-8" />
        </button>

        {/* Telegram Icon */}
        <button 
          onClick={() => setActiveTab("telegram")}
          className={`p-3 rounded-xl transition-all duration-200 ${activeTab === "telegram" ? "bg-[#2a3942] scale-110" : "hover:bg-[#2a3942] opacity-70 hover:opacity-100"}`}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="Telegram" className="w-8 h-8" />
        </button>

        {/* Gmail Icon */}
        <button 
          onClick={() => {
            if (!gmailToken) setShowGmailModal(true);
            else setActiveTab("gmail");
          }}
          className={`p-3 rounded-xl transition-all duration-200 ${activeTab === "gmail" ? "bg-[#2a3942] scale-110" : "hover:bg-[#2a3942] opacity-70 hover:opacity-100"}`}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" className="w-8 h-8" />
        </button>

      </div>

      {/* 2. LIST AREA (Right Side) */}
      <div className="w-80 bg-[#111b21] flex flex-col relative">
        
        {/* Header */}
        <div className="h-16 bg-[#202c33] flex items-center justify-between px-4 border-b border-[#2a3942]">
          <h1 className="text-[#e9edef] text-xl font-bold">
            {activeTab === "whatsapp" && <span className="text-green-500">WhatsApp</span>}
            {activeTab === "telegram" && <span className="text-blue-400">Telegram</span>}
            {activeTab === "gmail" && <span className="text-red-500">Gmail</span>}
          </h1>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto">
          
          {/* A. GMAIL TAB */}
          {activeTab === "gmail" && (
            <div>
              {!gmailToken ? (
                <div className="p-5 text-center mt-10">
                  <button onClick={() => setShowGmailModal(true)} className="bg-white text-black px-4 py-2 rounded-full font-bold">
                    Connect Gmail
                  </button>
                </div>
              ) : (
                <div className="p-3">
                  {/* ✨ COMPOSE BUTTON ✨ */}
                  <button 
                    onClick={() => setShowCompose(true)}
                    className="w-full bg-[#e9edef] hover:bg-white text-gray-800 py-3 rounded-xl font-bold mb-4 flex items-center justify-center gap-2 transition shadow-lg"
                  >
                    <span>✏️</span> Compose Email
                  </button>

                  {/* Folder List */}
                  {gmailFolders.map((folder) => (
                    <div key={folder.name} className="flex justify-between p-3 hover:bg-[#202c33] cursor-pointer rounded-lg text-[#e9edef] transition">
                      <span className="flex items-center gap-3">{folder.name}</span>
                      {folder.count > 0 && <span className="text-xs bg-[#00a884] text-black font-bold px-2 py-1 rounded-full">{folder.count}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* B. WHATSAPP/TELEGRAM TABS */}
          {activeTab !== "gmail" && (
            chats.filter(c => c.type === activeTab).map((chat) => (
               <div key={chat.id} onClick={() => onSelectChat(chat)} className="p-3 border-b border-[#2a3942] hover:bg-[#202c33] cursor-pointer">
                 <h3 className="text-white">{chat.name}</h3>
                 <p className="text-gray-400 text-sm">{chat.msg}</p>
               </div>
            ))
          )}
        </div>

        {/* 📧 COMPOSE POPUP FORM (Isi ke upar khulega) */}
        {showCompose && (
          <div className="absolute inset-0 bg-[#0b141a] z-50 flex flex-col animate-in slide-in-from-bottom-10">
            {/* Form Header */}
            <div className="bg-[#202c33] p-3 flex justify-between items-center border-b border-[#2a3942]">
              <span className="text-white font-bold">New Message</span>
              <button onClick={() => setShowCompose(false)} className="text-gray-400 hover:text-white text-xl">&times;</button>
            </div>

            {/* Form Inputs */}
            <div className="p-4 space-y-3 flex-1">
              <input 
                type="email" 
                placeholder="To" 
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                className="w-full bg-[#2a3942] text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#00a884]"
              />
              <input 
                type="text" 
                placeholder="Subject" 
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full bg-[#2a3942] text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#00a884]"
              />
              <textarea 
                placeholder="Compose email" 
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full h-40 bg-[#2a3942] text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#00a884] resize-none"
              ></textarea>
            </div>

            {/* Send Button */}
            <div className="p-4 border-t border-[#2a3942]">
              <button 
                onClick={sendEmail}
                disabled={sending}
                className="w-full bg-[#00a884] hover:bg-[#008f6f] text-black font-bold py-2 rounded-lg flex justify-center items-center gap-2"
              >
                {sending ? "Sending..." : "Send ➤"}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Connection Modal */}
      {showGmailModal && (
        <GmailConnectModal onClose={() => setShowGmailModal(false)} onConnected={handleGmailConnected} />
      )}
    </div>
  );
          }
