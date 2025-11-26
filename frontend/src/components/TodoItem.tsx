import { useState } from 'react';
import { Select } from './Select';
import { DatePicker } from './DatePicker';
import { getPriorityOptions, formatDate } from '../utils/todoHelpers';
import type { TodoItem as TodoItemType, UpdateTodoRequest } from '../types/todo';
import { priorityColors } from '../types/todo';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: UpdateTodoRequest) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ? todo.dueDate.split('T')[0] : '');

  const handleSave = () => {
    if (!editTitle.trim()) return;

    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
      dueDate: editDueDate || undefined,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate ? todo.dueDate.split('T')[0] : '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={styles.todoCard}>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className={styles.editInput}
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          rows={3}
          className={styles.editTextarea}
        />
        <div className={styles.editGridRow}>
          <div>
            <label className={styles.editLabel}>Priority</label>
            <Select
              value={editPriority}
              onChange={(value) => setEditPriority(Number(value))}
              options={getPriorityOptions()}
              className={styles.editSelect}
            />
          </div>
          <div>
            <label className={styles.editLabel}>Due Date</label>
            <DatePicker
              value={editDueDate}
              onChange={setEditDueDate}
              minDate={new Date()}
            />
          </div>
        </div>
        <div className={styles.editActions}>
          <button onClick={handleSave} className={`${styles.button} ${styles.saveButton}`}>
            Save
          </button>
          <button onClick={handleCancel} className={`${styles.button} ${styles.cancelButton}`}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.todoCard} ${todo.isCompleted ? styles.completed : ''}`}
      style={{ borderLeft: `4px solid ${priorityColors[todo.priority]}` }}
    >
      <div className={styles.todoContent}>
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => onToggle(todo.id)}
          className={styles.checkbox}
        />

        <div className={styles.contentBody}>
          <h3 className={`${styles.title} ${todo.isCompleted ? styles.completed : ''}`}>
            {todo.title}
          </h3>

          {todo.description && (
            <p className={styles.description}>
              {todo.description}
            </p>
          )}

          <div className={styles.metadata}>
            <span
              className={styles.priorityBadge}
              style={{ backgroundColor: priorityColors[todo.priority] }}
            >
              {todo.priorityLabel}
            </span>

            {todo.dueDate && (
              <span>📅 Due: {formatDate(todo.dueDate)}</span>
            )}

            {todo.tags.length > 0 && (
              <div className={styles.tags}>
                {todo.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.timestamps}>
            Created: {formatDate(todo.createdAt)}
            {todo.completedAt && ` • Completed: ${formatDate(todo.completedAt)}`}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => setIsEditing(true)}
            disabled={todo.isCompleted}
            className={`${styles.button} ${styles.editButton}`}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className={`${styles.button} ${styles.deleteButton}`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
