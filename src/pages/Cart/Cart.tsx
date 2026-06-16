import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearCart } from '../../store/cartSlice';
import { CartItem } from '../../components/CartItem/CartItem';
import styles from './Cart.module.scss';

const TAX_RATE = 0.1;

export function Cart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(s => s.cart.items);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🛒</span>
        <h2>Your cart is empty</h2>
        <Link to="/" className={styles.shopBtn}>Return To Shop</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Home</Link><span>/</span><span>Cart</span>
        </nav>

        {/* Table */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(entry => (
                <CartItem key={entry.product.id} entry={entry} />
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.toolbar}>
          <Link to="/" className={styles.returnBtn}>Return To Shop</Link>
          <button className={styles.clearBtn} onClick={() => dispatch(clearCart())}>Clear Cart</button>
        </div>

        {/* Summary */}
        <div className={styles.bottom}>
          <div className={styles.coupon}>
            <input type="text" placeholder="Coupon Code" className={styles.couponInput} aria-label="Coupon code" />
            <button className={styles.applyBtn}>Apply Coupon</button>
          </div>

          <div className={styles.summary}>
            <h3 className={styles.summaryTitle}>Cart Total</h3>
            <dl className={styles.totals}>
              <dt>Subtotal:</dt><dd>${subtotal.toFixed(2)}</dd>
              <dt>Shipping:</dt><dd>Free</dd>
              <dt>Tax (10%):</dt><dd>${tax.toFixed(2)}</dd>
              <dt className={styles.totalLabel}>Total:</dt>
              <dd className={styles.totalValue}>${total.toFixed(2)}</dd>
            </dl>
            <Link to="/checkout" className={styles.checkoutBtn}>Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
