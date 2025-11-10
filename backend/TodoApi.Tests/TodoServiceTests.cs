using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.DTOs;
using TodoApi.Services;

namespace TodoApi.Tests;

/// <summary>
/// Unit tests for TodoService
/// </summary>
public class TodoServiceTests
{
    private TodoDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<TodoDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new TodoDbContext(options);
    }

    [Fact]
    public async Task CreateAsync_ShouldCreateTodoSuccessfully()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);
        var request = new CreateTodoRequest
        {
            Title = "Test Todo",
            Description = "Test Description",
            Priority = 1,
            Tags = new List<string> { "test", "unit" }
        };

        // Act
        var result = await service.CreateAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test Todo", result.Title);
        Assert.Equal("Test Description", result.Description);
        Assert.Equal(1, result.Priority);
        Assert.False(result.IsCompleted);
        Assert.Contains("test", result.Tags);
        Assert.Contains("unit", result.Tags);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnTodo_WhenExists()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);
        var created = await service.CreateAsync(new CreateTodoRequest
        {
            Title = "Test Todo",
            Priority = 1
        });

        // Act
        var result = await service.GetByIdAsync(created.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(created.Id, result.Id);
        Assert.Equal("Test Todo", result.Title);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnNull_WhenNotExists()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);

        // Act
        var result = await service.GetByIdAsync(999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateTodoSuccessfully()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);
        var created = await service.CreateAsync(new CreateTodoRequest
        {
            Title = "Original Title",
            Priority = 1
        });

        // Act
        var result = await service.UpdateAsync(created.Id, new UpdateTodoRequest
        {
            Title = "Updated Title",
            Priority = 2
        });

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Updated Title", result.Title);
        Assert.Equal(2, result.Priority);
    }

    [Fact]
    public async Task ToggleCompleteAsync_ShouldToggleCompletionStatus()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);
        var created = await service.CreateAsync(new CreateTodoRequest
        {
            Title = "Test Todo",
            Priority = 1
        });

        // Act
        var toggled = await service.ToggleCompleteAsync(created.Id);

        // Assert
        Assert.NotNull(toggled);
        Assert.True(toggled.IsCompleted);
        Assert.NotNull(toggled.CompletedAt);

        // Toggle back
        var toggledAgain = await service.ToggleCompleteAsync(created.Id);
        Assert.NotNull(toggledAgain);
        Assert.False(toggledAgain.IsCompleted);
        Assert.Null(toggledAgain.CompletedAt);
    }

    [Fact]
    public async Task DeleteAsync_ShouldDeleteTodoSuccessfully()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);
        var created = await service.CreateAsync(new CreateTodoRequest
        {
            Title = "Test Todo",
            Priority = 1
        });

        // Act
        var deleted = await service.DeleteAsync(created.Id);

        // Assert
        Assert.True(deleted);
        var result = await service.GetByIdAsync(created.Id);
        Assert.Null(result);
    }

    [Fact]
    public async Task GetAllAsync_ShouldFilterByCompletionStatus()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);

        var todo1 = await service.CreateAsync(new CreateTodoRequest { Title = "Todo 1", Priority = 1 });
        var todo2 = await service.CreateAsync(new CreateTodoRequest { Title = "Todo 2", Priority = 1 });
        await service.ToggleCompleteAsync(todo1.Id); // Mark first as completed

        // Act
        var incompleteTodos = await service.GetAllAsync(isCompleted: false);
        var completedTodos = await service.GetAllAsync(isCompleted: true);

        // Assert
        Assert.Single(incompleteTodos);
        Assert.Single(completedTodos);
    }

    [Fact]
    public async Task GetAllAsync_ShouldFilterByPriority()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);

        await service.CreateAsync(new CreateTodoRequest { Title = "Low Priority", Priority = 0 });
        await service.CreateAsync(new CreateTodoRequest { Title = "High Priority", Priority = 2 });

        // Act
        var highPriorityTodos = await service.GetAllAsync(priority: 2);

        // Assert
        Assert.Single(highPriorityTodos);
        Assert.Equal("High Priority", highPriorityTodos.First().Title);
    }
}
