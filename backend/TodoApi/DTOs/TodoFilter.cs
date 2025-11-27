namespace TodoApi.DTOs;

/// <summary>
/// Filter parameters for querying todos
/// </summary>
public class TodoFilter
{
    public bool? IsCompleted { get; set; }
    public int? Priority { get; set; }
    // TODO: future implementation of SearchTerm, DueBefore, DueAfter filters
}
