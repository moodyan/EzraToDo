import { useState, FormEvent } from 'react';
import { priorityLabels } from '../types/todo';
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
      >
        <span className={styles.toggleIcon}>{isExpanded ? '−' : '+'}</span>
        <span className={styles.toggleText}>
          {isExpanded ? 'Hide New Todo Form' : 'Create New Todo'}
        </span>
      </button>

      {isExpanded && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              maxLength={200}
              disabled={isLoading}
              className={styles.input}
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              maxLength={1000}
              disabled={isLoading}
              rows={3}
              className={styles.textarea}
            />
          </div>

          <div className={styles.gridRow}>
            <div>
              <label className={styles.label}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                disabled={isLoading}
                className={styles.select}
              >
                {Object.entries(priorityLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={styles.label}>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                disabled={isLoading}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tags (comma-separated)</label>
            <input
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
