import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchQuery } from '../../store/productsSlice';
import styles from './Header.module.scss';

export function Header() {
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(s => s.cart.items.reduce((sum, i) => sum + i.quantity, 0));
  const searchQuery = useAppSelector(s => s.products.searchQuery);
  const isAuth = useAppSelector(s => s.auth.isAuthenticated);

  return (
    <header className={styles.root}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <span>Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%! <Link to="/" className={styles.shopNow}>ShopNow</Link></span>
      </div>

      {/* Main header */}
      <div className={styles.header}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>Exclusive</Link>

          <nav className={styles.nav} aria-label="Main navigation">
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/contact" className={styles.navLink}>Contact</Link>
            <Link to="/about" className={styles.navLink}>About</Link>
            {!isAuth && <Link to="/register" className={styles.navLink}>Sign Up</Link>}
          </nav>

          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={e => dispatch(setSearchQuery(e.target.value))}
              aria-label="Search products"
            />
            <button className={styles.searchBtn} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className={styles.actions}>
            <Link to="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/cart" className={styles.iconBtn} aria-label={`Cart, ${cartCount} items`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            </Link>
            <Link to={isAuth ? '/orders' : '/register'} className={styles.iconBtn} aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
