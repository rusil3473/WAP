"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast";
interface CookieStore {
    [key: string]: string;
  }
export default function Dashboard() {
    const router=useRouter();
    const getUserInfo = async (token: string) => {
        try {
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
                    toast.error("Invalid user role");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Authentication error:", error);
            } else {
                console.error("Unexpected error:", error);
                toast.error("An unexpected error occurred");
            }
        } finally {
            toast.error(false);
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
            } 
        } catch (error) {
            console.error("Cookie parsing error:", error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    )
}