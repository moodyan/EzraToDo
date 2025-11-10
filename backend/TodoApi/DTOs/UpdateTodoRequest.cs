namespace TodoApi.DTOs;

/// <summary>
/// Request DTO for updating an existing todo item
/// </summary>
public class UpdateTodoRequest
{
    public string? Title { get; set; }

    public string? Description { get; set; }

    public bool? IsCompleted { get; set; }

    public DateTime? DueDate { get; set; }

    public int? Priority { get; set; }

    public List<string>? Tags { get; set; }
}
