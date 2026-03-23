"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ACCESS_CODE = "bhl2024";

export default function AdminPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (code === ACCESS_CODE) {
      router.push("/dashboard");
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>
          <span style={styles.icon}>🔒</span>
        </div>
        <h1 style={styles.title}>관리자 로그인</h1>
        <p style={styles.subtitle}>세무법인 BHL</p>

        <div style={styles.form}>
          <label style={styles.label}>접근 코드</label>
          <input
            type="password"
            placeholder="접근 코드를 입력하세요"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              ...styles.input,
              borderColor: error ? "#D32F2F" : "#E5E8EB",
            }}
          />
          {error && (
            <p style={styles.errorText}>접근 코드가 올바르지 않습니다.</p>
          )}

          <button onClick={handleLogin} style={styles.loginBtn}>
            대시보드 입장
          </button>
        </div>

        <div style={styles.divider} />
        <p style={styles.footerText}>
          문의: 백근창 세무사 | 세무법인 BHL
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#F8F9FA",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 16px",
    fontFamily:
      "'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: 16,
    padding: "40px 32px",
    maxWidth: 400,
    width: "100%",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  iconWrap: {
    textAlign: "center" as const,
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1B2A4A",
    textAlign: "center" as const,
    margin: "0 0 4px",
  },
  subtitle: {
    fontSize: 13,
    color: "#8B95A1",
    textAlign: "center" as const,
    margin: "0 0 28px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: "#333D4B",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1.5px solid #E5E8EB",
    fontSize: 15,
    color: "#333D4B",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.15s",
  },
  errorText: {
    fontSize: 13,
    color: "#D32F2F",
    margin: "8px 0 0",
  },
  loginBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: 10,
    border: "none",
    background: "#1B2A4A",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 16,
    transition: "opacity 0.15s",
  },
  divider: {
    height: 1,
    background: "#F2F4F6",
    margin: "28px 0 16px",
  },
  footerText: {
    fontSize: 12,
    color: "#8B95A1",
    textAlign: "center" as const,
    margin: 0,
  },
};
