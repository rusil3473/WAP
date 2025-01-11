"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast"
export default function Signup() {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [err, setErr] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (user.fullName && user.email && user.password) {
      try {
        await axios.post("/api/users/signup", user);
        toast.success("Sigup Successful")
        router.push("/login");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  useEffect(() => {
    if (user.confirmPassword !== user.password) {
      setErr(true);
    } else {
      setErr(false);
    }
  }, [user.confirmPassword, user.password]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">Create Your Account</h1>
        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Full Name"
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.currentTarget.value })}
              required
            />
          </div>


          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.currentTarget.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.currentTarget.value })}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              value={user.confirmPassword}
              onChange={(e) => setUser({ ...user, confirmPassword: e.currentTarget.value })}
              required
            />
          </div>
          {err ? <p className="text-red-600">Password does not match</p> : ""}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-500 text-white font-medium text-lg rounded-lg shadow-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center text-gray-600 mt-6">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
