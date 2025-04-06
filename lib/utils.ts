import type { Metadata } from "next";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function constructMetadata({
  title = "OSS Gallery",
  description = "A collection of open-source projects built with Dub.",
  image = "https://oss.gallery/thumbnail.jpg",
}: {
  title?: string;
  description?: string;
  image?: string | null;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image && {
        images: [
          {
            url: image,
          },
        ],
      }),
    },
    twitter: {
      title,
      description,
      ...(image && {
        card: "summary_large_image",
        images: [image],
      }),
      creator: "@dubdotco",
    },
    metadataBase: new URL("https://oss.gallery"),
  };
}

export const getUrlWithRef = (url: string) => {
  const urlWithRef = new URL(url);
  urlWithRef.searchParams.set("ref", "ossgallery");

  return urlWithRef.toString();
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${path}`
}

// 将数字格式化为更友好的显示
export function formatNumber(num: number) {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

// 将日期转换为友好的字符串
export function formatDate(dateString: string | Date) {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString
  const now = new Date()
  const diff = (now.getTime() - date.getTime()) / 1000 // 差异（秒）
  
  // 小于1分钟
  if (diff < 60) {
    return "刚刚"
  }
  
  // 小于1小时
  if (diff < 3600) {
    const minutes = Math.floor(diff / 60)
    return `${minutes}分钟前`
  }
  
  // 小于1天
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600)
    return `${hours}小时前`
  }
  
  // 小于1月 (30天)
  if (diff < 2592000) {
    const days = Math.floor(diff / 86400)
    return `${days}天前`
  }
  
  // 小于1年
  if (diff < 31536000) {
    const months = Math.floor(diff / 2592000)
    return `${months}个月前`
  }
  
  // 大于1年
  const years = Math.floor(diff / 31536000)
  return `${years}年前`
}
