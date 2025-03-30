import { Suspense } from 'react';
import { getCryptoDetails } from '@/services/cryptoService';
import CryptoDetailView from './CryptoDetailView';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const crypto = await getCryptoDetails(params.id);
  return {
    title: `${crypto.name} (${crypto.symbol.toUpperCase()}) - Details`,
  };
}

export default async function CryptoDetailPage({ params }: PageProps) {
  const cryptoData = await getCryptoDetails(params.id);
  
  return (
    <Suspense fallback={<CryptoDetailSkeleton />}>
      <CryptoDetailView initialData={cryptoData} />
    </Suspense>
  );
}

function CryptoDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
          <div className="md:ml-auto">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}