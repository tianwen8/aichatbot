import { Link, Project } from "./supabase-db";

export interface EnrichedProjectProps extends Project {
  links: Link[];
  githubLink: Link;
  websiteLink?: Link | null;
  users: {
    id: string;
    role: string;
    name: string;
    username: string;
    image: string;
  }[];
}
