"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AdminSubmitForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    category: "ai-tool",
    keywords: "",
    meta_description: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.url.trim()) {
      toast.error("请填写必填字段");
      return;
    }
    
    try {
      setIsSubmitting(true);
      toast.info("提交中...");
      
      const response = await fetch("/api/admin/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "提交失败");
      }
      
      toast.success("项目已成功创建并上线");
      
      // 重置表单
      setFormData({
        name: "",
        description: "",
        url: "",
        category: "ai-tool",
        keywords: "",
        meta_description: "",
      });
      
      // 刷新页面
      setTimeout(() => {
        router.refresh();
      }, 1000);
      
    } catch (error) {
      console.error("提交失败:", error);
      toast.error(`提交失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">添加新项目（管理员直接发布）</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          项目名称 <span className="text-red-500">*</span>
        </label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="输入项目名称"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          项目描述 <span className="text-red-500">*</span>
        </label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="输入项目描述"
          rows={4}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          项目网址 <span className="text-red-500">*</span>
        </label>
        <Input
          name="url"
          type="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://example.com"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          分类
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 p-2"
        >
          <option value="ai-tool">AI工具</option>
          <option value="ai-chat">AI聊天</option>
          <option value="ai-character">AI角色</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          关键词（用逗号分隔）
        </label>
        <Input
          name="keywords"
          value={formData.keywords}
          onChange={handleChange}
          placeholder="例如: AI, 聊天机器人, GPT"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          META描述（可选）
        </label>
        <Textarea
          name="meta_description"
          value={formData.meta_description}
          onChange={handleChange}
          placeholder="SEO描述，默认使用项目描述"
          rows={2}
        />
      </div>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "提交中..." : "发布项目"}
        </Button>
      </div>
    </form>
  );
} 