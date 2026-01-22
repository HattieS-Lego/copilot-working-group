import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UseQueryResult } from '@tanstack/react-query';
import { renderWithProviders } from '../../test/test-utils';
import { ProductDetail } from './index';
import { useProduct } from '../../hooks/useProduct';
import { useCartContext } from '../../contexts/useCartContext';
import type { Product } from '../../types/product';

// Mock the hooks
vi.mock('../../hooks/useProduct');
vi.mock('../../contexts/useCartContext');

// Mock child components to isolate ProductDetail behavior
vi.mock('../ProductNavigation', () => ({
  ProductNavigation: () => <div data-testid="product-navigation">Navigation</div>,
}));

vi.mock('../ProductImage', () => ({
  ProductImage: () => {
    const { data: product } = useProduct();
    return (
      <div data-testid="product-image">
        {product?.images?.[0] && <img src={product.images[0]} alt={product.title} />}
      </div>
    );
  },
}));

vi.mock('../ProductInfo', () => ({
  ProductInfo: () => {
    const { data: product } = useProduct();
    return (
      <div data-testid="product-info">
        {product && (
          <>
            <h1>{product.title}</h1>
            <p data-testid="product-price">${product.price.toFixed(2)}</p>
            <p data-testid="product-description">{product.description}</p>
          </>
        )}
      </div>
    );
  },
}));

vi.mock('../ProductMeta', () => ({
  ProductMeta: () => {
    const { data: product } = useProduct();
    return (
      <div data-testid="product-meta">
        {product && (
          <>
            <span data-testid="product-brand">{product.brand || 'N/A'}</span>
            <span data-testid="product-category">{product.category}</span>
            <span data-testid="product-stock">{product.stock}</span>
            <span data-testid="product-rating">⭐ {product.rating.toFixed(1)}</span>
          </>
        )}
      </div>
    );
  },
}));

