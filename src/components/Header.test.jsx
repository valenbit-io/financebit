import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';
import { BrowserRouter } from 'react-router-dom';

// Mock simple para evitar errores con props complejas si no se pasan
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
    
    // Busca el texto "FinanceBit" (case insensitive)
    // Asegúrate de que este texto exista en tu Header
    const logoOrTitle = screen.getByText(/FinanceBit/i); 
    expect(logoOrTitle).toBeInTheDocument();
  });
});