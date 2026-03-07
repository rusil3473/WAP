"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { NavBar } from "@/app/components/NavBar";
import { useUser } from "@/context/UserContext";

export default function SupportPage() {
  const { user } = useUser();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsSubmitting(false);
    setSubject("");
    setMessage("");
    setPriority("medium");
    toast.success("Support request captured. We will contact you soon.");
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <NavBar landing={false} />

      <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900">Support</h1>
        <p className="mt-1 text-sm text-slate-500">
          Raise issues, ask product questions, or request booking assistance.
        </p>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
            <p className="mt-2 text-sm font-semibold text-slate-800">support@wap.local</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Phone</p>
            <p className="mt-2 text-sm font-semibold text-slate-800">+91 00000 00000</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Working Hours</p>
            <p className="mt-2 text-sm font-semibold text-slate-800">Mon-Sat, 9:00 AM - 7:00 PM</p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Create Support Request</h2>
          <p className="mt-1 text-sm text-slate-500">
            Logged in as {user?.email ?? "unknown user"}
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="subject" className="mb-1 block text-sm font-medium text-slate-700">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(event) => setSubject(event.currentTarget.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="e.g. Booking payment issue"
                required
              />
            </div>

            <div className="sm:max-w-xs">
              <label htmlFor="priority" className="mb-1 block text-sm font-medium text-slate-700">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(event) => setPriority(event.currentTarget.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(event) => setMessage(event.currentTarget.value)}
                rows={5}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Describe your issue in detail..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
