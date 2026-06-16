import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveCategory } from '../../store/productsSlice';
import { productService } from '../../services/productService';
import styles from './CategoryNav.module.scss';

export function CategoryNav() {
  const dispatch = useAppDispatch();
  const active = useAppSelector(s => s.products.activeCategory);

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await productService.getCategories();
      return res.data as string[];
    },
  });

  const all = ['All', ...categories];

  return (
    <nav className={styles.nav} aria-label="Product categories">
      <div className={styles.inner}>
        {all.map(cat => (
          <button
            key={cat}
            className={`${styles.tab} ${active === cat ? styles.active : ''}`}
            onClick={() => dispatch(setActiveCategory(cat))}
            aria-pressed={active === cat}
          >
            {cat}
          </button>
        ))}
      </div>
    </nav>
  );
}
