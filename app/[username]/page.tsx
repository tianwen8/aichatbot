import ProjectGrid from "@/components/projects/project-grid";
import { TabLink } from "@/components/projects/project-layout-tabs";
import { getUserWithProjects, getAllUsers } from "@/lib/supabase-db";
import { constructMetadata } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params: { username },
}: {
  params: { username: string };
}) {
  const user = await getUserWithProjects(username);

  if (!user) {
    return;
  }

  return constructMetadata({
    title: `${user.name}'s Profile`,
    description: `${user.name}'s profile page on OSS Gallery.`,
  });
}

export async function generateStaticParams() {
  const users = await getAllUsers();
  return users.map(({ username }) => ({
    username,
  }));
}

export default async function Profile({
  params: { username },
}: {
  params: {
    username: string;
  };
}) {
  const user = await getUserWithProjects(username);

  if (!user) {
    notFound();
  }

  const { projects } = user;

  return (
    <div>
      <div className="aspect-[4/1] w-full rounded-t-2xl bg-gradient-to-tr from-purple-100 via-violet-50 to-blue-100" />
      <div className="-mt-8 flex items-center justify-between px-4 sm:-mt-12 sm:items-end md:pr-0">
        <Image
          src={user.image}
          alt={user.name}
          width={100}
          height={100}
          className="h-16 w-16 rounded-full bg-white p-2 sm:h-24 sm:w-24"
        />
      </div>
      <div className="max-w-lg p-4">
        <div className="flex items-center space-x-2">
          <h1 className="font-display text-3xl font-bold">{user.name}</h1>
          <BadgeCheck className="h-8 w-8 text-white" fill="#1c9bef" />
        </div>
      </div>
      <div className="mb-4 flex items-center p-4">
        <TabLink title="Projects" href={`/${username}`} active />
      </div>
      <ProjectGrid
        projects={projects.map(({ project }) => project)}
        className="mx-5 p-4 md:mx-0"
      />
    </div>
  );
}
