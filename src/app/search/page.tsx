"use client"
import { useState } from "react";

const warehouses = [
  { id: 1, name: "Warehouse A", location: "New York", price: "$500/month" },
  { id: 2, name: "Warehouse B", location: "Los Angeles", price: "$400/month" },
  { id: 3, name: "Warehouse C", location: "Chicago", price: "$300/month" },
  { id: 4, name: "Warehouse D", location: "San Francisco", price: "$600/month" },
  { id: 5, name: "Warehouse E", location: "Miami", price: "$450/month" },
  { id: 6, name: "Warehouse F", location: "Dallas", price: "$350/month" },
  { id: 7, name: "Warehouse G", location: "Houston", price: "$500/month" },
  { id: 8, name: "Warehouse H", location: "Boston", price: "$550/month" },
  { id: 9, name: "Warehouse I", location: "Seattle", price: "$475/month" },
  { id: 10, name: "Warehouse J", location: "Atlanta", price: "$400/month" }
];


export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredWarehouses = warehouses.filter((warehouse) =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-500 text-white py-4">
        <h1 className="text-center text-3xl font-bold">Search Warehouses</h1>
      </header>
      <main className="flex-grow container mx-auto py-8">
        <div className="mb-6">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search warehouses by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWarehouses.length > 0 ? (
            filteredWarehouses.map((warehouse) => (
              <div
                key={warehouse.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg"
              >
                <h2 className="text-xl font-bold text-blue-700">{warehouse.name}</h2>
                <p className="text-gray-600">Location: {warehouse.location}</p>
                <p className="text-gray-600">Price: {warehouse.price}</p>
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
