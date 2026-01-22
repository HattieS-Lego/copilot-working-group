import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UseQueryResult } from '@tanstack/react-query';
import { renderWithProviders } from '../../test/test-utils';
import { ProductDetail } from './index';
import { useProduct } from '../../hooks/useProduct';
import { useCartContext } from '../../contexts/useCartContext';
import type { Product } from '../../types/product';

// Mock only external dependencies (hooks and router-dependent components)
vi.mock('../../hooks/useProduct');
vi.mock('../../contexts/useCartContext');

// Mock ProductNavigation as it depends on TanStack Router
vi.mock('../ProductNavigation', () => ({
  ProductNavigation: () => <div>Back to Products</div>,
}));

const mockProduct: Product = {
  id: 1,
  title: 'iPhone 15 Pro',
  description: 'Latest flagship smartphone with A17 Pro chip',
  category: 'smartphones',
  price: 999.99,
  rating: 4.8,
  stock: 50,
  brand: 'Apple',
  availabilityStatus: 'In Stock',
  returnPolicy: '30 days return',
  thumbnail: 'https://example.com/thumb.jpg',
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
};

// Helper function to create a properly typed mock UseQueryResult
const createMockUseProductResult = (
  overrides: Partial<UseQueryResult<Product, Error>>
): UseQueryResult<Product, Error> => {
  return {
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
    status: 'pending',
    fetchStatus: 'idle',
    isFetching: false,
    isRefetching: false,
    isPending: false,
    isLoadingError: false,
    isRefetchError: false,
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    isFetched: false,
    isFetchedAfterMount: false,
    isPlaceholderData: false,
    isStale: false,
    refetch: vi.fn(),
    ...overrides,
  } as UseQueryResult<Product, Error>;
};

describe('ProductDetail Component - Behavior Tests', () => {
  const mockAddToCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCartContext).mockReturnValue({
      addToCart: mockAddToCart,
      items: [],
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      totalItems: 0,
      totalPrice: 0,
    });
  });

  it('should render product information (title, price, description) when provided with product data', () => {
    vi.mocked(useProduct).mockReturnValue(
      createMockUseProductResult({
        data: mockProduct,
        isLoading: false,
        isSuccess: true,
      })
    );

    renderWithProviders(<ProductDetail />);

    expect(screen.getByRole('heading', { name: 'iPhone 15 Pro' })).toBeInTheDocument();
    expect(screen.getByText('$999.99')).toBeInTheDocument();
    expect(screen.getByText('Latest flagship smartphone with A17 Pro chip')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('smartphones')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('⭐ 4.8')).toBeInTheDocument();
    
    const image = screen.getByRole('img', { name: 'iPhone 15 Pro' });
    expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
  });

  it('should handle missing product data gracefully (no product data available)', () => {
    vi.mocked(useProduct).mockReturnValue(
      createMockUseProductResult({
        data: undefined,
        isLoading: false,
        isSuccess: false,
      })
    );

    renderWithProviders(<ProductDetail />);

    expect(screen.queryByText('iPhone 15 Pro')).not.toBeInTheDocument();
    expect(screen.queryByText('$999.99')).not.toBeInTheDocument();
  });

  it('should correctly handle add-to-cart action (calls appropriate handler)', async () => {
    const user = userEvent.setup();
    vi.mocked(useProduct).mockReturnValue(
      createMockUseProductResult({
        data: mockProduct,
        isLoading: false,
        isSuccess: true,
      })
    );

    renderWithProviders(<ProductDetail />);
    const addToCartButton = screen.getByRole('button', { name: 'Add to Cart' });
    
    expect(addToCartButton).toBeInTheDocument();

    await user.click(addToCartButton);

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledTimes(1);
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    });
  });

  it('should handle loading state appropriately (while fetching product data)', () => {
    vi.mocked(useProduct).mockReturnValue(
      createMockUseProductResult({
        data: undefined,
        isLoading: true,
        isSuccess: false,
      })
    );

    renderWithProviders(<ProductDetail />);

    expect(screen.queryByText('iPhone 15 Pro')).not.toBeInTheDocument();
    expect(screen.queryByText('$999.99')).not.toBeInTheDocument();
  });
});
