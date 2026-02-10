"use client";
import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Sidebar({ onSelectUser }: { onSelectUser: (user: any) => void }) {
  const router = useRouter();
  const [profilePic, setProfilePic] = useState("/default-avatar.png"); // डिफ़ॉल्ट फोटो

  // यह फंक्शन बाद में Gmail API से जुड़कर नंबर लाएगा
  const handleSyncGmail = () => {
    alert("Gmail API Connecting... (Contacts will appear here)");
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // प्रोफाइल फोटो बदलने का लॉजिक
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full md:w-1/3 bg-white dark:bg-[#111b21] border-r border-gray-700 flex flex-col h-screen">
      {/* Header: My Profile */}
      <div className="p-4 bg-[#202c33] flex justify-between items-center text-gray-300">
        <div className="flex items-center gap-3">
          <label htmlFor="profile-upload" className="cursor-pointer hover:opacity-80 relative group">
             {/* यहाँ आपकी फोटो दिखेगी */}
            <img src={profilePic} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-metaGreen" />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 text-xs text-white">Edit</div>
          </label>
          <input id="profile-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
          <span className="font-bold text-white">Ayush Raj</span>
        </div>
        <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
      </div>

      {/* Sync Buttons */}
      <div className="p-2 bg-[#111b21]">
        <button 
          onClick={handleSyncGmail}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center justify-center gap-2 mb-2"
        >
          <span>📧</span> Sync Gmail Contacts
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-2 bg-[#111b21]">
        <input 
          type="text" 
          placeholder="Search or start new chat" 
          className="w-full bg-[#202c33] text-white text-sm rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-metaGreen"
        />
      </div>

      {/* Contact List (Gmail वाले नंबर यहाँ आएँगे) */}
      <div className="flex-1 overflow-y-auto bg-[#111b21]">
        {/* अभी के लिए डमी डेटा, बाद में API से भरेगा */}
        {[1, 2, 3].map((i) => (
          <div key={i} onClick={() => onSelectUser({ name: `Contact ${i}`, id: i })} className="flex items-center gap-3 p-3 hover:bg-[#202c33] cursor-pointer border-b border-gray-800">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
              {i}
            </div>
            <div className="text-white">
              <h4 className="text-sm font-semibold">Gmail Contact {i}</h4>
              <p className="text-xs text-gray-400">Hey there! I am using WhatsApp.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

