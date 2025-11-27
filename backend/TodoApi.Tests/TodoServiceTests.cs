using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.DTOs;
using TodoApi.Exceptions;
using TodoApi.Services;
using Xunit;

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
    public async Task GetByIdAsync_ShouldThrowNotFoundException_WhenNotExists()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => service.GetByIdAsync(999));
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
        await service.DeleteAsync(created.Id);

        // Assert
        await Assert.ThrowsAsync<NotFoundException>(() => service.GetByIdAsync(created.Id));
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
        var incompleteTodos = await service.GetAllAsync(new TodoFilter { IsCompleted = false });
        var completedTodos = await service.GetAllAsync(new TodoFilter { IsCompleted = true });

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
        var highPriorityTodos = await service.GetAllAsync(new TodoFilter { Priority = 2 });

        // Assert
        Assert.Single(highPriorityTodos);
        Assert.Equal("High Priority", highPriorityTodos.First().Title);
    }

    // ====== NEGATIVE SCENARIO TESTS ======

    [Fact]
    public async Task UpdateAsync_ShouldThrowNotFoundException_WhenTodoDoesNotExist()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() =>
            service.UpdateAsync(999, new UpdateTodoRequest { Title = "Updated Title" }));
    }

    [Fact]
    public async Task DeleteAsync_ShouldThrowNotFoundException_WhenTodoDoesNotExist()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => service.DeleteAsync(999));
    }

    [Fact]
    public async Task ToggleCompleteAsync_ShouldThrowNotFoundException_WhenTodoDoesNotExist()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => service.ToggleCompleteAsync(999));
    }

    [Fact]
    public async Task CreateAsync_ShouldTrimWhitespaceFromTitle()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);

        // Act
        var result = await service.CreateAsync(new CreateTodoRequest
        {
            Title = "  Test Todo  ",
            Priority = 1
        });

        // Assert
        Assert.Equal("Test Todo", result.Title);
    }

    [Fact]
    public async Task CreateAsync_ShouldHandleNullTags()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);

        // Act
        var result = await service.CreateAsync(new CreateTodoRequest
        {
            Title = "Test Todo",
            Priority = 1,
            Tags = null
        });

        // Assert
        Assert.Empty(result.Tags);
    }

    [Fact]
    public async Task CreateAsync_ShouldHandleEmptyTags()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);

        // Act
        var result = await service.CreateAsync(new CreateTodoRequest
        {
            Title = "Test Todo",
            Priority = 1,
            Tags = new List<string>()
        });

        // Assert
        Assert.Empty(result.Tags);
    }

    [Fact]
    public async Task UpdateAsync_ShouldOnlyUpdateProvidedFields()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);
        var created = await service.CreateAsync(new CreateTodoRequest
        {
            Title = "Original Title",
            Description = "Original Description",
            Priority = 1
        });

        // Act - Only update priority
        var result = await service.UpdateAsync(created.Id, new UpdateTodoRequest
        {
            Priority = 3
        });

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Original Title", result.Title); // Should remain unchanged
        Assert.Equal("Original Description", result.Description); // Should remain unchanged
        Assert.Equal(3, result.Priority); // Should be updated
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnEmptyList_WhenNoTodosExist()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnEmptyList_WhenNoTodosMatchFilter()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);
        await service.CreateAsync(new CreateTodoRequest { Title = "Todo 1", Priority = 0 });

        // Act - Filter for priority 3 (Urgent) when only priority 0 exists
        var result = await service.GetAllAsync(new TodoFilter { Priority = 3 });

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetAllAsync_ShouldCombineMultipleFilters()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);

        var todo1 = await service.CreateAsync(new CreateTodoRequest { Title = "Todo 1", Priority = 2 });
        var todo2 = await service.CreateAsync(new CreateTodoRequest { Title = "Todo 2", Priority = 2 });
        var todo3 = await service.CreateAsync(new CreateTodoRequest { Title = "Todo 3", Priority = 1 });

        await service.ToggleCompleteAsync(todo1.Id); // Complete first high-priority todo

        // Act - Get completed todos with priority 2
        var result = await service.GetAllAsync(new TodoFilter { IsCompleted = true, Priority = 2 });

        // Assert
        Assert.Single(result);
        Assert.Equal("Todo 1", result.First().Title);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateCompletedAtWhenMarkingComplete()
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
        var result = await service.UpdateAsync(created.Id, new UpdateTodoRequest
        {
            IsCompleted = true
        });

        // Assert
        Assert.NotNull(result);
        Assert.True(result.IsCompleted);
        Assert.NotNull(result.CompletedAt);
    }

    [Fact]
    public async Task UpdateAsync_ShouldClearCompletedAtWhenMarkingIncomplete()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);
        var created = await service.CreateAsync(new CreateTodoRequest
        {
            Title = "Test Todo",
            Priority = 1
        });

        await service.ToggleCompleteAsync(created.Id); // Mark as complete first

        // Act
        var result = await service.UpdateAsync(created.Id, new UpdateTodoRequest
        {
            IsCompleted = false
        });

        // Assert
        Assert.NotNull(result);
        Assert.False(result.IsCompleted);
        Assert.Null(result.CompletedAt);
    }

    [Fact]
    public async Task CreateAsync_ShouldSetCreatedAtToCurrentTime()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);
        var beforeCreate = DateTime.UtcNow.AddSeconds(-1);

        // Act
        var result = await service.CreateAsync(new CreateTodoRequest
        {
            Title = "Test Todo",
            Priority = 1
        });

        var afterCreate = DateTime.UtcNow.AddSeconds(1);

        // Assert
        Assert.True(result.CreatedAt >= beforeCreate);
        Assert.True(result.CreatedAt <= afterCreate);
    }

    [Fact]
    public async Task UpdateAsync_ShouldTrimWhitespaceFromUpdatedFields()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new TodoService(context);
        var created = await service.CreateAsync(new CreateTodoRequest
        {
            Title = "Original",
            Priority = 1
        });

        // Act
        var result = await service.UpdateAsync(created.Id, new UpdateTodoRequest
        {
            Title = "  Updated  ",
            Description = "  Description  "
        });

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Updated", result.Title);
        Assert.Equal("Description", result.Description);
    }

    [Fact]
    public async Task DeleteAsync_ShouldActuallyRemoveFromDatabase()
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
        await service.DeleteAsync(created.Id);

        // Assert - Verify it's actually gone from the database
        var allTodos = await service.GetAllAsync();
        Assert.Empty(allTodos);
    }
}
