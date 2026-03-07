import nodemailer from "nodemailer";
import { signActionToken, type ActionTokenType } from "@/lib/action-token";

type SendMailArgs = {
  userId: string;
  email: string;
  requestType: ActionTokenType;
};

function getDomain() {
  return process.env.DOMAIN ?? "http://localhost:3000";
}

export async function sendMail({ userId, email, requestType }: SendMailArgs) {
  try {
    const token = signActionToken({ type: requestType, userId, email });
    const path = requestType === "VERIFY" ? "verifyemail" : "reset-password";
    const actionText = requestType === "VERIFY" ? "Verify Email" : "Reset Password";
    const actionUrl = `${getDomain()}/${path}?token=${token}`;

    const mailOption = {
      from: process.env.MAIL_FROM ?? "no-reply@wap.local",
      to: email,
      subject: actionText,
      html: `<p>To ${actionText}, <a href="${actionUrl}">click here</a>.</p><p>${actionUrl}</p>`,
    };

    const mailtrapUser = process.env.MAILTRAP_USER;
    const mailtrapPass = process.env.MAILTRAP_PASS;
    if (!mailtrapUser || !mailtrapPass) {
      console.warn("MAILTRAP_USER/MAILTRAP_PASS not configured. Skipping email send.");
      return "Mail skipped";
    }

    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST ?? "sandbox.smtp.mailtrap.io",
      port: Number(process.env.MAILTRAP_PORT ?? "2525"),
      auth: {
        user: mailtrapUser,
        pass: mailtrapPass,
      },
    });

    await transport.sendMail(mailOption);
    return "Mail sent";
  } catch (error) {
    console.error("sendMail failed:", error);
    throw error;
  }
}
