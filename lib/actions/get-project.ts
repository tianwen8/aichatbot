import { cache } from "react";
import { getProject as getProjectFromSupabase } from "../supabase-db";
import { EnrichedProject } from "../supabase-db";

export const getProject = cache(
  async ({ id, slug }: { id?: string; slug?: string }): Promise<EnrichedProject | null> => {
    if (!slug) {
      console.error("项目slug不能为空");
      return null;
    }
    
    return await getProjectFromSupabase(slug);
  }
);
