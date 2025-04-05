import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv-flow';

// 加载环境变量
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 确保有管理员权限
if (!supabaseKey) {
  console.error('错误: 需要SUPABASE_SERVICE_ROLE_KEY环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// 示例项目数据
const sampleProjects = [
  {
    id: 'dub',
    name: 'Dub',
    slug: 'dub',
    verified: true,
    description: '开源短链接工具',
    logo: 'https://assets.dub.co/logo.png',
    gradient: 'from-orange-100 via-amber-50 to-yellow-100',
    stars: 15000,
    clicks: 500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'gallery',
    name: 'OSS Gallery',
    slug: 'gallery',
    verified: true,
    description: '最佳开源项目导航',
    logo: 'https://raw.githubusercontent.com/dubinc/oss-gallery/main/public/favicon.ico',
    gradient: 'from-purple-100 via-violet-50 to-blue-100',
    stars: 5000,
    clicks: 300,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ui',
    name: 'UI Kit',
    slug: 'ui',
    verified: true,
    description: '现代React UI组件库',
    logo: 'https://ui.shadcn.com/apple-touch-icon.png',
    gradient: 'from-gray-100 via-slate-50 to-zinc-100',
    stars: 20000,
    clicks: 800,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    slug: 'nextjs',
    verified: true,
    description: 'React框架，用于构建全栈Web应用',
    logo: 'https://nextjs.org/favicon.ico',
    gradient: 'from-black via-gray-900 to-gray-800',
    stars: 112000,
    clicks: 1200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tailwindcss',
    name: 'Tailwind CSS',
    slug: 'tailwindcss',
    verified: true,
    description: '实用优先的CSS框架',
    logo: 'https://tailwindcss.com/favicons/favicon-32x32.png',
    gradient: 'from-cyan-100 via-sky-50 to-blue-100',
    stars: 73000,
    clicks: 900,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// 示例链接数据
const sampleLinks = [
  {
    id: 'dub-github',
    type: 'GITHUB',
    url: 'https://github.com/dubinc/dub',
    short_link: 'https://d.to/github',
    order_num: 0,
    project_id: 'dub',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dub-website',
    type: 'WEBSITE',
    url: 'https://dub.co',
    short_link: 'https://d.to',
    order_num: 1,
    project_id: 'dub',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'gallery-github',
    type: 'GITHUB',
    url: 'https://github.com/dubinc/oss-gallery',
    short_link: 'https://d.to/gallery-github',
    order_num: 0,
    project_id: 'gallery',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'gallery-website',
    type: 'WEBSITE',
    url: 'https://oss.gallery',
    short_link: 'https://d.to/gallery',
    order_num: 1,
    project_id: 'gallery',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ui-github',
    type: 'GITHUB',
    url: 'https://github.com/shadcn-ui/ui',
    short_link: 'https://d.to/ui-github',
    order_num: 0,
    project_id: 'ui',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ui-website',
    type: 'WEBSITE',
    url: 'https://ui.shadcn.com',
    short_link: 'https://d.to/ui',
    order_num: 1,
    project_id: 'ui',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'nextjs-github',
    type: 'GITHUB',
    url: 'https://github.com/vercel/next.js',
    short_link: 'https://d.to/nextjs-github',
    order_num: 0,
    project_id: 'nextjs',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'nextjs-website',
    type: 'WEBSITE',
    url: 'https://nextjs.org',
    short_link: 'https://d.to/nextjs',
    order_num: 1,
    project_id: 'nextjs',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tailwindcss-github',
    type: 'GITHUB',
    url: 'https://github.com/tailwindlabs/tailwindcss',
    short_link: 'https://d.to/tailwindcss-github',
    order_num: 0,
    project_id: 'tailwindcss',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tailwindcss-website',
    type: 'WEBSITE',
    url: 'https://tailwindcss.com',
    short_link: 'https://d.to/tailwindcss',
    order_num: 1,
    project_id: 'tailwindcss',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// 初始化存储桶
async function setupStorage() {
  console.log('设置存储桶...');
  
  // 创建缩略图存储桶
  const { error: thumbnailError } = await supabase.storage.createBucket('thumbnails', {
    public: true,
    fileSizeLimit: 2 * 1024 * 1024, // 2MB
  });
  
  if (thumbnailError && thumbnailError.message !== 'Bucket already exists') {
    console.error('创建thumbnails存储桶失败:', thumbnailError);
  } else {
    console.log('thumbnails存储桶已创建或已存在');
  }
  
  // 创建logo存储桶
  const { error: logoError } = await supabase.storage.createBucket('logos', {
    public: true,
    fileSizeLimit: 1 * 1024 * 1024, // 1MB
  });
  
  if (logoError && logoError.message !== 'Bucket already exists') {
    console.error('创建logos存储桶失败:', logoError);
  } else {
    console.log('logos存储桶已创建或已存在');
  }
}

// 插入示例数据
async function insertSampleData() {
  console.log('插入示例项目数据...');
  
  // 插入项目
  const { error: projectsError } = await supabase
    .from('projects')
    .upsert(sampleProjects);
  
  if (projectsError) {
    console.error('插入项目数据失败:', projectsError);
  } else {
    console.log(`已插入${sampleProjects.length}个项目`);
  }
  
  // 插入链接
  const { error: linksError } = await supabase
    .from('links')
    .upsert(sampleLinks);
  
  if (linksError) {
    console.error('插入链接数据失败:', linksError);
  } else {
    console.log(`已插入${sampleLinks.length}个链接`);
  }
}

// 执行初始化
async function main() {
  console.log('开始初始化Supabase数据...');
  
  try {
    await setupStorage();
    await insertSampleData();
    
    console.log('Supabase初始化完成！');
  } catch (error) {
    console.error('初始化过程中出错:', error);
  }
}

main(); 