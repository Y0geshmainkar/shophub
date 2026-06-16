import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders, makeProduct } from './testUtils';
import { ProductCard } from '../components/ProductCard/ProductCard';
import { CartItem } from '../components/CartItem/CartItem';
import { OrderCard } from '../components/OrderCard/OrderCard';

// ── ProductCard ───────────────────────────────────────────────────────────
describe('ProductCard', () => {
  const product = makeProduct();

  it('renders product name', () => {
    renderWithProviders(<ProductCard product={product} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders price', () => {
    renderWithProviders(<ProductCard product={product} />);
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('shows Add To Cart button when available', () => {
    renderWithProviders(<ProductCard product={product} />);
    expect(screen.getByRole('button', { name: /add test product to cart/i })).toBeEnabled();
  });

  it('disables Add To Cart when out of stock', () => {
    const oos = makeProduct({ available: false });
    renderWithProviders(<ProductCard product={oos} />);
    expect(screen.getByRole('button', { name: /add test product to cart/i })).toBeDisabled();
  });

  it('shows discount badge when originalPrice set', () => {
    const sale = makeProduct({ price: 20, originalPrice: 40 });
    renderWithProviders(<ProductCard product={sale} />);
    expect(screen.getByText('-50%')).toBeInTheDocument();
  });

  it('dispatches addToCart on click', () => {
    const { store } = renderWithProviders(<ProductCard product={product} />);
    fireEvent.click(screen.getByRole('button', { name: /add test product to cart/i }));
    expect(store.getState().cart.items).toHaveLength(1);
  });
});

// ── CartItem ──────────────────────────────────────────────────────────────
describe('CartItem', () => {
  const product = makeProduct();
  const entry = { product, quantity: 2 };

  it('renders product name', () => {
    renderWithProviders(<table><tbody><CartItem entry={entry} /></tbody></table>);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders quantity', () => {
    renderWithProviders(<table><tbody><CartItem entry={entry} /></tbody></table>);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders subtotal', () => {
    renderWithProviders(<table><tbody><CartItem entry={entry} /></tbody></table>);
    expect(screen.getByText('$59.98')).toBeInTheDocument();
  });

  it('renders remove button', () => {
    renderWithProviders(<table><tbody><CartItem entry={entry} /></tbody></table>);
    expect(screen.getByLabelText(/remove test product/i)).toBeInTheDocument();
  });
});

// ── OrderCard ─────────────────────────────────────────────────────────────
describe('OrderCard', () => {
  const product = makeProduct();
  const order = {
    id: 'ORD-001',
    status: 'delivered' as const,
    items: [{ product, quantity: 1 }],
    total: 29.99,
    placedAt: '2026-01-01T00:00:00Z',
    sourceSystem: 'Shopify' as const,
  };

  it('renders order id', () => {
    renderWithProviders(<OrderCard order={order} />);
    expect(screen.getByText(/ORD-001/)).toBeInTheDocument();
  });

  it('renders status badge', () => {
    renderWithProviders(<OrderCard order={order} />);
    expect(screen.getByText('Delivered')).toBeInTheDocument();
  });

  it('renders product name', () => {
    renderWithProviders(<OrderCard order={order} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders total', () => {
    renderWithProviders(<OrderCard order={order} />);
    expect(screen.getAllByText(/\$29\.99/).length).toBeGreaterThan(0);
  });
});
