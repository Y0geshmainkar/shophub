import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import type { Product } from '../../types/product';
import styles from './ProductCard.module.scss';

interface Props { product: Product; }

function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars} aria-label={`${rating} stars`}>
      {[1,2,3,4,5].map(n => (
        <span key={n} className={n <= Math.round(rating) ? styles.starOn : styles.starOff}>★</span>
      ))}
    </span>
  );
}

export function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();
  const img = product.images[0] ?? '';
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        {discount && <span className={styles.badge}>-{discount}%</span>}
        {!product.available && <span className={`${styles.badge} ${styles.badgeOos}`}>Out of Stock</span>}

        {img
          ? <img src={img} alt={product.name} className={styles.image} loading="lazy" />
          : <div className={styles.placeholder} aria-hidden>🖼</div>
        }

        <div className={styles.actions}>
          <button className={styles.actionBtn} aria-label="Add to wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <Link to={`/product/${product.id}`} className={styles.actionBtn} aria-label={`View ${product.name}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
          </Link>
        </div>

        <button
          className={styles.addToCart}
          onClick={() => dispatch(addToCart(product))}
          disabled={!product.available}
          aria-label={`Add ${product.name} to cart`}
        >
          Add To Cart
        </button>
      </div>

      <div className={styles.body}>
        <Link to={`/product/${product.id}`} className={styles.name}>{product.name}</Link>
        <div className={styles.priceRow}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        <div className={styles.ratingRow}>
          <Stars rating={product.rating} />
          <span className={styles.reviewCount}>({product.reviewCount})</span>
        </div>
      </div>
    </article>
  );
}
