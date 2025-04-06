"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, RefreshCw, Check, AlertTriangle, ArrowRight, Sparkles, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function SubmitForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedSlug, setSubmittedSlug] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [error, setError] = useState("");
  
  const categories = [
    { value: "roleplay", label: "角色扮演" },
    { value: "qa", label: "知识问答" },
    { value: "companion", label: "AI伴侣" },
    { value: "writing", label: "写作助手" },
    { value: "multilingual", label: "多语言" },
    { value: "llm", label: "语言模型" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    keywords: "",
    meta_description: "",
    category: ""
  });
  
  const [loading, setLoading] = useState({
    submit: false,
    capture: false,
    generate: false
  });
  
  const [generatedContent, setGeneratedContent] = useState<{
    keywords: string;
    descriptions: {
      short: string;
      medium: string;
      long: string;
    };
    features: string[];
    suggestions: {
      title: string;
      seoScore: number;
    };
  } | null>(null);

  useEffect(() => {
    if (success && submittedSlug) {
      // 3秒后自动跳转到项目页面
      const timer = setTimeout(() => {
        router.push(`/projects/${submittedSlug}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, submittedSlug, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除之前的错误信息
    setError("");
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const captureWebsite = async () => {
    if (!formData.url) {
      setError("请输入有效的网站URL");
      return;
    }
    
    try {
      setLoading({ ...loading, capture: true });
      setError("");
      
      const response = await fetch("/api/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: formData.url }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "获取网站信息失败");
      }
      
      setLogoUrl(data.data.favicon);
      setScreenshotUrl(data.data.screenshot);
      
      setFormData(prev => ({
        ...prev,
        name: prev.name || data.data.title,
        description: prev.description || data.data.description,
        meta_description: prev.meta_description || data.data.meta_description,
        keywords: prev.keywords || data.data.keywords
      }));
      
      toast.success("已成功获取网站信息");
    } catch (err: any) {
      setError(err.message || "获取网站信息时出错");
      toast.error("获取网站信息失败");
    } finally {
      setLoading({ ...loading, capture: false });
    }
  };
  
  const generateContent = async () => {
    if (!formData.name) {
      setError("请先输入网站名称");
      return;
    }
    
    try {
      setLoading({ ...loading, generate: true });
      setError("");
      
      const response = await fetch("/api/content-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title: formData.name,
          category: formData.category,
          url: formData.url
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "内容生成失败");
      }
      
      setGeneratedContent(data.data);
      
      toast.success("内容生成成功，请选择需要使用的内容");
    } catch (err: any) {
      setError(err.message || "内容生成时出错");
      toast.error("内容生成失败");
    } finally {
      setLoading({ ...loading, generate: false });
    }
  };
  
  const applyGeneratedContent = (type: string, value: string) => {
    if (type === 'keywords') {
      setFormData(prev => ({ ...prev, keywords: value }));
    } else if (type === 'meta_description') {
      setFormData(prev => ({ ...prev, meta_description: value }));
    } else if (type === 'description') {
      setFormData(prev => ({ ...prev, description: value }));
    }
    toast.success("已应用所选内容");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.url) {
      setError("请填写网站名称、描述和URL");
      return;
    }
    
    try {
      setLoading({ ...loading, submit: true });
      setError("");
      
      const submitData = {
        name: formData.name,
        description: formData.description,
        url: formData.url,
        keywords: formData.keywords || "",
        meta_description: formData.meta_description || "",
        category: formData.category || "",
        logo: logoUrl,
        image: screenshotUrl
      };
      
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "提交失败");
      }
      
      setSuccess(true);
      toast.success("网站提交成功！" + (data.verified ? "已通过验证" : "等待审核中"));
      
      setFormData({
        name: "",
        url: "",
        description: "",
        keywords: "",
        meta_description: "",
        category: ""
      });
      setLogoUrl("");
      setScreenshotUrl("");
      setGeneratedContent(null);
      
    } catch (err: any) {
      setError(err.message || "提交时出错");
      toast.error("提交失败");
    } finally {
      setLoading({ ...loading, submit: false });
    }
  };

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <div className="animate-pulse mb-4">
          <svg className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-medium text-green-800 mb-2">提交成功！</h3>
        <p className="text-green-700 mb-4">
          您的网站已成功发布到首页，3秒后将自动跳转到您的网站页面。
        </p>
        <button
          onClick={() => router.push(`/projects/${submittedSlug}`)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          立即查看
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">提交您的AI聊天工具</h1>
        <p className="mt-2 text-lg text-gray-600">
          分享您的AI聊天工具，让更多人发现它
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-medium text-gray-900">基本信息</h2>
          
          <div className="mt-6">
            <Label htmlFor="url">网站URL</Label>
            <div className="mt-1 flex">
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={handleInputChange}
                className="rounded-r-none flex-1"
                required
              />
              <Button
                type="button"
                onClick={captureWebsite}
                disabled={loading.capture || !formData.url}
                className="rounded-l-none border border-l-0"
                variant="outline"
              >
                {loading.capture ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                获取信息
              </Button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              输入网站URL后点击按钮，我们将自动提取网站信息
            </p>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="category">网站分类</Label>
            <Select 
              onValueChange={handleCategoryChange} 
              value={formData.category}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-1 text-sm text-gray-500">
              选择最匹配的分类，这将帮助生成更准确的SEO内容
            </p>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="name">网站名称</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="AI聊天助手"
              required
            />
          </div>
          
          <div className="mt-6">
            <Button
              type="button"
              onClick={generateContent}
              disabled={loading.generate || !formData.name}
              className="w-full"
              variant="outline"
            >
              {loading.generate ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              生成优化内容建议
            </Button>
            <p className="mt-1 text-sm text-gray-500 text-center">
              根据您的网站名称和分类，生成SEO友好的描述和关键词
            </p>
          </div>
        </div>
        
        {generatedContent && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h2 className="flex items-center text-xl font-medium text-blue-800">
              <Sparkles className="mr-2 h-5 w-5 text-blue-600" />
              优化内容建议
              <Badge className="ml-3 bg-blue-100 text-blue-800">
                SEO评分: {generatedContent.suggestions.seoScore}/100
              </Badge>
            </h2>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium text-blue-800">推荐关键词</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {generatedContent.keywords.split(', ').map((keyword, index) => (
                  <Badge 
                    key={index} 
                    className="bg-white text-blue-600 cursor-pointer hover:bg-blue-100"
                    onClick={() => applyGeneratedContent('keywords', generatedContent.keywords)}
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="mt-2 text-blue-600"
                onClick={() => applyGeneratedContent('keywords', generatedContent.keywords)}
              >
                使用这些关键词
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium text-blue-800">内容描述建议</h3>
              <div className="mt-2 space-y-3">
                <div className="rounded-md bg-white p-3 text-sm text-gray-800">
                  <div className="flex justify-between">
                    <span className="font-medium">简短描述:</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs text-blue-600"
                      onClick={() => applyGeneratedContent('meta_description', generatedContent.descriptions.short)}
                    >
                      用作元描述
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  <p className="mt-1">{generatedContent.descriptions.short}</p>
                </div>
                
                <div className="rounded-md bg-white p-3 text-sm text-gray-800">
                  <div className="flex justify-between">
                    <span className="font-medium">中等描述:</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs text-blue-600"
                      onClick={() => applyGeneratedContent('description', generatedContent.descriptions.medium)}
                    >
                      用作网站描述
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  <p className="mt-1">{generatedContent.descriptions.medium}</p>
                </div>
                
                <div className="rounded-md bg-white p-3 text-sm text-gray-800">
                  <div className="flex justify-between">
                    <span className="font-medium">详细描述:</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs text-blue-600"
                      onClick={() => applyGeneratedContent('description', generatedContent.descriptions.long)}
                    >
                      用作网站描述
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  <p className="mt-1">{generatedContent.descriptions.long}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium text-blue-800">建议功能特点</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-800">
                {generatedContent.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-1.5 h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-blue-600">
                这些功能特点可以帮助您完善网站描述
              </p>
            </div>
          </div>
        )}
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-medium text-gray-900">详细内容</h2>
          
          <div className="mt-6">
            <Label htmlFor="description">网站描述</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="详细描述您的AI聊天工具功能和特点..."
              rows={4}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              详细描述网站的主要功能、特点和用途
            </p>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="meta_description">
              元描述
              <span className="ml-1 text-gray-400 text-xs">(用于SEO)</span>
            </Label>
            <Textarea
              id="meta_description"
              name="meta_description"
              value={formData.meta_description}
              onChange={handleInputChange}
              placeholder="简短描述网站，将显示在搜索结果中..."
              rows={2}
            />
            <p className="mt-1 text-sm text-gray-500">
              简短描述(150字以内)，会显示在搜索引擎结果中
            </p>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="keywords">
              关键词
              <span className="ml-1 text-gray-400 text-xs">(用于SEO)</span>
            </Label>
            <Textarea
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleInputChange}
              placeholder="AI聊天, 角色扮演, 虚拟助手..."
              rows={2}
            />
            <p className="mt-1 text-sm text-gray-500">
              用逗号分隔的关键词列表，帮助用户在搜索时找到您的网站
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-medium text-gray-900">网站预览</h2>
          
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label className="block mb-2">网站截图</Label>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                {screenshotUrl ? (
                  <Image
                    src={screenshotUrl}
                    alt="Website Screenshot"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-center text-sm text-gray-500">
                      输入URL并点击"获取信息"<br />自动获取网站截图
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <Label className="block mb-2">网站Logo</Label>
              <div className="relative h-32 w-32 overflow-hidden rounded-lg bg-gray-100">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Website Logo"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-center text-sm text-gray-500">
                      自动获取<br />网站Logo
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">提交出错</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button type="submit" disabled={loading.submit} size="lg">
            {loading.submit && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            提交网站
          </Button>
        </div>
      </form>
    </div>
  );
} 