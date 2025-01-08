import { connect } from "@/dbConfig/db"

import User from "@/models/UserModel";

connect();

export async function getData(id: string) {
  try {
    const { _id, username, email, role, isVerified } = await User.findById(id);
    const data = { _id, username, email, role, isVerified }
    
    return data ;
  } catch (error) {
    return console.log(error)
  }
}