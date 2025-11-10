interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3rem 1rem',
      color: '#666',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
      <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
