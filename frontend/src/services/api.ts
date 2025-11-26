import type { TodoItem, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string[]>,
    public traceId?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'An unexpected error occurred',
      statusCode: response.status,
    }));

    // Handle both our custom error format and ASP.NET validation error format
    const message = errorData.message || errorData.title || 'An unexpected error occurred';
    const statusCode = errorData.statusCode || errorData.status || response.status;

    throw new ApiError(
      statusCode,
      message,
      errorData.errors,
      errorData.traceId
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const todoApi = {
  async getAll(isCompleted?: boolean, priority?: number): Promise<TodoItem[]> {
    const params = new URLSearchParams();
    if (isCompleted !== undefined) params.append('isCompleted', String(isCompleted));
    if (priority !== undefined) params.append('priority', String(priority));

    const url = `${API_BASE_URL}/todos${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return handleResponse<TodoItem[]>(response);
  },

  async getById(id: number): Promise<TodoItem> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`);
    return handleResponse<TodoItem>(response);
  },

  async create(data: CreateTodoRequest): Promise<TodoItem> {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<TodoItem>(response);
  },

  async update(id: number, data: UpdateTodoRequest): Promise<TodoItem> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<TodoItem>(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },

  async toggleComplete(id: number): Promise<TodoItem> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}/toggle`, {
      method: 'PATCH',
    });
    return handleResponse<TodoItem>(response);
  },
};

export { ApiError };
