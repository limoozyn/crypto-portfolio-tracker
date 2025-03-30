// src/components/MainNavigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const getHighlightClass = (isActive: boolean) => (
    isActive 
      ? 'border-primary-dark dark:border-primary-light text-gray-900 dark:text-white font-medium' 
      : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
)

export default function MainNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-dark dark:text-primary-light">
                CryptoTracker
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${getHighlightClass(pathname === '/')}`}
              >
                Cryptocurrencies
              </Link>
              <Link 
                href="/portfolio" 
                className={`inline-flex items-center px-1 pt-1 border-b-2  ${getHighlightClass(pathname === '/portfolio')}`}
              >
                My Portfolio
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}