vi.mock('../ProductActions', () => ({
  ProductActions: () => {
    const { data: product } = useProduct();
    const { addToCart } = useCartContext();
    return (
      <div data-testid="product-actions">
        {product && (
          <button
            data-testid="add-to-cart-button"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        )}
      </div>
    );
  },
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

  /**
   * Test 1: Should render product information when provided with product data
   * 
   * This test verifies that when valid product data is available, the ProductDetail
   * component renders all the essential product information including title, price,
   * description, brand, category, stock, and rating.
   */
  it('should render product information (title, price, description) when provided with product data', () => {
    // Arrange: Mock the useProduct hook to return valid product data
    vi.mocked(useProduct).mockReturnValue(
      createMockUseProductResult({
        data: mockProduct,
        isLoading: false,
        isSuccess: true,
      })
    );

    // Act: Render the ProductDetail component
    renderWithProviders(<ProductDetail />);

    // Assert: Verify all product information is displayed
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(screen.getByTestId('product-price')).toHaveTextContent('$999.99');
    expect(screen.getByTestId('product-description')).toHaveTextContent(
      'Latest flagship smartphone with A17 Pro chip'
    );
    expect(screen.getByTestId('product-brand')).toHaveTextContent('Apple');
    expect(screen.getByTestId('product-category')).toHaveTextContent('smartphones');
    expect(screen.getByTestId('product-stock')).toHaveTextContent('50');
    expect(screen.getByTestId('product-rating')).toHaveTextContent('⭐ 4.8');
    
    // Verify the image is rendered
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
    expect(image).toHaveAttribute('alt', 'iPhone 15 Pro');
  });

  /**
   * Test 2: Should display error or fallback if no product data is available
   * 
   * This test ensures that when no product data is available (null/undefined),
   * the component handles it gracefully by not rendering the product details.
   * In a real application, this might show a "Product not found" message.
   */
  it('should handle missing product data gracefully (no product data available)', () => {
    // Arrange: Mock the useProduct hook to return no product data
    vi.mocked(useProduct).mockReturnValue(
      createMockUseProductResult({
        data: undefined,
        isLoading: false,
        isSuccess: false,
      })
    );

    // Act: Render the ProductDetail component
    renderWithProviders(<ProductDetail />);

    // Assert: Verify that product-specific content is not rendered
    expect(screen.queryByText('iPhone 15 Pro')).not.toBeInTheDocument();
    expect(screen.queryByTestId('product-price')).not.toBeInTheDocument();
    expect(screen.queryByTestId('add-to-cart-button')).not.toBeInTheDocument();
    
    // Navigation should still be rendered (it doesn't depend on product data)
    expect(screen.getByTestId('product-navigation')).toBeInTheDocument();
  });

  /**
   * Test 3: Should correctly handle add-to-cart action
   * 
   * This test verifies that when a user clicks the "Add to Cart" button,
   * the addToCart handler is called with the correct product data.
   * This ensures the cart integration works as expected.
   */
  it('should correctly handle add-to-cart action (calls appropriate handler)', async () => {
    // Arrange: Set up user interaction utilities and mock product data
    const user = userEvent.setup();
    vi.mocked(useProduct).mockReturnValue(
      createMockUseProductResult({
        data: mockProduct,
        isLoading: false,
        isSuccess: true,
      })
    );

    // Act: Render the component and click the "Add to Cart" button
    renderWithProviders(<ProductDetail />);
    const addToCartButton = screen.getByTestId('add-to-cart-button');
    
    // Assert: Verify button is present and clickable
    expect(addToCartButton).toBeInTheDocument();
    expect(addToCartButton).toHaveTextContent('Add to Cart');

    // Act: Click the button
    await user.click(addToCartButton);

    // Assert: Verify the addToCart handler was called with the correct product
    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledTimes(1);
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    });
  });

  /**
   * Test 4: Should display loading state while fetching product data
   * 
   * This test ensures that while product data is being fetched (loading state),
   * the component either shows minimal content or handles the loading state gracefully.
   * Since ProductDetail itself doesn't show a loading indicator, we verify that
   * it doesn't crash and doesn't render product details during loading.
   */
  it('should handle loading state appropriately (while fetching product data)', () => {
    // Arrange: Mock the useProduct hook to return loading state
    vi.mocked(useProduct).mockReturnValue(
      createMockUseProductResult({
        data: undefined,
        isLoading: true,
        isSuccess: false,
      })
    );

    // Act: Render the ProductDetail component during loading
    renderWithProviders(<ProductDetail />);

    // Assert: Verify that product details are not rendered yet
    expect(screen.queryByText('iPhone 15 Pro')).not.toBeInTheDocument();
    expect(screen.queryByTestId('product-price')).not.toBeInTheDocument();
    expect(screen.queryByTestId('add-to-cart-button')).not.toBeInTheDocument();
    
    // Navigation should still be rendered
    expect(screen.getByTestId('product-navigation')).toBeInTheDocument();
    
    // Component should render without crashing
    expect(screen.getByTestId('product-info')).toBeInTheDocument();
    expect(screen.getByTestId('product-meta')).toBeInTheDocument();
    expect(screen.getByTestId('product-actions')).toBeInTheDocument();
  });

  /**
   * Bonus Test: Should handle product with missing optional fields
   * 
   * This test ensures the component handles products that don't have all optional
   * fields (like brand) and shows appropriate fallback values.
   */
  it('should handle product with missing optional fields (brand fallback)', () => {
    // Arrange: Create a product without optional brand field
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { brand: _brand, ...productWithoutBrand } = mockProduct;
    
    vi.mocked(useProduct).mockReturnValue(
      createMockUseProductResult({
        data: productWithoutBrand,
        isLoading: false,
        isSuccess: true,
      })
    );

    // Act: Render the component
    renderWithProviders(<ProductDetail />);

    // Assert: Verify N/A is shown for missing brand
    expect(screen.getByTestId('product-brand')).toHaveTextContent('N/A');
    
    // All other fields should still render correctly
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(screen.getByTestId('product-price')).toHaveTextContent('$999.99');
  });
});
