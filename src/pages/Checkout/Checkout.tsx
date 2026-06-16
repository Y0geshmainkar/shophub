import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearCart } from '../../store/cartSlice';
import { orderService } from '../../services/orderService';
import { FormField, Input, Button, Alert } from '../../components/UI';
import styles from './Checkout.module.scss';

const STEPS = ['Shipping', 'Payment', 'Review', 'Confirmation'];

interface ShippingForm {
  firstName: string; lastName: string;
  email: string; phone: string;
  address: string; city: string;
  state: string; zip: string;
}

interface PaymentForm {
  method: 'credit' | 'bank';
  cardNumber: string; cardName: string;
  expiry: string; cvv: string;
  bankName: string; accountNumber: string;
}

const blankShipping: ShippingForm = { firstName:'', lastName:'', email:'', phone:'', address:'', city:'', state:'', zip:'' };
const blankPayment: PaymentForm = { method:'credit', cardNumber:'', cardName:'', expiry:'', cvv:'', bankName:'', accountNumber:'' };

export function Checkout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector(s => s.cart.items);

  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState<ShippingForm>(blankShipping);
  const [payment, setPayment] = useState<PaymentForm>(blankPayment);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState('');

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const mutation = useMutation({
    mutationFn: () => orderService.placeOrder({ shipping, payment, items, total }),
    onSuccess: (res) => {
      setOrderId((res.data as { orderId: string }).orderId);
      dispatch(clearCart());
      setStep(3);
    },
  });

  function validateShipping() {
    const e: Record<string, string> = {};
    if (!shipping.firstName.trim()) e.firstName = 'Required';
    if (!shipping.lastName.trim())  e.lastName  = 'Required';
    if (!shipping.email.trim())     e.email     = 'Required';
    if (!shipping.address.trim())   e.address   = 'Required';
    if (!shipping.city.trim())      e.city      = 'Required';
    if (!shipping.zip.trim())       e.zip       = 'Required';
    return e;
  }

  function validatePayment() {
    const e: Record<string, string> = {};
    if (payment.method === 'credit') {
      if (!payment.cardNumber.trim()) e.cardNumber = 'Required';
      if (!payment.cardName.trim())   e.cardName   = 'Required';
      if (!payment.expiry.trim())     e.expiry     = 'Required';
      if (!payment.cvv.trim())        e.cvv        = 'Required';
    } else {
      if (!payment.bankName.trim())      e.bankName      = 'Required';
      if (!payment.accountNumber.trim()) e.accountNumber = 'Required';
    }
    return e;
  }

  function handleShipping(e: FormEvent) {
    e.preventDefault();
    const errs = validateShipping();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setStep(1);
  }

  function handlePayment(e: FormEvent) {
    e.preventDefault();
    const errs = validatePayment();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setStep(2);
  }

  const s = (field: keyof ShippingForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setShipping(prev => ({ ...prev, [field]: e.target.value }));
  const p = (field: keyof PaymentForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPayment(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Stepper */}
        <nav className={styles.stepper} aria-label="Checkout steps">
          {STEPS.map((label, i) => (
            <div key={label} className={`${styles.stepItem} ${i < step ? styles.done : ''} ${i === step ? styles.active : ''}`}>
              <div className={styles.circle}>{i < step ? '✓' : i + 1}</div>
              <span className={styles.stepLabel}>{label}</span>
              {i < STEPS.length - 1 && <div className={styles.line} aria-hidden />}
            </div>
          ))}
        </nav>

        <div className={styles.body}>
          <div className={styles.formArea}>

            {/* Step 0 — Shipping */}
            {step === 0 && (
              <form onSubmit={handleShipping} noValidate>
                <h2 className={styles.formTitle}>Billing Details</h2>
                <div className={styles.grid2}>
                  <FormField label="First Name" required error={errors.firstName}>
                    <Input value={shipping.firstName} onChange={s('firstName')} error={!!errors.firstName} placeholder="John" />
                  </FormField>
                  <FormField label="Last Name" required error={errors.lastName}>
                    <Input value={shipping.lastName} onChange={s('lastName')} error={!!errors.lastName} placeholder="Smith" />
                  </FormField>
                </div>
                <FormField label="Email" required error={errors.email}>
                  <Input type="email" value={shipping.email} onChange={s('email')} error={!!errors.email} placeholder="you@example.com" />
                </FormField>
                <FormField label="Phone" error={errors.phone}>
                  <Input type="tel" value={shipping.phone} onChange={s('phone')} placeholder="(555) 000-0000" />
                </FormField>
                <FormField label="Street Address" required error={errors.address}>
                  <Input value={shipping.address} onChange={s('address')} error={!!errors.address} placeholder="123 Main St" />
                </FormField>
                <div className={styles.grid3}>
                  <FormField label="City" required error={errors.city}>
                    <Input value={shipping.city} onChange={s('city')} error={!!errors.city} placeholder="City" />
                  </FormField>
                  <FormField label="State" error={errors.state}>
                    <Input value={shipping.state} onChange={s('state')} placeholder="TX" />
                  </FormField>
                  <FormField label="ZIP" required error={errors.zip}>
                    <Input value={shipping.zip} onChange={s('zip')} error={!!errors.zip} placeholder="12345" />
                  </FormField>
                </div>
                <div className={styles.actions}>
                  <Button type="submit">Continue →</Button>
                </div>
              </form>
            )}

            {/* Step 1 — Payment */}
            {step === 1 && (
              <form onSubmit={handlePayment} noValidate>
                <h2 className={styles.formTitle}>Payment Method</h2>
                <div className={styles.methodTabs}>
                  <button type="button" className={`${styles.methodTab} ${payment.method === 'credit' ? styles.methodActive : ''}`}
                    onClick={() => setPayment(p => ({ ...p, method: 'credit' }))}>Credit Card</button>
                  <button type="button" className={`${styles.methodTab} ${payment.method === 'bank' ? styles.methodActive : ''}`}
                    onClick={() => setPayment(p => ({ ...p, method: 'bank' }))}>Bank Draft</button>
                </div>

                {payment.method === 'credit' ? (
                  <>
                    <FormField label="Card Number" required error={errors.cardNumber}>
                      <Input value={payment.cardNumber} onChange={p('cardNumber')} error={!!errors.cardNumber} placeholder="1234 5678 9012 3456" maxLength={19} />
                    </FormField>
                    <FormField label="Name on Card" required error={errors.cardName}>
                      <Input value={payment.cardName} onChange={p('cardName')} error={!!errors.cardName} placeholder="John Smith" />
                    </FormField>
                    <div className={styles.grid2}>
                      <FormField label="Expiry" required error={errors.expiry}>
                        <Input value={payment.expiry} onChange={p('expiry')} error={!!errors.expiry} placeholder="MM/YY" maxLength={5} />
                      </FormField>
                      <FormField label="CVV" required error={errors.cvv}>
                        <Input value={payment.cvv} onChange={p('cvv')} error={!!errors.cvv} placeholder="123" maxLength={4} type="password" />
                      </FormField>
                    </div>
                  </>
                ) : (
                  <>
                    <FormField label="Bank Name" required error={errors.bankName}>
                      <Input value={payment.bankName} onChange={p('bankName')} error={!!errors.bankName} placeholder="Chase Bank" />
                    </FormField>
                    <FormField label="Account Number" required error={errors.accountNumber}>
                      <Input value={payment.accountNumber} onChange={p('accountNumber')} error={!!errors.accountNumber} placeholder="000123456789" />
                    </FormField>
                  </>
                )}

                <div className={styles.actions}>
                  <Button variant="secondary" type="button" onClick={() => { setErrors({}); setStep(0); }}>← Back</Button>
                  <Button type="submit">Continue →</Button>
                </div>
              </form>
            )}

            {/* Step 2 — Review */}
            {step === 2 && (
              <div>
                <h2 className={styles.formTitle}>Review Order</h2>
                <dl className={styles.reviewList}>
                  <dt>Ship to</dt>
                  <dd>{shipping.firstName} {shipping.lastName}, {shipping.address}, {shipping.city} {shipping.zip}</dd>
                  <dt>Payment</dt>
                  <dd>{payment.method === 'credit' ? `Card ···· ${payment.cardNumber.slice(-4)}` : `Bank Draft — ${payment.bankName}`}</dd>
                </dl>
                <ul className={styles.reviewItems}>
                  {items.map(entry => (
                    <li key={entry.product.id} className={styles.reviewItem}>
                      <img src={entry.product.images[0]} alt={entry.product.name} />
                      <span>{entry.product.name} × {entry.quantity}</span>
                      <span>${(entry.product.price * entry.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                {mutation.isError && <Alert variant="error">Failed to place order. Please try again.</Alert>}
                <div className={styles.actions}>
                  <Button variant="secondary" type="button" onClick={() => setStep(1)}>← Back</Button>
                  <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                    {mutation.isPending ? 'Placing…' : 'Place Order'}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3 — Confirmation */}
            {step === 3 && (
              <div className={styles.confirmation}>
                <div className={styles.checkCircle}>✓</div>
                <h2>Order Placed!</h2>
                <p>Your order <strong>{orderId}</strong> has been confirmed.</p>
                <Button onClick={() => navigate('/')}>Continue Shopping</Button>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          {step < 3 && (
            <aside className={styles.summary}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              <ul className={styles.summaryItems}>
                {items.map(entry => (
                  <li key={entry.product.id} className={styles.summaryItem}>
                    <img src={entry.product.images[0]} alt={entry.product.name} />
                    <span className={styles.summaryItemName}>{entry.product.name}</span>
                    <span className={styles.summaryItemPrice}>${(entry.product.price * entry.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <dl className={styles.totals}>
                <dt>Subtotal</dt><dd>${subtotal.toFixed(2)}</dd>
                <dt>Tax (10%)</dt><dd>${tax.toFixed(2)}</dd>
                <dt className={styles.totalLabel}>Total</dt>
                <dd className={styles.totalValue}>${total.toFixed(2)}</dd>
              </dl>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
