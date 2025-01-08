"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      if (user.email && user.password) {
        await axios.post("/api/users/login", user);
        router.push("/dashboard");
      } else {
        alert("Please fill in both fields.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">
          Login to Your Account
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.currentTarget.value })}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.currentTarget.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-500 text-white font-medium text-lg rounded-lg shadow hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
          >
            Login
          </button>
        </form>
        <div className="text-center text-gray-600 mt-6">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-500 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
          <p className="mt-2">
            <Link href="/forgot-password" className="text-blue-500 font-medium hover:underline">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
