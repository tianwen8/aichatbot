"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function DeleteButtonForm({ projectId }: { projectId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    if (!confirm("确定要删除此项目吗？此操作不可撤销，项目将从数据库中永久删除。")) {
      e.preventDefault();
    } else {
      setIsDeleting(true);
    }
  };

  return (
    <form action={`/api/delete?id=${projectId}`} method="POST">
      <Button 
        type="submit"
        variant="destructive" 
        size="sm"
        disabled={isDeleting}
        className="relative"
        onClick={handleDeleteClick}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  );
} 