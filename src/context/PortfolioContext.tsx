'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CryptoDetail } from '../services/cryptoService';

export interface PortfolioItem {
  coin: CryptoDetail;
  quantity: number;
}

interface PortfolioState {
  items: PortfolioItem[];
}

type PortfolioAction =
  | { type: 'ADD_COIN'; payload: { coin: CryptoDetail; quantity: number } }
  | { type: 'REMOVE_COIN'; payload: { coinId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { coinId: string; quantity: number } };

interface PortfolioContextType {
  portfolio: PortfolioState;
  addCoin: (coin: CryptoDetail, quantity: number) => void;
  removeCoin: (coinId: string) => void;
  updateQuantity: (coinId: string, quantity: number) => void;
  getTotalValue: () => number;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const portfolioReducer = (state: PortfolioState, action: PortfolioAction): PortfolioState => {
  switch (action.type) {
    case 'ADD_COIN': {
      const { coin, quantity } = action.payload;
      const existingItem = state.items.find(item => item.coin.id === coin.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item => 
            item.coin.id === coin.id 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { coin, quantity }]
      };
    }
    
    case 'REMOVE_COIN':
      return {
        ...state,
        items: state.items.filter(item => item.coin.id !== action.payload.coinId)
      };
      
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => 
          item.coin.id === action.payload.coinId 
            ? { ...item, quantity: action.payload.quantity } 
            : item
        )
      };
      
    default:
      return state;
  }
};

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portfolio, dispatch] = useReducer(portfolioReducer, { items: [] }, () => {
    if (typeof window !== 'undefined') {
      const savedPortfolio = localStorage.getItem('cryptoPortfolio');
      return savedPortfolio ? JSON.parse(savedPortfolio) : { items: [] };
    }
    return { items: [] };
  });
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cryptoPortfolio', JSON.stringify(portfolio));
    }
  }, [portfolio]);
  
  const addCoin = (coin: CryptoDetail, quantity: number) => {
    dispatch({ type: 'ADD_COIN', payload: { coin, quantity } });
  };
  
  const removeCoin = (coinId: string) => {
    dispatch({ type: 'REMOVE_COIN', payload: { coinId } });
  };
  
  const updateQuantity = (coinId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { coinId, quantity } });
  };
  
  const getTotalValue = () => {
    return portfolio.items.reduce((total, item) => {
      return total + (item.coin.market_data.current_price.usd * item.quantity);
    }, 0);
  };
  
  return (
    <PortfolioContext.Provider value={{ portfolio, addCoin, removeCoin, updateQuantity, getTotalValue }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};