import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

async function setupStorage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('错误: 缺少Supabase环境变量');
    process.exit(1);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // 创建网站数据存储桶
    const { data: bucketData, error: bucketError } = await supabase.storage.createBucket(
      'website-data',
      {
        public: true, // 允许公共访问
        fileSizeLimit: 5242880, // 5MB限制
      }
    );

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('存储桶 website-data 已存在');
      } else {
        throw bucketError;
      }
    } else {
      console.log('成功创建存储桶 website-data');
    }

    // 创建子文件夹
    const folders = ['screenshots', 'favicons'];
    for (const folder of folders) {
      // Supabase不直接支持创建文件夹，我们通过上传一个占位文件来创建
      const { error: folderError } = await supabase.storage
        .from('website-data')
        .upload(`${folder}/.placeholder`, new Uint8Array([]), {
          upsert: true,
        });

      if (folderError) {
        console.error(`创建文件夹 ${folder} 失败:`, folderError);
      } else {
        console.log(`成功创建文件夹 ${folder}`);
      }
    }

    // 设置存储桶权限
    const { error: policyError } = await supabase.storage.updateBucket(
      'website-data',
      { public: true }
    );

    if (policyError) {
      console.error('设置存储桶权限失败:', policyError);
    } else {
      console.log('成功设置存储桶公共访问权限');
    }

    console.log('存储桶设置完成');
  } catch (error) {
    console.error('设置存储桶时出错:', error);
    process.exit(1);
  }
}

setupStorage().catch(console.error); 