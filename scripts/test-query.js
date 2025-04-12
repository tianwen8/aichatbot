// 测试Supabase查询脚本
const { createClient } = require('@supabase/supabase-js');

// Supabase配置 - 替换为您的实际配置
const supabaseUrl = 'https://wzlvjqzfvatbeqoaykdr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bHZqcXpmdmF0YmVxb2F5a2RyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzgwMjE4MywiZXhwIjoyMDU5Mzc4MTgzfQ.n1x3ANnTVlWh5TagX1pF6i46L--GpvTwE_QbyPiJgNs';

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

// 映射关系
const categoryMap = {
  'ai-character': 'character',
  'ai-chat': 'chat',
  'ai-tools': 'tool'
};

// 测试不同的查询
async function testQueries() {
  console.log('开始测试Supabase查询...');
  
  // 1. 测试获取所有项目
  console.log('\n1. 获取所有已验证的项目:');
  const { data: allProjects, error: allError } = await supabase
    .from('projects')
    .select('*')
    .eq('verified', true);
    
  if (allError) {
    console.error('查询失败:', allError);
  } else {
    console.log(`找到 ${allProjects.length} 个项目`);
    if (allProjects.length > 0) {
      console.log('项目类别:', allProjects.map(p => p.category));
    }
  }
  
  // 2. 测试按照各类别获取项目
  for (const [pageCategory, dbCategory] of Object.entries(categoryMap)) {
    console.log(`\n2. 测试获取 ${pageCategory} (DB类别: ${dbCategory}) 的项目:`);
    
    const { data: categoryProjects, error: categoryError } = await supabase
      .from('projects')
      .select('*')
      .eq('verified', true)
      .eq('category', dbCategory);
      
    if (categoryError) {
      console.error(`查询 ${dbCategory} 失败:`, categoryError);
    } else {
      console.log(`找到 ${categoryProjects.length} 个 ${dbCategory} 类别的项目`);
      if (categoryProjects.length > 0) {
        console.log('项目:', categoryProjects.map(p => p.name));
      }
    }
  }
  
  // 3. 检查数据库中存在的所有类别
  console.log('\n3. 检查数据库中存在的所有类别:');
  const { data: categories, error: categoriesError } = await supabase
    .from('projects')
    .select('category')
    .eq('verified', true);
    
  if (categoriesError) {
    console.error('查询类别失败:', categoriesError);
  } else {
    const uniqueCategories = [...new Set(categories.map(item => item.category))];
    console.log('数据库中的类别:', uniqueCategories);
  }
}

// 执行测试
testQueries()
  .catch(error => console.error('执行测试时出错:', error))
  .finally(() => console.log('测试完成')); 