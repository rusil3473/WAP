"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { NavBar } from "@/app/components/NavBar";

type PaymentRow = {
  _id: string;
  warehouseName: string;
  bookingDate: string;
  startDate: string;
  endDate: string;
  status: string;
  paymentStatus: "pending" | "paid" | "failed" | string;
  totalAmount: number;
};

type PaymentsPayload = {
  summary: {
    totalTransactions: number;
    totalPaid: number;
    pendingAmount: number;
  };
  payments: PaymentRow[];
};

export default function CustomerPaymentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPayingId, setIsPayingId] = useState<string | null>(null);
  const [data, setData] = useState<PaymentsPayload>({
    summary: {
      totalTransactions: 0,
      totalPaid: 0,
      pendingAmount: 0,
    },
    payments: [],
  });

  const fetchPayments = async () => {
    try {
      const response = await axios.get("/api/customer/payments");
      const payload = response.data?.data as PaymentsPayload | undefined;
      if (!payload) {
        throw new Error("Missing payments payload");
      }
      setData(payload);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to load payments");
      } else {
        toast.error("Failed to load payments");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const payNow = async (bookingId: string) => {
    setIsPayingId(bookingId);
    try {
      await axios.put("/api/customer/payments/pay", { bookingId });
      toast.success("Payment completed");
      await fetchPayments();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to complete payment");
      } else {
        toast.error("Failed to complete payment");
      }
    } finally {
      setIsPayingId(null);
    }
  };

  const formattedSummary = useMemo(
    () => ({
      totalTransactions: data.summary.totalTransactions,
      totalPaid: data.summary.totalPaid.toLocaleString(),
      pendingAmount: data.summary.pendingAmount.toLocaleString(),
    }),
    [data.summary],
  );

  useEffect(() => {
    void fetchPayments();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
          <p className="text-sm text-slate-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <NavBar landing={false} role="Customer" />

      <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
        <p className="mt-1 text-sm text-slate-500">Track and complete booking payments.</p>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Transactions</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{formattedSummary.totalTransactions}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total Paid</p>
            <p className="mt-2 text-2xl font-bold text-emerald-700">
              Rs. {formattedSummary.totalPaid}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Pending Amount</p>
            <p className="mt-2 text-2xl font-bold text-amber-700">
              Rs. {formattedSummary.pendingAmount}
            </p>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Warehouse
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Booking Dates
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.payments.length > 0 ? (
                data.payments.map((payment) => {
                  const canPay =
                    payment.paymentStatus !== "paid" &&
                    payment.status !== "cancelled";

                  return (
                    <tr key={payment._id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 text-sm text-slate-700">
                        <p className="font-medium text-slate-900">{payment.warehouseName}</p>
                        <p className="text-xs text-slate-500">{new Date(payment.bookingDate).toLocaleDateString()}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {new Date(payment.startDate).toLocaleDateString()} -{" "}
                        {new Date(payment.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                        Rs. {payment.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            payment.paymentStatus === "paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : payment.paymentStatus === "failed"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {payment.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <button
                          type="button"
                          disabled={!canPay || isPayingId === payment._id}
                          onClick={() => void payNow(payment._id)}
                          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          {isPayingId === payment._id ? "Processing..." : canPay ? "Pay now" : "Paid"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>

      <footer className="bg-slate-200 py-4 text-center text-sm text-slate-600">
        &copy; 2026 Warehouse Aggregation Platform
      </footer>
    </div>
  );
}
