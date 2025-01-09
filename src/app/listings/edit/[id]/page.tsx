"use client";
import { useState, useEffect } from "react";
import { useRouter,useParams } from "next/navigation";
import axios from "axios";

export default function EditWarehousePage() {
  const params=useParams();
 
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    capacity: "",
    pricePerDay: "",
    pricePerMonth: "",
    facilities: "",
    startDate: "",
    endDate: "",
    photos: "",
    status: "available",
  });

  const router = useRouter();
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  // Fetch warehouse data by ID
  const fetchWarehouse = async () => {
    try {
      const res = await axios.get(`/api/users/owner/listings/edit/${params.id}`);
      const data = res.data.data;
    
      setFormData({
        name: data.name,
        address: data.location,
        capacity: data.capacity,
        pricePerDay: data.pricePerDay,
        pricePerMonth: data.pricePerMonth,
        facilities: data.facilities,
        startDate: formatDate(data.startDate),
        endDate: formatDate(data.endDate),
        photos: data.photos,
        status: data.status,
      });
    } catch (error) {
      console.error("Error fetching warehouse:", error);
    }
  };

  useEffect(() => {
    fetchWarehouse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/owner/listings/edit/${params.id}`, formData);
      router.push("/listings");
    } catch (error) {
      console.error("Error updating warehouse:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto py-4 px-6">
          <h1 className="text-2xl font-bold">Edit Warehouse</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-6">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Capacity (sq. ft.)
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700">
              Price per Day
            </label>
            <input
              type="number"
              id="pricePerDay"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="pricePerMonth" className="block text-sm font-medium text-gray-700">
              Price per Month
            </label>
            <input
              type="number"
              id="pricePerMonth"
              name="pricePerMonth"
              value={formData.pricePerMonth}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="facilities" className="block text-sm font-medium text-gray-700">
              Facilities
            </label>
            <input
              type="text"
              id="facilities"
              name="facilities"
              value={formData.facilities}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <small className="text-gray-500">Separate facilities with commas</small>
          </div>

          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="photos" className="block text-sm font-medium text-gray-700">
              Photos (Image URLs)
            </label>
            <input
              type="text"
              id="photos"
              name="photos"
              value={formData.photos}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <small className="text-gray-500">Separate URLs with commas</small>
          </div>

          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
          >
            Update Warehouse
          </button>
        </form>
      </main>
    </div>
  );
}
