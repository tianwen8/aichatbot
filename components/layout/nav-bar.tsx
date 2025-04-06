"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@dub/utils";
import { Menu, X, MessageSquare, Search, TrendingUp, Grid3x3, Star } from "lucide-react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.jpeg"
                alt="AI Character Chat Directory"
                width={32}
                height={32}
                className="mr-2 rounded-md"
              />
              <span className="font-bold text-indigo-600 text-xl">AIChat<span className="text-gray-700">Directory</span></span>
            </Link>
            <div className="hidden ml-8 md:flex md:space-x-1">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-md"
              >
                Home
              </Link>
              <div className="relative group">
                <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-md flex items-center">
                  <Grid3x3 className="mr-1 h-4 w-4" />
                  Categories
                </button>
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2 grid grid-cols-2 gap-1">
                    <Link href="/categories/roleplay" className="px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                      Roleplay
                    </Link>
                    <Link href="/categories/companions" className="px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                      AI Companions
                    </Link>
                    <Link href="/categories/platforms" className="px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                      AI Platforms
                    </Link>
                    <Link href="/categories/tools" className="px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                      Chat Tools
                    </Link>
                    <Link href="/categories/free" className="px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                      Free Tools
                    </Link>
                    <Link href="/categories/paid" className="px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                      Premium
                    </Link>
                  </div>
                </div>
              </div>
              <Link
                href="/rankings"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-md flex items-center"
              >
                <TrendingUp className="mr-1 h-4 w-4" />
                Rankings
              </Link>
              <Link
                href="/new"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-md flex items-center"
              >
                <Star className="mr-1 h-4 w-4" />
                New & Trending
              </Link>
              <Link
                href="/blog"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-md"
              >
                Blog
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full py-1.5 pl-10 pr-3 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search AI tools..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Link
              href="/submit"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Submit Website
            </Link>
          </div>
          
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", isMenuOpen ? "block" : "hidden")}>
        <div className="pt-2 pb-3 space-y-1">
          <div className="px-4 py-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search AI tools..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
          <Link
            href="/"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            href="/categories"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Categories
          </Link>
          <Link
            href="/rankings"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Rankings
          </Link>
          <Link
            href="/new"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            New & Trending
          </Link>
          <Link
            href="/blog"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Blog
          </Link>
          <Link
            href="/submit"
            className="block px-4 py-2 text-base font-medium text-indigo-600 hover:bg-gray-100"
          >
            Submit Website
          </Link>
        </div>
      </div>
      
      {/* Optional: Featured banner */}
      <div className="bg-indigo-600 py-1 text-center text-xs text-white">
        <span className="font-medium">New:</span> Discover the best AI character chat platforms of 2025
      </div>
    </nav>
  );
};

export default NavBar; 