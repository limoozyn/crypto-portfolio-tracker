import { render, screen, fireEvent, act } from '@testing-library/react';
import { PortfolioProvider, usePortfolio } from '@/context/PortfolioContext';

// Mock crypto data
const mockCrypto = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: 'https://example.com/bitcoin.png',
  market_cap: 1000000000000,
  market_cap_rank: 1,
  last_updated: '2023-01-01T00:00:00.000Z',
  market_data:{
    price_change_percentage_24h: 2.5,
    current_price: {usd: 50000},
    
  }
};

// Create a test component that uses the portfolio context
const TestComponent = () => {
  const { portfolio, addCoin, removeCoin, updateQuantity, getTotalValue } = usePortfolio();

  return (
    <div>
      <div data-testid="portfolio-length">{portfolio.items.length}</div>
      <div data-testid="total-value">{getTotalValue()}</div>
      <button onClick={() => addCoin(mockCrypto, 1)}>Add Bitcoin</button>
      <button onClick={() => updateQuantity('bitcoin', 2)}>Update Quantity</button>
      <button onClick={() => removeCoin('bitcoin')}>Remove Bitcoin</button>
    </div>
  );
};

describe('PortfolioContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  });

  it('initializes with an empty portfolio', () => {
    render(
      <PortfolioProvider>
        <TestComponent />
      </PortfolioProvider>
    );
    
    expect(screen.getByTestId('portfolio-length').textContent).toBe('0');
    expect(screen.getByTestId('total-value').textContent).toBe('0');
  });

  it('adds a cryptocurrency to the portfolio', () => {
    render(
      <PortfolioProvider>
        <TestComponent />
      </PortfolioProvider>
    );
    
    fireEvent.click(screen.getByText('Add Bitcoin'));
    
    expect(screen.getByTestId('portfolio-length').textContent).toBe('1');
    expect(screen.getByTestId('total-value').textContent).toBe('50000');
  });

  it('updates cryptocurrency quantity', () => {
    render(
      <PortfolioProvider>
        <TestComponent />
      </PortfolioProvider>
    );
    
    fireEvent.click(screen.getByText('Add Bitcoin'));
    fireEvent.click(screen.getByText('Update Quantity'));
    
    expect(screen.getByTestId('portfolio-length').textContent).toBe('1');
    expect(screen.getByTestId('total-value').textContent).toBe('100000');
  });

  it('removes a cryptocurrency from the portfolio', () => {
    render(
      <PortfolioProvider>
        <TestComponent />
      </PortfolioProvider>
    );
    
    fireEvent.click(screen.getByText('Add Bitcoin'));
    fireEvent.click(screen.getByText('Remove Bitcoin'));
    
    expect(screen.getByTestId('portfolio-length').textContent).toBe('0');
    expect(screen.getByTestId('total-value').textContent).toBe('0');
  });
});