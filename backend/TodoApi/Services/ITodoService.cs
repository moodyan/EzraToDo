using TodoApi.DTOs;

namespace TodoApi.Services;

/// <summary>
/// Interface for Todo business logic
/// </summary>
public interface ITodoService
{
    Task<IEnumerable<TodoResponse>> GetAllAsync(TodoFilter? filter = null);
    Task<TodoResponse> GetByIdAsync(int id);
    Task<TodoResponse> CreateAsync(CreateTodoRequest request);
    Task<TodoResponse> UpdateAsync(int id, UpdateTodoRequest request);
    Task DeleteAsync(int id);
    Task<TodoResponse> ToggleCompleteAsync(int id);
}
