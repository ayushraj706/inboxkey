"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/Button"; // आपका चकली वाला बटन

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // बटन घूमना शुरू करेगा

    // सुरक्षा चेक: सिर्फ आयुष भाई के लिए
    if (email !== "ayushrajayushhh@gmail.com") {
      alert("Access Denied: यह सिस्टम सिर्फ आयुष राज के लिए है!");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // डैशबोर्ड पर भेजें
    } catch (error: any) {
      alert("गलत पासवर्ड! " + error.message);
      setLoading(false); // बटन रुक जाएगा
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-darkBg text-white p-4">
      <div className="w-full max-w-md space-y-8 bg-[#111b21] p-8 rounded-xl shadow-2xl border border-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-100">Ayush Hub</h2>
          <p className="mt-2 text-sm text-gray-400">Success Point में आपका स्वागत है</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <input
                type="email"
                required
                placeholder="Email Address"
                className="w-full rounded-lg border border-gray-700 bg-[#202c33] px-4 py-3 text-white placeholder-gray-500 focus:border-metaGreen focus:outline-none focus:ring-1 focus:ring-metaGreen"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                placeholder="Password"
                className="w-full rounded-lg border border-gray-700 bg-[#202c33] px-4 py-3 text-white placeholder-gray-500 focus:border-metaGreen focus:outline-none focus:ring-1 focus:ring-metaGreen"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* आपका स्पेशल बटन */}
          <Button text="Login to Dashboard" type="submit" isLoading={loading} />
        </form>
      </div>
    </div>
  );
}
