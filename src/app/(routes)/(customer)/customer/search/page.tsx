"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { NavBar } from "@/app/components/NavBar";
import "react-datepicker/dist/react-datepicker.css";

type Warehouse = {
  _id: string;
  name: string;
  pricePerMonth: string;
  capacity: string;
  status: string;
  address: string;
  startDate: string;
  endDate: string;
};

type Filters = {
  startDate: Date | null;
  endDate: Date | null;
  capacity: string;
  pricePerMonth: string;
};

export default function Search() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    startDate: null,
    endDate: null,
    capacity: "",
    pricePerMonth: "",
  });

  const updateNonNegativeNumberFilter = (field: "capacity" | "pricePerMonth", value: string) => {
    if (value === "") {
      setFilters((previous) => ({ ...previous, [field]: "" }));
      return;
    }

    if (!/^\d+$/.test(value)) {
      return;
    }

    setFilters((previous) => ({ ...previous, [field]: value }));
  };

  const filteredWarehouses = warehouses.filter((warehouse) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      warehouse.name.toLowerCase().includes(normalizedSearch) ||
      warehouse.address.toLowerCase().includes(normalizedSearch);
    const matchesCapacity =
      filters.capacity === "" || Number(warehouse.capacity) >= Number(filters.capacity);
    const matchesPricePerMonth =
      filters.pricePerMonth === "" ||
      Number(warehouse.pricePerMonth) <= Number(filters.pricePerMonth);
    const matchesDate =
      (!filters.startDate || new Date(warehouse.startDate) <= filters.startDate) &&
      (!filters.endDate || new Date(warehouse.endDate) >= filters.endDate);

    return matchesSearch && matchesCapacity && matchesPricePerMonth && matchesDate;
  });

  const getWarehouse = async () => {
    try {
      const response = await axios.get("/api/customer/warehouses");
      const warehouseData: Warehouse[] = response.data.Warehouse.map((warehouse: Warehouse) => ({
        _id: warehouse._id,
        address: warehouse.address,
        name: warehouse.name,
        capacity: warehouse.capacity,
        pricePerMonth: warehouse.pricePerMonth,
        status: warehouse.status,
        startDate: warehouse.startDate,
        endDate: warehouse.endDate,
      }));
      setWarehouses(warehouseData);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Error fetching warehouse details");
      } else {
        toast.error("Error fetching warehouse details");
      }
    }
  };

  useEffect(() => {
    void getWarehouse();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-blue-50 text-slate-900">
      <NavBar landing={false} role="Customer" />

      <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m21 21-4.35-4.35" />
                <circle cx="11" cy="11" r="6" />
              </svg>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                placeholder="Search by warehouse name or address..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={() => setFilterVisible(!filterVisible)}
              className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              {filterVisible ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </div>

        {filterVisible && (
          <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    startDate: null,
                    endDate: null,
                    capacity: "",
                    pricePerMonth: "",
                  })
                }
                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="startDate" className="mb-1 block text-sm font-medium text-slate-700">
                  Start Date
                </label>
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) => setFilters((previous) => ({ ...previous, startDate: date }))}
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="mb-1 block text-sm font-medium text-slate-700">
                  End Date
                </label>
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) => setFilters((previous) => ({ ...previous, endDate: date }))}
                  minDate={filters.startDate || new Date()}
                  dateFormat="yyyy-MM-dd"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label htmlFor="capacity" className="mb-1 block text-sm font-medium text-slate-700">
                  Capacity (sq. ft.)
                </label>
                <input
                  type="number"
                  id="capacity"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Minimum capacity"
                  value={filters.capacity}
                  onWheel={(event) => event.currentTarget.blur()}
                  onChange={(event) =>
                    updateNonNegativeNumberFilter("capacity", event.currentTarget.value)
                  }
                />
              </div>
              <div>
                <label htmlFor="pricePerMonth" className="mb-1 block text-sm font-medium text-slate-700">
                  Price Per Month
                </label>
                <input
                  type="number"
                  id="pricePerMonth"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Maximum price per month"
                  value={filters.pricePerMonth}
                  onWheel={(event) => event.currentTarget.blur()}
                  onChange={(event) =>
                    updateNonNegativeNumberFilter("pricePerMonth", event.currentTarget.value)
                  }
                />
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 text-sm text-slate-600">
          {filteredWarehouses.length} warehouse{filteredWarehouses.length === 1 ? "" : "s"} found
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredWarehouses.length > 0 ? (
            filteredWarehouses.map((warehouse) => (
              <button
                key={warehouse._id}
                type="button"
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                onClick={() => router.push(`/customer/search/${warehouse._id}`)}
              >
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-700">
                  {warehouse.name}
                </h2>
                <p className="mt-2 text-sm text-slate-600">Address: {warehouse.address}</p>
                <p className="mt-2 text-sm font-medium text-blue-700">
                  Price: Rs. {Number(warehouse.pricePerMonth).toLocaleString()}/month
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Capacity: {Number(warehouse.capacity).toLocaleString()} sq. ft.
                </p>
              </button>
            ))
          ) : (
            <p className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-600">
              No warehouses found for the current filters.
            </p>
          )}
        </div>
      </main>

      <footer className="bg-slate-200 py-4 text-center">
        <p className="text-slate-600">&copy; 2026 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}

