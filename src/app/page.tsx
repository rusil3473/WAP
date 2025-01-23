"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

interface CookieStore {
  [key: string]: string;
}

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const getUserInfo = async (token: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      const res = await axios.post("api/users/getUserInfo", { token });
      const data = res.data.data;
      switch (data.role) {
        case "customer":
          router.push("/dashboard/customer");
          break;
        case "admin":
          router.push("/admin");
          break;
        case "owner":
          router.push("/dashboard/owner");
          break;
        default:
          setAuthError("Invalid user role");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Authentication error:", error);
        setAuthError(error.response?.data?.message || "Authentication failed");
      } else {
        console.error("Unexpected error:", error);
        setAuthError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      const cookies = document.cookie.split(';').reduce<CookieStore>((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      
      const token = cookies['token'];
      if (token) {
        getUserInfo(token);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Cookie parsing error:", error);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 w-full bg-white shadow-md z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <h1 className="text-xl sm:text-2xl font-bold text-blue-700">
              Warehouse Platform
            </h1>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-700 hover:text-blue-900 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
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

            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup/owner"
                className="px-4 py-2 text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                Signup For Owner
              </Link>
              <Link
                href="/signup/customer"
                className="px-4 py-2 text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                Signup For User
              </Link>
              <Link
                href="/search"
                className="px-4 py-2 text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                Search
              </Link>
            </div>
          </div>

          {/* Mobile menu with smooth transition */}
          <div 
            className={`md:hidden transition-all duration-300 ease-in-out ${
              menuOpen ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-b-lg shadow-lg">
              <Link
                href="/login"
                className="block px-3 py-2 text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup/owner"
                className="block px-3 py-2 text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Signup For Owner
              </Link>
              <Link
                href="/signup/customer"
                className="block px-3 py-2 text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Signup For User
              </Link>
              <Link
                href="/search"
                className="block px-3 py-2 text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Search
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Error Message */}
      {authError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{authError}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-700 mb-4 leading-tight">
            Simplify Warehouse Management
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Effortlessly book and manage storage spaces. Join us today!
          </p>
        </div>

        {/* Feature Cards */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 w-full max-w-6xl">
          <li className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-4">📦</span>
              <h2 className="text-xl font-semibold text-blue-700 mb-2">Search Warehouses</h2>
              <p className="text-gray-500">Find the perfect storage space for your needs.</p>
            </div>
          </li>
          <li className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-4">📈</span>
              <h2 className="text-xl font-semibold text-blue-700 mb-2">Manage Listings</h2>
              <p className="text-gray-500">Control and monitor your warehouses efficiently.</p>
            </div>
          </li>
          <li className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-4">🔒</span>
              <h2 className="text-xl font-semibold text-blue-700 mb-2">Secure Bookings</h2>
              <p className="text-gray-500">Enjoy safe and seamless transactions.</p>
            </div>
          </li>
        </ul>

        {/* CTA Button */}
        <Link
          href="/login"
          className="group inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium text-lg rounded-lg shadow-md hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Login to Get Started
          <svg 
            className="ml-2 -mr-1 w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </main>

      {/* Footer */}
      <footer className="w-full bg-blue-700 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm sm:text-base">© 2025 Warehouse Aggregation Platform</p>
        </div>
      </footer>
    </div>
  );
}