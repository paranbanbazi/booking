"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

const CONSULTATION_TYPES = [
  { value: "사업 절세", label: "사업 절세", desc: "법인세·소득세 절감" },
  { value: "법인전환", label: "법인전환", desc: "개인 → 법인 전환 검토" },
  { value: "상속·증여", label: "상속·증여", desc: "자산 이전·승계 설계" },
  { value: "세무조사", label: "세무조사 대응", desc: "" },
  { value: "기장대행", label: "기장대행", desc: "세무 기장 의뢰" },
  { value: "기타", label: "기타", desc: "" },
];

const BUSINESS_TYPES = [
  { value: "병의원", label: "병의원" },
  { value: "법인", label: "법인" },
  { value: "개인사업자", label: "개인사업자" },
  { value: "해당없음", label: "해당 없음" },
];

const METHODS = [
  { value: "전화", label: "전화 상담" },
  { value: "방문", label: "방문 상담" },
  { value: "카카오톡", label: "카카오톡" },
];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    consultation_type: "",
    business_type: "",
    name: "",
    phone: "",
    preferred_method: "",
  });

  const handleSubmit = async () => {
    if (
      !form.consultation_type ||
      !form.business_type ||
      !form.name ||
      !form.phone ||
      !form.preferred_method
    ) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await getSupabase().from("bookings").insert([form]);
      if (error) throw error;
      setStep(1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      console.error("예약 오류:", err);
      alert("예약 오류: " + msg);
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.doneIcon}>✓</div>
          <h1 style={styles.doneTitle}>예약이 완료되었습니다</h1>
          <p style={styles.doneText}>
            영업일 기준 24시간 내에 연락드리겠습니다.
          </p>
          <div style={styles.divider} />
          <p style={styles.brand}>백근창 세무사 | 세무법인 BHL</p>
          <p style={styles.slogan}>구조를 바꾸면 세금이 바뀝니다</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.subLabel}>세무법인 BHL</p>
        <h1 style={styles.title}>상담 예약</h1>
        <p style={styles.desc}>맞춤 상담을 위해 간단히 알려주세요</p>

        {/* Q1: 상담 분야 */}
        <div style={styles.section}>
          <label style={styles.label}>어떤 부분이 궁금하세요?</label>
          <div style={styles.optionGrid}>
            {CONSULTATION_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() =>
                  setForm({ ...form, consultation_type: t.value })
                }
                style={{
                  ...styles.optionBtn,
                  ...(form.consultation_type === t.value
                    ? styles.optionBtnActive
                    : {}),
                }}
              >
                <span style={styles.optionLabel}>{t.label}</span>
                {t.desc && <span style={styles.optionDesc}>{t.desc}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Q2: 사업 형태 */}
        <div style={styles.section}>
          <label style={styles.label}>사업 형태</label>
          <div style={styles.optionRow}>
            {BUSINESS_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setForm({ ...form, business_type: t.value })}
                style={{
                  ...styles.chipBtn,
                  ...(form.business_type === t.value
                    ? styles.chipBtnActive
                    : {}),
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.divider} />

        {/* Q3: 성함 */}
        <div style={styles.section}>
          <label style={styles.label}>성함</label>
          <input
            type="text"
            placeholder="홍길동"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={styles.input}
          />
        </div>

        {/* Q4: 연락처 */}
        <div style={styles.section}>
          <label style={styles.label}>연락처</label>
          <input
            type="tel"
            placeholder="010-0000-0000"
            value={form.phone}
            onChange={(e) => {
              const nums = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
              let formatted = nums;
              if (nums.length > 3 && nums.length <= 7) {
                formatted = nums.slice(0, 3) + "-" + nums.slice(3);
              } else if (nums.length > 7) {
                formatted = nums.slice(0, 3) + "-" + nums.slice(3, 7) + "-" + nums.slice(7);
              }
              setForm({ ...form, phone: formatted });
            }}
            style={styles.input}
          />
        </div>

        {/* Q5: 희망 상담 방법 */}
        <div style={styles.section}>
          <label style={styles.label}>희망 상담 방법</label>
          <div style={styles.optionRow}>
            {METHODS.map((m) => (
              <button
                key={m.value}
                onClick={() =>
                  setForm({ ...form, preferred_method: m.value })
                }
                style={{
                  ...styles.chipBtn,
                  ...(form.preferred_method === m.value
                    ? styles.chipBtnActive
                    : {}),
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            ...styles.submitBtn,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "예약 중..." : "상담 예약하기"}
        </button>

        <p style={styles.notice}>영업일 기준 24시간 내 연락드립니다</p>

        <div style={styles.divider} />

        <p style={styles.brand}>백근창 세무사 | 세무법인 BHL</p>
        <p style={styles.slogan}>구조를 바꾸면 세금이 바뀝니다</p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "#F8F9FA",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 16px 80px",
    fontFamily:
      "'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: 16,
    padding: "32px 28px",
    maxWidth: 480,
    width: "100%",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  subLabel: {
    fontSize: 12,
    color: "#8B95A1",
    margin: "0 0 4px",
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1B2A4A",
    margin: "0 0 6px",
  },
  desc: {
    fontSize: 14,
    color: "#6B7684",
    margin: "0 0 28px",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    color: "#333D4B",
    marginBottom: 10,
  },
  optionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
  },
  optionBtn: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1.5px solid #E5E8EB",
    background: "#FFFFFF",
    cursor: "pointer",
    textAlign: "left" as const,
    transition: "all 0.15s",
  },
  optionBtnActive: {
    borderColor: "#1B2A4A",
    background: "#F0F3F8",
  },
  optionLabel: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    color: "#333D4B",
  },
  optionDesc: {
    display: "block",
    fontSize: 11,
    color: "#8B95A1",
    marginTop: 2,
  },
  optionRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap" as const,
  },
  chipBtn: {
    padding: "10px 18px",
    borderRadius: 8,
    border: "1.5px solid #E5E8EB",
    background: "#FFFFFF",
    fontSize: 14,
    fontWeight: 500,
    color: "#6B7684",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  chipBtnActive: {
    borderColor: "#1B2A4A",
    background: "#F0F3F8",
    color: "#1B2A4A",
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
  divider: {
    height: 1,
    background: "#F2F4F6",
    margin: "24px 0",
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: 10,
    border: "none",
    background: "#1B2A4A",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
    transition: "opacity 0.15s",
  },
  notice: {
    fontSize: 12,
    color: "#8B95A1",
    textAlign: "center" as const,
    margin: "12px 0 0",
  },
  brand: {
    fontSize: 13,
    color: "#8B95A1",
    textAlign: "center" as const,
    margin: 0,
  },
  slogan: {
    fontSize: 13,
    color: "#1B2A4A",
    fontWeight: 600,
    textAlign: "center" as const,
    margin: "4px 0 0",
  },
  doneIcon: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#E8F5E9",
    color: "#2E7D32",
    fontSize: 28,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  doneTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#1B2A4A",
    textAlign: "center" as const,
    margin: "0 0 8px",
  },
  doneText: {
    fontSize: 14,
    color: "#6B7684",
    textAlign: "center" as const,
    margin: "0 0 0",
  },
};
