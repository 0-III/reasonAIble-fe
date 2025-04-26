"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 초기화 로직: localStorage에서 accessToken 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      // 토큰이 있으면 사용자 상태를 복원
      const email = localStorage.getItem("userEmail"); // 이메일도 localStorage에서 가져옴
      if (email) {
        setUser({ email });
      }
    }

    setIsLoading(false); // 로딩 상태 해제
  }, []);

  const login = (email: string, token: string) => {
    // 로그인 시 토큰과 이메일 저장
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userEmail", email);
    setUser({ email });
  };

  const logout = () => {
    // 로그아웃 시 토큰과 사용자 정보 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
