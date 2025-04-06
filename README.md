<a href="https://oss.gallery">
  <img alt="OSS Gallery" src="https://raw.githubusercontent.com/dubinc/oss-gallery/main/public/thumbnail.jpg" />
</a>

<h3 align="center">OSS Gallery</h3>

<p align="center">
    A crowdsourced list of the best open-source projects on the internet.
    <br />
    <a href="https://dub.co/blog/product-discovery-platform"><strong>Learn how it's built »</strong></a>
    <br />
    <br />
    <a href="#introduction"><strong>Introduction</strong></a> ·
    <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
    <a href="#supabase-integration"><strong>Supabase Integration</strong></a>
</p>

<p align="center">
  <a href="https://twitter.com/dubdotco">
    <img src="https://img.shields.io/twitter/follow/dubdotco?style=flat&label=%40dubdotco&logo=twitter&color=0bf&logoColor=fff" alt="Twitter" />
  </a>
  <a href="https://news.ycombinator.com/item?id=40146998"><img src="https://img.shields.io/badge/Hacker%20News-125-%23FF6600" alt="Hacker News"></a>
</p>

<br/>

## Introduction

[OSS Gallery](https://oss.gallery) is a crowdsourced list of the best open-source projects on the internet.

It uses the [Dub.co API](https://dub.co/docs/api-reference/introduction) to create short links for each project page + display real-time click analytics for them.

<img width="1062" alt="CleanShot 2024-04-24 at 20 15 09@2x" src="https://github.com/dubinc/oss-gallery/assets/28986134/7d2ff6e6-cdb2-4818-88f9-ce3e6518c09d">

## Tech Stack

- Next.js Server Actions + Form Actions (zero API routes)
- Dub [TypeScript SDK](https://github.com/dubinc/dub-node)
- Tremor for charts
- Vercel Postgres + deployment
- Supabase (optional alternative to Vercel Postgres)

## Supabase Integration

This project can be run with Supabase as an alternative to Vercel Postgres.

### Environment Setup

- Node.js v22.14.0
- npm v10.9.2
- pnpm v9.3.0
- Next.js 14.3.0-canary.30

### Setup Steps

1. **Install Supabase Client**
   ```bash
   pnpm add @supabase/supabase-js
   ```

2. **Configure Environment Variables**
   Create or modify `.env` file:
   ```
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # NextAuth Secret
   AUTH_SECRET=your-auth-secret
   ```

3. **Create Database Tables**
   Execute the SQL script in [supabase-tables.sql](./supabase-tables.sql) in Supabase SQL Editor.

4. **Initialize Sample Data**
   ```bash
   pnpm supabase:init:simple
   ```

5. **Run Development Server**
   ```bash
   pnpm dev
   ```

6. **Access the Site**
   Visit http://localhost:3000 (or the port assigned)

### Note on Prisma Dependency

The current implementation still requires Prisma for certain components:
```bash
npx prisma generate
```

This is a hybrid solution that will be fully migrated to Supabase in future updates.

### Deployment

When deploying to Vercel or Cloudflare, configure the following environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AUTH_SECRET`

## AI角色聊天导航网站分步实施方案

### 第一阶段：基础修复与准备（1-2天）

1. **修复数据库结构**
   - 添加必要字段到`projects`表
   ```sql
   ALTER TABLE projects ADD COLUMN url TEXT;
   ALTER TABLE projects ADD COLUMN keywords TEXT;
   ALTER TABLE projects ADD COLUMN meta_description TEXT;
   ```
   
2. **修复提交功能**
   - 更新`components/submit-form.tsx`适配新字段
   - 更新`app/api/submit/route.ts`处理新字段

3. **添加管理员识别功能**
   - 创建简单的管理员检查函数
   - 修改提交逻辑区分管理员和普通用户

### 第二阶段：自动采集功能（3-5天）

1. **增强截图API**
   - 升级`app/api/capture/route.ts`，使用Puppeteer实现真实截图
   - 添加错误处理和超时机制
   ```javascript
   // 使用Puppeteer获取网页截图
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   await page.goto(url);
   const screenshot = await page.screenshot();
   ```

2. **添加内容提取功能**
   - 从网页提取标题、描述、关键词等
   - 创建`app/api/extract/route.ts`提供内容分析API
   ```javascript
   // 提取页面元数据
   const title = await page.$eval('title', el => el.textContent);
   const description = await page.$eval('meta[name="description"]', el => el.getAttribute('content'));
   const keywords = await page.$eval('meta[name="keywords"]', el => el.getAttribute('content'));
   ```

3. **优化提交表单UI**
   - 更新表单展示预览和提取的内容
   - 添加编辑功能让用户修改自动提取的内容

### 第三阶段：SEO内容自动生成（5-7天）

1. **建立SEO内容生成API**
   - 创建`app/api/generate-seo/route.ts`
   - 接入AI服务（如OpenAI API）生成SEO内容
   ```javascript
   const response = await openai.createCompletion({
     model: "text-davinci-003",
     prompt: `基于以下网站信息，生成SEO描述和关键词:\n${websiteInfo}`,
     max_tokens: 200
   });
   ```

2. **增强文章管理功能**
   - 更新`app/projects/[slug]/articles/page.tsx`
   - 添加自动生成文章草稿的功能
   
3. **优化二级页面数据结构**
   - 完善`articles`表，支持更多SEO字段
   - 添加自动生成文章特性

### 第四阶段：管理员功能增强（3-4天）

1. **完善管理员后台**
   - 增强`app/admin/page.tsx`，添加高级管理功能
   - 添加批量审核功能
   - 添加统计和分析功能

2. **用户角色系统**
   - 创建`users`表存储用户信息
   - 实现基础的权限控制系统
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     email TEXT UNIQUE NOT NULL,
     name TEXT,
     role TEXT DEFAULT 'user',
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. **添加简单的登录认证**
   - 使用NextAuth或类似工具实现基础认证
   - 连接到Supabase Auth服务

### 第五阶段：前端优化与完善（4-5天）

1. **优化首页布局**
   - 仿照Toolify.ai的网格布局
   - 添加筛选和分类功能
   - 优化移动端显示

2. **完善二级页面**
   - 优化项目详情页，参考Ghibli AI Generator页面
   - 添加相关项目推荐功能
   - 增强交互体验

3. **添加数据统计功能**
   - 记录点击和访问数据
   - 添加简单的数据可视化

### 第六阶段：测试与部署（2-3天）

1. **全面测试**
   - 功能测试：确保所有功能正常工作
   - 性能测试：确保系统在高负载下仍然稳定
   - 安全测试：检查潜在的安全漏洞

2. **优化部署配置**
   - 配置CDN加速静态资源
   - 优化服务器配置
   - 设置监控和告警

3. **编写文档**
   - 用户指南
   - 管理员手册
   - API文档（如需要）

### 预计总工期：18-26天

## 开发记录与问题排查

### 最近开发进度 (2024年05月)

1. **数据库结构优化**
   - 添加了关键SEO字段：`category`, `status`, `featured`, `rating`
   - 修复了提交功能中的RLS(行级安全)权限问题
   - 添加了UUID自动生成功能，解决ID为null的问题

2. **提交表单增强**
   - 添加了分类选择功能
   - 实现了SEO内容自动生成功能
   - 优化了表单UI，支持预览和内容提取

3. **内容生成器API**
   - 创建了内容生成API，自动生成SEO友好的描述和关键词
   - 根据网站分类提供针对性的内容建议
   - 添加了评分系统，提供SEO优化建议

### 常见问题与排错指南

1. **网站提交错误**
   - **症状**: 提交时出现"violates row-level security policy"错误
   - **解决方案**: 
     - 使用具有`SERVICE_ROLE_KEY`权限的客户端执行插入操作
     - 确保所有必填字段都已提供值
     ```javascript
     // 使用supabaseAdmin客户端而非普通客户端
     const { data, error } = await supabaseAdmin
       .from("projects")
       .insert([projectData]);
     ```

2. **加载错误 (ChunkLoadError)**
   - **症状**: 显示"Loading chunk app/not-found failed"错误
   - **解决方案**:
     - 清理Next.js缓存: `Remove-Item -Path ".next\cache" -Recurse -Force`
     - 重新构建项目: `pnpm build`
     - 或使用Turbo模式启动: `npx next dev --turbo`

3. **TypeScript错误**
   - **症状**: 构建失败，显示"Expected 0-1 arguments, but got 2"
   - **解决方案**:
     - 修复useEffect依赖数组的问题
     - 使用可选链操作符处理可能为null的对象
     ```javascript
     useEffect(() => {
       fetchArticles();
     }, [project?.id]); // 使用可选链操作符
     ```

### Windows PowerShell特殊说明

Windows PowerShell不支持`&&`语法连接命令，请使用分号`;`或单独执行每个命令：

```powershell
# 错误
pnpm build && pnpm start

# 正确
pnpm build; pnpm start
# 或
pnpm build
pnpm start
```

## 本地运行指南

### 1. 环境准备

确保安装以下依赖:
- Node.js v14+
- pnpm (推荐) 或 npm
- 一个已配置的Supabase项目

### 2. 环境变量配置

创建`.env`文件:
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # 重要: 用于绕过RLS策略

# NextAuth Secret
AUTH_SECRET=your-auth-secret
```

### 3. 安装依赖

```bash
pnpm install
```

### 4. 数据库初始化

在Supabase SQL编辑器中执行以下SQL:
```sql
-- 确保projects表有所有必要字段
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1);

-- 创建articles表(如需要)
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  keywords TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. 启动开发服务器

```bash
pnpm dev
```

应用将在http://localhost:3000或自动分配的端口上运行。

### 6. 生产构建

```bash
pnpm build
pnpm start
```

## 项目目标

本项目旨在创建一个全面的AI角色聊天导航平台，帮助用户发现和探索最佳AI聊天工具。核心功能包括:

1. **收录与展示** - 提供AI聊天工具的集中目录
2. **分类与筛选** - 通过多种分类帮助用户找到最适合的工具
3. **自动数据提取** - 从提交的网站自动提取信息
4. **SEO优化** - 为每个项目生成优化的内容和关键词
5. **用户贡献** - 允许用户提交新的AI工具
6. **管理后台** - 提供工具审核和内容管理功能

通过实施上述功能，本项目将成为AI角色聊天工具的权威导航平台，为用户提供高质量的资源发现服务。
