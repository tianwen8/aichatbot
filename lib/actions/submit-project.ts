"use server";

import { PROJECT_GRADIENTS } from "@/components/projects/project-constants";
import { shortenAndCreateLink } from "@/lib/dub";
import { getRepo } from "@/lib/github";
import { supabaseAdmin } from "@/lib/supabase";
import { getUrlFromString, nanoid } from "@dub/utils";
import slugify from "@sindresorhus/slugify";
import { authUser } from "./auth";

export async function submitProject(_prevState: any, data: FormData) {
  const session = await authUser();

  const github = getUrlFromString(data.get("github") as string);

  if (!github) {
    return { error: "请提供网站URL" };
  }

  // 检查URL是否已存在
  const { data: existingLink, error: linkError } = await supabaseAdmin
    .from('links')
    .select('*')
    .eq('url', github)
    .single();

  if (linkError && linkError.code !== 'PGRST116') { // PGRST116是"没有找到结果"的错误
    return { error: "检查网站URL时出错" };
  }

  if (existingLink) {
    return { error: "该网站已提交" };
  }

  // 生成项目名称和描述
  const name = data.get("name") as string || "未命名网站";
  const description = data.get("description") as string || "暂无描述";
  const logoUrl = data.get("logo") as string || "https://placehold.co/100";

  // 检查slug是否已存在
  const slug = slugify(name);
  const { data: existingProject, error: slugError } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (slugError && slugError.code !== 'PGRST116') {
    return { error: "检查项目slug时出错" };
  }

  const finalSlug = existingProject 
    ? `${slug}-${nanoid(3)}`
    : slug;

  // 创建项目
  const projectId = nanoid(12);
  const { data: project, error: projectError } = await supabaseAdmin
    .from('projects')
    .insert({
      id: projectId,
      name: name,
      description: description,
      slug: finalSlug,
      logo: logoUrl,
      gradient: PROJECT_GRADIENTS[Math.floor(Math.random() * PROJECT_GRADIENTS.length)],
      stars: 0,
      verified: true,
    })
    .select()
    .single();

  if (projectError || !project) {
    return { error: "创建项目失败" };
  }

  // 创建项目用户关系
  await supabaseAdmin
    .from('project_users')
    .insert({
      id: nanoid(12),
      project_id: projectId,
      user_id: session.user.id,
      role: "提交者"
    });

  await shortenAndCreateLink({
    url: github,
    type: "WEBSITE",
    projectId: projectId,
  });

  return { redirect: `/projects/${finalSlug}` };
}
