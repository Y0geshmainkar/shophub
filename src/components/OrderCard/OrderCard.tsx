import type { Order } from '../../types/order';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import styles from './OrderCard.module.scss';

interface Props { order: Order; }

export function OrderCard({ order }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <span className={styles.orderId}>Order #{order.id}</span>
          <span className={styles.date}>{new Date(order.placedAt).toLocaleDateString()}</span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <ul className={styles.items}>
        {order.items.map((entry, i) => (
          <li key={i} className={styles.item}>
            <img
              src={entry.product.images[0]}
              alt={entry.product.name}
              className={styles.itemImg}
            />
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{entry.product.name}</span>
              <span className={styles.itemQty}>× {entry.quantity}</span>
            </div>
            <span className={styles.itemPrice}>${(entry.product.price * entry.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <span className={styles.source}>{order.sourceSystem}</span>
        <span className={styles.total}>Total: <strong>${order.total.toFixed(2)}</strong></span>
      </div>
    </article>
  );
}
