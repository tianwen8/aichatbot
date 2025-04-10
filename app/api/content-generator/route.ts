import { NextResponse } from "next/server";

// Function to simulate AI generation with a delay to mimic API response time
function simulateAIGeneration(prompt: string, type: 'keywords' | 'description' | 'features') {
  return new Promise<string>((resolve) => {
    // Add a random delay to make it feel like the AI is "thinking"
    const delay = Math.floor(Math.random() * 1000) + 500;
    setTimeout(() => {
      if (type === 'keywords') {
        resolve(generateKeywordsAdvanced(prompt));
      } else if (type === 'description') {
        resolve(generateDescription(prompt));
      } else {
        resolve(JSON.stringify(generateFeatureList(prompt)));
      }
    }, delay);
  });
}

// More sophisticated keyword generation that considers the prompt and category
function generateKeywordsAdvanced(prompt: string): string {
  const parts = prompt.split(',');
  const name = parts[0];
  const category = parts.length > 1 ? parts[1].trim() : '';
  
  // Base keywords that are common for AI tools
  const baseKeywords = ['AI', 'artificial intelligence', 'tool', 'assistant', 'chat', 'automation'];
  
  // Category-specific keywords
  const categoryKeywords: Record<string, string[]> = {
    'Writing': ['content creation', 'writing tool', 'copywriting', 'text generator', 'content assistant'],
    'Image': ['image generation', 'AI art', 'visual content', 'creative design', 'illustration'],
    'Voice': ['voice assistant', 'text to speech', 'audio generation', 'voice conversion', 'voice clone'],
    'Video': ['video creation', 'animation', 'video editing', 'AI video', 'visual effects'],
    'Code': ['coding assistant', 'developer tool', 'programming aid', 'code generation', 'AI programmer'],
    'Productivity': ['workflow automation', 'task management', 'efficiency tool', 'organization'],
    'Business': ['business automation', 'customer service', 'sales assistant', 'marketing tool'],
    'Education': ['learning assistant', 'tutor', 'study aid', 'educational tool', 'knowledge base'],
    'Entertainment': ['fun AI', 'games', 'entertainment bot', 'creative companion', 'AI friend'],
    'Other': ['utility', 'specialized AI', 'niche tool', 'custom assistant']
  };
  
  // Start with the tool name and add some base keywords
  let selectedKeywords = [name, ...baseKeywords];
  
  // Add category-specific keywords if a category was provided and exists in our map
  if (category && categoryKeywords[category]) {
    selectedKeywords = [...selectedKeywords, ...categoryKeywords[category]];
  }
  
  // Add some randomness to make different results for similar tools
  const extraKeywords = [
    'smart tool', 'digital assistant', 'virtual helper', 'online service',
    'productivity enhancer', 'time-saver', 'innovative solution', 'problem solver'
  ];
  
  // Add some random extras (2-4)
  const randomCount = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < randomCount; i++) {
    const randomIndex = Math.floor(Math.random() * extraKeywords.length);
    selectedKeywords.push(extraKeywords[randomIndex]);
    extraKeywords.splice(randomIndex, 1); // Remove so we don't pick it again
  }
  
  // Shuffle the keywords for variety
  selectedKeywords.sort(() => Math.random() - 0.5);
  
  // Return a comma-separated list
  return selectedKeywords.slice(0, 10).join(', ');
}

