import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export const dynamic = 'force-dynamic'; // 禁止缓存此API路由
export const fetchCache = 'force-no-store'; // 确保fetch请求不缓存

export async function POST(request: Request) {
  console.log("Reject API called:", new Date().toISOString());
  
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      console.error("Missing project ID in reject request");
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    
    console.log(`Rejecting project with ID: ${id}`);
    
    // Delete the project from the database
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Rejection failed:", error);
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    
    console.log(`Project ${id} rejected successfully`);
    
    // 改回使用重定向，确保客户端能正确跳转
    return NextResponse.redirect(new URL("/admin", request.url));
    
  } catch (error) {
    console.error("Error processing rejection request:", error);
    return NextResponse.redirect(new URL("/admin", request.url));
  }
}

// Add GET request handler
export async function GET(request: Request) {
  // Reuse the same logic as the POST method
  return POST(request);
} 