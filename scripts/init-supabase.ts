import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv-flow';
import { initStorage, LOGOS_BUCKET, THUMBNAILS_BUCKET } from '@/lib/supabase-db';
import * as fs from 'fs';
import * as path from 'path';

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
  },
];

// 示例链接数据
const sampleLinks = [
  {
    id: 'dub-github',
    type: 'GITHUB',
    url: 'https://github.com/dubinc/dub',
    short_link: 'https://d.to/github',
    order: 0,
    project_id: 'dub',
  },
  {
    id: 'dub-website',
    type: 'WEBSITE',
    url: 'https://dub.co',
    short_link: 'https://d.to',
    order: 1,
    project_id: 'dub',
  },
  {
    id: 'gallery-github',
    type: 'GITHUB',
    url: 'https://github.com/dubinc/oss-gallery',
    short_link: 'https://d.to/gallery-github',
    order: 0,
    project_id: 'gallery',
  },
  {
    id: 'gallery-website',
    type: 'WEBSITE',
    url: 'https://oss.gallery',
    short_link: 'https://d.to/gallery',
    order: 1,
    project_id: 'gallery',
  },
  {
    id: 'ui-github',
    type: 'GITHUB',
    url: 'https://github.com/shadcn-ui/ui',
    short_link: 'https://d.to/ui-github',
    order: 0,
    project_id: 'ui',
  },
  {
    id: 'ui-website',
    type: 'WEBSITE',
    url: 'https://ui.shadcn.com',
    short_link: 'https://d.to/ui',
    order: 1,
    project_id: 'ui',
  },
  {
    id: 'nextjs-github',
    type: 'GITHUB',
    url: 'https://github.com/vercel/next.js',
    short_link: 'https://d.to/nextjs-github',
    order: 0,
    project_id: 'nextjs',
  },
  {
    id: 'nextjs-website',
    type: 'WEBSITE',
    url: 'https://nextjs.org',
    short_link: 'https://d.to/nextjs',
    order: 1,
    project_id: 'nextjs',
  },
  {
    id: 'tailwindcss-github',
    type: 'GITHUB',
    url: 'https://github.com/tailwindlabs/tailwindcss',
    short_link: 'https://d.to/tailwindcss-github',
    order: 0,
    project_id: 'tailwindcss',
  },
  {
    id: 'tailwindcss-website',
    type: 'WEBSITE',
    url: 'https://tailwindcss.com',
    short_link: 'https://d.to/tailwindcss',
    order: 1,
    project_id: 'tailwindcss',
  },
];

// 创建数据库表
async function createTables() {
  console.log('创建数据库表...');
  
  // 创建projects表
  const { error: projectsError } = await supabase.rpc('create_projects_table_if_not_exists');
  if (projectsError) {
    console.error('创建projects表失败:', projectsError);
  } else {
    console.log('Projects表已创建或已存在');
  }
  
  // 创建links表
  const { error: linksError } = await supabase.rpc('create_links_table_if_not_exists');
  if (linksError) {
    console.error('创建links表失败:', linksError);
  } else {
    console.log('Links表已创建或已存在');
  }
}

// 插入测试数据
async function insertSampleData() {
  console.log('插入示例项目数据...');
  
  // 插入项目
  const { error: projectsError } = await supabase
    .from('projects')
    .upsert(sampleProjects.map(project => ({
      ...project,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })));
  
  if (projectsError) {
    console.error('插入项目数据失败:', projectsError);
  } else {
    console.log(`已插入${sampleProjects.length}个项目`);
  }
  
  // 插入链接
  const { error: linksError } = await supabase
    .from('links')
    .upsert(sampleLinks.map(link => ({
      ...link,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })));
  
  if (linksError) {
    console.error('插入链接数据失败:', linksError);
  } else {
    console.log(`已插入${sampleLinks.length}个链接`);
  }
}

// 创建增加计数器函数
async function createIncrementFunction() {
  console.log('创建增加计数器函数...');
  
  const { error } = await supabase.rpc('create_increment_counter_function');
  
  if (error) {
    console.error('创建增加计数器函数失败:', error);
  } else {
    console.log('增加计数器函数已创建或已存在');
  }
}

// 创建存储桶
async function setupStorage() {
  console.log('设置存储桶...');
  await initStorage();
  console.log('存储桶设置完成');
}

// 执行SQL函数
async function executeSqlFile() {
  console.log('执行SQL文件...');
  
  try {
    const sqlFilePath = path.join(process.cwd(), 'scripts', 'supabase-functions.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // 分割SQL语句并逐个执行
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error('执行SQL语句失败:', error);
      }
    }
    
    console.log('SQL函数已执行');
  } catch (error) {
    console.error('读取或执行SQL文件失败:', error);
  }
}

// 执行初始化
async function main() {
  console.log('开始初始化Supabase...');
  
  try {
    // 执行SQL文件
    await executeSqlFile();
    
    // 执行SQL函数调用
    const { data, error } = await supabase.rpc('setup_sql_functions');
    
    if (error) {
      console.error('设置SQL函数失败:', error);
    }
    
    await createTables();
    await createIncrementFunction();
    await insertSampleData();
    await setupStorage();
    
    console.log('Supabase初始化完成！');
  } catch (error) {
    console.error('初始化过程中出错:', error);
  }
}

main(); 