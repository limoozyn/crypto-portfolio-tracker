'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTopCryptocurrencies, Cryptocurrency } from '@/services/cryptoService';
import CryptoCard from '@/components/CryptoCard';

// Custom sorting options
type SortOption = 'rank' | 'name' | 'price' | 'priceChange';

interface CryptoListProps {
  initialCryptos: Cryptocurrency[];
}

export default function CryptoList({ initialCryptos }: CryptoListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rank');
  const [page, setPage] = useState(1);
  
  // Fetch data with React Query (client-side)
  const { data: cryptos = initialCryptos, isLoading, isError } = useQuery({
    queryKey: ['cryptocurrencies', page],
    queryFn: () => getTopCryptocurrencies(page, 20),
    initialData: initialCryptos,
    placeholderData: (previousData) => previousData,
  });

  // Function to handle sorting
  const sortCryptos = (cryptoList: Cryptocurrency[]) => {
    if (!cryptoList) return [];
    
    return [...cryptoList].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.current_price - a.current_price;
        case 'priceChange':
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        case 'rank':
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });
  };
  
  // Function to filter cryptos by search term
  const filterCryptos = (cryptoList: Cryptocurrency[]) => {
    if (!cryptoList) return [];
    if (!searchTerm.trim()) return cryptoList;
    
    const term = searchTerm.toLowerCase();
    return cryptoList.filter(
      crypto => 
        crypto.name.toLowerCase().includes(term) || 
        crypto.symbol.toLowerCase().includes(term)
    );
  };
  
  // Get sorted and filtered crypto list
  const sortedAndFilteredCryptos = sortCryptos(filterCryptos(cryptos || []));
  
  // Load more cryptos
  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };
  
  // Don't show load more button when searching
  const showLoadMore = !searchTerm && sortedAndFilteredCryptos.length >= 20;
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search coins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="flex items-center">
          <label className="mr-2 text-gray-700 dark:text-gray-300">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-light focus:border-primary"
          >
            <option value="rank">Market Cap Rank</option>
            <option value="name">Name</option>
            <option value="price">Price (High to Low)</option>
            <option value="priceChange">Price Change (24h)</option>
          </select>
        </div>
      </div>
      
      {isLoading && !cryptos && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      
      {isError && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Failed to load cryptocurrency data. Please try again later.</span>
        </div>
      )}
      
      {sortedAndFilteredCryptos.length === 0 && !isLoading && (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-300">No cryptocurrencies found matching your search.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAndFilteredCryptos.map(crypto => (
          <CryptoCard key={crypto.id} crypto={crypto} />
        ))}
      </div>
      
      {showLoadMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors duration-300"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}