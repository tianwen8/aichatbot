// Seed script for adding test data
const { createClient } = require('@supabase/supabase-js');

// 初始化Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 测试数据
const testProjects = [
  {
    id: 'char-1',
    name: 'TestCharacter 1',
    slug: 'test-character-1',
    verified: true,
    description: 'A test AI character for directory testing',
    logo: 'https://placehold.co/400x400?text=Character1',
    category: 'character',
    features: ['roleplaying', 'conversation', 'character'],
    gradient: 'from-pink-100 via-rose-50 to-red-100',
    stars: 120,
    clicks: 500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'char-2',
    name: 'TestCharacter 2',
    slug: 'test-character-2',
    verified: true,
    description: 'Another test AI character for directory testing',
    logo: 'https://placehold.co/400x400?text=Character2',
    category: 'character',
    features: ['companion', 'conversation', 'character'],
    gradient: 'from-pink-100 via-rose-50 to-red-100',
    stars: 85,
    clicks: 320,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'chat-1',
    name: 'TestChat 1',
    slug: 'test-chat-1',
    verified: true,
    description: 'A test AI chat tool for directory testing',
    logo: 'https://placehold.co/400x400?text=Chat1',
    category: 'chat',
    features: ['conversation', 'assistant', 'chat'],
    gradient: 'from-blue-100 via-cyan-50 to-sky-100',
    stars: 150,
    clicks: 700,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'chat-2',
    name: 'TestChat 2',
    slug: 'test-chat-2',
    verified: true,
    description: 'Another test AI chat tool for directory testing',
    logo: 'https://placehold.co/400x400?text=Chat2',
    category: 'chat',
    features: ['language model', 'conversation', 'chat'],
    gradient: 'from-blue-100 via-cyan-50 to-sky-100',
    stars: 95,
    clicks: 420,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tool-1',
    name: 'TestTool 1',
    slug: 'test-tool-1',
    verified: true,
    description: 'A test AI tool for directory testing',
    logo: 'https://placehold.co/400x400?text=Tool1',
    category: 'tool',
    features: ['productivity', 'automation', 'tool'],
    gradient: 'from-green-100 via-lime-50 to-emerald-100',
    stars: 180,
    clicks: 820,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tool-2',
    name: 'TestTool 2',
    slug: 'test-tool-2',
    verified: true,
    description: 'Another test AI tool for directory testing',
    logo: 'https://placehold.co/400x400?text=Tool2',
    category: 'tool',
    features: ['data analysis', 'visualization', 'tool'],
    gradient: 'from-green-100 via-lime-50 to-emerald-100',
    stars: 110,
    clicks: 560,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// 插入测试数据
async function seedTestData() {
  try {
    console.log('开始插入测试数据...');
    
    // 插入项目数据
    const { data, error } = await supabase
      .from('projects')
      .upsert(testProjects, { onConflict: 'id' }); // 使用upsert避免重复插入
    
    if (error) {
      console.error('插入测试数据失败:', error);
      return;
    }
    
    console.log('测试数据插入成功!');
    console.log('插入的项目:', testProjects.map(p => p.name));
  } catch (error) {
    console.error('插入测试数据出错:', error);
  }
}

// 执行数据填充
seedTestData(); 