import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';
import { ToastProvider, useToast } from './hooks/useToast';
import { useCreateTodo } from './hooks/useTodos';
import { sanitizeTodoInput } from './utils/sanitize';
import type { CreateTodoRequest } from './types/todo';
import styles from './App.module.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function TodoApp() {
  const createMutation = useCreateTodo();
  const { toasts, addToast, removeToast } = useToast();

  const handleCreateTodo = (data: CreateTodoRequest) => {
    const sanitized = sanitizeTodoInput({
      title: data.title,
      description: data.description,
      tags: data.tags,
    });

    createMutation.mutate(
      { ...data, ...sanitized },
      {
        onSuccess: () => {
          addToast('Todo created successfully', 'success');
        },
        onError: (error) => {
          addToast(
            error instanceof Error ? error.message : 'Failed to create todo',
            'error'
          );
        },
      }
    );
  };

  return (
    <div className={styles.app}>
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Todo Task Manager
          </h1>
          <p className={styles.subtitle}>
            Production-ready task management application
          </p>
        </header>

        <TodoForm onSubmit={handleCreateTodo} isLoading={createMutation.isPending} />
        <TodoList />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <TodoApp />
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
