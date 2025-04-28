import { Excuse } from "@/types/excuse";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // 백엔드 API 주소

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

export async function generateExcuse(situation: string) {
  const response = await apiClient.post(`/excuses/ai`, {
    situation,
  });
  return response.data.data; // 백엔드에서 반환된 데이터를 반환
}

export async function generateKnlExcuse(situation: string) {
  const response = await apiClient.post(`/excuses/knl-ai`, {
    situation,
  });
  return response.data.data;
}

export async function fetchExcuses() {
  const response = await apiClient.get(`/excuses`);
  return response.data.data; // 모든 excuses 데이터 반환
}

export async function fetchExcuseById(id: string) {
  const response = await apiClient.get(`/excuses/${id}`);
  return response.data.data;
}

export async function updateExcuse(id: string, data: Partial<Excuse>) {
  const response = await apiClient.put(`/excuses/${id}`, data);
  return response.data.data;
}

export async function deleteExcuse(id: string) {
  await apiClient.delete(`/excuses/${id}`);
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

export async function registerMember(
  email: string,
  password: string,
  nickname?: string
) {
  try {
    const response = await apiClient.post(`/members`, {
      email,
      password,
      nickname,
    });
    return response.data; // 성공 시 백엔드에서 반환된 데이터를 반환
  } catch (error: any) {
    console.error(
      "Failed to register member:",
      error.response?.data || error.message
    );
    throw error; // 에러를 호출한 쪽으로 전달
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const response = await apiClient.post(`/login`, {
      email,
      password,
    });

    // Authorization 헤더에서 accessToken 추출
    const accessToken = response.headers.authorization;

    if (!accessToken) {
      throw new Error(
        "Authorization token is missing in the response headers."
      );
    }

    return { accessToken, email }; // accessToken 반환
  } catch (error: any) {
    console.error("Failed to login:", error.response?.data || error.message);
    throw error; // 에러를 호출한 쪽으로 전달
  }
}

export async function logoutUser() {
  try {
    const response = await apiClient.post(`/logout`);

    return response.data; // 로그아웃 성공 시 반환된 데이터
  } catch (error: any) {
    console.error("Failed to logout:", error.response?.data || error.message);
    throw error; // 에러를 호출한 쪽으로 전달
  }
}
