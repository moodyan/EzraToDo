import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoForm } from '../TodoForm';

describe('TodoForm - Negative Scenarios', () => {
  it('should not submit when title is empty', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} defaultExpanded={true} />);

    const submitButton = screen.getByText('Add Todo');
    fireEvent.click(submitButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should not submit when title is only whitespace', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} defaultExpanded={true} />);

    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    const submitButton = screen.getByText('Add Todo');

    fireEvent.change(titleInput, { target: { value: '   ' } });
    fireEvent.click(submitButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should disable submit button when loading', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} isLoading={true} defaultExpanded={true} />);

    const submitButton = screen.getByText('Adding...') as HTMLButtonElement;

    expect(submitButton.disabled).toBe(true);
  });

  it('should disable submit button when title is empty', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} defaultExpanded={true} />);

    const submitButton = screen.getByText('Add Todo') as HTMLButtonElement;

    expect(submitButton.disabled).toBe(true);
  });

  it('should trim whitespace from title before submitting', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} defaultExpanded={true} />);

    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    const form = titleInput.closest('form')!;

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
    render(<TodoForm onSubmit={onSubmit} defaultExpanded={true} />);

    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    const descriptionInput = screen.getByPlaceholderText('Add details about this task...');
    const form = titleInput.closest('form')!;

    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.change(descriptionInput, { target: { value: '   ' } });
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Todo',
        description: undefined,
      })
    );
  });

  it('should handle empty tags gracefully', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} defaultExpanded={true} />);

    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    const tagsInput = screen.getByPlaceholderText('work, personal, urgent');
    const form = titleInput.closest('form')!;

    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.change(tagsInput, { target: { value: '   ' } });
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Todo',
        tags: undefined,
      })
    );
  });

  it('should parse comma-separated tags correctly', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} defaultExpanded={true} />);

    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    const tagsInput = screen.getByPlaceholderText('work, personal, urgent');
    const form = titleInput.closest('form')!;

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
    render(<TodoForm onSubmit={onSubmit} defaultExpanded={true} />);

    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    const tagsInput = screen.getByPlaceholderText('work, personal, urgent');
    const form = titleInput.closest('form')!;

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
    render(<TodoForm onSubmit={onSubmit} defaultExpanded={true} />);

    const titleInput = screen.getByPlaceholderText(
      'What needs to be done?'
    ) as HTMLInputElement;

    expect(titleInput.maxLength).toBe(200);
  });

  it('should enforce maxLength on description textarea', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} defaultExpanded={true} />);

    const descriptionInput = screen.getByPlaceholderText(
      'Add details about this task...'
    ) as HTMLTextAreaElement;

    expect(descriptionInput.maxLength).toBe(1000);
  });

  it('should reset form after successful submission', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} defaultExpanded={true} />);

    const titleInput = screen.getByPlaceholderText(
      'What needs to be done?'
    ) as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText(
      'Add details about this task...'
    ) as HTMLTextAreaElement;
    const form = titleInput.closest('form')!;

    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.submit(form);

    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
  });

  it('should handle empty due date gracefully', () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} defaultExpanded={true} />);

    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    const form = titleInput.closest('form')!;

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
    render(<TodoForm onSubmit={onSubmit} isLoading={true} defaultExpanded={true} />);

    const titleInput = screen.getByPlaceholderText(
      'What needs to be done?'
    ) as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText(
      'Add details about this task...'
    ) as HTMLTextAreaElement;

    expect(titleInput.disabled).toBe(true);
    expect(descriptionInput.disabled).toBe(true);
  });
});

describe('TodoForm - Toggle Behavior', () => {
  it('should start collapsed by default', () => {
    render(<TodoForm onSubmit={vi.fn()} />);

    expect(screen.queryByPlaceholderText('What needs to be done?')).toBeNull();
    expect(screen.getByText('Create New Todo')).toBeInTheDocument();
  });

  it('should expand when toggle button is clicked', () => {
    render(<TodoForm onSubmit={vi.fn()} />);

    fireEvent.click(screen.getByText('Create New Todo'));

    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.getByText('Hide New Todo Form')).toBeInTheDocument();
  });

  it('should start expanded when defaultExpanded is true', () => {
    render(<TodoForm onSubmit={vi.fn()} defaultExpanded={true} />);

    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
  });
});
