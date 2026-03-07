"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const rawNextPath = searchParams.get("next");
  const nextPath = rawNextPath && rawNextPath.startsWith("/") ? rawNextPath : "/";

  const continueWithAccount = async () => {
    if (!(formData.email && formData.password) && !session) {
      toast.error("Please fill in both fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/auth/login", { formData, session });
      toast.success("Signed in successfully");
      router.push(nextPath);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Unable to continue");
      } else {
        toast.error("Unable to continue");
      }
      await signOut({ redirect: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session) {
      void continueWithAccount();
    }
    // We only want one auto-login call when session flips to authenticated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/20 bg-white p-8 shadow-2xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-900">Continue</h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          Use email/password or Google. New email accounts are created automatically.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void continueWithAccount();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, email: event.currentTarget.value }))
              }
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, password: event.currentTarget.value }))
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isSubmitting ? "Please wait..." : "Continue with Email"}
          </button>

          <button
            type="button"
            onClick={() => signIn("google")}
            disabled={isSubmitting}
            className="w-full rounded-lg bg-rose-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300"
          >
            Continue with Google
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm text-slate-600">
          <p>First-time users can directly continue with any method above.</p>
          <p>
            <Link href="/forgot-password" className="font-medium text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

