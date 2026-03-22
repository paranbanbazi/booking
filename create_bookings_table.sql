-- =========================================
-- 세무법인 BHL 상담 예약 테이블
-- Supabase SQL Editor에서 실행하세요
-- =========================================

-- 1. 테이블 생성
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  consultation_type TEXT NOT NULL,
  business_type TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_method TEXT NOT NULL,
  status TEXT DEFAULT 'new'
);

-- 2. RLS 활성화
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 3. 누구나 예약 가능 (로그인 없이)
CREATE POLICY "Anyone can insert bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

-- 4. 인증된 사용자만 조회 가능
CREATE POLICY "Only authenticated can view"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);
