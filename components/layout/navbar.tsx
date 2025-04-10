"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menu, Search, X } from "lucide-react";
import { Session } from "@/lib/auth";

export default function NavBar({ 
  session, 
  stars 
}: { 
  session?: Session; 
  stars?: number 
}) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const navRef = useRef<HTMLDivElement>(null);
  const pathName = usePathname();

  // 处理滚动效果
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      if (scrollTop > 10) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 关闭菜单时处理点击外部
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuOpen]);

  // 导航项定义
  const navItems = [
    { name: "首页", href: "/" },
    { name: "分类", href: "/categories" },
    { name: "排行榜", href: "/rankings" },
    { name: "最新上线", href: "/new" },
    { name: "收藏夹", href: "/favorites" },
  ];

  return (
    <div
      ref={navRef}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        hasScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src="/logo.png"
                  alt="AI角色聊天导航"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <span className="hidden text-lg font-bold text-gray-900 sm:block">
                AI角色聊天导航
              </span>
            </Link>
          </div>

          {/* 桌面导航 */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathName === item.href
                      ? "bg-purple-50 text-purple-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* 搜索栏和提交按钮 */}
          <div className="hidden items-center gap-4 md:flex">
            <div
              className={cn(
                "relative flex w-64 items-center overflow-hidden rounded-full border transition-all",
                searchFocused
                  ? "border-purple-400 bg-white shadow-sm"
                  : "border-gray-200 bg-gray-50"
              )}
            >
              <Search
                className={cn(
                  "absolute left-3 h-4 w-4 transition-colors",
                  searchFocused ? "text-purple-500" : "text-gray-400"
                )}
              />
              <Input
                type="search"
                placeholder="搜索AI聊天工具..."
                className="border-none bg-transparent pl-10 shadow-none focus-visible:ring-0"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
            <Link href="/submit">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700">
                提交AI工具
              </Button>
            </Link>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="sr-only">打开主菜单</span>
              {menuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <div
        className={cn(
          "md:hidden",
          menuOpen ? "block" : "hidden"
        )}
      >
        <div className="space-y-1 px-4 pb-3 pt-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-2 text-base font-medium transition-colors",
                pathName === item.href
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-purple-600"
              )}
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-4 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="搜索AI聊天工具..."
                className="w-full border-gray-200 bg-gray-50 pl-10 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            <Link href="/submit" onClick={() => setMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700">
                提交AI工具
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
