import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '@/components/ThemeToggle';

const mockSetTheme = jest.fn();
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeToggle', () => {
  it('renders the theme toggle button', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });
    expect(button).toBeInTheDocument();
  });

  it('calls setTheme when clicked', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });
    
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});