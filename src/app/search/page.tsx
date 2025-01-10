"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type warehouseObject = {
  _id: string;
  name: string;
  pricePerMonth: string;
 
  capacity: string;
  status: string;
  location: string;
  startDate: string;
  endDate: string;
};

export default function Search() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState([
    { _id: "", location: "", name: "", capacity: "", pricePerMonth: "", status: "",  startDate: "", endDate: "" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    capacity: "",

    pricePerMonth: "",
  });

  const filteredWarehouses = warehouses.filter((warehouse) => {
    const matchesSearch = warehouse.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCapacity = filters.capacity === "" || parseInt(warehouse.capacity) >= parseInt(filters.capacity);
    
    const matchesPricePerMonth = filters.pricePerMonth === "" || parseInt(warehouse.pricePerMonth) <= parseInt(filters.pricePerMonth);
    const matchesDate =
      (!filters.startDate || new Date(warehouse.startDate) <= filters.startDate) &&
      (!filters.endDate || new Date(warehouse.endDate) >= filters.endDate);

    return matchesSearch && matchesCapacity  && matchesPricePerMonth && matchesDate;
  });

  const handleWarehouse = async (id: string) => {
    router.push(`/search/${id}`);
  };

  const getWarehouse = async () => {
    try {
      const res = await axios.post("/api/users/getWarehouse", {});
      setWarehouses(() => {
        const data = res.data.Warehouse.map((obj: warehouseObject) => {
          const { _id, location, name, capacity, pricePerMonth, status, startDate, endDate } = obj;
          return { _id, location, name, capacity, pricePerMonth, status, startDate, endDate };
        });
        return data;
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWarehouse();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-500 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Search Warehouses</h1>
          <nav className="space-x-6">
            <button
              onClick={() => router.push("/dashboard/user")}
              className="px-4 py-2  text-white rounded-lg hover:bg-blue-600"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="px-4 py-2  text-white rounded-lg hover:bg-blue-600"
            >
              Profile
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8">
        {/* Search and Filter Section */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search warehouses by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setFilterVisible(!filterVisible)}
            className="ml-4 px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-600"
          >
            Filter
          </button>
        </div>

        {/* Filter Options */}
        {filterVisible && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-gray-700 font-medium mb-1">
                  Start Date
                </label>
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) => setFilters({ ...filters, startDate: date })}
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-gray-700 font-medium mb-1">
                  End Date
                </label>
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) => setFilters({ ...filters, endDate: date })}
                  minDate={filters.startDate || new Date()}
                  dateFormat="yyyy-MM-dd"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="capacity" className="block text-gray-700 font-medium mb-1">
                  Capacity (sq. ft.)
                </label>
                <input
                  type="number"
                  id="capacity"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  placeholder="Minimum capacity"
                  value={filters.capacity}
                  onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="pricePerMonth" className="block text-gray-700 font-medium mb-1">
                  Price Per Month
                </label>
                <input
                  type="number"
                  id="pricePerMonth"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  placeholder="Maximum price per month"
                  value={filters.pricePerMonth}
                  onChange={(e) => setFilters({ ...filters, pricePerMonth: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Warehouse Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWarehouses.length > 0 ? (
            filteredWarehouses.map((warehouse) => (
              <div
                key={warehouse._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                onClick={() => handleWarehouse(warehouse._id)}
              >
                <h2 className="text-xl font-bold text-blue-700">{warehouse.name}</h2>
                <p className="text-gray-600">Location: {warehouse.location}</p>
                <p className="text-gray-600">Price: ₹{warehouse.pricePerMonth}/month</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center">
              No warehouses found.
            </p>
          )}
        </div>
      </main>
      <footer className="bg-gray-300 text-center py-4">
        <p className="text-gray-700">© 2025 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}
