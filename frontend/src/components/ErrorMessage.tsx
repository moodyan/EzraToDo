import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className={styles.errorContainer}>
      <p className={styles.errorTitle}>Error</p>
      <p className={styles.errorText}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className={styles.retryButton}>
          Try Again
        </button>
      )}
    </div>
  );
}
