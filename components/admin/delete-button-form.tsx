"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteButtonForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("确定要删除此项目吗？此操作不可撤销，项目将从数据库中永久删除。")) {
      return;
    }
    
    try {
      setIsDeleting(true);
      console.log("[删除按钮] 开始删除项目:", projectId);
      
      toast.info("删除中...", { duration: 2000 });
      
      // 检查当前cookie
      console.log("[删除按钮] 当前document.cookie:", document.cookie);
      
      // 使用Fetch API访问管理员专用删除接口
      console.log("[删除按钮] 发送POST请求到 /api/admin/delete");
      const response = await fetch(`/api/admin/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: projectId }),
        credentials: "include", // 确保包含cookies
      });
      
      console.log("[删除按钮] 收到响应:", response.status, response.statusText);
      
      // 尝试解析响应内容
      const responseText = await response.text();
      console.log("[删除按钮] 原始响应内容:", responseText);
      
      let responseData;
      try {
        // 只有在有内容时才解析JSON
        if (responseText.trim()) {
          responseData = JSON.parse(responseText);
          console.log("[删除按钮] 解析后的响应数据:", responseData);
        } else {
          console.warn("[删除按钮] 响应内容为空");
          responseData = { message: "操作已执行，但服务器未返回详细信息" };
        }
      } catch (parseError) {
        console.error("[删除按钮] 解析响应失败:", parseError);
        throw new Error(`无法解析响应: ${response.status} ${response.statusText}`);
      }
      
      if (!response.ok) {
        const errorMessage = responseData?.message || `删除失败: ${response.status} ${response.statusText}`;
        console.error("[删除按钮] 删除请求失败:", errorMessage);
        throw new Error(errorMessage);
      }
      
      console.log("[删除按钮] 删除请求成功");
      toast.success(responseData?.message || "项目已成功删除");
      
      // 等待短暂延迟后刷新页面
      setTimeout(() => {
        console.log("[删除按钮] 刷新页面");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("[删除按钮] 删除过程中出错:", error);
      toast.error(`删除失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      type="button"
      variant="destructive" 
      size="sm"
      disabled={isDeleting}
      className="relative"
      onClick={handleDelete}
      title="删除项目"
    >
      {isDeleting ? (
        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
} 