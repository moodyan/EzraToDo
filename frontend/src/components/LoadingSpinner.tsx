import styles from './LoadingSpinner.module.css';

export function LoadingSpinner() {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.spinner} aria-label="Loading todos" />
      <span className="sr-only">Loading todos...</span>
    </div>
  );
}
