import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 创建客户端（使用匿名密钥，适用于前端）
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 创建管理员客户端（使用服务角色密钥，仅在服务器端安全环境使用）
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;

// 创建存储桶（如果不存在）
export async function createBucketIfNotExists(bucketName: string) {
  const { data, error } = await supabaseAdmin.storage.getBucket(bucketName);
  
  if (error && error.message.includes('does not exist')) {
    const { data, error } = await supabaseAdmin.storage.createBucket(bucketName, {
      public: true
    });
    
    if (error) {
      console.error(`Error creating bucket ${bucketName}:`, error);
    } else {
      console.log(`Created bucket: ${bucketName}`);
    }
  } else if (error) {
    console.error(`Error checking bucket ${bucketName}:`, error);
  }
} 