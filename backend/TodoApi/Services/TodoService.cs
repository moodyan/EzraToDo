using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.DTOs;
using TodoApi.Exceptions;
using TodoApi.Models;

namespace TodoApi.Services;

/// <summary>
/// Service handling todo business logic
/// </summary>
public class TodoService : ITodoService
{
    private readonly TodoDbContext _context;

    public TodoService(TodoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TodoResponse>> GetAllAsync(bool? isCompleted = null, int? priority = null)
    {
        var query = _context.TodoItems.AsQueryable();

        // Apply filters
        if (isCompleted.HasValue)
        {
            query = query.Where(t => t.IsCompleted == isCompleted.Value);
        }

        if (priority.HasValue)
        {
            query = query.Where(t => (int)t.Priority == priority.Value);
        }

        // Order by: incomplete items first, then by priority (highest first), then by due date
        query = query
            .OrderBy(t => t.IsCompleted)
            .ThenByDescending(t => t.Priority)
            .ThenBy(t => t.DueDate ?? DateTime.MaxValue)
            .ThenByDescending(t => t.CreatedAt);

        var items = await query.ToListAsync();
        return items.Select(MapToResponse);
    }

    public async Task<TodoResponse> GetByIdAsync(int id)
    {
        var item = await _context.TodoItems.FindAsync(id);
        if (item == null)
        {
            throw new NotFoundException("Todo", id);
        }
        return MapToResponse(item);
    }

    public async Task<TodoResponse> CreateAsync(CreateTodoRequest request)
    {
        var item = new TodoItem
        {
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            DueDate = request.DueDate,
            Priority = (TodoPriority)request.Priority,
            Tags = request.Tags != null && request.Tags.Any()
                ? string.Join(",", request.Tags)
                : null,
            CreatedAt = DateTime.UtcNow,
            IsCompleted = false
        };

        _context.TodoItems.Add(item);
        await _context.SaveChangesAsync();

        return MapToResponse(item);
    }

    public async Task<TodoResponse> UpdateAsync(int id, UpdateTodoRequest request)
    {
        var item = await _context.TodoItems.FindAsync(id);
        if (item == null)
        {
            throw new NotFoundException("Todo", id);
        }

        // Update only provided fields
        if (request.Title != null)
        {
            item.Title = request.Title.Trim();
        }

        if (request.Description != null)
        {
            item.Description = request.Description.Trim();
        }

        if (request.IsCompleted.HasValue)
        {
            item.IsCompleted = request.IsCompleted.Value;
            item.CompletedAt = request.IsCompleted.Value ? DateTime.UtcNow : null;
        }

        if (request.DueDate.HasValue)
        {
            item.DueDate = request.DueDate.Value;
        }

        if (request.Priority.HasValue)
        {
            item.Priority = (TodoPriority)request.Priority.Value;
        }

        if (request.Tags != null)
        {
            item.Tags = request.Tags.Any() ? string.Join(",", request.Tags) : null;
        }

        await _context.SaveChangesAsync();

        return MapToResponse(item);
    }

    public async Task DeleteAsync(int id)
    {
        var item = await _context.TodoItems.FindAsync(id);
        if (item == null)
        {
            throw new NotFoundException("Todo", id);
        }

        _context.TodoItems.Remove(item);
        await _context.SaveChangesAsync();
    }

    public async Task<TodoResponse> ToggleCompleteAsync(int id)
    {
        var item = await _context.TodoItems.FindAsync(id);
        if (item == null)
        {
            throw new NotFoundException("Todo", id);
        }

        item.IsCompleted = !item.IsCompleted;
        item.CompletedAt = item.IsCompleted ? DateTime.UtcNow : null;

        await _context.SaveChangesAsync();

        return MapToResponse(item);
    }

    /// <summary>
    /// Maps entity to response DTO - ensures EF entities are never exposed directly
    /// </summary>
    private static TodoResponse MapToResponse(TodoItem item)
    {
        return new TodoResponse
        {
            Id = item.Id,
            Title = item.Title,
            Description = item.Description,
            IsCompleted = item.IsCompleted,
            CreatedAt = item.CreatedAt,
            CompletedAt = item.CompletedAt,
            DueDate = item.DueDate,
            Priority = (int)item.Priority,
            PriorityLabel = item.Priority.ToString(),
            Tags = string.IsNullOrEmpty(item.Tags)
                ? new List<string>()
                : item.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
        };
    }
}
