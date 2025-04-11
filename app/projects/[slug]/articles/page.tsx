"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useProjectContext, ProjectProvider } from "@/components/projects/project-context";
import { Button } from "@/components/ui/button";
import { PenLine, Plus, Calendar, Eye, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { getProject } from "@/lib/actions/get-project";

export default function ArticlesPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadProject() {
      try {
        const data = await getProject({ slug: slug as string });
        setProject(data);
      } catch (error) {
        console.error("加载项目失败:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProject();
  }, [slug]);
  
  if (isLoading) {
    return <div>加载中...</div>;
  }
  
  if (!project) {
    return <div>项目不存在</div>;
  }
  
  return (
    <ProjectProvider props={project}>
      <ArticlesContent />
    </ProjectProvider>
  );
}

function ArticlesContent() {
  const project = useProjectContext();
  const [articles, setArticles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [articleData, setArticleData] = useState({
    title: "",
    content: "",
    meta_description: "",
    keywords: ""
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchArticles();
  }, [project?.id]);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("project_id", project.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      setArticles(data || []);
    } catch (err) {
      console.error("加载文章失败:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticleData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (!articleData.title || !articleData.content) {
        throw new Error("标题和内容不能为空");
      }
      
      // 生成文章slug
      const articleSlug = articleData.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      
      // 准备文章数据
      const newArticle = {
        project_id: project.id,
        title: articleData.title,
        slug: articleSlug,
        content: articleData.content,
        meta_description: articleData.meta_description,
        keywords: articleData.keywords,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // 提交到Supabase
      const { data, error } = await supabase
        .from("articles")
        .insert([newArticle])
        .select();
      
      if (error) throw error;
      
      // 更新文章列表
      setArticles([data[0], ...articles]);
      
      // 清空表单
      setArticleData({
        title: "",
        content: "",
        meta_description: "",
        keywords: ""
      });
      
      setSuccessMessage("文章发布成功！");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("发布文章失败:", err);
      setError(err.message || "发布失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    if (!confirm("确定要删除这篇文章吗？")) return;
    
    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      // 更新文章列表
      setArticles(articles.filter(article => article.id !== id));
    } catch (err) {
      console.error("删除文章失败:", err);
      alert("删除失败，请重试");
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">网站文章管理</h1>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? "取消" : <>
            <Plus className="mr-2 h-4 w-4" />
            添加文章
          </>}
        </Button>
      </div>
      
      {successMessage && (
        <div className="mb-6 p-4 rounded-md bg-green-50 text-green-700 border border-green-200">
          {successMessage}
        </div>
      )}
      
      {/* 文章编辑表单 */}
      {isEditing && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-medium mb-4">发布新文章</h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                文章标题 <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                value={articleData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="输入SEO优化的文章标题"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="meta_description" className="block text-sm font-medium mb-1">
                Meta描述
              </label>
              <input
                id="meta_description"
                name="meta_description"
                value={articleData.meta_description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="输入Meta描述，有助于SEO优化"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="keywords" className="block text-sm font-medium mb-1">
                关键词
              </label>
              <input
                id="keywords"
                name="keywords"
                value={articleData.keywords}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="输入逗号分隔的关键词"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                文章内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={articleData.content}
                onChange={handleChange}
                className="w-full p-2 border rounded-md min-h-[300px]"
                placeholder="支持Markdown格式"
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="mr-2"
              >
                取消
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "发布中..." : "发布文章"}
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* 文章列表 */}
      <div>
        <h2 className="text-xl font-medium mb-4">已发布文章</h2>
        
        {articles.length === 0 ? (
          <div className="text-center p-12 border rounded-lg bg-gray-50">
            <PenLine className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">还没有发布文章</h3>
            <p className="mt-1 text-gray-500">
              添加SEO文章来提升您的网站在搜索引擎中的排名
            </p>
            <Button 
              onClick={() => setIsEditing(true)}
              className="mt-4"
            >
              添加第一篇文章
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg divide-y">
            {articles.map((article) => (
              <div key={article.id} className="p-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{article.title}</h3>
                  <div className="mt-1 flex text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(article.created_at).toLocaleDateString()}
                    </div>
                    {article.views && (
                      <div className="ml-4 flex items-center">
                        <Eye className="mr-1 h-4 w-4" />
                        {article.views} 次浏览
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center ml-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setIsEditing(true);
                      setArticleData({
                        title: article.title,
                        content: article.content,
                        meta_description: article.meta_description || "",
                        keywords: article.keywords || ""
                      });
                    }}
                  >
                    <PenLine className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteArticle(article.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 