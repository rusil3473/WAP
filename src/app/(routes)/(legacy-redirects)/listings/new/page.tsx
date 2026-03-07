import { redirect } from "next/navigation";

export default function NewListingLegacyPage() {
  redirect("/owner/listings/new");
}
