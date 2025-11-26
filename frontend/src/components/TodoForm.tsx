import { useState, FormEvent } from 'react';
import { Select } from './Select';
import { DatePicker } from './DatePicker';
import { getPriorityOptions } from '../utils/todoHelpers';
import type { CreateTodoRequest } from '../types/todo';
import styles from './TodoForm.module.css';

interface TodoFormProps {
  onSubmit: (data: CreateTodoRequest) => void;
  isLoading?: boolean;
}

export function TodoForm({ onSubmit, isLoading }: TodoFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(1);
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const todoData: CreateTodoRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
      tags: tags.trim() ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
    };

    onSubmit(todoData);

    // Reset form
    setTitle('');
    setDescription('');
    setPriority(1);
    setDueDate('');
    setTags('');
  };

  return (
    <div className={styles.formContainer}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={styles.toggleButton}
        aria-expanded={isExpanded}
        aria-controls="todo-form"
      >
        <span className={styles.toggleIcon} aria-hidden="true">{isExpanded ? '−' : '+'}</span>
        <span className={styles.toggleText}>
          {isExpanded ? 'Hide New Todo Form' : 'Create New Todo'}
        </span>
      </button>

      {isExpanded && (
        <form id="todo-form" onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="todo-title" className={styles.label}>Task Title</label>
              <span className={styles.requiredBadge}>Required</span>
            </div>
            <input
              id="todo-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              maxLength={200}
              disabled={isLoading}
              className={styles.input}
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="todo-description" className={styles.label}>Description (optional)</label>
            <textarea
              id="todo-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this task..."
              maxLength={1000}
              disabled={isLoading}
              rows={3}
              className={styles.textarea}
            />
          </div>

          <div className={styles.gridRow}>
            <div className={styles.gridCell}>
              <label className={styles.label}>Priority</label>
              <Select
                value={priority}
                onChange={(value) => setPriority(Number(value))}
                disabled={isLoading}
                options={getPriorityOptions()}
              />
            </div>

            <div className={styles.gridCell}>
              <label className={styles.label}>Due Date</label>
              <DatePicker
                value={dueDate}
                onChange={setDueDate}
                disabled={isLoading}
                minDate={new Date()}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="todo-tags" className={styles.label}>Tags (comma-separated)</label>
            <input
              id="todo-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="work, personal, urgent"
              disabled={isLoading}
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className={styles.submitButton}
          >
            {isLoading ? 'Adding...' : 'Add Todo'}
          </button>
        </form>
      )}
    </div>
  );
}
