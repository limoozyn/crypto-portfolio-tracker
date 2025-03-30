import { render, screen } from '@testing-library/react';
import CryptoCard from '@/components/CryptoCard';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock Next.js image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img {...props} />;
  },
}));

describe('CryptoCard', () => {
  const mockCrypto = {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://example.com/bitcoin.png',
    current_price: 50000,
    market_cap: 1000000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5,
    last_updated: '2023-01-01T00:00:00.000Z',
  };

  it('renders cryptocurrency information correctly', () => {
    render(<CryptoCard crypto={mockCrypto} />);
    
    expect(screen.getByText('Bitcoin (BTC)')).toBeInTheDocument();
    expect(screen.getByText('Rank #1')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('+2.50%')).toBeInTheDocument();
  });

  it('displays negative price change in red', () => {
    const negativeCrypto = {
      ...mockCrypto,
      price_change_percentage_24h: -2.5,
    };
    
    render(<CryptoCard crypto={negativeCrypto} />);
    
    const priceChangeElement = screen.getByText('-2.50%');
    expect(priceChangeElement).toHaveClass('text-red-600');
  });

  it('displays positive price change in green', () => {
    render(<CryptoCard crypto={mockCrypto} />);
    
    const priceChangeElement = screen.getByText('+2.50%');
    expect(priceChangeElement).toHaveClass('text-green-600');
  });
});