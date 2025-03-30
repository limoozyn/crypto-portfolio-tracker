import { Suspense } from 'react';
import { getTopCryptocurrencies } from '@/services/cryptoService';
import CryptoList from './CryptoList';

export const metadata = {
  title: 'Cryptocurrency Tracker - Top Coins',
};

export default async function Home() {
  // Fetch initial data on the server
  const initialCryptos = await getTopCryptocurrencies(1, 20);
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Cryptocurrency Market
      </h1>
      
      <Suspense fallback={<CryptoListSkeleton />}>
        <CryptoList initialCryptos={initialCryptos} />
      </Suspense>
    </div>
  );
}

// Loading skeleton component
function CryptoListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse">
          <div className="flex items-center">
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10 mr-4"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="text-right">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
