import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
  },
  role:{
    type:String,
    required:true
  },
  password: {
    type: String,
    required: true
  },
  
  isVerified:{
    type:Boolean,
    required:true,
    default:false
  },
  verifyToken:String,
  verifyTokenExpiry:Date,
  forgotToken:String,
  forgotTokenExpiry:Date

});

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;