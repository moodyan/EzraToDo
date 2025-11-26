import { priorityLabels } from '../types/todo';

/**
 * Converts priority labels object to Select component options format
 */
export function getPriorityOptions() {
  return Object.entries(priorityLabels).map(([value, label]) => ({
    value: Number(value),
    label,
  }));
}

/**
 * Formats a date string to localized date format
 */
export function formatDate(dateString?: string): string | null {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString();
}
