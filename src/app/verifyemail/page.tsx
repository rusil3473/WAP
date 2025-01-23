"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
interface CookieStore {
  [key: string]: string;
}

export default function VerifyEmailPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const handleToken = async () => {
    try {
      await axios.post("/api/users/verifyemail", { verifyToken: token });
      setStatus("Email verified successfully!");
      setTimeout(() => router.push("/login"), 3000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.data.message)
      setStatus("Failed to verify email. Please try again.");
    }
  };

  useEffect(() => {
    try {
      const cookies = document.cookie.split(';').reduce<CookieStore>((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      
      const token = cookies['token'];
      if (token) {
        setToken(token);
      } 
    } catch (error) {
      console.error("Cookie parsing error:", error);
      
    }
    
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      handleToken();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">Verify Your Email</h1>
        <div className="text-center">
          {status ? (
            <p className={`text-lg ${status.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
              {status}
            </p>
          ) : (
            <p className="text-lg text-gray-700">Verifying your email...</p>
          )}
        </div>
      </div>
    </div>
  );
}
