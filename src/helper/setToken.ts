import { setAuthTokenCookie } from "@/lib/auth-token";
type userType = {
    _id: string
    fullName: string,
    email: string,
    role: "customer" | "owner" | "admin" | null,
    isVerified:boolean
}
export const setToken = async (user: userType) => {
    try {
        const data = {
            _id: user._id,
            fullName: user.fullName,
            email:user.email,
            role: user.role,
            isVerified: user.isVerified
        }
        const token = await setAuthTokenCookie(data);
        return token
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.log(error)
        return 
    }
}
