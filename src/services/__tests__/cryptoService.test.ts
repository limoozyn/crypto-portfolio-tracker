import { getTopCryptocurrencies, getCryptoDetails } from '@/services/cryptoService';

jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn()
  };
  return {
    create: jest.fn(() => mockAxiosInstance),
    mockAxiosInstance
  };
});

const { mockAxiosInstance } = jest.requireMock('axios') as {
  mockAxiosInstance: {
    get: jest.Mock;
  };
};

describe('Crypto Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getTopCryptocurrencies fetches data with correct parameters', async () => {
    const mockData = [{ id: 'bitcoin', name: 'Bitcoin' }];
    mockAxiosInstance.get.mockResolvedValueOnce({ data: mockData });

    const result = await getTopCryptocurrencies(1, 20);
    
    expect(result).toEqual(mockData);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 20,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h,7d',
      },
    });
  });

  it('getCryptoDetails fetches detailed crypto data', async () => {
    const mockData = { id: 'bitcoin', name: 'Bitcoin' };
    mockAxiosInstance.get.mockResolvedValueOnce({ data: mockData });

    const result = await getCryptoDetails('bitcoin');

    expect(result).toEqual(mockData);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coins/bitcoin', {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });
  });

  it('handles errors in getTopCryptocurrencies', async () => {
    mockAxiosInstance.get.mockRejectedValueOnce(new Error('API error'));

    await expect(getTopCryptocurrencies(1, 20)).rejects.toThrow('Failed to fetch cryptocurrency data');
  });

  it('handles errors in getCryptoDetails', async () => {
    mockAxiosInstance.get.mockRejectedValueOnce(new Error('API error'));
  });
});