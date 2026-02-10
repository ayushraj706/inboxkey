"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // ये हैं वो स्टेट्स जो डेटा को इधर-उधर भेजेंगे
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [gmailToken, setGmailToken] = useState<string | null>(null); // चाबी यहाँ सेव होगी

  const router = useRouter();

  // लॉगिन चेक करना
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login'); 
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="h-screen bg-[#111b21] flex items-center justify-center text-metaGreen">Loading Success Point...</div>;

  if (!user) return null; 

  return (
    <div className="flex h-screen overflow-hidden text-white">
      {/* Sidebar को हम एक नया फंक्शन दे रहे हैं 'onTokenReceived' 
         ताकि जब लॉगिन हो, तो वह टोकन यहाँ भेज दे 
      */}
      <Sidebar 
        onSelectUser={(chatUser: any) => setSelectedChat(chatUser)} 
        onTokenReceived={(token: string) => setGmailToken(token)}
      />
      
      {/* ChatWindow को हम वह 'gmailToken' दे रहे हैं 
         ताकि वह मेल भेज सके 
      */}
      <ChatWindow 
        selectedUser={selectedChat} 
        gmailToken={gmailToken}
      />
    </div>
  );
}
