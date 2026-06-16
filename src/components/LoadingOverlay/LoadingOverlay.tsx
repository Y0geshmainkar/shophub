import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import styles from './LoadingOverlay.module.scss';

export function LoadingOverlay() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  if (!isFetching && !isMutating) return null;
  return (
    <div className={styles.overlay} role="status" aria-live="polite" aria-label="Loading">
      <div className={styles.spinner} />
    </div>
  );
}
