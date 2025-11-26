import { useState } from 'react';
import { TodoItem } from './TodoItem';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { EmptyState } from './EmptyState';
import { useTodos, useToggleTodo, useDeleteTodo, useUpdateTodo } from '../hooks/useTodos';
import type { UpdateTodoRequest } from '../types/todo';
import { priorityLabels } from '../types/todo';
import styles from './TodoList.module.css';

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

  const hasActiveFilters = filterCompleted !== undefined || filterPriority !== undefined;

  const handleClearFilters = () => {
    setFilterCompleted(undefined);
    setFilterPriority(undefined);
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
      <div className={styles.statsCard}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={`${styles.statNumber} ${styles.total}`}>
              {stats.total}
            </div>
            <div className={styles.statLabel}>Total</div>
          </div>
          <div className={styles.statItem}>
            <div className={`${styles.statNumber} ${styles.pending}`}>
              {stats.pending}
            </div>
            <div className={styles.statLabel}>Pending</div>
          </div>
          <div className={styles.statItem}>
            <div className={`${styles.statNumber} ${styles.completed}`}>
              {stats.completed}
            </div>
            <div className={styles.statLabel}>Completed</div>
          </div>
        </div>

        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Filter by Status</label>
            <select
              value={filterCompleted === undefined ? 'all' : filterCompleted ? 'completed' : 'pending'}
              onChange={(e) => {
                const value = e.target.value;
                setFilterCompleted(value === 'all' ? undefined : value === 'completed');
              }}
              className={styles.filterSelect}
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Filter by Priority</label>
            <select
              value={filterPriority ?? 'all'}
              onChange={(e) => {
                const value = e.target.value;
                setFilterPriority(value === 'all' ? undefined : Number(value));
              }}
              className={styles.filterSelect}
            >
              <option value="all">All Priorities</option>
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className={styles.clearFiltersContainer}>
            <button
              onClick={handleClearFilters}
              className={styles.clearFiltersButton}
            >
              Clear Filters
            </button>
          </div>
        )}
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
        <div className={styles.todoList}>
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
