import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';
import { useCreateTodo } from './hooks/useTodos';
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

  const handleCreateTodo = (data: CreateTodoRequest) => {
    createMutation.mutate(data);
  };

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Todo Task Manager
          </h1>
          <p className={styles.subtitle}>
            Production-ready task management application
          </p>
        </header>

        {createMutation.error && (
          <ErrorMessage
            message={
              createMutation.error instanceof Error
                ? createMutation.error.message
                : 'Failed to create todo'
            }
          />
        )}

        <TodoForm onSubmit={handleCreateTodo} isLoading={createMutation.isPending} />
        <TodoList />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoApp />
    </QueryClientProvider>
  );
}
