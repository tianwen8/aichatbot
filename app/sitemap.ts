import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 获取所有已验证的项目
  const { data: projects } = await supabaseAdmin
    .from('projects')
    .select('slug, updated_at')
    .eq('verified', true);

  // 为所有项目创建URL
  const projectUrls = projects ? projects.map((project) => ({
    url: `https://www.perai.shop/projects/${project.slug}`,
    lastModified: new Date(project.updated_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) : [];

  // 获取所有分类
  const { data: categories } = await supabaseAdmin
    .from('projects')
    .select('category')
    .eq('verified', true)
    .is('category', 'not.null');
  
  // 提取唯一分类
  const uniqueCategories = new Set<string>();
  categories?.forEach(item => {
    if (item.category) uniqueCategories.add(item.category);
  });
  
  // 为所有分类创建URL
  const categoryUrls = Array.from(uniqueCategories).map(category => ({
    url: `https://www.perai.shop/categories/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 基本路由
  const routes = [
    {
      url: 'https://www.perai.shop',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://www.perai.shop/submit',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: 'https://www.perai.shop/categories',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.perai.shop/categories/ai-character',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.perai.shop/categories/ai-characters',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.perai.shop/categories/ai-chat',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.perai.shop/categories/ai-tools',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.perai.shop/search',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: 'https://www.perai.shop/new',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.perai.shop/featured',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.perai.shop/rankings',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  return [...routes, ...categoryUrls, ...projectUrls];
}
