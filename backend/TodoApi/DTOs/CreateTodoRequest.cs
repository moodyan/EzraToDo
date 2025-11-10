namespace TodoApi.DTOs;

/// <summary>
/// Request DTO for creating a new todo item
/// </summary>
public class CreateTodoRequest
{
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime? DueDate { get; set; }

    public int Priority { get; set; } = 1; // Default to Medium

    public List<string>? Tags { get; set; }
}
