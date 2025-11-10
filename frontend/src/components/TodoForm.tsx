import { useState, FormEvent } from 'react';
import { priorityLabels } from '../types/todo';
import type { CreateTodoRequest } from '../types/todo';

interface TodoFormProps {
  onSubmit: (data: CreateTodoRequest) => void;
  isLoading?: boolean;
}

export function TodoForm({ onSubmit, isLoading }: TodoFormProps) {
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
    <form onSubmit={handleSubmit} style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '2rem',
    }}>
      <h2 style={{ margin: '0 0 1rem 0' }}>Add New Todo</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
          maxLength={200}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          maxLength={1000}
          disabled={isLoading}
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '4px',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid #e0e0e0',
              borderRadius: '4px',
              backgroundColor: 'white',
            }}
          >
            {Object.entries(priorityLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid #e0e0e0',
              borderRadius: '4px',
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="work, personal, urgent"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !title.trim()}
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1rem',
          fontWeight: 'bold',
          color: 'white',
          backgroundColor: isLoading || !title.trim() ? '#ccc' : '#3498db',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading || !title.trim() ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  );
}
