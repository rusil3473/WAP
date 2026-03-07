import jwt from "jsonwebtoken";

export type ActionTokenType = "VERIFY" | "RESET";

type ActionTokenPayload = {
  type: ActionTokenType;
  userId: string;
  email: string;
};

function getAuthSecret() {
  const secret = process.env.SECRET;
  if (!secret) {
    throw new Error("SECRET is not configured.");
  }
  return secret;
}

export function signActionToken(payload: ActionTokenPayload) {
  return jwt.sign(payload, getAuthSecret(), { expiresIn: "1d" });
}

export function verifyActionToken(token: string): ActionTokenPayload {
  return jwt.verify(token, getAuthSecret()) as ActionTokenPayload;
}
