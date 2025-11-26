import { useState, useMemo, useCallback } from 'react';
import { TodoItem } from './TodoItem';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { EmptyState } from './EmptyState';
import { Select } from './Select';
import { ConfirmModal } from './ConfirmModal';
import { useTodos, useToggleTodo, useDeleteTodo, useUpdateTodo } from '../hooks/useTodos';
import { useToast } from '../hooks/useToast';
import { getPriorityOptions } from '../utils/todoHelpers';
import { sanitizeTodoInput } from '../utils/sanitize';
import type { UpdateTodoRequest } from '../types/todo';
import styles from './TodoList.module.css';

type SortOption = 'createdAt' | 'priority' | 'dueDate' | 'title';

export function TodoList() {
  const [filterCompleted, setFilterCompleted] = useState<boolean | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; todoId: number | null }>({
    isOpen: false,
    todoId: null,
  });

  const { data: todos, isLoading, error, refetch } = useTodos(filterCompleted, filterPriority);
  const toggleMutation = useToggleTodo();
  const deleteMutation = useDeleteTodo();
  const updateMutation = useUpdateTodo();
  const { addToast } = useToast();

  const handleToggle = useCallback((id: number) => {
    toggleMutation.mutate(id, {
      onSuccess: () => {
        addToast('Todo status updated', 'success');
      },
      onError: (error) => {
        addToast(
          error instanceof Error ? error.message : 'Failed to update todo',
          'error'
        );
      },
    });
  }, [toggleMutation, addToast]);

  const handleDeleteRequest = useCallback((id: number) => {
    setDeleteConfirm({ isOpen: true, todoId: id });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.todoId === null) return;

    deleteMutation.mutate(deleteConfirm.todoId, {
      onSuccess: () => {
        addToast('Todo deleted successfully', 'success');
      },
      onError: (error) => {
        addToast(
          error instanceof Error ? error.message : 'Failed to delete todo',
          'error'
        );
      },
    });
    setDeleteConfirm({ isOpen: false, todoId: null });
  }, [deleteConfirm.todoId, deleteMutation, addToast]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirm({ isOpen: false, todoId: null });
  }, []);

  const handleUpdate = useCallback((id: number, data: UpdateTodoRequest) => {
    const sanitized = sanitizeTodoInput({
      title: data.title || '',
      description: data.description,
    });

    updateMutation.mutate(
      { id, data: { ...data, ...sanitized } },
      {
        onSuccess: () => {
          addToast('Todo updated successfully', 'success');
        },
        onError: (error) => {
          addToast(
            error instanceof Error ? error.message : 'Failed to update todo',
            'error'
          );
        },
      }
    );
  }, [updateMutation, addToast]);

  const hasActiveFilters = filterCompleted !== undefined || filterPriority !== undefined;

  const handleClearFilters = () => {
    setFilterCompleted(undefined);
    setFilterPriority(undefined);
  };

  // Sort todos based on selected option (memoized for performance)
  // NOTE: All hooks must be called before any early returns
  const sortedTodos = useMemo(() => {
    if (!todos) return [];

    return [...todos].sort((a, b) => {
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
    });
  }, [todos, sortBy]);

  const stats = {
    total: todos?.length || 0,
    completed: todos?.filter(t => t.isCompleted).length || 0,
    pending: todos?.filter(t => !t.isCompleted).length || 0,
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

  return (
    <div>
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Todo"
        message="Are you sure you want to delete this todo? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />

      {/* Filters and Stats - only show when there are todos */}
      {stats.total > 0 && (
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
              <Select
                value={filterCompleted === undefined ? 'all' : filterCompleted ? 'completed' : 'pending'}
                onChange={(value) => {
                  setFilterCompleted(value === 'all' ? undefined : value === 'completed');
                }}
                options={[
                  { value: 'all', label: 'All Tasks' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'completed', label: 'Completed' },
                ]}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Filter by Priority</label>
              <Select
                value={filterPriority ?? 'all'}
                onChange={(value) => {
                  setFilterPriority(value === 'all' ? undefined : Number(value));
                }}
                options={[
                  { value: 'all', label: 'All Priorities' },
                  ...getPriorityOptions(),
                ]}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Sort By</label>
              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value as SortOption)}
                options={[
                  { value: 'createdAt', label: 'Date Created (Newest)' },
                  { value: 'priority', label: 'Priority (High to Low)' },
                  { value: 'dueDate', label: 'Due Date (Earliest)' },
                  { value: 'title', label: 'Title (A-Z)' },
                ]}
              />
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
      )}

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
              onDelete={handleDeleteRequest}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
