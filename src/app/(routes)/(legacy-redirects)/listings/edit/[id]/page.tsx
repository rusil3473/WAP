import { redirect } from "next/navigation";

export default async function EditListingLegacyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/owner/listings/edit/${id}`);
}