// Generate a description based on the provided prompt
function generateDescription(prompt: string): string {
  const parts = prompt.split(',');
  const name = parts[0];
  const category = parts.length > 1 ? parts[1].trim() : '';
  
  // Base templates to choose from
  const templates = [
    `{name} is an advanced AI-powered tool that {function}. Designed for {audience}, it offers a {adj} experience through its {feature}. Users will appreciate its {benefit} and {unique}.`,
    `Meet {name}, the cutting-edge AI solution for {problem}. With its {feature}, users can {action} more effectively. {name} stands out with its {unique} and delivers {benefit} for all {audience}.`,
    `{name} represents the next generation of {category} tools. Built with sophisticated AI technology, it {function} with remarkable {adj}. Ideal for {audience}, {name} provides {benefit} through its {feature}.`,
    `Looking for a powerful {category} assistant? {name} offers {benefit} through its innovative {feature}. This AI-powered solution helps users {action}, making it perfect for {audience} seeking {adj} results.`,
    `Transform your {domain} experience with {name}, an AI tool that {function}. Its {feature} enables {audience} to {action} with unprecedented {adj}. Enjoy {benefit} and {unique} that sets {name} apart.`
  ];
  
  // Category-specific descriptions
  const categorySpecs: Record<string, any> = {
    'Writing': {
      function: 'generates high-quality written content',
      problem: 'content creation and copywriting',
      action: 'create compelling written material',
      feature: 'advanced language understanding capabilities',
      domain: 'content creation'
    },
    'Image': {
      function: 'creates stunning visual content',
      problem: 'image generation and design',
      action: 'produce professional-grade imagery',
      feature: 'state-of-the-art visual processing algorithms',
      domain: 'visual design'
    },
    'Voice': {
      function: 'transforms text into natural-sounding speech',
      problem: 'audio content creation',
      action: 'generate realistic voice recordings',
      feature: 'human-like voice synthesis technology',
      domain: 'audio production'
    },
    'Video': {
      function: 'helps create and edit video content',
      problem: 'video production challenges',
      action: 'produce engaging video content',
      feature: 'intelligent scene recognition and editing tools',
      domain: 'video creation'
    },
    'Code': {
      function: 'assists with programming and development tasks',
      problem: 'coding efficiency and quality',
      action: 'write better code faster',
      feature: 'context-aware code generation capabilities',
      domain: 'software development'
    },
    'Productivity': {
      function: 'streamlines workflows and automates routine tasks',
      problem: 'daily productivity challenges',
      action: 'accomplish more in less time',
      feature: 'smart workflow optimization tools',
      domain: 'work'
    },
    'Business': {
      function: 'enhances business operations and customer interactions',
      problem: 'business process optimization',
      action: 'improve customer engagement and operational efficiency',
      feature: 'business-focused AI capabilities',
      domain: 'business'
    },
    'Education': {
      function: 'facilitates learning and knowledge acquisition',
      problem: 'educational support and tutoring',
      action: 'learn more effectively',
      feature: 'personalized educational guidance systems',
      domain: 'learning'
    },
    'Entertainment': {
      function: 'provides engaging and interactive experiences',
      problem: 'creating fun and engaging interactions',
      action: 'enjoy entertaining AI-powered experiences',
      feature: 'creative content generation abilities',
      domain: 'entertainment'
    },
    'Other': {
      function: 'offers specialized assistance for specific needs',
      problem: 'specialized tasks and challenges',
      action: 'achieve specific goals more efficiently',
      feature: 'customized AI functionalities',
      domain: 'specialized work'
    }
  };
  
  // General attributes that can apply to any tool
  const attributes = {
    adj: ['impressive', 'seamless', 'intuitive', 'efficient', 'reliable', 'powerful', 'innovative', 'user-friendly'],
    audience: ['professionals', 'creators', 'everyday users', 'businesses', 'students', 'developers', 'content producers', 'teams'],
    benefit: ['significant time savings', 'enhanced productivity', 'superior results', 'creative inspiration', 'streamlined workflows', 'reduced workload', 'greater accuracy'],
    unique: ['continuously improving AI capabilities', 'intuitive user interface', 'seamless integration with other tools', 'customizable features', 'cutting-edge technology']
  };
  
  // Select a random template
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Get category-specific attributes or use general ones for "Other" or missing categories
  const specs = category && categorySpecs[category] ? categorySpecs[category] : categorySpecs['Other'];
  
  // Build the description by replacing placeholders
  let description = template
    .replace('{name}', name)
    .replace('{category}', category || 'AI')
    .replace('{function}', specs.function)
    .replace('{problem}', specs.problem)
    .replace('{action}', specs.action)
    .replace('{feature}', specs.feature)
    .replace('{domain}', specs.domain)
    .replace('{adj}', attributes.adj[Math.floor(Math.random() * attributes.adj.length)])
    .replace('{audience}', attributes.audience[Math.floor(Math.random() * attributes.audience.length)])
    .replace('{benefit}', attributes.benefit[Math.floor(Math.random() * attributes.benefit.length)])
    .replace('{unique}', attributes.unique[Math.floor(Math.random() * attributes.unique.length)]);
  
  // Add some extra sentences for more detailed descriptions
  const extraSentences = [
    `Whether you're a beginner or expert, ${name} adapts to your skill level.`,
    `${name} is regularly updated with new features based on user feedback.`,
    `With its intuitive interface, getting started with ${name} takes just minutes.`,
    `Thousands of users already rely on ${name} for their daily ${specs.domain} needs.`,
    `${name} integrates seamlessly with popular tools in the ${category || 'AI'} space.`,
    `Security and privacy are priorities, with ${name} implementing robust data protection measures.`,
    `The team behind ${name} is dedicated to providing exceptional customer support.`,
    `Try ${name} today and join the community of satisfied users experiencing the future of ${specs.domain}.`
  ];
  
  // Add 2-3 random extra sentences
  const extraCount = Math.floor(Math.random() * 2) + 2;
  const selectedExtras = [];
  for (let i = 0; i < extraCount; i++) {
    const idx = Math.floor(Math.random() * extraSentences.length);
    selectedExtras.push(extraSentences[idx]);
    extraSentences.splice(idx, 1); // Remove to avoid duplication
  }
  
  description += ' ' + selectedExtras.join(' ');
  return description;
}

