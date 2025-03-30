'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { CryptoDetail, getCryptoDetails } from '@/services/cryptoService';
import { usePortfolio } from '@/context/PortfolioContext';

interface CryptoDetailViewProps {
  initialData: CryptoDetail;
}

export default function CryptoDetailView({ initialData }: CryptoDetailViewProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  
  const { portfolio, addCoin } = usePortfolio();
  
  const id = initialData.id;
  
  const { data: crypto = initialData } = useQuery({
    queryKey: ['cryptoDetail', id],
    queryFn: () => getCryptoDetails(id),
    initialData: initialData,
    staleTime: 30000,
  });

  const isInPortfolio = portfolio.items.some(item => item.coin.id === id);
  
  const handleAddToPortfolio = () => {
    if (crypto && quantity > 0) {
      addCoin(crypto, quantity);
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 3000);
    }
  };
  
  const priceChangeColor = (crypto.price_change_percentage_24h || 0) >= 0
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400';
  
  const formattedMarketCap = crypto.market_cap
    ? `$${crypto.market_cap.toLocaleString()}`
    : 'Not available';
  
  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to List
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-16 w-16 relative mr-4">
              {crypto.image && (
                <Image
                  src={crypto.image.small}
                  alt={crypto.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Rank #{crypto.market_cap_rank}
              </p>
            </div>
          </div>
          
          <div className="md:ml-auto">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              ${crypto.current_price?.toLocaleString() || '0.00'}
            </div>
            <div className={`text-lg ${priceChangeColor}`}>
              {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
              {crypto.price_change_percentage_24h?.toFixed(2) || '0.00'}%
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Market Stats
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Market Cap</span>
                <span className="font-medium text-gray-900 dark:text-white">{formattedMarketCap}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">24h Trading Vol</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${crypto.market_data?.total_volume?.usd?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Circulating Supply</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {crypto.market_data?.circulating_supply?.toLocaleString() || '0'} {crypto.symbol?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Max Supply</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {crypto.market_data?.max_supply ? crypto.market_data?.max_supply.toLocaleString() : 'Unlimited'} {crypto.symbol?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Add to Portfolio
            </h2>
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={handleAddToPortfolio}
                className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors duration-300"
              >
                {isInPortfolio ? 'Update Portfolio' : 'Add to Portfolio'}
              </button>
            </div>
            
            <AnimatePresence>
              {showAddedMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-2 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded-lg text-center"
                >
                  {isInPortfolio 
                    ? 'Updated in your portfolio!' 
                    : 'Added to your portfolio!'}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="mt-6 text-gray-500 dark:text-gray-400 text-sm">
              Total Value: ${(crypto.current_price * quantity).toLocaleString()}
            </div>
          </div>
        </div>
        
        {crypto.description?.en && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              About {crypto.name}
            </h2>
            <div 
              className="prose dark:prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: crypto.description.en }}
            />
          </div>
        )}
      </div>
    </>
  );
}