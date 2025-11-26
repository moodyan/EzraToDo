namespace TodoApi.Models;

/// <summary>
/// Entity representing a todo item in the database
/// </summary>
public class TodoItem
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsCompleted { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public DateTime? DueDate { get; set; }

    public TodoPriority Priority { get; set; } = TodoPriority.Medium;

    public string? Tags { get; set; } // Stored as comma-separated values
}
