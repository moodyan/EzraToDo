using Microsoft.AspNetCore.Mvc;
using TodoApi.DTOs;
using TodoApi.Services;

namespace TodoApi.Controllers;

/// <summary>
/// Controller for todo item operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class TodosController : ControllerBase
{
    private readonly ITodoService _todoService;
    private readonly ILogger<TodosController> _logger;

    public TodosController(ITodoService todoService, ILogger<TodosController> logger)
    {
        _todoService = todoService;
        _logger = logger;
    }

    /// <summary>
    /// Get all todo items with optional filters
    /// </summary>
    /// <param name="isCompleted">Filter by completion status</param>
    /// <param name="priority">Filter by priority (0-3)</param>
    /// <returns>List of todo items</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TodoResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<TodoResponse>>> GetAll(
        [FromQuery] bool? isCompleted = null,
        [FromQuery] int? priority = null)
    {
        _logger.LogInformation("Getting all todos with filters - IsCompleted: {IsCompleted}, Priority: {Priority}",
            isCompleted, priority);

        var todos = await _todoService.GetAllAsync(isCompleted, priority);
        return Ok(todos);
    }

    /// <summary>
    /// Get a specific todo item by ID
    /// </summary>
    /// <param name="id">Todo item ID</param>
    /// <returns>Todo item</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TodoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TodoResponse>> GetById(int id)
    {
        _logger.LogInformation("Getting todo with ID: {Id}", id);

        var todo = await _todoService.GetByIdAsync(id);
        return Ok(todo);
    }

    /// <summary>
    /// Create a new todo item
    /// </summary>
    /// <param name="request">Todo creation request</param>
    /// <returns>Created todo item</returns>
    [HttpPost]
    [ProducesResponseType(typeof(TodoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TodoResponse>> Create([FromBody] CreateTodoRequest request)
    {
        _logger.LogInformation("Creating new todo with title: {Title}", request.Title);

        var todo = await _todoService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = todo.Id }, todo);
    }

    /// <summary>
    /// Update an existing todo item
    /// </summary>
    /// <param name="id">Todo item ID</param>
    /// <param name="request">Todo update request</param>
    /// <returns>Updated todo item</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(TodoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TodoResponse>> Update(int id, [FromBody] UpdateTodoRequest request)
    {
        _logger.LogInformation("Updating todo with ID: {Id}", id);

        var todo = await _todoService.UpdateAsync(id, request);
        return Ok(todo);
    }

    /// <summary>
    /// Delete a todo item
    /// </summary>
    /// <param name="id">Todo item ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        _logger.LogInformation("Deleting todo with ID: {Id}", id);

        await _todoService.DeleteAsync(id);
        return NoContent();
    }

    /// <summary>
    /// Toggle completion status of a todo item
    /// </summary>
    /// <param name="id">Todo item ID</param>
    /// <returns>Updated todo item</returns>
    [HttpPatch("{id}/toggle")]
    [ProducesResponseType(typeof(TodoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TodoResponse>> ToggleComplete(int id)
    {
        _logger.LogInformation("Toggling completion status for todo with ID: {Id}", id);

        var todo = await _todoService.ToggleCompleteAsync(id);
        return Ok(todo);
    }
}
