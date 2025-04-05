import { BlurImage } from "@dub/ui";
import { Project } from "@/lib/supabase-db";
import Link from "next/link";
import { Badge, Clock, ExternalLink } from "lucide-react";

export default function ProjectCard({
  id,
  name,
  description,
  slug,
  logo,
  gradient,
  clicks,
  verified,
}: Project) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg"
    >
      <div className={`h-24 w-full bg-gradient-to-tr ${gradient}`} />
      <div className="flex-grow p-4">
        <div className="-mt-12 mb-4 flex items-center">
          <BlurImage
            src={logo}
            alt={name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full border-2 border-white bg-white p-1"
          />
          {verified && (
            <span className="ml-2 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              Verified
            </span>
          )}
          <div className="ml-auto flex items-center text-xs text-gray-500">
            <Clock className="mr-1 h-3 w-3" />
            <span>{clicks || 0} visits</span>
          </div>
        </div>
        <h3 className="line-clamp-1 font-display text-xl font-semibold text-gray-900">
          {name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-gray-500">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {/* 这里可以添加标签，暂时使用静态标签作为示例 */}
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              website
            </span>
          </div>
          <div className="flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            <ExternalLink className="mr-1 h-3 w-3" />
            Visit
          </div>
        </div>
      </div>
    </Link>
  );
}
