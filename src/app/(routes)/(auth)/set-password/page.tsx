"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";
import { getDashboardRouteForRole } from "@/lib/role-routing";

export default function SetPasswordPage() {
  const router = useRouter();
  const { user, isLoading, refreshUser } = useUser();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    if (isLoading || !user) {
      return;
    }

    if (user.hasPassword) {
      if (!user.role) {
        router.replace("/choose-role");
        return;
      }

      router.replace(getDashboardRouteForRole(user.role));
    }
  }, [isLoading, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (isMismatch) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/auth/set-password", { password });
      await refreshUser();
      toast.success("Password set successfully");

      if (user?.role) {
        router.replace(getDashboardRouteForRole(user.role));
        return;
      }

      router.replace("/choose-role");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Unable to set password");
      } else {
        toast.error("Unable to set password");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">Set Your Password</h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Add a password so you can sign in using either Google or email/password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your new password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
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
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.currentTarget.value)}
              required
            />
          </div>

          {isMismatch ? <p className="mb-3 text-red-600">Password does not match</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-blue-500 text-white font-medium text-lg rounded-lg shadow-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition duration-300 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSubmitting ? "Saving..." : "Save Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

