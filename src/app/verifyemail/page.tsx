"use client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
export default function VerifyEmailPage() {
  const router = useRouter();
  const [token, setToken] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleToken = async () => {
    try {
      await axios.post("/api/users/verifyemail", { verifyToken:token })
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     } catch (error: any) {
       console.log(error)
     }
  }
  useEffect(() => {
    const t = window.location.search.split("=")[1] || ""
    console.log(t)
    setToken(t);
  }, [])

  useEffect(() => {
    if(token.length>0){
      handleToken();
      router.push("/login")
    }

  }, [handleToken, router, token])

  return (
    <p>Verify Email Page</p>
  )
}