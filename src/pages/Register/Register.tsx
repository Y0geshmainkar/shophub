import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/authSlice';
import { apiClient } from '../../api/apiClient';
import { FormField, Input, Button, Alert } from '../../components/UI';
import styles from './Register.module.scss';

const STEPS = ['Account', 'Personal', 'Confirm'];

interface Form {
  email: string; password: string; confirmPassword: string;
  firstName: string; lastName: string; phone: string;
}

const blank: Form = { email:'', password:'', confirmPassword:'', firstName:'', lastName:'', phone:'' };

function pwStrength(pw: string): 0|1|2|3 {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s as 0|1|2|3;
}

export function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(blank);
  const [errors, setErrors] = useState<Record<string,string>>({});

  const up = (f: Partial<Form>) => setForm(p => ({ ...p, ...f }));

  const mutation = useMutation({
    mutationFn: () => apiClient.get('localJson/Auth/Register.json'),
    onSuccess: () => {
      dispatch(login({ email: form.email, firstName: form.firstName }));
      navigate('/');
    },
  });

  function handleStep1(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string,string> = {};
    if (!form.email)                errs.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password)             errs.password = 'Required';
    else if (form.password.length < 8) errs.password = 'Min 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setStep(1);
  }

  function handleStep2(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string,string> = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim())  errs.lastName  = 'Required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setStep(2);
  }

  const strength = pwStrength(form.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Stepper */}
        <nav className={styles.stepper} aria-label="Registration steps">
          {STEPS.map((label, i) => (
            <div key={label} className={`${styles.stepItem} ${i < step ? styles.done : ''} ${i === step ? styles.active : ''}`}>
              <div className={styles.circle}>{i < step ? '✓' : i + 1}</div>
              <span className={styles.stepLabel}>{label}</span>
              {i < STEPS.length - 1 && <div className={styles.line} aria-hidden />}
            </div>
          ))}
        </nav>

        {/* Step 1 — Account */}
        {step === 0 && (
          <form onSubmit={handleStep1} noValidate>
            <h2 className={styles.title}>Create account</h2>
            <div className={styles.fields}>
              <FormField label="Email" required error={errors.email}>
                <Input type="email" placeholder="you@example.com" error={!!errors.email}
                  value={form.email} onChange={e => up({ email: e.target.value })} />
              </FormField>
              <FormField label="Password" required error={errors.password}>
                <Input type="password" placeholder="Min. 8 characters" error={!!errors.password}
                  value={form.password} onChange={e => up({ password: e.target.value })} />
                {form.password && (
                  <div className={styles.strengthWrap}>
                    <div className={styles.strengthBar}>
                      <div className={`${styles.fill} ${styles[`s${strength}`]}`} />
                    </div>
                    <span className={styles.strengthLabel}>{strengthLabels[strength]}</span>
                  </div>
                )}
              </FormField>
              <FormField label="Confirm Password" required error={errors.confirmPassword}>
                <Input type="password" placeholder="Repeat password" error={!!errors.confirmPassword}
                  value={form.confirmPassword} onChange={e => up({ confirmPassword: e.target.value })} />
              </FormField>
            </div>
            <Button type="submit" full>Next →</Button>
            <p className={styles.hint}>Already have an account? <Link to="/">Sign in</Link></p>
          </form>
        )}

        {/* Step 2 — Personal */}
        {step === 1 && (
          <form onSubmit={handleStep2} noValidate>
            <h2 className={styles.title}>Personal info</h2>
            <div className={styles.fields}>
              <div className={styles.row}>
                <FormField label="First Name" required error={errors.firstName}>
                  <Input placeholder="Jane" error={!!errors.firstName}
                    value={form.firstName} onChange={e => up({ firstName: e.target.value })} />
                </FormField>
                <FormField label="Last Name" required error={errors.lastName}>
                  <Input placeholder="Smith" error={!!errors.lastName}
                    value={form.lastName} onChange={e => up({ lastName: e.target.value })} />
                </FormField>
              </div>
              <FormField label="Phone" error={errors.phone}>
                <Input type="tel" placeholder="(555) 000-0000"
                  value={form.phone} onChange={e => up({ phone: e.target.value })} />
              </FormField>
            </div>
            <div className={styles.actions}>
              <Button variant="secondary" type="button" onClick={() => { setErrors({}); setStep(0); }}>← Back</Button>
              <Button type="submit">Next →</Button>
            </div>
          </form>
        )}

        {/* Step 3 — Confirm */}
        {step === 2 && (
          <form onSubmit={e => { e.preventDefault(); mutation.mutate(); }} noValidate>
            <h2 className={styles.title}>Review & confirm</h2>
            <dl className={styles.summary}>
              <dt>Email</dt><dd>{form.email}</dd>
              <dt>Name</dt><dd>{form.firstName} {form.lastName}</dd>
              {form.phone && <><dt>Phone</dt><dd>{form.phone}</dd></>}
            </dl>
            {mutation.isError && <Alert variant="error">Registration failed. Please try again.</Alert>}
            <div className={styles.actions}>
              <Button variant="secondary" type="button" onClick={() => setStep(1)}>← Back</Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Creating…' : 'Create Account'}
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
