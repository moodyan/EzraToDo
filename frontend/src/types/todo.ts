export interface TodoItem {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
  priority: number;
  priorityLabel: string;
  tags: string[];
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  dueDate?: string;
  timezoneOffset?: number;
  priority: number;
  tags?: string[];
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  dueDate?: string;
  timezoneOffset?: number;
  priority?: number;
  tags?: string[];
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  traceId?: string;
}

export enum TodoPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Urgent = 3,
}

export const priorityLabels: Record<number, string> = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
  3: 'Urgent',
};

export const priorityColors: Record<number, string> = {
  0: '#b8a888',  // Low - muted tan/beige
  1: '#ffcf33',  // Medium - main yellow
  2: '#f0a500',  // High - darker golden yellow
  3: '#252218',  // Urgent - dark brown (text color)
};
