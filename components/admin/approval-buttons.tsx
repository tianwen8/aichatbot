"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ApprovalButtons({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApproval = async (approve: boolean) => {
    if (!confirm(`确定要${approve ? '批准' : '拒绝'}此项目吗？${!approve ? '拒绝将会删除此项目，此操作不可撤销。' : ''}`)) {
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const actionText = approve ? "批准" : "拒绝";
      toast.info(`正在${actionText}项目...`);
      
      const response = await fetch(`/api/admin/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: projectId, approve }),
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `${actionText}失败`);
      }
      
      toast.success(data.message || `已${actionText}项目`);
      
      // 刷新页面
      setTimeout(() => {
        router.refresh();
      }, 1000);
      
    } catch (error) {
      console.error("操作失败:", error);
      toast.error(`操作失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center text-green-600 hover:text-green-800 hover:bg-green-50"
        onClick={() => handleApproval(true)}
        disabled={isProcessing}
        title="批准项目"
      >
        <Check className="h-4 w-4 mr-1" />
        批准
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="flex items-center text-red-600 hover:text-red-800 hover:bg-red-50"
        onClick={() => handleApproval(false)}
        disabled={isProcessing}
        title="拒绝并删除项目"
      >
        <X className="h-4 w-4 mr-1" />
        拒绝
      </Button>
    </div>
  );
} 