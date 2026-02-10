"use client";
import React, { useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Sidebar({ onSelectUser }: { onSelectUser: (user: any) => void }) {
  const router = useRouter();
  const [profilePic, setProfilePic] = useState("/default-avatar.png");
  const [contacts, setContacts] = useState<any[]>([]); // कॉन्टैक्ट्स सेव करने के लिए
  const [loading, setLoading] = useState(false);

  const handleSyncGmail = async () => {
    setLoading(true);
    try {
      // 1. Google से परमिशन माँगेगा
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (!token) return;

      // 2. Google People API से कॉन्टैक्ट्स लाएगा
      const response = await fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      // 3. डेटा को सही फॉर्मेट में बदलेगा
      if (data.connections) {
        const formattedContacts = data.connections.map((person: any, index: number) => ({
          id: index,
          name: person.names?.[0]?.displayName || "Unknown",
          phone: person.phoneNumbers?.[0]?.value || "No Number",
          avatar: person.photos?.[0]?.url || ""
        }));
        setContacts(formattedContacts); // लिस्ट अपडेट हो जाएगी
      } else {
        alert("कोई कॉन्टैक्ट नहीं मिला!");
      }

    } catch (error) {
      console.error("Sync Error:", error);
      alert("Sync फेल हो गया! क्या आपने Google Console में People API इनेबल की है?");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="w-full md:w-1/3 bg-white dark:bg-[#111b21] border-r border-gray-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 bg-[#202c33] flex justify-between items-center text-gray-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-metaGreen flex items-center justify-center text-white font-bold">
            AR
          </div>
          <span className="font-bold text-white">Ayush Raj</span>
        </div>
        <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
      </div>

      {/* Sync Button */}
      <div className="p-2 bg-[#111b21]">
        <button 
          onClick={handleSyncGmail}
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center justify-center gap-2 mb-2 transition-all"
        >
          {loading ? (
            <span>🔄 Syncing...</span>
          ) : (
            <>
              <span>📧</span> Sync Gmail Contacts
            </>
          )}
        </button>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto bg-[#111b21]">
        {contacts.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 text-sm">
            अभी कोई कॉन्टैक्ट नहीं है.<br/>'Sync Gmail Contacts' बटन दबाएं.
          </div>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} onClick={() => onSelectUser(contact)} className="flex items-center gap-3 p-3 hover:bg-[#202c33] cursor-pointer border-b border-gray-800">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs overflow-hidden">
                 {contact.name[0]}
              </div>
              <div className="text-white">
                <h4 className="text-sm font-semibold">{contact.name}</h4>
                <p className="text-xs text-gray-400">{contact.phone}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
