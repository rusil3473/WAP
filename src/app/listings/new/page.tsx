"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function NewWarehousePage() {
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    address: '',
    capacity: '',
    pricePerDay: '',
    pricePerMonth: '',
    facilities: "",
    startDate: '',
    endDate: '',
    photos:"",
    status: 'available',
  });

  const router = useRouter();


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/users/owner/listings/new",formData);
      router.push("/listings")
    } catch (error:unknown) {
      console.log(error)
    }
   
    
  };

  const getOwner = async (token: string) => {
    try {
      const res = await axios.post("/api/users/getUserInfo", { token });
      setFormData((pre) => ({
        ...pre,
        owner: res.data.data._id,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = document.cookie.split("=")[1];
    getOwner(token);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold">Create New Warehouse Listing</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-6">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          {/* Warehouse Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Warehouse Name</label>
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

          {/* Owner (Set automatically) */}
          <div className="mb-4">
            <label htmlFor="owner" className="block text-sm font-medium text-gray-700">Owner</label>
            <input
              type="text"
              id="owner"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter the full address"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Capacity */}
          <div className="mb-4">
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity (sq. ft.)</label>
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

          {/* Price per Day */}
          <div className="mb-4">
            <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700">Price per Day</label>
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

          {/* Price per Month */}
          <div className="mb-4">
            <label htmlFor="pricePerMonth" className="block text-sm font-medium text-gray-700">Price per Month</label>
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

          {/* Facilities */}
      
          <div className="mb-4">
            <label htmlFor="facilities" className="block text-sm font-medium text-gray-700">Facilities</label>
            <input
              type="text"
              id="facilities"
              name="facilities"
              value={formData.facilities}
              onChange={handleChange}
              placeholder="e.g. CCTV, Temperature Control"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <small className="text-gray-500">Separate facilities with commas</small>
          </div>


          {/* Start Date */}
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
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

          {/* End Date */}
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
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

          {/* Photos */}
          <div className="mb-4">
            <label htmlFor="photos" className="block text-sm font-medium text-gray-700">Photos (Image URLs)</label>
            <input
              type="text"
              id="photos"
              name="photos"
              value={formData.photos}
              onChange={handleChange}
              placeholder="e.g. https://example.com/photo1.jpg"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <small className="text-gray-500">Separate URLs with commas</small>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
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

          {/* Submit Button */}
          <div className="mb-4">
            <button type="submit" className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600">
              Create Warehouse
            </button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-gray-300 text-center py-4">
        <p className="text-gray-700">© 2025 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}
