import { fetchExcuses } from "@/lib/api";
import ExcuseDetailClient from "./ExcuseDetailClient";

export async function generateStaticParams() {
  const excuses = await fetchExcuses();
  return excuses.map((excuse: { id: number }) => ({
    id: excuse.id.toString(),
  }));
}

export default function ExcuseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <ExcuseDetailClient id={params.id} />;
}
