import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';
const SESSION_EXPIRY = 24 * 60 * 60; // 24 hours (seconds)

// Create server-side Supabase client
function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

// Ensure admin_sessions table exists
async function ensureAdminSessionsTable() {
  try {
    console.log("Ensuring admin_sessions table exists...");
    const supabase = createServerClient();
    
    // Check if table exists first
    const { data, error: checkError } = await supabase
      .from('admin_sessions')
      .select('session_id')
      .limit(1)
      .maybeSingle();
    
    if (!checkError) {
      console.log("admin_sessions table already exists");
      return; // Table exists, no need to create
    }
    
    console.log("admin_sessions table doesn't exist, creating...");
    
    // Create the table using SQL
    const { error } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS admin_sessions (
          id SERIAL PRIMARY KEY,
          session_id TEXT NOT NULL UNIQUE,
          username TEXT NOT NULL,
          ip TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL
        );
      `
    });
    
    if (error) {
      console.error("Failed to create admin_sessions table with execute_sql:", error);
      
      // Try alternative approach
      const { error: directError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS admin_sessions (
            id SERIAL PRIMARY KEY,
            session_id TEXT NOT NULL UNIQUE,
            username TEXT NOT NULL,
            ip TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            expires_at TIMESTAMP WITH TIME ZONE NOT NULL
          );
        `
      });
      
      if (directError) {
        console.error("Failed to create admin_sessions table with exec_sql:", directError);
        throw new Error("Could not create admin_sessions table");
      }
    }
    
    // Ensure admin_logs table exists too
    await ensureAdminLogsTable();
    
    console.log("admin_sessions table created successfully");
  } catch (error) {
    console.error("Error ensuring admin_sessions table:", error);
    throw error;
  }
}

// Ensure admin_logs table exists
async function ensureAdminLogsTable() {
  try {
    console.log("Ensuring admin_logs table exists...");
    const supabase = createServerClient();
    
    // Check if table exists first
    const { data, error: checkError } = await supabase
      .from('admin_logs')
      .select('id')
      .limit(1)
      .maybeSingle();
    
    if (!checkError) {
      console.log("admin_logs table already exists");
      return; // Table exists, no need to create
    }
    
    console.log("admin_logs table doesn't exist, creating...");
    
    // Create the table using SQL
    const { error } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS admin_logs (
          id SERIAL PRIMARY KEY,
          action TEXT NOT NULL,
          username TEXT NOT NULL,
          success BOOLEAN NOT NULL,
          ip TEXT,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (error) {
      console.error("Failed to create admin_logs table with execute_sql:", error);
      
      // Try alternative approach
      const { error: directError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS admin_logs (
            id SERIAL PRIMARY KEY,
            action TEXT NOT NULL,
            username TEXT NOT NULL,
            success BOOLEAN NOT NULL,
            ip TEXT,
            timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (directError) {
        console.error("Failed to create admin_logs table with exec_sql:", directError);
      }
    }
    
    console.log("admin_logs table created successfully");
  } catch (error) {
    console.error("Error ensuring admin_logs table:", error);
  }
}

// Log admin activity
async function logAdminActivity(action: string, username: string, success: boolean, ip?: string) {
  try {
    const supabase = createServerClient();
    await supabase.from('admin_logs').insert({
      action,
      username,
      success,
      ip,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log admin activity:', error);
  }
}

// Generate session ID
function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Get request IP
function getClientIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for') || 'unknown';
}

// Set session cookie
function setSessionCookie(sessionId: string) {
  cookies().set('admin_session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_EXPIRY,
    path: '/',
  });
}

// Check if session is valid
async function isValidSession(request: NextRequest) {
  const sessionId = request.cookies.get('admin_session')?.value;
  if (!sessionId) return false;
  
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('admin_sessions')
    .select('*')
    .eq('session_id', sessionId)
    .single();
  
  if (error || !data) return false;
  
  // Check if session is expired
  const now = new Date();
  const expiryDate = new Date(data.expires_at);
  return now < expiryDate;
}

// Admin login
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const clientIp = getClientIp(request);
    
    // Validate credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      await logAdminActivity('login', username, false, clientIp);
      return NextResponse.json({ success: false, message: 'Incorrect username or password' }, { status: 401 });
    }
    
    // Ensure tables exist before using them
    await ensureAdminSessionsTable();
    
    // Create new session
    const sessionId = generateSessionId();
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + SESSION_EXPIRY);
    
    // Store session
    const supabase = createServerClient();
    const { error } = await supabase.from('admin_sessions').insert({
      session_id: sessionId,
      username,
      ip: clientIp,
      created_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    });
    
    if (error) {
      console.error('Failed to create session:', error);
      return NextResponse.json({ success: false, message: 'Failed to create session' }, { status: 500 });
    }
    
    // Set session cookie
    setSessionCookie(sessionId);
    
    // Log successful login
    await logAdminActivity('login', username, true, clientIp);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error during login process:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// Check current authentication status
export async function GET(request: NextRequest) {
  try {
    // Ensure tables exist before checking session
    await ensureAdminSessionsTable();
    
    const isAuthenticated = await isValidSession(request);
    return NextResponse.json({ authenticated: isAuthenticated });
  } catch (error) {
    console.error('Failed to check authentication status:', error);
    return NextResponse.json({ authenticated: false });
  }
}

// Admin logout
export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('admin_session')?.value;
    if (sessionId) {
      // Delete session from database
      const supabase = createServerClient();
      await supabase.from('admin_sessions').delete().eq('session_id', sessionId);
      
      // Clear cookie
      cookies().delete('admin_session');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ success: false, message: 'Logout failed' }, { status: 500 });
  }
} 