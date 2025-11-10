import { useState } from 'react';
import { TodoItem } from './TodoItem';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { EmptyState } from './EmptyState';
import { useTodos, useToggleTodo, useDeleteTodo, useUpdateTodo } from '../hooks/useTodos';
import type { UpdateTodoRequest } from '../types/todo';
import { priorityLabels } from '../types/todo';

export function TodoList() {
  const [filterCompleted, setFilterCompleted] = useState<boolean | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState<number | undefined>(undefined);

  const { data: todos, isLoading, error, refetch } = useTodos(filterCompleted, filterPriority);
  const toggleMutation = useToggleTodo();
  const deleteMutation = useDeleteTodo();
  const updateMutation = useUpdateTodo();

  const handleToggle = (id: number) => {
    toggleMutation.mutate(id);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleUpdate = (id: number, data: UpdateTodoRequest) => {
    updateMutation.mutate({ id, data });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : 'Failed to load todos'}
        onRetry={() => refetch()}
      />
    );
  }

  const stats = {
    total: todos?.length || 0,
    completed: todos?.filter(t => t.isCompleted).length || 0,
    pending: todos?.filter(t => !t.isCompleted).length || 0,
  };

  return (
    <div>
      {/* Filters and Stats */}
      <div style={{
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '1.5rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '1rem',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Total</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>
              {stats.pending}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Pending</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>
              {stats.completed}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Completed</div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e0e0e0',
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
              Filter by Status
            </label>
            <select
              value={filterCompleted === undefined ? 'all' : filterCompleted ? 'completed' : 'pending'}
              onChange={(e) => {
                const value = e.target.value;
                setFilterCompleted(value === 'all' ? undefined : value === 'completed');
              }}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '2px solid #e0e0e0',
                borderRadius: '4px',
                backgroundColor: 'white',
              }}
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
              Filter by Priority
            </label>
            <select
              value={filterPriority ?? 'all'}
              onChange={(e) => {
                const value = e.target.value;
                setFilterPriority(value === 'all' ? undefined : Number(value));
              }}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '2px solid #e0e0e0',
                borderRadius: '4px',
                backgroundColor: 'white',
              }}
            >
              <option value="all">All Priorities</option>
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Todo List */}
      {!todos || todos.length === 0 ? (
        <EmptyState
          message={
            filterCompleted !== undefined || filterPriority !== undefined
              ? 'No todos match your filters'
              : 'No todos yet. Create one to get started!'
          }
        />
      ) : (
        <div>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
