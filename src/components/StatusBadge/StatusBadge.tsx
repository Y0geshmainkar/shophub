import styles from './StatusBadge.module.scss';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';

const CONFIG: Record<OrderStatus, { label: string; cls: string }> = {
  pending:   { label: 'Pending',   cls: 'pending' },
  confirmed: { label: 'Confirmed', cls: 'confirmed' },
  shipped:   { label: 'Shipped',   cls: 'shipped' },
  delivered: { label: 'Delivered', cls: 'delivered' },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, cls } = CONFIG[status];
  return (
    <span className={`${styles.badge} ${styles[cls]}`} aria-label={`Status: ${label}`}>
      {label}
    </span>
  );
}
