import { Suspense } from 'react';
import PortfolioView from './PortfolioView';

export const metadata = {
  title: 'My Cryptocurrency Portfolio',
};

export default function PortfolioPage() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        My Portfolio
      </h1>
      
      <Suspense fallback={<PortfolioSkeleton />}>
        <PortfolioView />
      </Suspense>
    </div>
  );
}

function PortfolioSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-2"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
                <div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}