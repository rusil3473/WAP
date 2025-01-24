"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn, signOut, useSession } from "next-auth/react";
export default function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const router = useRouter();
  const [isSession,setIsSession]=useState(false);
  const { data: session } = useSession();
  const loginUser = async (/* e: { preventDefault: () => void } */) => {
    try {
      if ((user.email && user.password) || session) {
        await axios.post("/api/users/login", { formData: user, session });
        toast.success("Login Success")
        router.push("/");
      } else {
        alert("Please fill in both fields.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data.message);
      signOut();
    }
  };
  useEffect(()=>{
    if(session){
    setIsSession(true);
    loginUser();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[session])
  if (!isSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300">
          <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
            Login to Your Account
          </h1>
          <form onSubmit={(e) => {
            e.preventDefault();
            loginUser();
          }}>
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
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Enter your password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.currentTarget.value })}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white font-medium text-lg rounded-lg shadow-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition duration-300"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                signIn("google")
              }}
              className="w-full mt-4 px-6 py-3 bg-red-500 text-white font-medium text-lg rounded-lg shadow-lg hover:bg-red-600 focus:ring-4 focus:ring-red-300 transition duration-300"
            >
              Login with Google
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
  return (
    <h1>Login in process wait for some time</h1>
  )
}
/*const getUserToken=async()=>{
      try {
        await axios.post("/api/users/login",{session:sessiom})
      } catch (error) {
        console.log(error)
      }
    }
    getUserToken();*/