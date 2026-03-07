import { redirect } from "next/navigation";

export default function ManageBookingLegacyPage() {
  redirect("/owner/bookings");
}
