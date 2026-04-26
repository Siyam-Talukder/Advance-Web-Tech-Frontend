"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Verifying your account...");

  useEffect(() => {
    const { userId, token } = params;
    if (!userId || !token) return;

    const verifyAccount = async () => {
      try {
        const response = await fetch(`http://localhost:3000/customers/verify/${userId}/${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage("Your email has been successfully verified! You can now log in.");
          setTimeout(() => router.push('/home'), 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. The link may be invalid or expired.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Failed to connect to the server.");
      }
    };

    verifyAccount();
  }, [params, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans px-4">
      {/* 🟢 We use standard HTML here instead of the missing Title component! */}
      <title>Verify Email | FoodHouse</title> 
      
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        {status === "loading" && (
          <div>
            <div className="text-4xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-gray-800">Verifying...</h2>
            <p className="text-gray-500 mt-2">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="text-5xl mb-4 text-green-500">✅</div>
            <h2 className="text-2xl font-bold text-gray-800">Verified!</h2>
            <p className="text-gray-500 mt-2">{message}</p>
            <p className="text-sm text-gray-400 mt-4">Redirecting to login...</p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="text-5xl mb-4 text-red-500">❌</div>
            <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
            <p className="text-red-500 mt-2">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}