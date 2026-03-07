import { redirect } from "next/navigation";

export default async function BookLegacyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/customer/book/${id}`);
}
