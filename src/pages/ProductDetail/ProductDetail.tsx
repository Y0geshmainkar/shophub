import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import { productService } from '../../services/productService';
import { normalizeAuto } from '../../data/normalizers';
import type { Product } from '../../types/product';
import styles from './ProductDetail.module.scss';

function Stars({ rating, count }: { rating: number; count: number }) {
  return (
    <div className={styles.ratingRow}>
      {[1,2,3,4,5].map(n => (
        <span key={n} className={n <= Math.round(rating) ? styles.starOn : styles.starOff}>★</span>
      ))}
      <span className={styles.reviewCount}>({count} Reviews)</span>
    </div>
  );
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await productService.getProducts();
      return (res.data as Record<string, unknown>[]).map(normalizeAuto);
    },
  });

  const product = allProducts.find(p => p.id === id);

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (!product) return <div className={styles.loading}>Product not found.</div>;

  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/">{product.category}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        {/* Main detail */}
        <div className={styles.detail}>
          {/* Gallery */}
          <div className={styles.gallery}>
            <div className={styles.thumbs}>
              {product.images.map((src, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${activeImg === i ? styles.thumbActive : ''}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
            <div className={styles.mainImg}>
              <img src={product.images[activeImg]} alt={product.name} />
            </div>
          </div>

          {/* Info */}
          <div className={styles.info}>
            <h1 className={styles.name}>{product.name}</h1>
            <Stars rating={product.rating} count={product.reviewCount} />
            <div className={styles.priceRow}>
              <span className={styles.price}>${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <p className={styles.description}>{product.description}</p>

            <div className={styles.divider} />

            {/* Source badge */}
            <div className={styles.sourceBadge}>
              Source: <strong>{product.sourceSystem}</strong>
            </div>

            {/* Qty + Buy Now */}
            <div className={styles.cartRow}>
              <div className={styles.stepper}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <span className={styles.qty}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} aria-label="Increase quantity">+</button>
              </div>
              <button
                className={styles.buyNow}
                onClick={() => { for (let i = 0; i < qty; i++) dispatch(addToCart(product)); }}
                disabled={!product.available}
              >
                Buy Now
              </button>
              <button className={styles.wishBtn} aria-label="Add to wishlist">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Delivery info */}
            <div className={styles.delivery}>
              <div className={styles.deliveryItem}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="1" y="3" width="15" height="13" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M16 8h4l3 5v3h-7V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <div>
                  <strong>Free Delivery</strong>
                  <p>Enter your postal code for Delivery Availability</p>
                </div>
              </div>
              <div className={styles.deliveryItem}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div>
                  <strong>Return Delivery</strong>
                  <p>Free 30 Days Delivery Returns. <a href="#">Details</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Items */}
        {related.length > 0 && (
          <section className={styles.related}>
            <div className={styles.relatedHead}>
              <span className={styles.relatedLabel}>Related Item</span>
            </div>
            <div className={styles.relatedGrid}>
              {related.map(p => (
                <article key={p.id} className={styles.relatedCard}>
                  <Link to={`/product/${p.id}`} className={styles.relatedImgWrap}>
                    <img src={p.images[0]} alt={p.name} />
                  </Link>
                  <Link to={`/product/${p.id}`} className={styles.relatedName}>{p.name}</Link>
                  <div className={styles.relatedPrice}>
                    <span className={styles.price}>${p.price.toFixed(2)}</span>
                    {p.originalPrice && <span className={styles.originalPrice}>${p.originalPrice.toFixed(2)}</span>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
