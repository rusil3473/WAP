"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { NavBar } from "@/app/components/NavBar";

export default function NewWarehousePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    capacity: "",
    pricePerMonth: "",
    facilities: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    photos: "",
    status: "available",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if ((name === "capacity" || name === "pricePerMonth") && value !== "") {
      if (!/^\d+$/.test(value)) {
        return;
      }
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("/api/owner/warehouses", {
        ...formData,
        capacity: Number(formData.capacity),
        pricePerMonth: Number(formData.pricePerMonth),
      });

      toast.success("Warehouse created");
      router.push("/owner/listings");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to create listing");
      } else {
        toast.error("Failed to create listing");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100">
      <NavBar landing={false} role="Owner" />

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto mb-6 max-w-4xl">
          <h1 className="text-3xl font-bold text-slate-900">Add Warehouse Listing</h1>
          <p className="mt-1 text-sm text-slate-600">
            Publish a new warehouse with rental details and availability.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                Warehouse Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="e.g. Mumbai Central Storage Hub"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="mb-1 block text-sm font-medium text-slate-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter the full address"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label htmlFor="capacity" className="mb-1 block text-sm font-medium text-slate-700">
                Capacity (sq. ft.)
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                min={0}
                step={1}
                inputMode="numeric"
                value={formData.capacity}
                onChange={handleChange}
                onWheel={(event) => event.currentTarget.blur()}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label htmlFor="pricePerMonth" className="mb-1 block text-sm font-medium text-slate-700">
                Price per Month
              </label>
              <input
                type="number"
                id="pricePerMonth"
                name="pricePerMonth"
                min={0}
                step={1}
                inputMode="numeric"
                value={formData.pricePerMonth}
                onChange={handleChange}
                onWheel={(event) => event.currentTarget.blur()}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label htmlFor="facilities" className="mb-1 block text-sm font-medium text-slate-700">
                Facilities
              </label>
              <input
                type="text"
                id="facilities"
                name="facilities"
                value={formData.facilities}
                onChange={handleChange}
                placeholder="e.g. CCTV, Temperature Control"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <small className="text-xs text-slate-500">Separate facilities with commas.</small>
            </div>

            <div>
              <label htmlFor="status" className="mb-1 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="mb-1 block text-sm font-medium text-slate-700">
                Start Date
              </label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => setFormData((previous) => ({ ...previous, startDate: date }))}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholderText="Select start date"
                required
              />
            </div>

            <div>
              <label htmlFor="endDate" className="mb-1 block text-sm font-medium text-slate-700">
                End Date
              </label>
              <DatePicker
                selected={formData.endDate}
                onChange={(date) => setFormData((previous) => ({ ...previous, endDate: date }))}
                minDate={
                  formData.startDate
                    ? new Date(
                        new Date(formData.startDate).setMonth(
                          formData.startDate.getMonth() + 1,
                        ),
                      )
                    : new Date()
                }
                dateFormat="yyyy-MM-dd"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholderText="Select end date"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="photos" className="mb-1 block text-sm font-medium text-slate-700">
                Photos (Image URLs)
              </label>
              <input
                type="text"
                id="photos"
                name="photos"
                value={formData.photos}
                onChange={handleChange}
                placeholder="e.g. https://example.com/photo1.jpg"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <small className="text-xs text-slate-500">Separate URLs with commas.</small>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isSubmitting ? "Creating..." : "Create Listing"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}