import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = useAppSelector(s => s.auth.isAuthenticated);
  return isAuth ? <>{children}</> : <Navigate to="/register" replace />;
}
