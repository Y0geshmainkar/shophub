import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveCategory } from '../../store/productsSlice';
import { productService } from '../../services/productService';
import styles from './Sidebar.module.scss';

export function Sidebar() {
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
    <aside className={styles.sidebar} aria-label="Categories">
      <h3 className={styles.title}>Categories</h3>
      <ul className={styles.list}>
        {all.map(cat => (
          <li key={cat}>
            <button
              className={`${styles.item} ${active === cat ? styles.active : ''}`}
              onClick={() => dispatch(setActiveCategory(cat))}
              aria-pressed={active === cat}
            >
              <span>{cat}</span>
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden>
                <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
