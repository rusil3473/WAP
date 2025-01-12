"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
export default function Home() {

  const router = useRouter();
  const getUserInfo = async (token: string) => {
    try {
      const res = await axios.post("api/users/getUserInfo", { token })
      const data = res.data.data;
      if (data.role === "customer") {
        router.push("/dashboard/customer")
      }
      else if (data.role === "admin") {
        router.push("/admin")
      }
      else if (data.role === "owner") {
        router.push("/dashboard/owner")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const t = document.cookie.split("=")[1]
    if (t) {
      getUserInfo(t);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="w-full bg-white shadow-md">
        <nav className="container mx-auto flex items-center justify-between p-6">
          <h1 className="text-2xl font-bold text-blue-700">Warehouse Platform</h1>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
            >
              Login
            </Link>

            <Link
              href="/signup/owner"
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
            >
              Signup For Owner
            </Link>
            <Link
              href="/signup/user"
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
            >
              Signup For User
            </Link>
            <Link
              href="/search"
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
            >
              Search
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-bold text-blue-700 mb-4">
          Simplify Warehouse Management
        </h1>
        <p className="text-gray-600 mb-8">
          Effortlessly book and manage storage spaces. Join us today!
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <li className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              📦 Search Warehouses
            </h2>
            <p className="text-gray-500">Find the perfect storage space.</p>
          </li>
          <li className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              📈 Manage Listings
            </h2>
            <p className="text-gray-500">Control and monitor your warehouses.</p>
          </li>
          <li className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              🔒 Secure Bookings
            </h2>
            <p className="text-gray-500">Enjoy safe and seamless transactions.</p>
          </li>
        </ul>
        <Link
          href="/login"
          className="px-8 py-3 bg-blue-500 text-white font-medium text-lg rounded-lg shadow hover:bg-blue-600"

        >
          Login to Get Started
        </Link>
      </main>

      <footer className="w-full bg-blue-700 text-white text-center py-4">
        <p>© 2025 Warehouse Aggregation Platform</p>
      </footer>
    </div>
  );
}
