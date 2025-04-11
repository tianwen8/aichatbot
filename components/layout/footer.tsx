export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <img src="/logomark.svg" alt="AI Chat Directory" className="h-8" />
            <p className="text-sm text-gray-500">
              Discover the best AI characters, chat tools, and virtual companions.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" className="text-gray-400 hover:text-purple-600">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="/category/ai-roles" className="text-sm text-gray-600 hover:text-purple-600">AI Roles</a>
              </li>
              <li>
                <a href="/category/ai-chat" className="text-sm text-gray-600 hover:text-purple-600">AI Chat</a>
              </li>
              <li>
                <a href="/category/ai-tools" className="text-sm text-gray-600 hover:text-purple-600">AI Tools</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="/submit" className="text-sm text-gray-600 hover:text-purple-600">Submit AI Tool</a>
              </li>
              <li>
                <a href="/trending" className="text-sm text-gray-600 hover:text-purple-600">Trending</a>
              </li>
              <li>
                <a href="/projects" className="text-sm text-gray-600 hover:text-purple-600">All Tools</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="/terms" className="text-sm text-gray-600 hover:text-purple-600">Terms</a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-gray-600 hover:text-purple-600">Privacy</a>
              </li>
              <li>
                <a href="/cookies" className="text-sm text-gray-600 hover:text-purple-600">Cookies</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} AI Character Chat Directory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
