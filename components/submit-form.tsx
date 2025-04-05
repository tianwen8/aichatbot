"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SubmitForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    category: "roleplay", // 默认类别
    logo: "",
    email: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // 验证必填字段
      if (!formData.name || !formData.url || !formData.description || !formData.email) {
        throw new Error("请填写所有必填字段");
      }

      // 验证URL格式
      if (!formData.url.match(/^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/)) {
        throw new Error("请提供有效的网站URL（例如：https://example.com）");
      }

      // 验证电子邮件格式
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error("请提供有效的电子邮件地址");
      }

      // 准备提交数据
      const submissionData = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        description: formData.description,
        logo: formData.logo || "https://placehold.co/400x400/png?text=" + formData.name.charAt(0).toUpperCase(),
        category: formData.category,
        website: formData.url,
        verified: false, // 默认未验证
        clicks: 0,
        contact_email: formData.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // 发送到Supabase
      const { error } = await supabase
        .from('submissions')
        .insert([submissionData]);

      if (error) throw error;

      // 提交成功
      setSubmitSuccess(true);
      setFormData({
        name: "",
        url: "",
        description: "",
        category: "roleplay",
        logo: "",
        email: ""
      });

      // 5秒后重定向到首页
      setTimeout(() => {
        router.push("/");
      }, 5000);
    } catch (err) {
      console.error("提交错误:", err);
      setError(err.message || "提交过程中出现错误，请稍后再试");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
        <h3 className="text-xl font-semibold text-green-800 mb-2">提交成功！</h3>
        <p className="text-green-700 mb-4">
          感谢您的提交。我们将审核您的网站，通常需要1-3个工作日。
        </p>
        <p className="text-sm text-green-600">
          5秒后将自动返回首页...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          网站名称 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="例如：AI角色助手"
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          网站URL <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          网站描述 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="描述您的网站提供什么服务，有什么特色功能..."
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          类别 <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="roleplay">角色扮演</option>
          <option value="companions">AI伴侣</option>
          <option value="platforms">AI平台</option>
          <option value="tools">聊天工具</option>
          <option value="other">其他</option>
        </select>
      </div>

      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
          Logo URL（可选）
        </label>
        <input
          type="url"
          id="logo"
          name="logo"
          value={formData.logo}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="https://example.com/logo.png"
        />
        <p className="mt-1 text-sm text-gray-500">如不提供，将使用默认图标</p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          联系邮箱 <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="your@email.com"
        />
        <p className="mt-1 text-sm text-gray-500">仅用于审核通知，不会公开显示</p>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? "提交中..." : "提交网站"}
        </button>
      </div>
    </form>
  );
} 