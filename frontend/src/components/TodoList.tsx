import { useState } from 'react';
import { TodoItem } from './TodoItem';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { EmptyState } from './EmptyState';
import { CustomSelect } from './CustomSelect';
import { useTodos, useToggleTodo, useDeleteTodo, useUpdateTodo } from '../hooks/useTodos';
import type { UpdateTodoRequest } from '../types/todo';
import { priorityLabels } from '../types/todo';
import styles from './TodoList.module.css';

type SortOption = 'createdAt' | 'priority' | 'dueDate' | 'title';

export function TodoList() {
  const [filterCompleted, setFilterCompleted] = useState<boolean | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');

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

  // Sort todos based on selected option
  const sortedTodos = todos ? [...todos].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        // Higher priority (3) should come first
        return b.priority - a.priority;
      case 'dueDate':
        // Sort by due date, with null dates at the end
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'createdAt':
      default:
        // Most recent first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  }) : [];

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
            <CustomSelect
              value={filterCompleted === undefined ? 'all' : filterCompleted ? 'completed' : 'pending'}
              onChange={(value) => {
                setFilterCompleted(value === 'all' ? undefined : value === 'completed');
              }}
              options={[
                { value: 'all', label: 'All Tasks' },
                { value: 'pending', label: 'Pending' },
                { value: 'completed', label: 'Completed' },
              ]}
              className={styles.filterSelect}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Filter by Priority</label>
            <CustomSelect
              value={filterPriority ?? 'all'}
              onChange={(value) => {
                setFilterPriority(value === 'all' ? undefined : Number(value));
              }}
              options={[
                { value: 'all', label: 'All Priorities' },
                ...Object.entries(priorityLabels).map(([value, label]) => ({
                  value: Number(value),
                  label,
                })),
              ]}
              className={styles.filterSelect}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sort By</label>
            <CustomSelect
              value={sortBy}
              onChange={(value) => setSortBy(value as SortOption)}
              options={[
                { value: 'createdAt', label: 'Date Created (Newest)' },
                { value: 'priority', label: 'Priority (High to Low)' },
                { value: 'dueDate', label: 'Due Date (Earliest)' },
                { value: 'title', label: 'Title (A-Z)' },
              ]}
              className={styles.filterSelect}
            />
          </div>
        </div>
      </div>

      {/* Todo List */}
      {!sortedTodos || sortedTodos.length === 0 ? (
        <EmptyState
          message={
            filterCompleted !== undefined || filterPriority !== undefined
              ? 'No todos match your filters'
              : 'No todos yet. Create one to get started!'
          }
        />
      ) : (
        <div className={styles.todoList}>
          {sortedTodos.map((todo) => (
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
