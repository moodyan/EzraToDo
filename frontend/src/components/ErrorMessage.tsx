interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div style={{
      padding: '1rem',
      margin: '1rem 0',
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      borderRadius: '4px',
      color: '#c33',
    }}>
      <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Error</p>
      <p style={{ margin: '0 0 0.5rem 0' }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#c33',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
