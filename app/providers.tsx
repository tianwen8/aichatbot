"use client";

import { TooltipProvider } from "@dub/ui";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <TooltipProvider>
        <Toaster closeButton />
        {children}
        <Analytics />
      </TooltipProvider>
    </SessionProvider>
  );
}
