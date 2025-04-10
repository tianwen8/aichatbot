"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteButtonClient({ projectId }: { projectId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    // 显示确认对话框，更详细的提示内容
    const confirmed = window.confirm(
      "确定要删除此项目吗？此操作不可撤销，项目将从数据库中永久删除。"
    );
    
    if (!confirmed) return;
    
    try {
      setIsDeleting(true);
      
      // 发送删除请求前显示Toast提示
      const toastId = toast.loading("正在删除项目...");
      
      console.log(`正在删除项目 ID: ${projectId}`);
      
      // 发送删除请求
      const response = await fetch(`/api/delete?id=${projectId}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        // 确保不使用缓存
        cache: 'no-store',
      });
      
      console.log(`删除请求状态: ${response.status}`);
      
      let responseData;
      let responseText = '';
      
      // 获取完整响应内容
      try {
        responseText = await response.text();
        console.log('原始响应文本:', responseText);
        
        // 尝试解析为JSON
        try {
          responseData = JSON.parse(responseText);
          console.log('删除响应数据:', responseData);
        } catch (e) {
          console.error('JSON解析失败:', e);
          responseData = { success: false, message: responseText || "未知错误" };
        }
      } catch (e) {
        console.error('读取响应文本失败:', e);
        responseData = { success: false, message: '无法获取响应内容' };
      }
      
      if (!response.ok || !responseData.success) {
        // 更新Toast为错误
        toast.error(`删除失败: ${responseData.message || response.statusText}`, {
          id: toastId,
        });
        throw new Error(`删除失败: ${responseData.message || response.statusText}`);
      }
      
      // 更新Toast为成功
      toast.success(responseData.message || "项目已成功删除", {
        id: toastId,
      });
      
      // 使用强制刷新方式重新加载页面，并添加延迟确保数据库操作完成
      console.log('删除成功，即将刷新页面...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("删除出错:", error);
      toast.error(`删除失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      onClick={handleDelete} 
      variant="destructive" 
      size="sm"
      disabled={isDeleting}
      className="relative"
    >
      {isDeleting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
          <span>删除中</span>
        </>
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
} 