namespace TodoApi.DTOs;

/// <summary>
/// Request DTO for updating an existing todo item
/// </summary>
public class UpdateTodoRequest
{
    public string? Title { get; set; }

    public string? Description { get; set; }

    public bool? IsCompleted { get; set; }

    public DateOnly? DueDate { get; set; }

    /// <summary>
    /// Client's timezone offset in minutes (e.g., -480 for UTC-8)
    /// Used for date validation to account for timezone differences
    /// </summary>
    public int? TimezoneOffset { get; set; }

    public int? Priority { get; set; }

    public List<string>? Tags { get; set; }
}
