"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "../../lib/supabase";

interface Booking {
  id: string;
  created_at: string;
  consultation_type: string;
  business_type: string;
  name: string;
  phone: string;
  preferred_method: string;
  status: string;
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "all", consultation: "all" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    const { data, error } = await getSupabase()
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("데이터 조회 실패:", error);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await getSupabase()
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  const filtered = bookings.filter((b) => {
    if (filter.status !== "all" && b.status !== filter.status) return false;
    if (filter.consultation !== "all" && b.consultation_type !== filter.consultation) return false;
    if (search && !b.name.includes(search) && !b.phone.includes(search)) return false;
    return true;
  });

  const totalCount = bookings.length;
  const todayCount = bookings.filter((b) => b.created_at?.slice(0, 10) === today).length;
  const newCount = bookings.filter((b) => b.status === "new").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const doneCount = bookings.filter((b) => b.status === "done").length;

  const statusLabel: Record<string, string> = {
    new: "신규",
    confirmed: "확인",
    done: "완료",
  };

  const statusColor: Record<string, { bg: string; text: string }> = {
    new: { bg: "#E3F2FD", text: "#1565C0" },
    confirmed: { bg: "#FFF3E0", text: "#E65100" },
    done: { bg: "#E8F5E9", text: "#2E7D32" },
  };

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${month}.${day} ${hours}:${mins}`;
  }

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>상담 예약 대시보드</h1>
          <p style={styles.subtitle}>세무법인 BHL</p>
        </div>

        {/* Summary Cards */}
        <div style={styles.summaryGrid}>
          <div style={{ ...styles.summaryCard, borderTop: "3px solid #1565C0" }}>
            <p style={styles.summaryLabel}>전체 예약</p>
            <p style={styles.summaryValue}>{totalCount}</p>
          </div>
          <div style={{ ...styles.summaryCard, borderTop: "3px solid #7B1FA2" }}>
            <p style={styles.summaryLabel}>오늘 예약</p>
            <p style={styles.summaryValue}>{todayCount}</p>
          </div>
          <div style={{ ...styles.summaryCard, borderTop: "3px solid #E65100" }}>
            <p style={styles.summaryLabel}>신규 (미확인)</p>
            <p style={styles.summaryValue}>{newCount}</p>
          </div>
          <div style={{ ...styles.summaryCard, borderTop: "3px solid #2E7D32" }}>
            <p style={styles.summaryLabel}>완료</p>
            <p style={styles.summaryValue}>{doneCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filterCard}>
          <div style={styles.filterRow}>
            <input
              type="text"
              placeholder="이름 또는 전화번호 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <select
              value={filter.status}
              onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
              style={styles.filterSelect}
            >
              <option value="all">전체 상태</option>
              <option value="new">신규</option>
              <option value="confirmed">확인</option>
              <option value="done">완료</option>
            </select>
            <select
              value={filter.consultation}
              onChange={(e) => setFilter((f) => ({ ...f, consultation: e.target.value }))}
              style={styles.filterSelect}
            >
              <option value="all">전체 상담</option>
              <option value="사업 절세">사업 절세</option>
              <option value="법인전환">법인전환</option>
              <option value="상속·증여">상속·증여</option>
              <option value="세무조사">세무조사</option>
              <option value="기장대행">기장대행</option>
              <option value="기타">기타</option>
            </select>
            <button onClick={fetchBookings} style={styles.refreshBtn}>
              새로고침
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={styles.tableCard}>
          {filtered.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>예약 데이터가 없습니다.</p>
            </div>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>접수일시</th>
                    <th style={styles.th}>이름</th>
                    <th style={styles.th}>연락처</th>
                    <th style={styles.th}>상담 유형</th>
                    <th style={styles.th}>업종</th>
                    <th style={styles.th}>희망 방법</th>
                    <th style={styles.th}>상태</th>
                    <th style={styles.th}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} style={styles.tr}>
                      <td style={styles.td}>{formatDate(b.created_at)}</td>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{b.name}</td>
                      <td style={styles.td}>{b.phone}</td>
                      <td style={styles.td}>{b.consultation_type}</td>
                      <td style={styles.td}>{b.business_type}</td>
                      <td style={styles.td}>{b.preferred_method}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: statusColor[b.status]?.bg || "#F5F5F5",
                            color: statusColor[b.status]?.text || "#666",
                          }}
                        >
                          {statusLabel[b.status] || b.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionBtns}>
                          {b.status === "new" && (
                            <button
                              onClick={() => updateStatus(b.id, "confirmed")}
                              style={styles.confirmBtn}
                            >
                              확인
                            </button>
                          )}
                          {(b.status === "new" || b.status === "confirmed") && (
                            <button
                              onClick={() => updateStatus(b.id, "done")}
                              style={styles.doneBtn}
                            >
                              완료
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={styles.tableFooter}>
            <p style={styles.footerText}>총 {filtered.length}건</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#F8F9FA",
    fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  inner: {
    maxWidth: 1080,
    margin: "0 auto",
    padding: "32px 16px 60px",
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: "#1B2A4A",
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: "#8B95A1",
    marginTop: 4,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: "18px 16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#8B95A1",
    margin: 0,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 700,
    color: "#1B2A4A",
    margin: "6px 0 0",
  },
  filterCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: "14px 16px",
    marginBottom: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  filterRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap" as const,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    minWidth: 180,
    padding: "9px 14px",
    borderRadius: 8,
    border: "1px solid #E5E8EB",
    fontSize: 14,
    outline: "none",
    color: "#1B2A4A",
  },
  filterSelect: {
    padding: "9px 14px",
    borderRadius: 8,
    border: "1px solid #E5E8EB",
    fontSize: 14,
    color: "#1B2A4A",
    backgroundColor: "#fff",
    outline: "none",
    cursor: "pointer",
  },
  refreshBtn: {
    padding: "9px 18px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#1B2A4A",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  tableCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  tableWrap: {
    overflowX: "auto" as const,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 14,
  },
  th: {
    textAlign: "left" as const,
    padding: "13px 14px",
    backgroundColor: "#F8F9FA",
    color: "#6B7684",
    fontWeight: 600,
    fontSize: 13,
    borderBottom: "1px solid #E5E8EB",
    whiteSpace: "nowrap" as const,
  },
  tr: {
    borderBottom: "1px solid #F2F4F6",
  },
  td: {
    padding: "13px 14px",
    color: "#1B2A4A",
    whiteSpace: "nowrap" as const,
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
  },
  actionBtns: {
    display: "flex",
    gap: 6,
  },
  confirmBtn: {
    padding: "5px 12px",
    borderRadius: 6,
    border: "1px solid #E65100",
    backgroundColor: "#fff",
    color: "#E65100",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  doneBtn: {
    padding: "5px 12px",
    borderRadius: 6,
    border: "1px solid #2E7D32",
    backgroundColor: "#fff",
    color: "#2E7D32",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  tableFooter: {
    padding: "12px 16px",
    borderTop: "1px solid #F2F4F6",
  },
  footerText: {
    fontSize: 13,
    color: "#8B95A1",
    margin: 0,
  },
  emptyState: {
    padding: "60px 16px",
    textAlign: "center" as const,
  },
  emptyText: {
    fontSize: 15,
    color: "#8B95A1",
  },
  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
    fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid #E5E8EB",
    borderTop: "3px solid #1B2A4A",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: "#8B95A1",
  },
};