// Generate a list of features for an AI tool
function generateFeatureList(prompt: string): string[] {
  const parts = prompt.split(',');
  const name = parts[0];
  const category = parts.length > 1 ? parts[1].trim() : '';
  
  // Common features across all AI tools
  const commonFeatures = [
    'User-friendly interface',
    'Cloud-based functionality',
    'Regular updates and improvements',
    'Cross-platform compatibility',
    'API access for developers',
    'Custom settings and preferences',
    'Detailed documentation and tutorials'
  ];
  
  // Category-specific features
  const categoryFeatures: Record<string, string[]> = {
    'Writing': [
      'Advanced grammar and style checking',
      'Multiple writing styles and tones',
      'Plagiarism detection',
      'SEO optimization suggestions',
      'Content templates for various purposes',
      'Multi-language support',
      'Export to multiple formats'
    ],
    'Image': [
      'High-resolution image generation',
      'Custom style controls',
      'Batch processing capabilities',
      'Image editing and enhancement',
      'Various artistic style options',
      'Background removal and replacement',
      'Prompt library for inspiration'
    ],
    'Voice': [
      'Multiple voice options and accents',
      'Emotional tone adjustment',
      'Real-time voice conversion',
      'Audio quality enhancement',
      'Customizable speech patterns',
      'Background noise reduction',
      'Voice cloning capabilities'
    ],
    'Video': [
      'AI-powered video editing',
      'Scene detection and segmentation',
      'Special effects library',
      'Automatic captioning',
      'Green screen removal',
      'Motion tracking',
      'Style transfer between videos'
    ],
    'Code': [
      'Multi-language code support',
      'Code completion and suggestions',
      'Bug detection and fixes',
      'Performance optimization hints',
      'Code refactoring assistance',
      'Documentation generation',
      'Git integration'
    ],
    'Productivity': [
      'Task prioritization',
      'Automated scheduling',
      'Email response suggestions',
      'Document summarization',
      'Meeting transcription and notes',
      'Time tracking features',
      'Integration with popular productivity tools'
    ],
    'Business': [
      'Customer interaction analytics',
      'Sales forecasting',
      'Automated customer support',
      'Invoice and document processing',
      'Market trend analysis',
      'Business report generation',
      'CRM integration'
    ],
    'Education': [
      'Personalized learning paths',
      'Progress tracking and analytics',
      'Interactive quizzes and exercises',
      'Subject-specific tutoring',
      'Study material generation',
      'Flashcard creation',
      'Learning schedule optimization'
    ],
    'Entertainment': [
      'Interactive storytelling',
      'Personalized content recommendations',
      'Character and scenario generation',
      'Game assistance and strategies',
      'Creative prompt suggestions',
      'Collaborative creation tools',
      'Voice-controlled interactions'
    ],
    'Other': [
      'Customizable workflows',
      'Data analysis capabilities',
      'Personalization options',
      'Export and sharing features',
      'Collaborative tools',
      'Offline functionality',
      'Premium support options'
    ]
  };
  
  // Select 4-5 common features
  const selectedCommon = commonFeatures.sort(() => Math.random() - 0.5).slice(0, 4 + Math.floor(Math.random() * 2));
  
  // Select 5-6 category-specific features
  const specificFeatures = category && categoryFeatures[category] 
    ? categoryFeatures[category] 
    : categoryFeatures['Other'];
  
  const selectedSpecific = specificFeatures.sort(() => Math.random() - 0.5).slice(0, 5 + Math.floor(Math.random() * 2));
  
  // Combine and return all features
  return [...selectedCommon, ...selectedSpecific];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, url } = body;
    
    if (!title) {
      return NextResponse.json(
        { success: false, message: "Title is required" },
        { status: 400 }
      );
    }
    
    console.log(`Generating content for ${title}, category: ${category || 'unknown'}`);
    
    // Use simulated AI to generate keywords
    const keywordsPrompt = `${title},${category}`;
    const keywords = await simulateAIGeneration(keywordsPrompt, 'keywords');
    
    // Use simulated AI to generate descriptions of different lengths
    const descPrompt = `${title},${category}`;
    const description = await simulateAIGeneration(descPrompt, 'description');
    
    // Use short and medium descriptions as alternatives
    const shortDescription = description.substring(0, 80) + '...';
    const mediumDescription = description.length > 150 
      ? description.substring(0, 150) + '...'
      : description;
    
    // Use simulated AI to generate feature list
    const featuresPrompt = `${title},${category}`;
    const featuresJson = await simulateAIGeneration(featuresPrompt, 'features');
    const features = JSON.parse(featuresJson);
    
    // Generate SEO suggestions
    const seoScore = Math.floor(Math.random() * 30) + 70; // Between 70-100
    const seoSuggestions = [];
    
    if (keywords.split(',').length < 5) {
      seoSuggestions.push("Add more keywords to improve search visibility");
    }
    
    if (description.length < 100) {
      seoSuggestions.push("Expand the description to include more relevant information and keywords");
    }
    
    if (!category) {
      seoSuggestions.push("Select a category to help with classification and discovery");
    }
    
    // Return the generated content
    return NextResponse.json({
      success: true,
      data: {
        keywords,
        descriptions: {
          short: shortDescription,
          medium: mediumDescription,
          long: description
        },
        features,
        suggestions: {
          title: `${title} - Professional AI Chat Assistant`,
          seoScore,
          improvements: seoSuggestions
        }
      }
    });
    
  } catch (error: any) {
    console.error("Content generation failed:", error);
    return NextResponse.json(
      { success: false, message: "Content generation service error: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
} 