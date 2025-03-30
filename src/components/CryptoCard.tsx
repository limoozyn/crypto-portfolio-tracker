'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Cryptocurrency } from '../services/cryptoService';

interface CryptoCardProps {
  crypto: Cryptocurrency;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto }) => {
  const priceChangeColor = crypto.price_change_percentage_24h >= 0 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';
  
  return (
    <Link href={`/crypto/${crypto.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 cursor-pointer">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 relative mr-4">
            {crypto.image && (
              <Image 
                src={crypto.image} 
                alt={crypto.name} 
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {crypto.name} ({crypto.symbol.toUpperCase()})
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Rank #{crypto.market_cap_rank}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              ${crypto.current_price.toLocaleString()}
            </p>
            <p className={`text-sm ${priceChangeColor}`}>
              {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CryptoCard;