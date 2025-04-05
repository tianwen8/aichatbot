import { Project } from "./supabase-db";
import Typesense from "typesense";
import { SearchResponseHit } from "typesense/lib/Typesense/Documents";

export type ProjectHit = SearchResponseHit<
  Pick<Project, "id" | "name" | "description" | "slug" | "logo">
>;

const typesense = ({ client }: { client?: boolean } = {}) => {
  try {
    const apiKey = client
      ? process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY
      : process.env.TYPESENSE_API_KEY;
      
    const typesenseUrl = process.env.NEXT_PUBLIC_TYPESENSE_URL;
    
    // 如果没有配置Typesense，返回一个哑客户端避免错误
    if (!apiKey || !typesenseUrl) {
      console.warn('Typesense未配置，搜索功能可能不可用');
      return createDummyClient();
    }
    
    return new Typesense.Client({
      apiKey,
      nodes: [
        {
          url: typesenseUrl,
        },
      ],
      connectionTimeoutSeconds: 2, // 减少超时时间
      retryIntervalSeconds: 0.1,
    });
  } catch (error) {
    console.error('创建Typesense客户端失败:', error);
    return createDummyClient();
  }
};

// 创建一个假的Typesense客户端，用于在Typesense不可用时避免错误
function createDummyClient() {
  return {
    collections: function(name: string) {
      return {
        documents: function() {
          return {
            search: async () => ({
              hits: []
            }),
            create: async () => ({}),
            update: async () => ({}),
            delete: async () => ({})
          };
        }
      };
    }
  };
}

export default typesense;
