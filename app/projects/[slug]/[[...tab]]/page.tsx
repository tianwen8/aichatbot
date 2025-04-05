import ProjectAnalytics from "@/components/projects/project-analytics";
import ProjectTeam from "@/components/projects/project-team";
import { getProject } from "@/lib/actions/get-project";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return [
    {
      tab: [], // for the root page
    },
  ];
}

export default async function Project({
  params: { slug, tab },
}: {
  params: {
    slug: string;
    tab?: string[];
  };
}) {
  const project = await getProject({ slug });

  if (!project) {
    notFound();
  }

  // 暂时简化项目页面，仅显示基本信息
  // 后续可以根据需要添加团队和贡献者页面
  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-6 flex flex-col items-center text-center">
        <h1 className="mb-2 text-3xl font-bold">{project.name}</h1>
        <p className="mb-4 text-gray-600">{project.description}</p>
        <div className="flex space-x-4">
          {project.githubLink && (
            <a
              href={project.githubLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-gray-800 px-4 py-2 text-white"
            >
              GitHub
            </a>
          )}
          {project.websiteLink && (
            <a
              href={project.websiteLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-blue-600 px-4 py-2 text-white"
            >
              网站
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-4 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold">项目统计</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Star数量:</span>
              <span className="font-medium">{project.stars}</span>
            </div>
            <div className="flex justify-between">
              <span>点击数:</span>
              <span className="font-medium">{project.clicks}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold">项目信息</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>创建时间:</span>
              <span className="font-medium">
                {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>更新时间:</span>
              <span className="font-medium">
                {new Date(project.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
