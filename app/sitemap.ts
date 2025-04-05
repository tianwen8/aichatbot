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
    url: `https://aidirectory.example.com/projects/${project.slug}`,
    lastModified: new Date(project.updated_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) : [];

  // 基本路由和类别路由
  const routes = [
    {
      url: 'https://aidirectory.example.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://aidirectory.example.com/submit',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: 'https://aidirectory.example.com/categories/roleplay',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://aidirectory.example.com/categories/companions',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://aidirectory.example.com/categories/platforms',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://aidirectory.example.com/categories/tools',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  return [...routes, ...projectUrls];
}
