import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // 백엔드 API 주소

export async function generateExcuse(situation: string) {
  const response = await axios.post(`${API_BASE_URL}/excuses`, { situation });
  return response.data.data; // 백엔드에서 반환된 데이터를 반환
}

export async function fetchExcuses() {
  const response = await axios.get(`${API_BASE_URL}/excuses`);
  return response.data.data; // 모든 excuses 데이터 반환
}

export async function fetchExcuseById(id: string) {
  const response = await axios.get(`${API_BASE_URL}/excuses/${id}`);
  return response.data.data;
}

export async function updateExcuse(id: string, data: Partial<Excuse>) {
  const response = await axios.put(`${API_BASE_URL}/excuses/${id}`, data);
  return response.data.data;
}

export async function deleteExcuse(id: string) {
  await axios.delete(`${API_BASE_URL}/excuses/${id}`);
}
