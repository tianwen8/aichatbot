import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ExternalLink, Star, Users, Calendar, Info, Bookmark, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProject, getVerifiedProjects } from "@/lib/supabase-db";
import ProjectCard from "@/components/projects/project-card";

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

type Props = {
  params: {
    slug: string;
    tab?: string[];
  };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} - AI Character Directory`,
    description: project.description,
    keywords: project.name + ", AI character, AI chat, virtual assistant, chatbot",
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProject(params.slug);
  const similarProjects = await getVerifiedProjects(5);

  // Mock data for demo purposes
  const projectData = {
    ...project,
    rating: 4.8,
    users: 124500,
    lastUpdated: "Apr 2023",
    url: project.url || "https://example.com",
    tags: ["AI Character", "Roleplay", "Interactive", "Dynamic personality"],
    features: [
      "Natural conversation capabilities",
      "Memory of previous interactions",
      "Customizable personality",
      "Multimedia response options",
      "Voice chat integration"
    ],
    pricing: "Free / Premium from $9.99/month"
  };

  if (!project) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold">Project Not Found</h1>
        <p className="mt-2 text-gray-600">The project you're looking for doesn't exist.</p>
        <Button asChild className="mt-8">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  // Determine the active tab
  const activeTab = params.tab?.[0] || "overview";

  return (
    <div className="bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="container py-4">
          <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-primary">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Directory
          </Link>
        </div>
      </div>

      {/* Top Info Area */}
      <div className="bg-white border-b py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Project Logo */}
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 via-violet-50 to-blue-100 shrink-0 flex items-center justify-center">
              {project.logo ? (
                <Image src={project.logo} alt={project.name} width={96} height={96} unoptimized className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-gray-400">{project.name.charAt(0)}</span>
              )}
            </div>
            
            {/* Project Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="px-3 gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span>{projectData.rating}</span>
                  </Badge>
                  
                  <Badge variant="outline" className="px-3 gap-1">
                    <Users className="h-3.5 w-3.5 text-gray-400" />
                    <span>{formatNumber(projectData.users)} users</span>
                  </Badge>
                  
                  <Badge variant="outline" className="px-3 gap-1">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <span>Updated {projectData.lastUpdated}</span>
                  </Badge>
                </div>
                
                <div className="ml-auto hidden md:flex">
                  <Button asChild className="rounded-full">
                    <a href={projectData.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <span>Visit Website</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              
              <p className="mt-3 text-gray-600">{project.description}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {projectData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="mt-6 md:hidden">
                <Button asChild className="w-full rounded-full">
                  <a href={projectData.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <span>Visit Website</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="bg-white border-b">
        <div className="container">
          <div className="flex overflow-x-auto">
            <Link 
              href={`/projects/${params.slug}`} 
              className={`flex items-center border-b-2 px-4 py-3 text-sm font-medium ${
                activeTab === "overview" ? "border-primary text-primary" : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Overview
            </Link>
            <Link 
              href={`/projects/${params.slug}/reviews`} 
              className={`flex items-center border-b-2 px-4 py-3 text-sm font-medium ${
                activeTab === "reviews" ? "border-primary text-primary" : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Reviews
            </Link>
            <Link 
              href={`/projects/${params.slug}/alternatives`} 
              className={`flex items-center border-b-2 px-4 py-3 text-sm font-medium ${
                activeTab === "alternatives" ? "border-primary text-primary" : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Alternatives
            </Link>
            <Link 
              href={`/projects/${params.slug}/pricing`} 
              className={`flex items-center border-b-2 px-4 py-3 text-sm font-medium ${
                activeTab === "pricing" ? "border-primary text-primary" : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Pricing
            </Link>
            <Link 
              href={`/projects/${params.slug}/faq`} 
              className={`flex items-center border-b-2 px-4 py-3 text-sm font-medium ${
                activeTab === "faq" ? "border-primary text-primary" : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Project Image */}
            {project.image && (
              <div className="rounded-xl overflow-hidden border bg-white p-2">
                <Image 
                  src={project.image} 
                  alt={`${project.name} screenshot`} 
                  width={1200} 
                  height={675}
                  className="rounded-lg w-full h-auto object-cover"
                  unoptimized
                />
              </div>
            )}
            
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About {project.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  {project.description}
                </p>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ac magna vel augue euismod feugiat. 
                  In hac habitasse platea dictumst. Sed a ligula quis lorem rhoncus consequat.
                </p>
              </CardContent>
            </Card>
            
            {/* Features Section */}
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {projectData.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Rating</span>
                  <div className="flex items-center">
                    <span className="font-medium">{projectData.rating}</span>
                    <div className="ml-1 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3.5 w-3.5 ${
                            i < Math.floor(projectData.rating) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Users</span>
                  <span className="font-medium">{formatNumber(projectData.users)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Last Updated</span>
                  <span className="font-medium">{projectData.lastUpdated}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Pricing</span>
                  <span className="font-medium">{projectData.pricing}</span>
                </div>
                
                <div className="pt-2">
                  <Button asChild className="w-full rounded-full">
                    <a href={projectData.url} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Similar Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Tools</CardTitle>
                <CardDescription>You might also like</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {similarProjects.slice(0, 3).map((similarProject) => (
                  <Link 
                    key={similarProject.slug}
                    href={`/projects/${similarProject.slug}`}
                    className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 via-violet-50 to-blue-100">
                      {similarProject.logo ? (
                        <Image 
                          src={similarProject.logo} 
                          alt={similarProject.name} 
                          width={40} 
                          height={40} 
                          className="rounded-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-lg font-bold text-gray-400">{similarProject.name.charAt(0)}</span>
                      )}
            </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate group-hover:text-primary">{similarProject.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{similarProject.description}</p>
            </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                  </Link>
                ))}
                
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/projects/${params.slug}/alternatives`}>View All Alternatives</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
