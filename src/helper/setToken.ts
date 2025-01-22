import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

type userType = {
    _id: string
    fullName: string,
    email: string,
    role: string,
    password: string,
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

        const cookie = await cookies();
        const token = jwt.sign(data, process.env.SECRET!);
        cookie.set("token", token);
        return token
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.log(error)
        return 
    }
}