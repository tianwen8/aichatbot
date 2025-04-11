import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

// Create Supabase client with server role permissions
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Ensure projects table exists
async function ensureProjectsTable() {
  try {
    console.log("Starting to check and ensure projects table exists...");
    
    // Try to create table using RPC call if it doesn't exist
    console.log("Attempting to use RPC call create_projects_table_if_not_exists...");
    const { error } = await supabaseAdmin.rpc('create_projects_table_if_not_exists');
    
    if (error) {
      console.error("RPC call failed, error:", error);
      
      // Try to query the table to check if it exists
      console.log("Attempting to check if table exists via query...");
      const { data, error: queryError } = await supabaseAdmin
        .from('projects')
        .select('id')
        .limit(1);
        
      if (queryError) {
        console.error("Table query failed, error:", queryError);
        console.log("Table may not exist, attempting to create it...");
        await createProjectsTable();
      } else {
        console.log("Table exists, no need to create");
      }
    } else {
      console.log("RPC call successful, table exists");
    }
  } catch (error) {
    console.error("Error ensuring table exists:", error);
    throw error;
  }
}

// Create projects table
async function createProjectsTable() {
  try {
    console.log("Starting to create projects table...");
    
    // First, try to get existing table structure
    console.log("Attempting to get database table info...");
    const { data: tableInfo, error: tableInfoError } = await supabaseAdmin.rpc('get_table_schema', {
      table_name: 'projects'
    });
    
    if (tableInfoError) {
      console.log("Failed to get table structure, error:", tableInfoError);
    } else if (tableInfo) {
      console.log("Retrieved table structure info:", tableInfo);
    }
    
    // Create table using SQL
    console.log("Using execute_sql RPC to attempt table creation...");
    const { error } = await supabaseAdmin.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS projects (
          id UUID PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT NOT NULL,
          url TEXT NOT NULL,
          logo TEXT,
          image TEXT,
          category TEXT,
          keywords TEXT,
          meta_description TEXT,
          verified BOOLEAN DEFAULT false,
          stars INTEGER DEFAULT 0,
          clicks INTEGER DEFAULT 0,
          gradient TEXT,
          features JSONB,
          instructions TEXT,
          stats JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (error) {
      console.error("Failed to create table using execute_sql, error:", error);
      
      // Try alternative approach with direct SQL
      console.log("Attempting to use exec_sql as an alternative...");
      const { error: directError } = await supabaseAdmin.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS projects (
            id UUID PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT NOT NULL,
            url TEXT NOT NULL,
            logo TEXT,
            image TEXT,
            category TEXT,
            keywords TEXT,
            meta_description TEXT,
            verified BOOLEAN DEFAULT false,
            stars INTEGER DEFAULT 0,
            clicks INTEGER DEFAULT 0,
            gradient TEXT,
            features JSONB,
            instructions TEXT,
            stats JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (directError) {
        console.error("Failed to create table using exec_sql as well, error:", directError);
        throw directError;
      } else {
        console.log("Successfully created table using exec_sql");
      }
    } else {
      console.log("Successfully created projects table");
    }
    
    console.log("Checking if projects table was actually created...");
    const { data, error: checkError } = await supabaseAdmin
      .from('projects')
      .select('id')
      .limit(1);
      
    if (checkError) {
      console.error("Table creation verification failed, error:", checkError);
    } else {
      console.log("Table creation verification successful");
    }
  } catch (error) {
    console.error("Critical error during table creation:", error);
    throw error;
  }
}

// Validate project data
function validateProjectData(data: any) {
  const errors = [];
  
  if (!data.name) errors.push("Name is required");
  if (!data.description) errors.push("Description is required");
  if (!data.url) errors.push("URL is required");
  
  if (data.name && data.name.length > 100) {
    errors.push("Name must be less than 100 characters");
  }
  
  if (data.description && data.description.length > 1000) {
    errors.push("Description must be less than 1000 characters");
  }
  
  return errors;
}

// Generate unique slug
function generateUniqueSlug(name: string) {
  const baseSlug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
  
  const uniqueId = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${uniqueId}`;
}

// Format URL
function formatUrl(url: string) {
  try {
    const urlObj = new URL(url);
    if (!urlObj.protocol.startsWith('http')) {
      return 'https://' + url;
    }
    return url;
  } catch (error) {
    return 'https://' + url;
  }
}

// Check if user is admin
async function isAdmin() {
  try {
    // Check for admin session cookie
    const cookieStore = cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    
    if (!sessionId) {
      console.log("No admin session cookie found");
      return false;
    }
    
    // Verify session in database
    const { data: session, error } = await supabaseAdmin
      .from('admin_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    
    if (error) {
      console.log("Admin session verification failed:", error);
      return false;
    }

    if (!session) {
      console.log("No session found");
      return false;
    }
    
    // Check if session is expired
    const now = new Date();
    if (new Date(session.expires_at) < now) {
      console.log("Admin session expired");
      return false;
    }
    
    console.log("Admin session verified successfully");
    return true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function POST(request: Request) {
  console.log("=== 普通用户提交API调用 ===");
  console.log("时间:", new Date().toISOString());
  
  try {
    // 检查管理员权限
    const adminStatus = await isAdmin();
    console.log("管理员状态:", adminStatus);

    // 确保projects表存在
    await ensureProjectsTable();
    
    // 解析请求体
    const projectData = await request.json();
    
    // 验证项目数据
    const validationErrors = validateProjectData(projectData);
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        errors: validationErrors
      }, { status: 400 });
    }
    
    // 生成唯一ID和slug
    const projectId = uuidv4();
    const slug = generateUniqueSlug(projectData.name);
    
    // 格式化URL
    const url = formatUrl(projectData.url);
    
    // 构造项目对象 - 普通用户提交的项目默认为未验证状态
    const project = {
      id: projectId,
      name: projectData.name,
      slug: slug,
      description: projectData.description,
      url: url,
      category: projectData.category || '',
      keywords: projectData.keywords || '',
      meta_description: projectData.meta_description || projectData.description.substring(0, 160),
      logo: projectData.logo || '',
      image: projectData.image || '',
      gradient: projectData.gradient || '',
      features: projectData.features || null,
      instructions: projectData.instructions || '',
      stats: projectData.stats || null,
      verified: false, // 普通用户提交的项目默认为未验证状态，需要管理员审核
      stars: 0,
      clicks: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // 插入项目数据
    const { error } = await supabaseAdmin.from('projects').insert(project);
    
    if (error) {
      console.error("保存项目失败:", error);
      
      // 检查是否为唯一约束错误（slug重复）
      if (error.code === '23505' && error.message.includes('slug')) {
        return NextResponse.json({
          success: false,
          message: "项目标题已存在，请使用不同的标题"
        }, { status: 409 });
      }
      
      return NextResponse.json({
        success: false,
        message: `保存项目失败: ${error.message}`
      }, { status: 500 });
    }
    
    console.log(`项目 ${projectData.name} (ID: ${projectId}) 已成功提交，等待审核`);
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: "项目已成功提交，等待审核",
      project: {
        id: projectId,
        name: projectData.name,
        slug: slug
      }
    }, { status: 200 });
  } catch (error) {
    console.error("提交处理失败:", error);
    return NextResponse.json({ error: "提交失败，请稍后重试" }, { status: 500 });
  } finally {
    console.log("=== SUBMIT API COMPLETED ===");
  }
} 