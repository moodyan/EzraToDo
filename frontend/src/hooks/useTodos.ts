import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '../services/api';
import type { CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

const TODOS_QUERY_KEY = 'todos';

export function useTodos(isCompleted?: boolean, priority?: number) {
  return useQuery({
    queryKey: [TODOS_QUERY_KEY, { isCompleted, priority }],
    queryFn: () => todoApi.getAll(isCompleted, priority),
  });
}

export function useTodo(id: number) {
  return useQuery({
    queryKey: [TODOS_QUERY_KEY, id],
    queryFn: () => todoApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTodoRequest) => todoApi.create(data),
    onSuccess: () => {
      // Invalidate all todos queries to refetch
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTodoRequest }) =>
      todoApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => todoApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}

export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => todoApi.toggleComplete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}
