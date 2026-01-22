import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';
import { BrowserRouter } from 'react-router-dom';

const defaultProps = {
  coins: [],
  trending: [],
  currency: 'usd',
  setCurrency: vi.fn(),
  watchlist: [],
  handleSearch: vi.fn(),
  searchTerm: '',
  setSearchTerm: vi.fn(),
};

describe('Header Component', () => {
  it('debería renderizar el título o logo', () => {
    render(
      <BrowserRouter>
        <Header {...defaultProps} />
      </BrowserRouter>
    );
    
    const logoOrTitle = screen.getByText(/FinanceBit/i); 
    expect(logoOrTitle).toBeInTheDocument();
  });
});