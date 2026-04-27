"use client";

import { useState, FormEvent } from "react";
import { z } from "zod";

// 1. Zod Schema 
const customerSchema = z.object({
  fullName: z.string().min(2, "Full Name is required").regex(/^[^0-9]+$/, "Name cannot contain numbers"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/[@#$&]/, "Must contain a special character (@, #, $, or &)"),
  phone: z.string().min(1, "Phone number is required").regex(/^\d+$/, "Numbers only").length(11, "Must be exactly 11 digits").regex(/^01/, "Must start with 01"),
  address: z.string().min(5, "Delivery Address is required"),
});

export default function AddCustomerForm() {
  // 2. Manual State for inputs 
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  const [error, setError] = useState("");

  // 3. FULL-STACK Submit Handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate using Zod safeParse
    const result = customerSchema.safeParse({ fullName, email, password, phone, address });

    if (!result.success) {
      setError(result.error.issues[0]?.message || "Validation failed");
      return;
    }

    setError(""); // Clear errors
    console.log("Valid Frontend Data Ready for Database:", result.data);

    try {
      // 🚨 Change this port number to match your NestJS Backend terminal!
      const response = await fetch('http://localhost:3000/customers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.data.fullName, 
          email: result.data.email,
          phone: result.data.phone,
          address: result.data.address,
          password: result.data.password
        }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! 🎉 Please check your terminal for the link.");
        // Clear the form after success
        setFullName(""); setEmail(""); setPassword(""); setPhone(""); setAddress("");
      } else {
        // This catches Backend errors (like "Email already exists!")
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the backend server. Is NestJS running?");
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      
      {/* LEFT SIDE: Visual/Marketing (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-pink-600 flex-col justify-center items-center px-12 text-center overflow-hidden">
        {/* Background Image & Pink Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070')" }}
        ></div>
        <div className="absolute inset-0 bg-[#e21b70] opacity-80 mix-blend-multiply"></div>
        
        {/* Text Content over the image */}
        <div className="relative z-10 text-white mt-10">
          <div className="bg-white text-transparent p-4 mb-6 inline-block rounded">
             {/* You can put your actual FoodHouse logo image here later! */}
             <span className="text-black font-bold text-xl tracking-widest">FOOD HOUSE</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Start your food <br/> journey today.
          </h1>
          <p className="text-lg font-medium text-pink-50 max-w-md mx-auto">
            Create an account and get access to exclusive deals, fast delivery, and the best restaurants in your area.
          </p>
        </div>
        
        <div className="absolute bottom-6 left-6 text-white text-sm font-semibold z-10">
          © 2026 FOOD HOUSE
        </div>
      </div>

      {/* RIGHT SIDE: The Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create account</h2>
          <p className="text-gray-500 mb-8 font-medium">Join Food House and start ordering.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 border text-gray-600 rounded-lg outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition-colors" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 border text-gray-600 rounded-lg outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition-colors" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 border text-gray-600 rounded-lg outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition-colors" />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Phone Number</label>
              <input type="text" placeholder="01XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} 
                className="w-full px-4 py-3 border text-gray-600 rounded-lg outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition-colors" />
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Delivery Address</label>
              <input type="text" placeholder="House, Road, Area" value={address} onChange={(e) => setAddress(e.target.value)} 
                className="w-full px-4 py-3 border text-gray-600 rounded-lg outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition-colors" />
            </div>

            {/* Error Message */}
            {error && <div className="text-red-500 text-sm font-bold text-center mt-2">{error}</div>}

            {/* Submit Button */}
            <button type="submit" 
              className="w-full bg-[#f0146b] hover:bg-[#d0105b] text-white font-bold py-3.5 rounded-lg transition-colors mt-4 shadow-md">
              Create Account
            </button>

          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-[#f0146b] font-bold hover:underline">Sign In</a>
          </div>
          
          <div className="mt-8 text-center text-xs text-gray-400">
            By creating an account, you agree to Food House's <a href="#" className="font-bold hover:underline text-gray-500">Terms of Service</a><br/>
            and <a href="#" className="font-bold hover:underline text-gray-500">Privacy Policy</a>.
          </div>

        </div>
      </div>
    </div>
  );
}