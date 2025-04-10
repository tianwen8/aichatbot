"use client";

import { cn } from "@dub/utils";
import Link from "next/link";
import { buttonLinkVariants } from "../ui/button-link";
import { PlusCircle } from "lucide-react";

export function SubmitProjectButton({ text = "Submit AI Tool" }: { text?: string }) {
  return (
    <Link
      href="/submit"
      className={cn(
        buttonLinkVariants(), 
        "px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full inline-flex items-center"
      )}
    >
      <PlusCircle className="mr-1.5 h-4 w-4" />
      {text}
    </Link>
  );
} 