"use client"
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookNowPage() {
  const [formData, setFormData] = useState({
    userName: "",
    contactInfo: "",
    startDate: null,
    endDate: null,
    pricePerDay: 1000,
    totalPrice: 0,
    paymentMethod: "",
    storageDetails: "",
  });
  const router = useRouter();
  const warehouseStartDate = new Date("2025-01-01");
  const warehouseEndDate = new Date("2025-12-31");

  const calculateTotalPrice = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      const days =
        Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return days > 0 ? days * formData.pricePerDay : 0;
    }
    return 0;
  };

  const handleDateChange = (name: string, value: Date | null) => {
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };
      return {
        ...updatedForm,
        totalPrice: calculateTotalPrice(updatedForm.startDate, updatedForm.endDate),
      };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Booking Confirmed!");
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="bg-blue-600 text-white py-4 w-full shadow-md">
        <div className="flex  flex-row justify-between  py-4 px-6">
          <h1 className="text-center text-3xl font-bold">Book Warehouse</h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard/user")}
              className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-gray-400"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push("/search")}
              className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-gray-400"
            >
             Search
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-gray-400"
            >
              Profile
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-6">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6">Booking Form</h2>
          {/* User Name */}
          <div className="mb-4">
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          {/* Contact Info */}
          <div className="mb-4">
            <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
              Contact Information
            </label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          {/* Start Date */}
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => handleDateChange("startDate", date)}
              minDate={warehouseStartDate}
              maxDate={warehouseEndDate}
              dateFormat="yyyy-MM-dd"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholderText="Select start date"
            />
          </div>
          {/* End Date */}
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) => handleDateChange("endDate", date)}
              minDate={formData.startDate || warehouseStartDate}
              maxDate={warehouseEndDate}
              dateFormat="yyyy-MM-dd"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholderText="Select end date"
            />
          </div>
          {/* Total Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Total Price</label>
            <p className="text-lg font-bold text-blue-700">₹{formData.totalPrice}</p>
          </div>
          {/* Payment Method */}
          <div className="mb-4">
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="" disabled>
                Select Payment Method
              </option>
              <option value="creditCard">Credit Card</option>
              <option value="debitCard">Debit Card</option>
              <option value="netBanking">Net Banking</option>
              <option value="upi">UPI</option>
            </select>
          </div>
          {/* Storage Details */}
          <div className="mb-4">
            <label htmlFor="storageDetails" className="block text-sm font-medium text-gray-700">
              What will be stored?
            </label>
            <textarea
              id="storageDetails"
              name="storageDetails"
              value={formData.storageDetails}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Provide details about the items to be stored..."
              required
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 font-medium"
          >
            Confirm Request
          </button>
        </form>
      </main>
    </div>
  );
}
