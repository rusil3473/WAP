import { getProfileById, type UserProfile } from "@/lib/supabase-data";

export default async function getUserData(id: string): Promise<UserProfile | null> {
  try {
    return await getProfileById(id);
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
}
