import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';
import { useCreateTodo } from './hooks/useTodos';
import type { CreateTodoRequest } from './types/todo';

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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      padding: '2rem 1rem',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <header style={{
          textAlign: 'center',
          marginBottom: '2rem',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            margin: '0 0 0.5rem 0',
            color: '#2c3e50',
          }}>
            📋 Todo Task Manager
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#7f8c8d',
            margin: 0,
          }}>
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
