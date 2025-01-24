"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast"
import { useSession, signIn, signOut } from "next-auth/react";
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
  const { data: session } = useSession();
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (user.fullName && user.email && user.password) {
      try {
        await axios.post("/api/users/signup", user);
        toast.success("Sigup Successful")
        router.push("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error:any) {
        toast.error(error.response.data.message)
        if(error.response.data.message==="Email alerady in use "){
          await signOut()
        }
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
    if(session){
      setUser({...user,fullName:session.user?.name || "",email:session.user?.email||""})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.confirmPassword, user.password,session]);
  if (!session) {
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
            {err && <p className="text-red-600 mb-4">Passwords do not match</p>}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white font-medium text-lg rounded-lg shadow-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition duration-300"
            >
              Sign Up
            </button>
          </form>
          <div className="text-center text-gray-600 mt-6">
            <button
              onClick={() => signIn("google")}
              className="w-full px-6 py-3 bg-red-500 text-white font-medium text-lg rounded-lg shadow-lg hover:bg-red-600 focus:ring-4 focus:ring-red-300 transition duration-300 mb-4"
            >
              Sign Up with Google
            </button>
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
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      <form className="w-full max-w-md bg-white p-8 rounded-lg shadow-2xl" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">Set Your Password</h2>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            onChange={(e)=>{setUser({...user,password:e.currentTarget.value})}}
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
            name="confirmPassword"
            value={user.confirmPassword}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm your password"
            onChange={(e)=>{setUser({...user,confirmPassword:e.currentTarget.value})}}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-500 text-white font-medium text-lg rounded-lg shadow-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
