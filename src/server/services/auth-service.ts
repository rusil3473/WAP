import { sendMail } from "@/helper/sendMail";
import { setToken } from "@/helper/setToken";
import { verifyActionToken } from "@/lib/action-token";
import {
  authenticateWithPassword,
  ensureAuthUserByEmail,
  ensureProfileForAuthUser,
  getProfileByEmail,
  getProfileById,
  selectInitialRole,
  setPasswordByUserId,
  setUserVerified,
} from "@/lib/supabase-data";

function getDefaultNameFromEmail(email: string) {
  return email.split("@")[0] || "User";
}

type LoginInput = {
  email: string;
  password?: string;
  sessionName?: string;
  viaGoogle: boolean;
};

export async function loginOrCreate(input: LoginInput) {
  let profile = await getProfileByEmail(input.email);

  if (!input.viaGoogle) {
    if (!input.password) {
      return { error: "Password is required", status: 400 as const };
    }

    const authenticatedProfile = await authenticateWithPassword(input.email, input.password);
    if (authenticatedProfile) {
      profile = authenticatedProfile;
    } else if (profile) {
      return {
        error: "Invalid credentials. Use the same method you used previously.",
        status: 400 as const,
      };
    } else {
      const authUser = await ensureAuthUserByEmail({
        email: input.email,
        password: input.password,
        fullName: getDefaultNameFromEmail(input.email),
      });

      profile = await ensureProfileForAuthUser(authUser, {
        fullName: getDefaultNameFromEmail(input.email),
        isVerified: true,
      });
    }
  } else if (!profile) {
    const authUser = await ensureAuthUserByEmail({
      email: input.email,
      fullName: input.sessionName,
    });
    profile = await ensureProfileForAuthUser(authUser, {
      fullName: input.sessionName,
      isVerified: true,
    });
  }

  if (!profile) {
    return { error: "No account found for this email", status: 400 as const };
  }

  const token = await setToken(profile);
  if (!token) {
    return { error: "Error while setting token", status: 400 as const };
  }

  return {
    status: 200 as const,
    data: {
      message: "Login success",
      success: true,
      role: profile.role,
      hasPassword: profile.hasPassword,
    },
  };
}

type SignupInput = {
  email: string;
  password: string;
  fullName: string;
};

export async function signupWithEmail(input: SignupInput) {
  const existingUser = await getProfileByEmail(input.email);
  if (existingUser) {
    return { error: "Email already in use", status: 400 as const };
  }

  const authUser = await ensureAuthUserByEmail({
    password: input.password,
    email: input.email,
    fullName: input.fullName,
  });

  const profile = await ensureProfileForAuthUser(authUser, {
    fullName: input.fullName,
    isVerified: false,
  });

  await sendMail({ userId: profile._id, email: input.email, requestType: "VERIFY" });

  return {
    status: 201 as const,
    data: { message: "User created successfully", success: true },
  };
}

export async function forgotPassword(email: string) {
  const user = await getProfileByEmail(email);

  if (!user) {
    return {
      error: "No account was found for this email",
      status: 400 as const,
    };
  }

  await sendMail({ userId: user._id, email, requestType: "RESET" });

  return {
    status: 200 as const,
    data: { message: "Password reset email sent", success: true },
  };
}

export async function resetPassword(token: string, password: string) {
  const payload = verifyActionToken(token);
  if (payload.type !== "RESET") {
    return { error: "Invalid token", status: 400 as const };
  }

  const updated = await setPasswordByUserId(payload.userId, password);
  if (!updated) {
    return { error: "Invalid token", status: 400 as const };
  }

  return {
    status: 200 as const,
    data: { message: "Password reset successful", success: true },
  };
}

export async function verifyEmail(verifyToken: string) {
  const payload = verifyActionToken(verifyToken);
  if (payload.type !== "VERIFY") {
    return { error: "Invalid token", status: 400 as const };
  }

  const updated = await setUserVerified(payload.userId, true);
  if (!updated) {
    return { error: "Invalid token", status: 400 as const };
  }

  return {
    status: 201 as const,
    data: { message: "User verified successfully", success: true },
  };
}

export async function selectRole(userId: string, role: "customer" | "owner") {
  const result = await selectInitialRole(userId, role);

  if (result.status === "not_found" || !result.profile) {
    return { error: "User not found", status: 404 as const };
  }

  if (result.status === "locked") {
    return {
      error: "Role already selected and cannot be changed",
      status: 409 as const,
    };
  }

  await setToken(result.profile);

  return {
    status: 200 as const,
    data: {
      message: result.status === "already_selected" ? "Role already selected" : "Role selected",
      success: true,
      role: result.profile.role,
    },
  };
}

export async function setPasswordForAuthenticatedUser(userId: string, password: string) {
  const updated = await setPasswordByUserId(userId, password);
  if (!updated) {
    return { error: "User not found", status: 404 as const };
  }

  const profile = await getProfileById(userId);
  if (profile) {
    await setToken(profile);
  }

  return {
    status: 200 as const,
    data: { message: "Password set successfully", success: true },
  };
}
