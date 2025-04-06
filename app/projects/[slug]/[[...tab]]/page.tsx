import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProjectAnalytics from "@/components/projects/project-analytics";
import ProjectTeam from "@/components/projects/project-team";
import { getProject, getVerifiedProjects } from "@/lib/supabase-db";
import { notFound } from "next/navigation";
import { Star, ExternalLink, Heart, Share2, Flag, Users, Clock, CheckCircle, ThumbsUp } from "lucide-react";

export async function generateStaticParams() {
  return [
    {
      tab: [], // for the root page
    },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProject(params.slug);
  
  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }
  
  return {
    title: `${project.name} | AI Chat Tool`,
    description: project.description,
    openGraph: {
      images: [project.logo],
    },
  };
}

export default async function Project({
  params: { slug, tab },
}: {
  params: {
    slug: string;
    tab?: string[];
  };
}) {
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }
  
  // Get some similar projects
  const similarProjects = await getVerifiedProjects(5);
  
  // Generate random rating for demo purposes
  const rating = (4 + Math.random()).toFixed(1);
  const totalReviews = Math.floor(Math.random() * 500) + 50;
  
  // Tags for the project
  const tags = ["AI Chat", "Virtual Assistant", "English", "Free Trial"];
  
  // Main features
  const features = [
    "Natural conversation with AI characters",
    "Customizable personality settings",
    "Memory of previous interactions",
    "Voice input and output capabilities",
    "Multiple language support"
  ];

  const activeTab = tab && tab.length > 0 ? tab[0] : "overview";

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={project.logo}
                  alt={project.name}
                  fill
                  className="object-cover"
                />
                {project.verified && (
                  <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 font-medium">{rating}</span>
                    <span className="ml-1 text-gray-400">({totalReviews} reviews)</span>
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="ml-1">{project.clicks}+ users</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-3 md:mt-0 md:ml-auto">
              {project.websiteLink && (
                <a
                  href={project.websiteLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  <ExternalLink className="mr-1.5 h-4 w-4" />
                  Visit Website
                </a>
              )}
              <button className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-300">
                <Heart className="mr-1.5 h-4 w-4" />
                Save
              </button>
              <button className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-300">
                <Share2 className="mr-1.5 h-4 w-4" />
                Share
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {["Overview", "Reviews", "Alternatives", "Pricing", "FAQ"].map((item) => {
                const isActive = 
                  (item.toLowerCase() === "overview" && activeTab === "overview") ||
                  item.toLowerCase() === activeTab;
                return (
                  <Link
                    key={item}
                    href={`/projects/${slug}${item.toLowerCase() === "overview" ? "" : `/${item.toLowerCase()}`}`}
                    className={`border-b-2 py-2 px-1 text-sm font-medium ${
                      isActive
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {item}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column - Main content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">About {project.name}</h2>
              <p className="mt-4 text-sm text-gray-600">{project.description}</p>
              
              {/* Tags */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Features */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Main Features</h3>
                <ul className="mt-2 space-y-2">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Screenshots */}
            <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Screenshots</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="aspect-w-16 aspect-h-9 relative h-44 overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={project.logo}
                    alt="Screenshot 1"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-w-16 aspect-h-9 relative h-44 overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={project.logo}
                    alt="Screenshot 2"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Sidebar */}
          <div>
            {/* Quick info */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Information</h2>
              <dl className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Rating</dt>
                  <dd className="text-sm text-gray-900 flex items-center">
                    <Star className="mr-1 h-4 w-4 text-yellow-400" />
                    {rating} / 5.0
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Users</dt>
                  <dd className="text-sm text-gray-900">{project.clicks}+</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Added</dt>
                  <dd className="text-sm text-gray-900">{new Date(project.created_at).toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Updated</dt>
                  <dd className="text-sm text-gray-900">{new Date(project.updated_at).toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Pricing</dt>
                  <dd className="text-sm text-gray-900">Free / Freemium</dd>
                </div>
              </dl>
              
              <div className="mt-6">
                <a
                  href={project.websiteLink?.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Visit Official Website
                </a>
              </div>
            </div>
            
            {/* Similar products */}
            <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Similar AI Chat Tools</h2>
              <div className="mt-4 space-y-4">
                {similarProjects.slice(0, 3).map((similarProject) => (
                  <Link
                    key={similarProject.id}
                    href={`/projects/${similarProject.slug}`}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md"
                  >
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={similarProject.logo}
                        alt={similarProject.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{similarProject.name}</p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400" />
                        <span className="ml-1 text-xs text-gray-500">{(4 + Math.random()).toFixed(1)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  href="/"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View more alternatives
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
