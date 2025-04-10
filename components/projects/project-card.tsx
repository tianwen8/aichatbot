import Link from "next/link";
import Image from "next/image";
import { StarIcon, Users2Icon, ClockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Helper functions to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

// Get a random category for demo
const getRandomCategory = () => {
  const categories = [
    "AI Chat", "Virtual Assistant", "AI Character", "Roleplay", 
    "AI Tool", "Language Model", "Content Creator", "Image Generator"
  ];
  return categories[Math.floor(Math.random() * categories.length)];
};

type ProjectCardProps = {
  name: string;
  description: string;
  slug: string;
  image?: string;
  url?: string;
  users?: number;
  rating?: number;
  updated?: string;
  gradient?: string;
  featured?: boolean;
};

export default function ProjectCard({
  name,
  description,
  slug,
  image,
  url,
  users = Math.floor(Math.random() * 10000),
  rating = parseFloat((Math.random() * 2 + 3).toFixed(1)),
  updated = "2023-05-01",
  gradient = "from-purple-100 via-violet-50 to-blue-100",
  featured = false,
}: ProjectCardProps) {
  // Format the updated date
  const updatedDate = new Date(updated);
  const formattedDate = `${updatedDate.toLocaleString('default', { month: 'short' })} ${updatedDate.getFullYear()}`;
  
  // Generate star rating display
  const ratingValue = typeof rating === 'string' ? parseFloat(rating) : rating;
  const fullStars = Math.floor(ratingValue);
  const hasHalfStar = ratingValue - fullStars >= 0.5;
  
  return (
    <Link href={`/projects/${slug}`} className="tool-card">
      <div className="tool-card-header">
        {image ? (
          <Image 
            src={image} 
            alt={name} 
            width={400} 
            height={200} 
            className="object-cover h-full w-full"
            unoptimized
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-3xl font-bold text-gray-700 opacity-30">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {featured && (
          <Badge className="absolute top-2 right-2 bg-secondary hover:bg-secondary">
            Featured
          </Badge>
        )}
      </div>
      
      <div className="tool-card-content">
        <div className="mb-1">
          <Badge variant="outline" className="text-xs">
            {getRandomCategory()}
          </Badge>
        </div>
        
        <h3 className="tool-card-title">{name}</h3>
        <p className="tool-card-description">{description}</p>
        
        <div className="tool-card-meta">
          <div className="rating-stars">
            <span className="mr-1 font-medium">{rating}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon 
                  key={i} 
                  className={`w-3.5 h-3.5 ${
                    i < fullStars 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : i === fullStars && hasHalfStar 
                        ? 'text-yellow-400 fill-yellow-400 opacity-50' 
                        : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Users2Icon className="w-3.5 h-3.5 mr-1 text-gray-400" />
              <span>{formatNumber(users)}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-3.5 h-3.5 mr-1 text-gray-400" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
