"use client";

import { cn } from "@dub/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { PROJECT_TABS } from "./project-constants";
import { ProjectContext } from "./project-provider";

export default function ProjectLayoutTabs() {
  const { slug, tab } = useParams() as { slug: string; tab?: string[] };
  const { props } = useContext(ProjectContext);

  return null;
}

export const TabLink = ({
  title,
  href,
  active,
}: {
  title: string;
  href: string;
  active?: boolean;
}) => {
  return (
    <Link href={href} className="relative z-10">
      <div
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium text-gray-800 transition-all",
          active ? "text-white" : "hover:text-gray-500",
        )}
      >
        {title}
      </div>
      {active && (
        <motion.div
          layoutId="indicator"
          className="absolute left-0 top-0 h-full w-full rounded-full bg-black"
          style={{ zIndex: -1 }}
        />
      )}
    </Link>
  );
};
