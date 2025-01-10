"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (email) {
      await axios.post("/api/users/forgot-password", { email });
      setSuccess(true);
      setErr(false);
      setEmail("");
      setTimeout(() => router.push("/login"), 2000); // Redirect to login after success
    } else {
      setErr(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-blue-700">
      <header className="bg-transparent text-white py-8">
        <h1 className="text-center text-4xl font-bold tracking-wider">Forgot Password</h1>
      </header>
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
            Reset Your Password
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Enter your email to reset password
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {err && (
              <p className="text-red-600 text-center mb-4">
                Please enter a valid email.
              </p>
            )}
            {success && (
              <p className="text-green-600 text-center mb-4">
                Password reset link has been sent!
              </p>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium text-lg rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-300"
            >
              Reset Password
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Remembered your password?{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
      <footer className="bg-gray-300 text-center py-4">
        <p className="text-gray-700">© 2025 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}
