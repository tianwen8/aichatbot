import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpDown, Check, Edit, Eye, Trash2, X, Plus, SearchIcon, RefreshCw, Download } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DeleteButtonForm } from "@/components/admin/delete-button-form";
import { ApprovalButtonsForm } from "@/components/admin/approval-buttons-form";

export const metadata: Metadata = {
  title: "Admin Dashboard | AI Character Directory",
  description: "Manage your AI Character Directory submissions, publish and manage websites.",
};

// 添加缓存控制，确保每次访问都获取最新数据
export const dynamic = 'force-dynamic'; // 禁用页面缓存
export const fetchCache = 'force-no-store'; // 确保fetch请求不缓存
export const revalidate = 0; // 禁用ISR缓存

async function getSubmissions() {
  try {
    // 添加时间戳参数防止缓存
    const timestamp = new Date().getTime();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("verified", false)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Failed to fetch submissions:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error while fetching submissions:", error);
    return [];
  }
}

async function getPublishedProjects() {
  try {
    // 添加时间戳参数防止缓存
    const timestamp = new Date().getTime();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("verified", true)
      .order("clicks", { ascending: false })
      .limit(20);
    
    if (error) {
      console.error("Failed to fetch published projects:", error);
      return [];
    }
    
    console.log(`获取到已发布项目: ${data?.length || 0}个`);
    return data || [];
  } catch (error) {
    console.error("Error while fetching published projects:", error);
    return [];
  }
}

export default async function AdminDashboard() {
  // Get pending submissions and published projects
  const pendingSubmissions = await getSubmissions();
  const publishedProjects = await getPublishedProjects();

  // Mock stats for dashboard
  const stats = {
    totalProjects: publishedProjects.length,
    pendingSubmissions: pendingSubmissions.length,
    totalClicks: publishedProjects.reduce((sum, project) => sum + (project.clicks || 0), 0),
    lastUpdated: new Date().toLocaleDateString(),
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage AI Character Directory submissions and listings</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="gap-1">
            <Link href="/">
              <span>Back to Home</span>
            </Link>
          </Button>
          <Button asChild className="gap-1">
            <Link href="/submit">
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-500">Total Tools</p>
              <p className="text-3xl font-bold">{stats.totalProjects}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-500">Pending Submissions</p>
              <p className="text-3xl font-bold">{stats.pendingSubmissions}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-500">Total Clicks</p>
              <p className="text-3xl font-bold">{stats.totalClicks.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-3xl font-bold">{stats.lastUpdated}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-1">
        {/* Pending Submissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Submissions ({pendingSubmissions.length})</CardTitle>
              <CardDescription>Review and approve new submissions</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-1">
              <Link href={`/admin?t=${Date.now()}`}>
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingSubmissions.length > 0 ? (
              <div className="divide-y">
                {pendingSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center">
                        {submission.logo ? (
                          <Image 
                            src={submission.logo} 
                            alt={submission.name} 
                            width={40} 
                            height={40}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="text-lg font-semibold text-primary">{submission.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{submission.name}</h3>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <span>Created on {new Date(submission.created_at).toLocaleDateString()}</span>
                          <Badge variant="outline" className="text-xs">{submission.slug}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/projects/${submission.slug}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <ApprovalButtonsForm projectId={submission.id} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Check className="mb-2 h-10 w-10 text-green-500" />
                <h3 className="text-lg font-medium">No Pending Submissions</h3>
                <p className="text-sm text-muted-foreground">
                  All submissions have been reviewed. Great job!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Published Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Published Tools ({publishedProjects.length})</CardTitle>
              <CardDescription>Manage existing AI tools in the directory</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search tools..." 
                  className="w-[200px] pl-8 h-9 text-sm" 
                />
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button asChild size="sm" className="gap-1">
                <Link href="/submit">
                  <Plus className="h-4 w-4" />
                  <span>Add New</span>
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm font-medium">Tool</th>
                    <th className="p-3 text-center text-sm font-medium">Clicks</th>
                    <th className="p-3 text-center text-sm font-medium">Added Date</th>
                    <th className="p-3 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {publishedProjects.map((project) => (
                    <tr key={project.id} className="border-b">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center">
                            {project.logo ? (
                              <Image 
                                src={project.logo} 
                                alt={project.name} 
                                width={36} 
                                height={36} 
                                className="h-full w-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <span className="text-sm font-semibold text-primary">{project.name.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{project.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-md">{project.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="outline">{project.clicks || 0}</Badge>
                      </td>
                      <td className="p-3 text-center text-sm">
                        {new Date(project.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/projects/${project.slug}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/edit?id=${project.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteButtonForm projectId={project.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 