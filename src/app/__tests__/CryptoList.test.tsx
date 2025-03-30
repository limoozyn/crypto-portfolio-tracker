// src/app/__tests__/CryptoList.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import CryptoList from '@/app/CryptoList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock components
jest.mock('@/components/CryptoCard', () => {
  return function MockCryptoCard({ crypto }: { crypto: any }) {
    return <div data-testid={`crypto-card-${crypto.id}`}>{crypto.name}</div>;
  };
});

// Mock API
jest.mock('@/services/cryptoService', () => ({
  getTopCryptocurrencies: jest.fn().mockResolvedValue([]),
}));

const mockCryptos = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://example.com/bitcoin.png',
    current_price: 50000,
    market_cap: 1000000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5,
    last_updated: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://example.com/ethereum.png',
    current_price: 3000,
    market_cap: 400000000000,
    market_cap_rank: 2,
    price_change_percentage_24h: 1.5,
    last_updated: '2023-01-01T00:00:00.000Z',
  },
];

describe('CryptoList', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  it('renders list of cryptocurrencies', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CryptoList initialCryptos={mockCryptos} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });

  it('filters cryptocurrencies by search term', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CryptoList initialCryptos={mockCryptos} />
      </QueryClientProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search coins...');
    fireEvent.change(searchInput, { target: { value: 'bitcoin' } });

    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
  });

  it('sorts cryptocurrencies by name', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CryptoList initialCryptos={mockCryptos} />
      </QueryClientProvider>
    );

    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'name' } });

    // Check order - since we're mocking CryptoCard, we can check the DOM order
    const cryptoCards = screen.getAllByTestId(/crypto-card/);
    expect(cryptoCards[0].textContent).toBe('Bitcoin');
    expect(cryptoCards[1].textContent).toBe('Ethereum');
  });
});