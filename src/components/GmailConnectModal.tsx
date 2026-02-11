"use client";
import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Apni firebase file ka path check kar lena

export default function GmailConnectModal({ onClose, onConnected }: any) {
  // Checkbox States (User kya kya tick karega)
  const [permissions, setPermissions] = useState({
    read: true,      // Default ON
    send: false,
    modify: false,   // Delete/Spam
    labels: false,   // Manage Folders
    full: false,     // Dangerous
  });

  const [loading, setLoading] = useState(false);

  // Checkbox badalne ka function
  const handleCheckbox = (key: string) => {
    setPermissions((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  // Google Login Logic (Scopes ke saath)
  const handleConnect = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    // 1. Hamesha Basic Profile to leni hi hai
    provider.addScope("email");
    provider.addScope("profile");

    // 2. User ki pasand ke hisab se permission jodo
    if (permissions.read) provider.addScope("https://www.googleapis.com/auth/gmail.readonly");
    if (permissions.send) provider.addScope("https://www.googleapis.com/auth/gmail.send");
    if (permissions.modify) provider.addScope("https://www.googleapis.com/auth/gmail.modify");
    if (permissions.labels) provider.addScope("https://www.googleapis.com/auth/gmail.labels");
    if (permissions.full) provider.addScope("https://mail.google.com/");

    try {
      // User ko Google Login page par bhejo
      const result = await signInWithPopup(auth, provider);
      
      // Agar login safal hua
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      console.log("User Token:", token);
      alert("Gmail Connected Successfully! ✅");
      
      // Token ko save karne ke liye parent ko bhejo (Database me dalne ke liye)
      if (onConnected) onConnected(result.user, token);
      
    } catch (error) {
      console.error("Error connecting Gmail:", error);
      alert("Connection Failed! ❌");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1f2c34] w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-[#2a3942]">
        
        {/* Header */}
        <div className="bg-[#202c33] p-4 flex justify-between items-center border-b border-[#2a3942]">
          <h2 className="text-[#e9edef] text-lg font-semibold flex items-center gap-2">
            <span className="text-red-500 text-xl">M</span> Connect Gmail
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        {/* Body - Checkbox List */}
        <div className="p-6 space-y-4 text-[#d1d7db]">
          <p className="text-sm text-gray-400 mb-4">
            Select what <strong>Ayush Hub</strong> can do with your Gmail account:
          </p>

          {/* 1. Read Emails */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={permissions.read} 
              onChange={() => handleCheckbox("read")}
              className="mt-1 w-5 h-5 accent-[#00a884] bg-gray-700 border-gray-600 rounded"
            />
            <div>
              <span className="font-medium text-[#e9edef]">Read Emails (Recommended)</span>
              <p className="text-xs text-gray-500">View inbox, sent, starred & important mails.</p>
            </div>
          </label>

          {/* 2. Send Emails */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={permissions.send} 
              onChange={() => handleCheckbox("send")}
              className="mt-1 w-5 h-5 accent-[#00a884]"
            />
            <div>
              <span className="font-medium text-[#e9edef]">Send Emails</span>
              <p className="text-xs text-gray-500">Send replies directly from this app.</p>
            </div>
          </label>

          {/* 3. Modify (Spam/Delete) */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={permissions.modify} 
              onChange={() => handleCheckbox("modify")}
              className="mt-1 w-5 h-5 accent-[#00a884]"
            />
            <div>
              <span className="font-medium text-[#e9edef]">Manage Spam & Trash</span>
              <p className="text-xs text-gray-500">Delete emails or move to spam.</p>
            </div>
          </label>

           {/* 4. Labels */}
           <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={permissions.labels} 
              onChange={() => handleCheckbox("labels")}
              className="mt-1 w-5 h-5 accent-[#00a884]"
            />
            <div>
              <span className="font-medium text-[#e9edef]">Manage Labels</span>
              <p className="text-xs text-gray-500">Create or remove folders/labels.</p>
            </div>
          </label>

          {/* 5. Full Access (Red Zone) */}
          <div className="pt-2 border-t border-[#2a3942]">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={permissions.full} 
                onChange={() => handleCheckbox("full")}
                className="mt-1 w-5 h-5 accent-red-500"
              />
              <div>
                <span className="font-medium text-red-400">Full Account Access</span>
                <p className="text-xs text-gray-500">Dangerous: Full control over Gmail.</p>
              </div>
            </label>
          </div>

        </div>

        {/* Footer - Buttons */}
        <div className="p-4 bg-[#202c33] flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-[#00a884] hover:bg-[#2a3942] rounded-full text-sm font-semibold transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleConnect}
            disabled={loading}
            className="px-6 py-2 bg-[#00a884] hover:bg-[#008f6f] text-[#111b21] rounded-full text-sm font-bold transition flex items-center gap-2"
          >
            {loading ? "Connecting..." : "Continue & Connect"}
          </button>
        </div>

      </div>
    </div>
  );
}

