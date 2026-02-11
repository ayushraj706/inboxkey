"use client";
import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
// 👇 सबसे जरुरी सुधार: Braces { } हटा दिए गए हैं
import Button from '@/components/ui/Button'; 

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/'); // लॉगिन होते ही होम पेज पर भेजो
    } catch (error) {
      console.error("Login Failed", error);
      alert("Login Failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#111b21] p-4">
      <div className="w-full max-w-md bg-[#202c33] p-8 rounded-lg shadow-xl text-center">
        {/* Logo or Icon */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-lg">
          AR
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Welcome to Ayush Hub</h1>
        <p className="text-gray-400 mb-8">Secure Access Dashboard</p>

        {/* Login Button */}
        <Button 
          onClick={handleLogin} 
          isLoading={loading}
          className="bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
        >
          Login with Google
        </Button>

        <p className="mt-6 text-xs text-gray-500">
          Only authorized users (Ayush Raj) can access the dashboard.
        </p>
      </div>
    </div>
  );
}
