"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
type warehouseObject = {
  _id: string;
  name: string;
  pricePerMonth: string;
  capacity: string;
  status: string;
  address: string;
  startDate: string;
  endDate: string;
};
export default function Search() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState([
    { _id: "", address: "", name: "", capacity: "", pricePerMonth: "", status: "",  startDate: "", endDate: "" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen,setMenuOpen]=useState(false);
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
      const res = await axios.get("/api/users/getWarehouse");
      setWarehouses(() => {
        const data = res.data.Warehouse.map((obj: warehouseObject) => {
          const { _id, address, name, capacity, pricePerMonth, status, startDate, endDate } = obj;
          return { _id, address, name, capacity, pricePerMonth, status, startDate, endDate };
        });
        return data;
      });
    } catch (error) {
      toast.error("Error fetching warehouse details:")
      console.log(error);
    }
  };
  useEffect(() => {
    getWarehouse();
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-white text-blue-700">
      <header className="sticky top-0 bg-white shadow-md z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-700">
            Warehouse Aggregation
            </h1>
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition"
                aria-expanded={menuOpen}
                aria-label="Toggle menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
            <div
              className={`md:flex md:items-center md:space-x-4 ${
                menuOpen ? "block" : "hidden"
              } md:block absolute md:static top-full left-0 w-full md:w-auto bg-white shadow-md md:shadow-none z-10`}
            >
              <button
                onClick={() => router.push("/dashboard")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push("/search")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Search
              </button>
              <button
                onClick={() => router.push("//bookings")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Booking
              </button>
              <button
                onClick={() => router.push("/payments")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Payments
              </button>
              <button
                onClick={() => router.push("/support")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Support
              </button>
              <button
                onClick={() => router.push("/profile")}
                className="block md:inline px-4 py-2 text-blue-700 hover:bg-blue-100 transition rounded-md"
              >
                Profile
              </button>
            </div>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto py-8">
        {/* Search and Filter Section */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Search warehouses by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setFilterVisible(!filterVisible)}
            className="ml-4 px-4 py-2 bg-blue-100 font-medium rounded-lg hover:bg-blue-200"
          >
            Filter
          </button>
        </div>
        {/* Filter Options */}
        {filterVisible && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-blue-700 font-medium mb-1">
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
                <label htmlFor="endDate" className="block text-blue-700 font-medium mb-1">
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
                <label htmlFor="capacity" className="block text-blue-700 font-medium mb-1">
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
                <label htmlFor="pricePerMonth" className="block text-blue-700 font-medium mb-1">
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
                <h2 className="text-xl font-bold">{warehouse.name}</h2>
                <p className="text-blue-700">address: {warehouse.address}</p>
                <p className="text-blue-700">Price: ₹{warehouse.pricePerMonth}/month</p>
              </div>
            ))
          ) : (
            <p className="text-blue-700 col-span-full text-center">
              No warehouses found.
            </p>
          )}
        </div>
      </main>
      <footer className="bg-blue-100 text-center py-4">
        <p className="text-blue-700">© 2025 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}
