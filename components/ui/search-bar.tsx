"use client";

import { supabase } from "@/lib/supabase";
import { cn } from "@dub/utils";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import { measure, measureAsync } from "@/lib/performance";

// 定义一个简单的搜索结果类型
interface SearchResult {
  id: string;
  name: string;
  description: string;
  slug: string;
  logo: string;
  category: string;
  verified: boolean;
}

// 简化的BlurImage组件
function BlurImage({
  src,
  alt,
  width,
  height,
  className,
  ...props
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("rounded-full", className)}
      {...props}
    />
  );
}

// 创建一个简单的Badge组件
function Badge({ children, variant, className = "" }) {
  const getVariantClass = () => {
    if (variant === "blue") {
      return "border-transparent bg-blue-500 text-white";
    }
    return "border-transparent bg-gray-200 text-gray-700";
  };
  
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getVariantClass()} ${className}`}>
      {children}
    </div>
  );
}

// 创建一个简单的Input组件
function Input({ className = "", ...props }) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function SearchBarPlaceholder() {
  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <div className="h-12 w-full animate-pulse rounded-md border border-gray-300 bg-gray-100 pl-10" />
      </div>
    </div>
  );
}

export default function SearchBar() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    if (q && q !== searchTerm) {
      setSearchTerm(q);
    }
  }, [q, searchTerm]);

  useEffect(() => {
    const search = async () => {
      if (!searchTerm) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // 使用性能监控包装搜索功能
        const searchResults = await measureAsync(
          `SearchBar-PerformSearch`,
          async () => {
            const { data, error } = await supabase
              .from('projects')
              .select('id, name, description, slug, logo, category, verified')
              .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
              .eq('verified', true)
              .order('clicks', { ascending: false })
              .limit(20);

            if (error) {
              console.error('搜索失败:', error);
              return [];
            }

            return data as SearchResult[];
          },
          { component: 'SearchBar', searchTerm }
        );
        
        setResults(searchResults);
      } catch (error) {
        console.error('搜索出错:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const delaySearch = setTimeout(() => {
      search();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const router = useRouter();

  // 高亮搜索结果中的匹配词
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    // 性能监控包装高亮功能
    return measure(
      `SearchBar-HighlightMatch`,
      () => {
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-100 rounded-sm px-0.5">$1</mark>');
      },
      { component: 'SearchBar' }
    );
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => {
            // 延迟关闭结果，允许用户点击结果
            setTimeout(() => setShowResults(false), 200);
          }}
          placeholder="搜索网站..."
          className="h-12 w-full rounded-md border border-gray-300 bg-white pl-10 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500"
        />
        {loading && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 animate-spin text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>

      {showResults && results && results.length > 0 && (
        <div className="absolute z-10 mt-2 max-h-96 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
          <div className="py-2">
            <p className="px-4 py-2 text-xs font-medium text-gray-500">
              搜索结果 ({results.length})
            </p>
            {results.map((item) => (
              <div
                key={item.id}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  router.push(`/projects/${item.slug}`);
                  setShowResults(false);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <BlurImage
                      src={item.logo}
                      alt={item.name}
                      width={30}
                      height={30}
                      className="h-10 w-10 rounded-full border border-gray-200 bg-white p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="truncate text-sm font-medium text-gray-900">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(item.name, searchTerm),
                          }}
                        />
                      </p>
                      {item.verified && (
                        <Badge variant="blue" className="h-4 px-1 text-[10px]">
                          已认证
                        </Badge>
                      )}
                    </div>
                    <p className="truncate text-xs text-gray-500">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(item.description, searchTerm),
                        }}
                      />
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(item.category, searchTerm),
                        }}
                      />
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
