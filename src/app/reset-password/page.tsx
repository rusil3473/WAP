"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function ResetPassword() {
  const router=useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token,setToken]=useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      await axios.post("/api/users/reset-password",{token,password})
      router.push("/login")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.log(error)
    }
  };
  useEffect(()=>{
    const t=window.location.search.split("=")[1];
    console.log(t)
    setToken(t);
  }, []);
 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">
          Reset Your Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-500 text-white font-medium text-lg rounded-lg shadow hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
