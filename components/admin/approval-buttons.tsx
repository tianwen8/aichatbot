"use client";

import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ApprovalButtonsProps {
  projectId: string;
}

export function ApprovalButtons({ projectId }: ApprovalButtonsProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    if (isApproving || isRejecting) return;
    
    setIsApproving(true);
    const toastId = toast.loading("Approving submission...");
    
    try {
      console.log(`Approving project ID: ${projectId}`);
      
      const response = await fetch(`/api/approve?id=${projectId}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
      
      console.log(`Approval request status: ${response.status}`);
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        toast.error(`Approval failed: ${data.message || response.statusText}`, {
          id: toastId,
        });
        throw new Error(`Approval failed: ${data.message || response.statusText}`);
      }
      
      toast.success(data.message || "Project approved successfully", {
        id: toastId,
      });
      
      // 强制刷新页面而不是使用router.refresh()
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error during approval:", error);
      toast.error(`Approval failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (isApproving || isRejecting) return;
    
    // Confirm before rejecting
    const confirmed = window.confirm("Are you sure you want to reject this submission? This will delete the project permanently.");
    if (!confirmed) return;
    
    setIsRejecting(true);
    const toastId = toast.loading("Rejecting submission...");
    
    try {
      console.log(`Rejecting project ID: ${projectId}`);
      
      const response = await fetch(`/api/reject?id=${projectId}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
      
      console.log(`Rejection request status: ${response.status}`);
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        toast.error(`Rejection failed: ${data.message || response.statusText}`, {
          id: toastId,
        });
        throw new Error(`Rejection failed: ${data.message || response.statusText}`);
      }
      
      toast.success(data.message || "Project rejected successfully", {
        id: toastId,
      });
      
      // 强制刷新页面而不是使用router.refresh()
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error during rejection:", error);
      toast.error(`Rejection failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleApprove}
        size="sm"
        className="bg-green-600 hover:bg-green-700"
        disabled={isApproving || isRejecting}
      >
        {isApproving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
            <span>Approving...</span>
          </>
        ) : (
          <>
            <Check className="h-4 w-4 mr-1" />
            <span>Approve</span>
          </>
        )}
      </Button>
      
      <Button
        onClick={handleReject}
        variant="destructive"
        size="sm"
        disabled={isApproving || isRejecting}
      >
        {isRejecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
            <span>Rejecting...</span>
          </>
        ) : (
          <>
            <X className="h-4 w-4 mr-1" />
            <span>Reject</span>
          </>
        )}
      </Button>
    </div>
  );
} 