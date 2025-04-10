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
    
    // Verify session in database - 修改为字符串类型比较
    const { data: session, error } = await supabaseAdmin
      .from('admin_sessions')
      .select('*')
      .eq('id', sessionId)
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
  console.log("=== SUBMIT API CALLED ===");
  console.log("Time:", new Date().toISOString());
  
  // Set CORS headers for developer clarity
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  // Handle preflight request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 204,
      headers: headers
    });
  }
  
  try {
    console.log("Received project submission request...");
    
    // Check if user is admin first
    const isAdminUser = await isAdmin();
    console.log("Submission by admin:", isAdminUser);
    
    // Ensure projects table exists
    console.log("Ensuring database table exists...");
    await ensureProjectsTable();
    
    console.log("Parsing request data...");
    let data;
    
    try {
      // Get raw request body first
      const requestText = await request.text();
      console.log("Raw request body:", requestText.substring(0, 500) + (requestText.length > 500 ? '...' : ''));
      
      // Check if request body is empty
      if (!requestText.trim()) {
        console.error("Empty request body received");
        return NextResponse.json(
          { 
            success: false, 
            message: "Empty request body"
          },
          { status: 400, headers }
        );
      }
      
      // Then parse it
      try {
        data = JSON.parse(requestText);
        console.log("API received submission data:", JSON.stringify(data, null, 2));
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError);
        console.error("Problematic JSON:", requestText);
        return NextResponse.json(
          { 
            success: false, 
            message: "Invalid JSON format: " + (jsonError as Error).message,
            rawData: requestText.substring(0, 100)
          },
          { status: 400, headers }
        );
      }
    } catch (parseError) {
      console.error("Request processing error:", parseError);
      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to process request: " + (parseError as Error).message
        },
        { status: 400, headers }
      );
    }
    
    // Check if data is null or undefined
    if (!data) {
      console.error("Null or undefined data after parsing");
      return NextResponse.json(
        { 
          success: false, 
          message: "No data provided in request" 
        },
        { status: 400, headers }
      );
    }
    
    // Truncate meta_description if longer than 160 characters
    if (data.meta_description && data.meta_description.length > 160) {
      console.log("Meta description too long, truncating to 160 characters");
      data.meta_description = data.meta_description.substring(0, 157) + "...";
    }
    
    // Validate required fields
    console.log("Validating required fields...");
    const validationErrors = validateProjectData(data);
    if (validationErrors.length > 0) {
      console.error("Validation failed, errors:", validationErrors);
      return NextResponse.json(
        { 
          success: false, 
          message: "Validation failed", 
          errors: validationErrors 
        },
        { status: 400, headers }
      );
    }
    
    // Format URL
    console.log("Formatting URL...");
    const validUrl = formatUrl(data.url);
    
    // Generate unique slug
    console.log("Generating unique slug...");
    const slug = generateUniqueSlug(data.name);
    
    // Prepare project data - remove fields that might cause issues
    console.log("Preparing project data...");
    
    // Validate and prepare features
    let features = [];
    if (data.features) {
      if (Array.isArray(data.features)) {
        features = data.features;
      } else if (typeof data.features === 'string') {
        try {
          features = JSON.parse(data.features);
        } catch (e) {
          console.warn("Failed to parse features string, using empty array", e);
        }
      } else {
        console.warn("Features is not an array or string, using empty array");
      }
    }
    console.log("Features processed:", JSON.stringify(features));
    
    // Validate and prepare stats
    let stats = {};
    if (data.stats) {
      if (typeof data.stats === 'object' && data.stats !== null) {
        stats = data.stats;
      } else if (typeof data.stats === 'string') {
        try {
          stats = JSON.parse(data.stats);
        } catch (e) {
          console.warn("Failed to parse stats string, using empty object", e);
        }
      } else {
        console.warn("Stats is not an object or string, using empty object");
      }
    }
    console.log("Stats processed:", JSON.stringify(stats));
    
    // Ensure valid category
    let category = data.category || "ai-tool";
    // Validate that the category is valid, only accept a few categories
    const validCategories = ["ai-character", "ai-chat", "ai-tool"];
    if (!validCategories.includes(category)) {
      console.log(`Invalid category "${category}", defaulting to "ai-tool"`);
      category = "ai-tool";
    }
    console.log("Category set to:", category);
    
    const projectId = uuidv4();
    const projectData = {
      id: projectId,
      name: data.name,
      slug: slug,
      description: data.description,
      url: validUrl,
      category: category,
      logo: data.logo || null,
      image: data.image || null,
      keywords: data.keywords || null,
      meta_description: data.meta_description || null,
      features: features,
      instructions: data.instructions || null,
      stats: stats,
      verified: isAdminUser, // 如果是管理员提交，直接设置为已验证
      stars: 0,
      clicks: 0,
      gradient: data.gradient || "from-purple-100 via-violet-50 to-blue-100",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log("Data being written to database:", JSON.stringify(projectData, null, 2));
    
    try {
      // First check the table structure
      console.log("Getting database table structure...");
      const { data: columns, error: columnsError } = await supabaseAdmin.rpc('list_columns', {
        table_name: 'projects'
      });
      
      if (columnsError) {
        console.error("Failed to get table structure:", columnsError);
      } else {
        console.log("Table column names:", columns.map((col: any) => col.column_name).join(', '));
      }
      
      // Insert data into projects table
      console.log("Starting to insert data into projects table...");
      console.log("Insert data ID:", projectId);
      
      const { data: insertedData, error } = await supabaseAdmin
        .from("projects")
        .insert([projectData])
        .select();
      
      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json(
          { 
            success: false, 
            message: "Database write failed: " + error.message,
            error: error
          },
          { status: 500, headers }
        );
      }
      
      console.log("Project submission successful, ID:", projectId);
      console.log("Inserted data:", insertedData ? JSON.stringify(insertedData) : "No data returned");
      
      // Return success response with needsApproval flag
      return NextResponse.json({
        success: true,
        message: isAdminUser ? "Project published successfully" : "Website submitted successfully and is pending approval",
        data: {
          slug: projectData.slug,
          id: projectData.id,
          needsApproval: !isAdminUser
        }
      }, { 
        status: 200,
        headers 
      });
    } catch (dbError: any) {
      console.error("Database operation error:", dbError);
      console.error("Error stack:", dbError.stack);
      return NextResponse.json(
        { 
          success: false, 
          message: "Database operation error: " + (dbError.message || "Unknown database error"),
          error: dbError
        },
        { status: 500, headers }
      );
    }
    
  } catch (error: any) {
    console.error("Error processing submission request:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error: " + (error.message || "Unknown error") 
      },
      { status: 500, headers }
    );
  } finally {
    console.log("=== SUBMIT API COMPLETED ===");
  }
} 