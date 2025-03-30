import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import { PortfolioProvider } from '@/context/PortfolioContext';
import MainNavigation from '@/components/MainNavigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cryptocurrency Portfolio Tracker',
  description: 'Track your cryptocurrency investments and market trends',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <ReactQueryProvider>
              <PortfolioProvider>
                <MainNavigation />
                
                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                  {children}
                </main>
                
                <footer className="bg-white dark:bg-gray-800 shadow-inner mt-auto">
                  <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 dark:text-gray-300 text-sm">
                      © {new Date().getFullYear()} CryptoTracker. All rights reserved.
                    </p>
                  </div>
                </footer>
              </PortfolioProvider>
            </ReactQueryProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}