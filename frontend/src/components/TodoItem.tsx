import { useState } from 'react';
import type { TodoItem as TodoItemType, UpdateTodoRequest } from '../types/todo';
import { priorityColors, priorityLabels } from '../types/todo';

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

  const handleSave = () => {
    if (!editTitle.trim()) return;

    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  if (isEditing) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '0.75rem',
      }}>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            fontSize: '1rem',
            border: '2px solid #3498db',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            border: '2px solid #e0e0e0',
            borderRadius: '4px',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
          }}
        />
        <select
          value={editPriority}
          onChange={(e) => setEditPriority(Number(e.target.value))}
          style={{
            padding: '0.5rem',
            marginBottom: '0.5rem',
            marginRight: '0.5rem',
            border: '2px solid #e0e0e0',
            borderRadius: '4px',
          }}
        >
          {Object.entries(priorityLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleSave}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '0.75rem',
      opacity: todo.isCompleted ? 0.7 : 1,
      borderLeft: `4px solid ${priorityColors[todo.priority]}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => onToggle(todo.id)}
          style={{
            width: '20px',
            height: '20px',
            marginTop: '2px',
            cursor: 'pointer',
          }}
        />

        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: '0 0 0.5rem 0',
            textDecoration: todo.isCompleted ? 'line-through' : 'none',
            color: todo.isCompleted ? '#999' : '#333',
          }}>
            {todo.title}
          </h3>

          {todo.description && (
            <p style={{
              margin: '0 0 0.5rem 0',
              color: '#666',
              fontSize: '0.9rem',
            }}>
              {todo.description}
            </p>
          )}

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: '#666',
          }}>
            <span
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: priorityColors[todo.priority],
                color: 'white',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            >
              {todo.priorityLabel}
            </span>

            {todo.dueDate && (
              <span>📅 Due: {formatDate(todo.dueDate)}</span>
            )}

            {todo.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {todo.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#e8f4f8',
                      color: '#2c3e50',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#999' }}>
            Created: {formatDate(todo.createdAt)}
            {todo.completedAt && ` • Completed: ${formatDate(todo.completedAt)}`}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setIsEditing(true)}
            disabled={todo.isCompleted}
            style={{
              padding: '0.5rem',
              backgroundColor: todo.isCompleted ? '#ddd' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: todo.isCompleted ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            style={{
              padding: '0.5rem',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
