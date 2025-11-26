namespace TodoApi.DTOs;

/// <summary>
/// Request DTO for creating a new todo item
/// </summary>
public class CreateTodoRequest
{
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateOnly? DueDate { get; set; }

    /// <summary>
    /// Client's timezone offset in minutes (e.g., -480 for UTC-8)
    /// Used for date validation to account for timezone differences
    /// </summary>
    public int? TimezoneOffset { get; set; }

    public int Priority { get; set; } = 1; // Default to Medium

    public List<string>? Tags { get; set; }
}
