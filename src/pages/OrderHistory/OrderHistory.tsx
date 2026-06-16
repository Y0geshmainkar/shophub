import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { normalizeOrder } from '../../data/normalizers';
import { OrderCard } from '../../components/OrderCard/OrderCard';
import type { Order } from '../../types/order';
import styles from './OrderHistory.module.scss';

export function OrderHistory() {
  const { data: orders = [], isLoading, isError } = useQuery<Order[]>({
    queryKey: ['orderHistory'],
    queryFn: async () => {
      const res = await orderService.getOrderHistory();
      return (res.data as Record<string, unknown>[]).map(normalizeOrder);
    },
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Home</Link><span>/</span><span>My Orders</span>
        </nav>

        <h1 className={styles.title}>Order History</h1>

        {isLoading && <p className={styles.msg}>Loading orders…</p>}
        {isError  && <p className={styles.msgError} role="alert">Failed to load orders.</p>}

        {!isLoading && !isError && orders.length === 0 && (
          <div className={styles.empty}>
            <p>You have no orders yet.</p>
            <Link to="/" className={styles.shopBtn}>Start Shopping</Link>
          </div>
        )}

        {!isLoading && !isError && orders.length > 0 && (
          <div className={styles.grid}>
            {orders.map(o => <OrderCard key={o.id} order={o} />)}
          </div>
        )}
      </div>
    </div>
  );
}
