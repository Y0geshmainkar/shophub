import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { LoadingOverlay } from './components/LoadingOverlay/LoadingOverlay';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { Catalog } from './pages/Catalog/Catalog';
import styles from './App.module.scss';

const ProductDetail = lazy(() => import('./pages/ProductDetail/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Cart          = lazy(() => import('./pages/Cart/Cart').then(m => ({ default: m.Cart })));
const Checkout      = lazy(() => import('./pages/Checkout/Checkout').then(m => ({ default: m.Checkout })));
const OrderHistory  = lazy(() => import('./pages/OrderHistory/OrderHistory').then(m => ({ default: m.OrderHistory })));
const Register      = lazy(() => import('./pages/Register/Register').then(m => ({ default: m.Register })));

function App() {
  return (
    <div className={styles.layout}>
      <LoadingOverlay />
      <Header />

      <div className={styles.content}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/"           element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart"        element={<Cart />} />
            <Route path="/register"    element={<Register />} />
            <Route path="/checkout" element={
              <ProtectedRoute><Checkout /></ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute><OrderHistory /></ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}

export default App;
