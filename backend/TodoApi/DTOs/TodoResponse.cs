namespace TodoApi.DTOs;

/// <summary>
/// Response DTO for todo items
/// </summary>
public class TodoResponse
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsCompleted { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public DateTime? DueDate { get; set; }

    public int Priority { get; set; }

    public string PriorityLabel { get; set; } = string.Empty;

    public List<string> Tags { get; set; } = new();
}
