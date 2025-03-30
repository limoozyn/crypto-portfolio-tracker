'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePortfolio } from '@/context/PortfolioContext';

export default function PortfolioView() {
  const { portfolio, removeCoin, updateQuantity, getTotalValue } = usePortfolio();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  
  const handleEditClick = (coinId: string, currentQuantity: number) => {
    setEditingId(coinId);
    setEditQuantity(currentQuantity);
  };
  
  const handleSaveEdit = (coinId: string) => {
    updateQuantity(coinId, editQuantity);
    setEditingId(null);
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
  };
  
  // Total portfolio value
  const totalValue = getTotalValue();
  
  // Calculate portfolio performance (simplified)
  const portfolioPerformance = portfolio.items.reduce((total, item) => {
    const change = item.coin.market_data.price_change_percentage_24h / 100;
    return total + (item.coin.market_data.current_price.usd * item.quantity * change);
  }, 0);
  
  const performancePercentage = totalValue > 0 
    ? (portfolioPerformance / (totalValue - portfolioPerformance)) * 100 
    : 0;
  
  const performanceColor = performancePercentage >= 0 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';
  
  // Empty state
  if (portfolio.items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your portfolio is empty
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Start tracking your crypto investments by adding coins to your portfolio.
        </p>
        <Link 
          href="/" 
          className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors duration-300"
        >
          Browse Cryptocurrencies
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Portfolio Summary
        </h2>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className={`text-lg ${performanceColor}`}>
          {performancePercentage >= 0 ? '+' : ''}
          {performancePercentage.toFixed(2)}% (24h)
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Assets
        </h2>
        
        <div className="space-y-4">
          {portfolio.items.map((item) => {
            const coinValue = item.coin.market_data.current_price.usd * item.quantity;
            const priceChangeColor = item.coin.market_data.price_change_percentage_24h >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400';
            
            return (
              <motion.div 
                key={item.coin.id}
                layout
                className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="h-10 w-10 relative mr-3">
                    {item.coin.image && (
                      <Image 
                        src={item.coin.image.small} 
                        alt={item.coin.name} 
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                  </div>
                  <div>
                    <Link href={`/crypto/${item.coin.id}`} className="font-medium text-gray-900 dark:text-white hover:underline">
                      {item.coin.name} ({item.coin.symbol.toUpperCase()})
                    </Link>
                    <p className={`text-sm ${priceChangeColor}`}>
                      {item.coin.market_data.price_change_percentage_24h >= 0 ? '+' : ''}
                      {item.coin.market_data.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center">
                  {editingId === item.coin.id ? (
                    <div className="flex items-center space-x-2 mb-2 sm:mb-0 sm:mr-4">
                      <input
                        type="number"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(Number(e.target.value))}
                        min="0"
                        step="0.01"
                        className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-light focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => handleSaveEdit(item.coin.id)}
                        className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center mb-2 sm:mb-0 sm:mr-4">
                      <span className="text-gray-600 dark:text-gray-300 mr-2">
                        {item.quantity} {item.coin.symbol.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleEditClick(item.coin.id, item.quantity)}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  <div className="flex justify-between sm:block">
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${coinValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ${item.coin.market_data.current_price.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per coin
                      </p>
                    </div>
                    <button
                      onClick={() => removeCoin(item.coin.id)}
                      className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2 sm:ml-4"
                      aria-label={`Remove ${item.coin.name} from portfolio`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}