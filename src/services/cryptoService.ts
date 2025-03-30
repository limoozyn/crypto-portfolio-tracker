import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string | { small: string; large: string; thumb: string };
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  last_updated: string;
}

export interface CryptoDetail extends Cryptocurrency {
  description: { en: string };
  total_volume?: number;
  market_data: {
    ath: { usd: number };
    atl: { usd: number };
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    total_volume?: { usd: number };
    price_change_percentage_24h: number;
    current_price: { usd: number };
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    telegram_channel_identifier: string;
  };
}

export const getTopCryptocurrencies = async (
  page = 1,
  perPage = 20,
  currency = 'usd'
): Promise<Cryptocurrency[]> => {
  try {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: perPage,
        page: page,
        sparkline: false,
        price_change_percentage: '24h,7d',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
    throw new Error('Failed to fetch cryptocurrency data');
  }
};

export const getCryptoDetails = async (id: string): Promise<CryptoDetail> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await api.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for ${id}:`, error);
    throw new Error(`Failed to fetch details for ${id}`);
  }
};

export const searchCryptocurrencies = async (query: string): Promise<{ coins: { id: string; name: string; symbol: string; market_cap_rank: number }[] }> => {
  try {
    const response = await api.get('/search', {
      params: {
        query,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching cryptocurrencies:', error);
    throw new Error('Failed to search cryptocurrencies');
  }
};