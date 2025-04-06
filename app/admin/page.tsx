import { Metadata } from "next";
import Link from "next/link";
import { ArrowUpDown, Check, Edit, Eye, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

export const metadata: Metadata = {
  title: "管理后台 | AI角色聊天导航",
  description: "管理您的AI聊天网站目录，审核提交，发布和管理网站。",
};

async function getSubmissions() {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("verified", false)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("获取提交列表失败:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("获取提交列表时出错:", error);
    return [];
  }
}

async function getPublishedProjects() {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("verified", true)
      .order("clicks", { ascending: false })
      .limit(10);
    
    if (error) {
      console.error("获取已发布项目失败:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("获取已发布项目时出错:", error);
    return [];
  }
}

export default async function AdminDashboard() {
  // 获取待审核的提交和已发布的项目
  const pendingSubmissions = await getSubmissions();
  const publishedProjects = await getPublishedProjects();

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">管理控制台</h1>
        <Link 
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          返回首页
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-1">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">待审核网站 ({pendingSubmissions.length})</h2>
          </div>
          <div className="rounded-lg border shadow-sm">
            {pendingSubmissions.length > 0 ? (
              <div className="divide-y">
                {pendingSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full">
                        <img 
                          src={submission.logo || `https://placehold.co/40?text=${submission.name.charAt(0)}`} 
                          alt={submission.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{submission.name}</h3>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <span>创建于 {new Date(submission.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/api/approve?id=${submission.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 p-0 text-green-600 hover:bg-green-200">
                        <Check className="h-4 w-4" />
                      </Link>
                      <Link href={`/api/reject?id=${submission.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 p-0 text-red-600 hover:bg-red-200">
                        <X className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Check className="mb-2 h-10 w-10 text-green-500" />
                <h3 className="text-lg font-medium">没有待审核的内容</h3>
                <p className="text-sm text-muted-foreground">
                  当前没有等待审核的网站提交
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">已发布网站 ({publishedProjects.length})</h2>
            <Link
              href="/submit"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              添加网站
            </Link>
          </div>
          <div className="rounded-lg border shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left text-sm font-medium">网站</th>
                  <th className="p-3 text-center text-sm font-medium">点击</th>
                  <th className="p-3 text-center text-sm font-medium">添加日期</th>
                  <th className="p-3 text-right text-sm font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {publishedProjects.map((project) => (
                  <tr key={project.id} className="border-b">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 overflow-hidden rounded-full">
                          <img 
                            src={project.logo || `https://placehold.co/40?text=${project.name.charAt(0)}`} 
                            alt={project.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{project.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">{project.clicks || 0}</td>
                    <td className="p-3 text-center">
                      {new Date(project.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/projects/${project.slug}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 p-0 text-blue-600 hover:bg-blue-200">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link href={`/admin/edit?id=${project.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 p-0 text-gray-600 hover:bg-gray-200">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <Link href={`/api/delete?id=${project.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 p-0 text-red-600 hover:bg-red-200">
                          <Trash2 className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 