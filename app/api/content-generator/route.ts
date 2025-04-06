import { NextResponse } from "next/server";

// 辅助函数：根据网站类型生成更详细的关键词
function generateKeywords(category: string, title: string): string[] {
  const baseKeywords = ["AI聊天", "人工智能", "聊天机器人", "AI助手"];
  
  const categoryKeywords: Record<string, string[]> = {
    "roleplay": ["角色扮演", "虚拟角色", "AI角色", "角色创建", "情感陪伴", "虚拟伴侣"],
    "qa": ["问答助手", "AI答疑", "知识库", "智能问答", "信息检索", "学习助手"],
    "companion": ["AI伴侣", "情感支持", "虚拟朋友", "心理健康", "情感交流", "互动体验"],
    "writing": ["AI写作", "内容创作", "自动写作", "创意写作", "写作助手", "文本生成"],
    "multilingual": ["多语言支持", "语言翻译", "跨语言交流", "国际化AI", "全球聊天", "语言学习"],
    "llm": ["大型语言模型", "GPT", "BERT", "自然语言处理", "语义理解", "Claude", "LLaMA"]
  };
  
  // 获取网站类型的关键词
  const specificKeywords = categoryKeywords[category] || [];
  
  // 结合标题生成个性化关键词
  const titleWords = title.toLowerCase().split(' ');
  const titleRelatedKeywords = titleWords
    .filter(word => word.length > 3)
    .map(word => [`${word} AI`, `${word}助手`, `${word}聊天`])
    .flat();
  
  // 合并所有关键词并去重
  const allKeywords = [...baseKeywords, ...specificKeywords, ...titleRelatedKeywords];
  return Array.from(new Set(allKeywords));
}

// 生成SEO友好的描述
function generateDescriptions(title: string, category: string, keywords: string[]): {
  short: string;
  medium: string;
  long: string;
} {
  // 根据类别生成适当的动词和形容词
  const categoryAttributes: Record<string, {verbs: string[], adjectives: string[]}> = {
    "roleplay": {
      verbs: ["创建", "扮演", "体验", "互动"],
      adjectives: ["身临其境的", "个性化的", "互动式的", "富有想象力的"]
    },
    "qa": {
      verbs: ["解答", "学习", "获取", "查询"],
      adjectives: ["准确的", "专业的", "知识丰富的", "实用的"]
    },
    "companion": {
      verbs: ["交流", "陪伴", "分享", "倾诉"],
      adjectives: ["温暖的", "理解的", "支持性的", "贴心的"]
    },
    "writing": {
      verbs: ["创作", "生成", "编写", "构思"],
      adjectives: ["创意十足的", "高效的", "多样化的", "专业的"]
    },
    "multilingual": {
      verbs: ["交流", "翻译", "学习", "沟通"],
      adjectives: ["多语言的", "国际化的", "跨文化的", "全球性的"]
    },
    "llm": {
      verbs: ["处理", "生成", "理解", "分析"],
      adjectives: ["强大的", "先进的", "智能的", "灵活的"]
    }
  };
  
  const attrs = categoryAttributes[category] || {
    verbs: ["使用", "体验", "尝试", "探索"],
    adjectives: ["创新的", "智能的", "高效的", "实用的"]
  };
  
  // 随机选择动词和形容词
  const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const verb = getRandomItem(attrs.verbs);
  const adjective = getRandomItem(attrs.adjectives);
  
  // 随机选择关键词子集
  const shuffledKeywords = [...keywords].sort(() => 0.5 - Math.random());
  const randomKeywords = shuffledKeywords.slice(0, 3).join('、');
  
  // 生成不同长度的描述
  return {
    short: `${title}是一款${adjective}AI聊天工具，提供${randomKeywords}等功能。`,
    medium: `${title}是一款${adjective}AI聊天工具，让您能够${verb}各种智能对话场景。支持${randomKeywords}等多种功能，为用户提供丰富的AI互动体验。`,
    long: `${title}是一款领先的${adjective}AI聊天工具，专为需要${verb}高质量AI对话的用户设计。它提供包括${randomKeywords}在内的多种强大功能，让您的AI互动体验更加丰富和个性化。无论是日常聊天、学习辅助还是创意激发，${title}都能满足您的各种需求，成为您的智能助手。`
  };
}

// 生成功能列表建议
function generateFeatureSuggestions(category: string): string[] {
  const commonFeatures = [
    "自然流畅的对话能力",
    "个性化定制选项",
    "多平台支持",
    "数据隐私保护",
    "实时响应"
  ];
  
  const categoryFeatures: Record<string, string[]> = {
    "roleplay": [
      "详细的角色设定功能",
      "个性化的角色形象",
      "情感表达能力",
      "记忆上下文的长对话",
      "多样的角色库",
      "角色成长系统"
    ],
    "qa": [
      "精准的知识检索",
      "专业领域知识支持",
      "实时信息更新",
      "多来源信息验证",
      "复杂问题分解能力",
      "学习进度跟踪"
    ],
    "companion": [
      "情感理解与回应",
      "心理健康支持功能",
      "个性化陪伴体验",
      "日常提醒与建议",
      "情绪分析与回应",
      "长期记忆功能"
    ],
    "writing": [
      "多种文体风格生成",
      "内容改写与优化",
      "创意灵感提供",
      "语法与拼写检查",
      "多语言内容创作",
      "写作风格定制"
    ],
    "multilingual": [
      "实时语言翻译",
      "多语言无缝切换",
      "文化背景适应",
      "方言与口音支持",
      "语言学习辅助功能",
      "国际化表情符号支持"
    ],
    "llm": [
      "高级语义理解能力",
      "复杂指令处理",
      "上下文长记忆",
      "代码生成与解释",
      "内容摘要与扩展",
      "模型行为自定义"
    ]
  };
  
  // 获取类别特定的功能
  const specificFeatures = categoryFeatures[category] || [];
  
  // 随机选择共性功能和特定功能，组合成推荐列表
  const allFeatures = [...commonFeatures, ...specificFeatures];
  const shuffledFeatures = [...allFeatures].sort(() => 0.5 - Math.random());
  return shuffledFeatures.slice(0, 5);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, url } = body;
    
    if (!title) {
      return NextResponse.json(
        { success: false, message: "标题是必需的" },
        { status: 400 }
      );
    }
    
    // 生成关键词
    const keywords = generateKeywords(category || "general", title);
    
    // 生成描述文本
    const descriptions = generateDescriptions(title, category || "general", keywords);
    
    // 生成功能建议
    const features = generateFeatureSuggestions(category || "general");
    
    // 返回生成的内容
    return NextResponse.json({
      success: true,
      data: {
        keywords: keywords.join(", "),
        descriptions,
        features,
        suggestions: {
          title: `${title} - 专业的AI聊天助手`,
          seoScore: Math.floor(Math.random() * 30) + 70 // 模拟的SEO评分(70-100)
        }
      }
    });
    
  } catch (error) {
    console.error("内容生成失败:", error);
    return NextResponse.json(
      { success: false, message: "内容生成服务出错" },
      { status: 500 }
    );
  }
} 