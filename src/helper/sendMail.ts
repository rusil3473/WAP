import { connect } from "@/dbConfig/db"
import nodemailer from "nodemailer"
import User from "@/models/UserModel"
import bcrypt from "bcryptjs"
connect()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendMail({ _id, email, requestType }: any) {
  try {
    const token = await bcrypt.hash(_id.toString(), await bcrypt.genSalt(10))
    if (requestType === "VERIFY") {
      await User.findByIdAndUpdate(_id, { verifyToken: token, verifyTokenExpiry:Date.now()+86400000 });
    }
    if (requestType === "RESET") {
      await User.findByIdAndUpdate(_id, { forgotToken: token,forgotTokenExpiry:Date.now()+86400000  });
    }
    const mailOption = {
      from: "rusilvaru555@gmail.com",
      to: email,
      subject: requestType === "VERIFY" ? "Verify Email " : "Reset Email",
      html: `<p>
              To ${requestType === "VERIFY" ? "Verify Email " : "Reset Password"} <a href="${process.env.DOMAIN}/${requestType === "VERIFY" ? "verifyemail" : "reset-password"}?token=${token}"> Click Here</a>
              or
              <p> copy paste this link 
              <span>${process.env.DOMAIN}/${requestType === "VERIFY" ? "verifyemail" : "reset-password"}?token=${token}</span>
              </p>
            </p>`
    };
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "91a0eb042fd17b",
        pass: "877554e4dfaee0"
      }
    });

    transport.sendMail(mailOption)
    return "Mail sent"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error.message;

  }
}


