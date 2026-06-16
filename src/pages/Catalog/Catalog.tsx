import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '../../store/hooks';
import { productService } from '../../services/productService';
import { normalizeAuto } from '../../data/normalizers';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import type { Product } from '../../types/product';
import styles from './Catalog.module.scss';

const HERO_BG = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800';

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className={styles.sectionHead}>
      <span className={styles.label}>{label}</span>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </div>
  );
}

export function Catalog() {
  const activeCategory = useAppSelector(s => s.products.activeCategory);
  const searchQuery = useAppSelector(s => s.products.searchQuery).toLowerCase();

  const { data: allProducts = [], isLoading, isError } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await productService.getProducts();
      return (res.data as Record<string, unknown>[]).map(normalizeAuto);
    },
  });

  const products = allProducts.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchQ = !searchQuery || p.name.toLowerCase().includes(searchQuery) || p.description.toLowerCase().includes(searchQuery);
    return matchCat && matchQ;
  });

  return (
    <main>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Sidebar />
          <div className={styles.heroBanner} style={{ backgroundImage: `url(${HERO_BG})` }}>
            <div className={styles.heroContent}>
              <p className={styles.heroSub}>iPhone 14 Series</p>
              <h1 className={styles.heroTitle}>Up to 10%<br />off Voucher</h1>
              <a href="#products" className={styles.heroLink}>
                Shop Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <div className={styles.container} id="products">

        {/* Best Selling Products */}
        <section className={styles.section}>
          <SectionHeading label="This Month" title="Best Selling Products" />

          {isLoading && (
            <div className={styles.grid}>
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className={styles.skeleton} aria-hidden />)}
            </div>
          )}

          {isError && <p className={styles.error} role="alert">Failed to load products.</p>}

          {!isLoading && !isError && products.length === 0 && (
            <p className={styles.empty}>No products found.</p>
          )}

          {!isLoading && !isError && products.length > 0 && (
            <div className={styles.grid}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {!isLoading && !isError && (
            <div className={styles.viewAllWrap}>
              <button className={styles.viewAll} onClick={() => {}}>View All Products</button>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
