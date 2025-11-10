import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoForm } from '../TodoForm';

describe('TodoForm - Negative Scenarios', () => {
  it('should not submit when title is empty', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    const submitButton = screen.getByText('Add Todo');
    fireEvent.click(submitButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should not submit when title is only whitespace', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    const submitButton = screen.getByText('Add Todo');

    fireEvent.change(titleInput, { target: { value: '   ' } });
    fireEvent.click(submitButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should disable submit button when loading', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} isLoading={true} />);

    const submitButton = screen.getByText('Adding...') as HTMLButtonElement;

    expect(submitButton.disabled).toBe(true);
  });

  it('should disable submit button when title is empty', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    const submitButton = screen.getByText('Add Todo') as HTMLButtonElement;

    expect(submitButton.disabled).toBe(true);
  });

  it('should trim whitespace from title before submitting', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    const form = screen.getByRole('button').closest('form')!;

    fireEvent.change(titleInput, { target: { value: '  Test Todo  ' } });
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Todo',
      })
    );
  });

  it('should handle empty description gracefully', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    const descriptionInput = screen.getByPlaceholderText('Description (optional)');
    const form = screen.getByRole('button').closest('form')!;

    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.change(descriptionInput, { target: { value: '   ' } });
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Todo',
        description: undefined, // Should be undefined, not empty string
      })
    );
  });

  it('should handle empty tags gracefully', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    const tagsInput = screen.getByPlaceholderText('work, personal, urgent');
    const form = screen.getByRole('button').closest('form')!;

    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.change(tagsInput, { target: { value: '   ' } });
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Todo',
        tags: undefined, // Should be undefined, not empty array
      })
    );
  });

  it('should parse comma-separated tags correctly', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    const tagsInput = screen.getByPlaceholderText('work, personal, urgent');
    const form = screen.getByRole('button').closest('form')!;

    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.change(tagsInput, { target: { value: 'work, personal,urgent' } });
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        tags: ['work', 'personal', 'urgent'],
      })
    );
  });

  it('should filter out empty tags from comma-separated list', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    const tagsInput = screen.getByPlaceholderText('work, personal, urgent');
    const form = screen.getByRole('button').closest('form')!;

    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.change(tagsInput, { target: { value: 'work,, ,personal' } });
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        tags: ['work', 'personal'],
      })
    );
  });

  it('should enforce maxLength on title input', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    const titleInput = screen.getByPlaceholderText(
      'What needs to be done?'
    ) as HTMLInputElement;

    expect(titleInput.maxLength).toBe(200);
  });

  it('should enforce maxLength on description textarea', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    const descriptionInput = screen.getByPlaceholderText(
      'Description (optional)'
    ) as HTMLTextAreaElement;

    expect(descriptionInput.maxLength).toBe(1000);
  });

  it('should reset form after successful submission', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    const titleInput = screen.getByPlaceholderText(
      'What needs to be done?'
    ) as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText(
      'Description (optional)'
    ) as HTMLTextAreaElement;
    const form = screen.getByRole('button').closest('form')!;

    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.submit(form);

    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
  });

  it('should handle empty due date gracefully', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    const form = screen.getByRole('button').closest('form')!;

    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        dueDate: undefined,
      })
    );
  });

  it('should disable all inputs when loading', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} isLoading={true} />);

    const titleInput = screen.getByPlaceholderText(
      'What needs to be done?'
    ) as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText(
      'Description (optional)'
    ) as HTMLTextAreaElement;
    const prioritySelect = screen.getByLabelText('Priority') as HTMLSelectElement;

    expect(titleInput.disabled).toBe(true);
    expect(descriptionInput.disabled).toBe(true);
    expect(prioritySelect.disabled).toBe(true);
  });
});
