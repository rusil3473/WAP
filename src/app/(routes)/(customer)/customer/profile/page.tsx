"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NavBar } from "@/app/components/NavBar";

type CustomerProfile = {
  _id: string;
  fullName: string;
  email: string;
  role: "customer" | "owner" | "admin" | null;
  isVerified: boolean;
  hasPassword: boolean;
};

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/customer/profile");
      const payload = response.data?.data as CustomerProfile | undefined;
      if (!payload) {
        throw new Error("Missing profile payload");
      }
      setProfile(payload);
      setFullName(payload.fullName);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to load profile");
      } else {
        toast.error("Failed to load profile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put("/api/customer/profile", { fullName });
      const updated = response.data?.profile as CustomerProfile | undefined;
      if (!updated) {
        throw new Error("Missing updated profile payload");
      }
      setProfile(updated);
      setFullName(updated.fullName);
      toast.success("Profile updated");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to update profile");
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    void fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
          <p className="text-sm text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <NavBar landing={false} role="Customer" />

      <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-md sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">Customer Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your account details.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.currentTarget.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={profile?.email ?? ""}
                disabled
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-slate-500"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-wide text-slate-500">Role</p>
              <p className="mt-1 font-semibold capitalize">{profile?.role ?? "None"}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-wide text-slate-500">Verification</p>
              <p className="mt-1 font-semibold">{profile?.isVerified ? "Verified" : "Not verified"}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-wide text-slate-500">Password</p>
              <p className="mt-1 font-semibold">{profile?.hasPassword ? "Set" : "Not set"}</p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => void saveProfile()}
            className="mt-8 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </main>

      <footer className="bg-slate-200 py-4 text-center text-sm text-slate-600">
        &copy; 2026 Warehouse Aggregation Platform
      </footer>
    </div>
  );
}
