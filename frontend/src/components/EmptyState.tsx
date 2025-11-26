import styles from './EmptyState.module.css';

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <p className={styles.message}>{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className={styles.actionButton}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
