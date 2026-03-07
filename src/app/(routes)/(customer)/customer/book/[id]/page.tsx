"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { NavBar } from "@/app/components/NavBar";
import "react-datepicker/dist/react-datepicker.css";

type WarehouseBookingContext = {
  customerId: string;
  ownerId: string;
  pricePerMonth: string;
  startDate: Date;
  endDate: Date;
  warehouseName: string;
};

type BookingForm = {
  fullName: string;
  contactInfo: string;
  startDate: Date | null;
  endDate: Date | null;
  totalPrice: number;
  storageDetails: string;
};

export default function BookNowPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [warehouseContext, setWarehouseContext] = useState<WarehouseBookingContext>({
    customerId: "",
    ownerId: "",
    pricePerMonth: "",
    startDate: new Date(),
    endDate: new Date(),
    warehouseName: "",
  });
  const [formData, setFormData] = useState<BookingForm>({
    fullName: "",
    contactInfo: "",
    startDate: null,
    endDate: null,
    totalPrice: 0,
    storageDetails: "",
  });

  const params = useParams();
  const router = useRouter();

  const calculateTotalPrice = (startDate: Date | null, endDate: Date | null) => {
    if (!(startDate && endDate)) {
      return 0;
    }

    const monthDifference = endDate.getMonth() - startDate.getMonth();
    return monthDifference * Number(warehouseContext.pricePerMonth);
  };

  const handleDateChange = (name: "startDate" | "endDate", value: Date | null) => {
    setFormData((previous) => {
      const updated = { ...previous, [name]: value };
      return {
        ...updated,
        totalPrice: calculateTotalPrice(updated.startDate, updated.endDate),
      };
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const loadWarehouseDetails = async () => {
    try {
      const response = await axios.post("/api/customer/warehouse", { _id: params.id });
      const warehouse = response.data.Warehouse;

      setWarehouseContext((previous) => ({
        ...previous,
        ownerId: warehouse.owner,
        pricePerMonth: warehouse.pricePerMonth,
        startDate: warehouse.startDate,
        endDate: warehouse.endDate,
        warehouseName: warehouse.name,
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to load warehouse");
      } else {
        toast.error("Failed to load warehouse");
      }
    }
  };

  const loadCurrentUser = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      const currentUser = response.data.data;

      setWarehouseContext((previous) => ({ ...previous, customerId: currentUser._id }));
      setFormData((previous) => ({
        ...previous,
        fullName: currentUser.fullName,
        contactInfo: currentUser.email,
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to load user profile");
      } else {
        toast.error("Failed to load user profile");
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post("/api/customer/bookings/new", {
        customerId: warehouseContext.customerId,
        ownerId: warehouseContext.ownerId,
        warehouseId: params.id,
        warehouseName: warehouseContext.warehouseName,
        bookingDate: new Date(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalAmount: formData.totalPrice,
        storageDetails: formData.storageDetails,
      });

      toast.success("Booking created");
      router.push("/customer/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to create booking");
      } else {
        toast.error("Failed to create booking");
      }
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await Promise.all([loadWarehouseDetails(), loadCurrentUser()]);
      } catch {
        toast.error("Failed to load booking form");
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-medium text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-gray-100">
      <NavBar landing={false} role="Customer" />

      <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md"
        >
          <h2 className="mb-6 text-center text-2xl font-bold text-blue-700 sm:text-3xl">
            Booking Form
          </h2>

          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
              Contact Information
            </label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => handleDateChange("startDate", date)}
              minDate={warehouseContext.startDate}
              maxDate={warehouseContext.endDate}
              dateFormat="yyyy-MM-dd"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholderText="Select start date"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) => handleDateChange("endDate", date)}
              minDate={
                formData.startDate
                  ? new Date(
                      new Date(formData.startDate).setMonth(formData.startDate.getMonth() + 1),
                    )
                  : warehouseContext.startDate
              }
              maxDate={warehouseContext.endDate}
              dateFormat="yyyy-MM-dd"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholderText="Select end date"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Total Price</label>
            <p className="text-lg font-bold text-blue-700">Rs. {formData.totalPrice}</p>
          </div>

          <div className="mb-4">
            <label htmlFor="storageDetails" className="block text-sm font-medium text-gray-700">
              What will be stored?
            </label>
            <textarea
              id="storageDetails"
              name="storageDetails"
              value={formData.storageDetails}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Provide details about the items to be stored..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-lg transition hover:bg-blue-700"
          >
            Confirm Booking
          </button>
        </form>
      </main>

      <footer className="mt-auto bg-blue-600 py-4 text-center text-white">
        <p>&copy; 2026 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}
