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
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const router = useRouter();

  // लॉगिन चेक करना
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login'); // अगर लॉगिन नहीं है तो लॉगिन पेज पर भेजो
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="h-screen bg-[#111b21] flex items-center justify-center text-metaGreen">Loading Success Point...</div>;

  if (!user) return null; // रीडायरेक्ट हो रहा है

  return (
    <div className="flex h-screen overflow-hidden">
      {/* लेफ्ट साइड: कांटेक्ट लिस्ट */}
      <Sidebar onSelectUser={(chatUser) => setSelectedChat(chatUser)} />
      
      {/* राइट साइड: चैटिंग */}
      <ChatWindow selectedUser={selectedChat} />
    </div>
  );
}

