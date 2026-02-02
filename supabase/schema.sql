-- =============================================
-- Biz360 SkillBridge Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. Companies Table
-- =============================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  employee_count INTEGER,
  address TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  biz360_id TEXT UNIQUE, -- Biz360 연동 ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. Users Table (extends Supabase auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  company_id UUID REFERENCES companies(id),
  department TEXT,
  position TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. Skill Courses Table
-- =============================================
CREATE TABLE IF NOT EXISTS skill_courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  provider_logo TEXT,
  category TEXT CHECK (category IN ('용접', '안전', '품질', '자동화', 'IoT', '기타')),
  description TEXT,
  duration TEXT,
  cost TEXT,
  location TEXT,
  start_date DATE,
  end_date DATE,
  deadline DATE,
  status TEXT DEFAULT 'recruiting' CHECK (status IN ('recruiting', 'upcoming', 'ongoing', 'completed', 'cancelled')),
  thumbnail_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  students INTEGER DEFAULT 0,
  capacity INTEGER,
  curriculum JSONB, -- 커리큘럼 데이터
  instructor JSONB, -- 강사 정보
  requirements TEXT[],
  benefits TEXT[],
  contact_phone TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. Skill Assessments Table
-- =============================================
CREATE TABLE IF NOT EXISTS skill_assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  scores JSONB NOT NULL, -- {"스마트제조": 3, "데이터분석": 2, ...}
  average_score DECIMAL(2,1) NOT NULL,
  recommendations JSONB, -- 추천 교육 과정
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. Course Applications Table
-- =============================================
CREATE TABLE IF NOT EXISTS course_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES skill_courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  UNIQUE(course_id, user_id)
);

-- =============================================
-- 6. Course Reviews Table
-- =============================================
CREATE TABLE IF NOT EXISTS course_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES skill_courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- =============================================
-- Indexes for better query performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_courses_category ON skill_courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_status ON skill_courses(status);
CREATE INDEX IF NOT EXISTS idx_assessments_user ON skill_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_company ON skill_assessments(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON course_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_course ON course_applications(course_id);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Companies are viewable by everyone" ON companies
  FOR SELECT USING (true);

CREATE POLICY "Companies can be managed by admins" ON companies
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users in their company" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'manager')
      AND u.company_id = users.company_id
    )
  );

-- Skill courses policies (public read)
CREATE POLICY "Courses are viewable by everyone" ON skill_courses
  FOR SELECT USING (true);

CREATE POLICY "Courses can be managed by admins" ON skill_courses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Skill assessments policies
CREATE POLICY "Users can view their own assessments" ON skill_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments" ON skill_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Managers can view company assessments" ON skill_assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
      AND users.company_id = skill_assessments.company_id
    )
  );

-- Course applications policies
CREATE POLICY "Users can view their own applications" ON course_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications" ON course_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own applications" ON course_applications
  FOR UPDATE USING (auth.uid() = user_id);

-- Course reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON course_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for completed courses" ON course_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM course_applications
      WHERE course_applications.course_id = course_reviews.course_id
      AND course_applications.user_id = auth.uid()
      AND course_applications.status = 'completed'
    )
  );

-- =============================================
-- Functions and Triggers
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON skill_courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update course rating when review is added
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE skill_courses
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM course_reviews
    WHERE course_id = NEW.course_id
  )
  WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_review
  AFTER INSERT OR UPDATE ON course_reviews
  FOR EACH ROW EXECUTE FUNCTION update_course_rating();

-- =============================================
-- Sample Data (Optional)
-- =============================================

-- Insert sample courses
INSERT INTO skill_courses (title, provider_name, category, duration, cost, location, start_date, status, description, rating, students, capacity) VALUES
('아크 용접 기능사 자격증 취득반', '한국폴리텍대학', '용접', '3개월 (120시간)', '무료 (국비지원)', '부산 사상구', '2024-02-15', 'recruiting', 'CO2 용접, 아크 용접 실기 집중 훈련', 4.8, 324, 30),
('산업안전기사 실기 완성', '경남산업안전교육원', '안전', '2개월 (80시간)', '450,000원', '창원시 성산구', '2024-02-20', 'recruiting', '산업안전 법규, 위험성 평가 실무', 4.6, 186, 25),
('품질관리(QC) 전문가 양성과정', '부산품질혁신센터', '품질', '1개월 (40시간)', '무료 (국비지원)', '부산 강서구', '2024-03-01', 'recruiting', 'SPC, 6시그마, ISO 9001 실무', 4.9, 412, 30),
('PLC 자동화 시스템 실무', '스마트공장혁신센터', '자동화', '2개월 (100시간)', '600,000원', '울산시 남구', '2024-02-25', 'recruiting', '미쓰비시/지멘스 PLC 프로그래밍', 4.7, 253, 20),
('지게차 운전 기능사 취득', '대한상공회의소', '안전', '2주 (40시간)', '무료 (내일배움카드)', '김해시 장유', '2024-02-12', 'recruiting', '지게차 실기 운전 및 안전 교육', 4.5, 567, 40),
('스마트 센서 및 IoT 기초', '경남테크노파크', '자동화', '1개월 (60시간)', '350,000원', '창원시 의창구', '2024-03-10', 'upcoming', '산업용 센서, 데이터 수집 및 분석', 4.4, 128, 25)
ON CONFLICT DO NOTHING;

-- =============================================
-- Grant permissions
-- =============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
