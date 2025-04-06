import { BlurImage } from "@dub/ui";
import { Project } from "@/lib/supabase-db";
import Link from "next/link";
import { Badge, Clock, ExternalLink, Star, ThumbsUp, Users, CheckCircle } from "lucide-react";

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
  // Generate a random rating between 4.0 and 5.0 for demo purposes
  const rating = (4 + Math.random()).toFixed(1);
  
  // Generate random numbers for stats
  const userCount = Math.floor(Math.random() * 50000) + 5000;
  const formattedUserCount = userCount > 10000 
    ? `${(userCount / 1000).toFixed(1)}K` 
    : userCount.toString();
  
  // Random tag generation (in a real app, these would come from the database)
  const tags = ["AI Chat", "Virtual Assistant", "Roleplay"];
  const randomTags = tags.sort(() => 0.5 - Math.random()).slice(0, 2);
  
  return (
    <Link
      href={`/projects/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative flex items-center p-4 bg-white">
        <div className="relative h-12 w-12 flex-shrink-0">
          <BlurImage
            src={logo}
            alt={name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-md border border-gray-200 bg-white p-1"
          />
          {verified && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-white">
              <CheckCircle className="h-3 w-3" />
            </span>
          )}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-display text-base font-medium text-gray-900 group-hover:text-indigo-600">
            {name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex items-center">
              <Star className="mr-1 h-3 w-3 text-yellow-400" />
              <span>{rating}</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center">
              <Users className="mr-1 h-3 w-3 text-gray-400" />
              <span>{formattedUserCount}</span>
            </div>
          </div>
        </div>
        <div className="ml-auto flex flex-col items-end">
          <div className="flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
            <ThumbsUp className="mr-1 h-3 w-3" />
            {clicks || 0}
          </div>
          <div className="mt-1 flex flex-wrap gap-1 justify-end">
            {randomTags.map((tag, index) => (
              <span key={index} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex-grow p-4 border-t border-gray-100">
        <p className="line-clamp-2 text-sm text-gray-600">{description}</p>
      </div>
      
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2 text-xs text-gray-500">
        <div className="flex items-center">
          <Clock className="mr-1 h-3 w-3" />
          <span>Added recently</span>
        </div>
        <div className="flex items-center text-indigo-600 font-medium">
          <span>Visit site</span>
          <ExternalLink className="ml-1 h-3 w-3" />
        </div>
      </div>
    </Link>
  );
}
