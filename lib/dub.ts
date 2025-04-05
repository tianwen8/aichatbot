import { supabaseAdmin } from "@/lib/supabase";
import { Link } from "@/lib/supabase-db";
import { nanoid } from "@dub/utils";
import { Dub } from "dub";
import { getUrlWithRef } from "./utils";

export const dub = new Dub();

export async function shortenAndCreateLink({
  url,
  type,
  projectId,
}: {
  url: string;
  type: "GITHUB" | "WEBSITE";
  projectId: string;
}) {
  const linkId = nanoid(24);

  const { shortLink } = await dub.links.create({
    url: getUrlWithRef(url),
    externalId: linkId,
  });

  const { data, error } = await supabaseAdmin
    .from('links')
    .insert({
      id: linkId,
      type,
      url,
      short_link: shortLink,
      project_id: projectId,
      order: 0
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating link:', error);
    throw new Error('Failed to create link');
  }
  
  return data;
}

export async function editShortLink({
  link,
  newUrl,
}: {
  link: Link;
  newUrl: string;
}) {
  return await Promise.all([
    dub.links.update(`ext_${link.id}`, {
      url: getUrlWithRef(newUrl),
    }),
    supabaseAdmin
      .from('links')
      .update({ url: newUrl })
      .eq('id', link.id)
  ]);
}
