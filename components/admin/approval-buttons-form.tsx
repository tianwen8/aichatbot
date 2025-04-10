"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface ApprovalButtonsFormProps {
  projectId: string;
}

export function ApprovalButtonsForm({ projectId }: ApprovalButtonsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRejectClick = (e: React.MouseEvent) => {
    if (!confirm("Are you sure you want to reject this submission? This will delete the project permanently.")) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <form action={`/api/approve?id=${projectId}`} method="POST">
        <Button
          type="submit"
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          disabled={isSubmitting}
          onClick={() => setIsSubmitting(true)}
        >
          <Check className="h-4 w-4 mr-1" />
          <span>Approve</span>
        </Button>
      </form>
      
      <form action={`/api/reject?id=${projectId}`} method="POST">
        <Button
          type="submit"
          variant="destructive"
          size="sm"
          disabled={isSubmitting}
          onClick={(e) => {
            setIsSubmitting(true);
            handleRejectClick(e);
          }}
        >
          <X className="h-4 w-4 mr-1" />
          <span>Reject</span>
        </Button>
      </form>
    </div>
  );
} 