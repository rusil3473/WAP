"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { NavBar } from "@/app/components/NavBar";

type EarningTransaction = {
  _id: string;
  warehouseName: string;
  bookingDate: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
};

type EarningsPayload = {
  summary: {
    totalTransactions: number;
    totalPaid: number;
    pendingAmount: number;
    paidCount: number;
    pendingCount: number;
  };
  monthly: Array<{
    month: string;
    paid: number;
    pending: number;
  }>;
  transactions: EarningTransaction[];
};

export default function EarningsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [payload, setPayload] = useState<EarningsPayload>({
    summary: {
      totalTransactions: 0,
      totalPaid: 0,
      pendingAmount: 0,
      paidCount: 0,
      pendingCount: 0,
    },
    monthly: [],
    transactions: [],
  });

  const loadEarnings = async () => {
    try {
      const response = await axios.get("/api/owner/earnings");
      const data = response.data?.data as EarningsPayload | undefined;
      if (!data) {
        throw new Error("Missing earnings payload");
      }

      setPayload(data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to load earnings");
      } else {
        toast.error("Failed to load earnings");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadEarnings();
  }, []);

  const formattedSummary = useMemo(
    () => ({
      totalTransactions: payload.summary.totalTransactions,
      totalPaid: payload.summary.totalPaid.toLocaleString(),
      pendingAmount: payload.summary.pendingAmount.toLocaleString(),
      paidCount: payload.summary.paidCount,
      pendingCount: payload.summary.pendingCount,
    }),
    [payload.summary],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
          <p className="text-sm text-slate-600">Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <NavBar landing={false} role="Owner" />

      <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900">Earnings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of paid and pending booking revenue.
        </p>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total Transactions</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formattedSummary.totalTransactions}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Paid Revenue</p>
            <p className="mt-2 text-2xl font-bold text-emerald-700">
              Rs. {formattedSummary.totalPaid}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Pending Revenue</p>
            <p className="mt-2 text-2xl font-bold text-amber-700">
              Rs. {formattedSummary.pendingAmount}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Payment Split</p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              {formattedSummary.paidCount} paid / {formattedSummary.pendingCount} pending
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent Monthly Trend</h2>
          {payload.monthly.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {payload.monthly.map((month) => (
                <div key={month.month} className="rounded-lg border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-slate-800">{month.month}</p>
                  <p className="mt-1 text-sm text-emerald-700">
                    Paid: Rs. {month.paid.toLocaleString()}
                  </p>
                  <p className="text-sm text-amber-700">
                    Pending: Rs. {month.pending.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No monthly earning data available yet.</p>
          )}
        </section>

        <section className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Warehouse
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Dates
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Payment Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {payload.transactions.length > 0 ? (
                payload.transactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <p className="font-medium text-slate-900">{transaction.warehouseName}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(transaction.bookingDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {new Date(transaction.startDate).toLocaleDateString()} -{" "}
                      {new Date(transaction.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                      Rs. {transaction.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          transaction.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {transaction.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                    No earning transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
