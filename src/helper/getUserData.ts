import { connect } from "@/dbConfig/db"
import User from "@/models/UserModel";

connect();

export default async function getUserData(id: string) {
  try {
 
     const { fullName, email, role, isVerified } = await User.findById(id);
    const data = { id, fullName, email, role, isVerified }
    return data ; 

  } catch (error) {
    return console.log(error)
  }
}