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

// 创建存储桶并设置公共访问权限的辅助函数
export async function createBucketIfNotExists(bucketName: string) {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  
  if (!buckets?.find(bucket => bucket.name === bucketName)) {
    const { error } = await supabaseAdmin.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 1024 * 1024 * 2, // 2MB限制
    });
    
    if (error) {
      console.error(`Error creating bucket ${bucketName}:`, error);
    }
  }
} 