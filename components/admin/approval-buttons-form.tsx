"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ApprovalButtonsFormProps {
  projectId: string;
}

export function ApprovalButtonsForm({ projectId }: ApprovalButtonsFormProps) {
  const router = useRouter();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      console.log("[审批按钮] 开始审批项目:", projectId);
      
      toast.info("正在审批中...", { duration: 2000 });
      
      const response = await fetch(`/api/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: projectId }),
        credentials: "include", // 确保包含cookies
      });
      
      console.log("[审批按钮] 收到响应:", response.status, response.statusText);
      
      // 尝试解析响应内容
      const responseText = await response.text();
      console.log("[审批按钮] 原始响应内容:", responseText);
      
      let responseData;
      try {
        // 只有在有内容时才解析JSON
        if (responseText.trim()) {
          responseData = JSON.parse(responseText);
          console.log("[审批按钮] 解析后的响应数据:", responseData);
        } else {
          console.warn("[审批按钮] 响应内容为空");
          responseData = { message: "操作已执行，但服务器未返回详细信息" };
        }
      } catch (parseError) {
        console.error("[审批按钮] 解析响应失败:", parseError);
        // 可能是重定向响应，不一定是错误
        if (response.status >= 200 && response.status < 300) {
          responseData = { message: "项目已成功审批通过" };
        } else {
          throw new Error(`无法解析响应: ${response.status} ${response.statusText}`);
        }
      }
      
      if (!response.ok) {
        const errorMessage = responseData?.message || `审批失败: ${response.status} ${response.statusText}`;
        console.error("[审批按钮] 审批请求失败:", errorMessage);
        throw new Error(errorMessage);
      }
      
      console.log("[审批按钮] 审批请求成功");
      toast.success(responseData?.message || "项目已成功审核通过");
      
      // 等待短暂延迟后刷新页面
      setTimeout(() => {
        console.log("[审批按钮] 刷新页面");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("[审批按钮] 审批过程中出错:", error);
      toast.error(`审批失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("确定要拒绝此项目吗？这将永久删除该项目，无法撤销。")) {
      return;
    }
    
    try {
      setIsRejecting(true);
      console.log("[审批按钮] 开始拒绝项目:", projectId);
      
      toast.info("处理中...", { duration: 2000 });
      
      const response = await fetch(`/api/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: projectId }),
        credentials: "include", // 确保包含cookies
      });
      
      console.log("[审批按钮] 收到响应:", response.status, response.statusText);
      
      // 尝试解析响应内容
      const responseText = await response.text();
      console.log("[审批按钮] 原始响应内容:", responseText);
      
      let responseData;
      try {
        // 只有在有内容时才解析JSON
        if (responseText.trim()) {
          responseData = JSON.parse(responseText);
          console.log("[审批按钮] 解析后的响应数据:", responseData);
        } else {
          console.warn("[审批按钮] 响应内容为空");
          responseData = { message: "操作已执行，但服务器未返回详细信息" };
        }
      } catch (parseError) {
        console.error("[审批按钮] 解析响应失败:", parseError);
        // 可能是重定向响应，不一定是错误
        if (response.status >= 200 && response.status < 300) {
          responseData = { message: "项目已被拒绝并删除" };
        } else {
          throw new Error(`无法解析响应: ${response.status} ${response.statusText}`);
        }
      }
      
      if (!response.ok) {
        const errorMessage = responseData?.message || `拒绝失败: ${response.status} ${response.statusText}`;
        console.error("[审批按钮] 拒绝请求失败:", errorMessage);
        throw new Error(errorMessage);
      }
      
      console.log("[审批按钮] 拒绝请求成功");
      toast.success(responseData?.message || "项目已被拒绝并删除");
      
      // 刷新页面
      setTimeout(() => {
        console.log("[审批按钮] 刷新页面");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("[审批按钮] 拒绝过程中出错:", error);
      toast.error(`拒绝失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="sm"
        className="bg-green-600 hover:bg-green-700"
        disabled={isApproving || isRejecting}
        onClick={handleApprove}
      >
        {isApproving ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            处理中
          </span>
        ) : (
          <>
            <Check className="h-4 w-4 mr-1" />
            <span>通过</span>
          </>
        )}
      </Button>
      
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={isApproving || isRejecting}
        onClick={handleReject}
      >
        {isRejecting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            处理中
          </span>
        ) : (
          <>
            <X className="h-4 w-4 mr-1" />
            <span>拒绝</span>
          </>
        )}
      </Button>
    </div>
  );
} 