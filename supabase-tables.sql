-- 创建projects表
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  description TEXT NOT NULL,
  logo TEXT NOT NULL,
  image TEXT,
  gradient TEXT DEFAULT 'from-purple-100 via-violet-50 to-blue-100',
  stars INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 设置安全策略
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "允许所有用户读取projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "允许服务角色更新projects" ON public.projects FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "允许服务角色插入projects" ON public.projects FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_projects_verified ON public.projects(verified);
CREATE INDEX IF NOT EXISTS idx_projects_stars ON public.projects(stars);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);

-- 创建links表
CREATE TABLE IF NOT EXISTS public.links (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('GITHUB', 'TWITTER', 'LINKEDIN', 'WEBSITE')),
  url TEXT NOT NULL,
  short_link TEXT NOT NULL,
  order_num INTEGER DEFAULT 0,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 添加唯一约束
ALTER TABLE public.links ADD CONSTRAINT links_url_unique UNIQUE (url);
ALTER TABLE public.links ADD CONSTRAINT links_short_link_unique UNIQUE (short_link);

-- 设置安全策略
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "允许所有用户读取links" ON public.links FOR SELECT USING (true);
CREATE POLICY "允许服务角色更新links" ON public.links FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "允许服务角色插入links" ON public.links FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_links_project_id ON public.links(project_id);

-- 创建计数器增加函数
CREATE OR REPLACE FUNCTION increment_counter(row_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  current_value INTEGER;
BEGIN
  -- 获取当前值
  SELECT clicks INTO current_value FROM public.projects WHERE id = row_id;
  -- 返回增加后的值
  RETURN current_value + 1;
END;
$$ LANGUAGE plpgsql; 