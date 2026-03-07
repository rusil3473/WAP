import { redirect } from "next/navigation";

export default async function SearchDetailsLegacyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/customer/search/${id}`);
}
