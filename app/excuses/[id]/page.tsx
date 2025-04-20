import { fetchExcuses, fetchExcuseById } from "@/lib/api";
import ExcuseDetailClient from "./ExcuseDetailClient";

export async function generateStaticParams() {
  try {
    const excuses = await fetchExcuses();
    return excuses.map((excuse: { id: number }) => ({
      id: excuse.id.toString(),
    }));
  } catch (error) {
    console.error("Failed to fetch excuses:", error);

    // 기본 데이터 반환 (예: 테스트용 ID)
    return [{ id: "1" }, { id: "2" }];
  }
}

export default async function ExcuseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    // 비동기적으로 데이터를 가져옵니다.
    const excuse = await fetchExcuseById(params.id);

    return <ExcuseDetailClient id={params.id} excuse={excuse} />;
  } catch (error) {
    console.error("Failed to fetch excuse:", error);

    // 에러 페이지 또는 기본 메시지 반환
    return (
      <div className="container">
        <h1>Error</h1>
        <p>Failed to load the excuse. Please try again later.</p>
      </div>
    );
  }
}
