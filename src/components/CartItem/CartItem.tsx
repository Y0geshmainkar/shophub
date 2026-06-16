import { useAppDispatch } from '../../store/hooks';
import { removeFromCart, updateQuantity } from '../../store/cartSlice';
import type { CartEntry } from '../../types/cart';
import styles from './CartItem.module.scss';

interface Props { entry: CartEntry; }

export function CartItem({ entry }: Props) {
  const dispatch = useAppDispatch();
  const { product, quantity } = entry;
  const img = product.images[0] ?? '';

  return (
    <tr className={styles.row}>
      <td className={styles.productCell}>
        <div className={styles.productInfo}>
          {img
            ? <img src={img} alt={product.name} className={styles.image} />
            : <div className={styles.placeholder} aria-hidden>🖼</div>
          }
          <span className={styles.name}>{product.name}</span>
        </div>
      </td>
      <td className={styles.priceCell}>${product.price.toFixed(2)}</td>
      <td className={styles.qtyCell}>
        <div className={styles.stepper}>
          <button
            onClick={() => quantity > 1
              ? dispatch(updateQuantity({ id: product.id, quantity: quantity - 1 }))
              : dispatch(removeFromCart(product.id))
            }
            aria-label="Decrease quantity"
          >−</button>
          <span>{quantity}</span>
          <button
            onClick={() => dispatch(updateQuantity({ id: product.id, quantity: quantity + 1 }))}
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
          >+</button>
        </div>
      </td>
      <td className={styles.subtotalCell}>${(product.price * quantity).toFixed(2)}</td>
      <td className={styles.removeCell}>
        <button
          className={styles.removeBtn}
          onClick={() => dispatch(removeFromCart(product.id))}
          aria-label={`Remove ${product.name}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </td>
    </tr>
  );
}
