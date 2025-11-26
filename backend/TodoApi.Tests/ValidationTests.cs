using FluentValidation.TestHelper;
using TodoApi.DTOs;
using TodoApi.Validators;
using Xunit;

namespace TodoApi.Tests;

/// <summary>
/// Validation tests for request DTOs
/// </summary>
public class ValidationTests
{
    [Fact]
    public void CreateTodoRequest_ShouldHaveError_WhenTitleIsEmpty()
    {
        // Arrange
        var validator = new CreateTodoRequestValidator();
        var request = new CreateTodoRequest
        {
            Title = "",
            Priority = 1
        };

        // Act
        var result = validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Title)
            .WithErrorMessage("Title is required");
    }

    [Fact]
    public void CreateTodoRequest_ShouldHaveError_WhenTitleExceedsMaxLength()
    {
        // Arrange
        var validator = new CreateTodoRequestValidator();
        var request = new CreateTodoRequest
        {
            Title = new string('a', 201), // 201 characters
            Priority = 1
        };

        // Act
        var result = validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Title)
            .WithErrorMessage("Title must not exceed 200 characters");
    }

    [Fact]
    public void CreateTodoRequest_ShouldHaveError_WhenDescriptionExceedsMaxLength()
    {
        // Arrange
        var validator = new CreateTodoRequestValidator();
        var request = new CreateTodoRequest
        {
            Title = "Valid Title",
            Description = new string('a', 1001), // 1001 characters
            Priority = 1
        };

        // Act
        var result = validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Description)
            .WithErrorMessage("Description must not exceed 1000 characters");
    }

    [Fact]
    public void CreateTodoRequest_ShouldHaveError_WhenPriorityIsNegative()
    {
        // Arrange
        var validator = new CreateTodoRequestValidator();
        var request = new CreateTodoRequest
        {
            Title = "Valid Title",
            Priority = -1
        };

        // Act
        var result = validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Priority)
            .WithErrorMessage("Priority must be between 0 (Low) and 3 (Urgent)");
    }

    [Fact]
    public void CreateTodoRequest_ShouldHaveError_WhenPriorityExceedsMaximum()
    {
        // Arrange
        var validator = new CreateTodoRequestValidator();
        var request = new CreateTodoRequest
        {
            Title = "Valid Title",
            Priority = 10
        };

        // Act
        var result = validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Priority)
            .WithErrorMessage("Priority must be between 0 (Low) and 3 (Urgent)");
    }

    [Fact]
    public void CreateTodoRequest_ShouldHaveError_WhenDueDateIsInPast()
    {
        // Arrange
        var validator = new CreateTodoRequestValidator();
        var request = new CreateTodoRequest
        {
            Title = "Valid Title",
            Priority = 1,
            DueDate = DateTime.UtcNow.AddDays(-1) // Yesterday
        };

        // Act
        var result = validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.DueDate)
            .WithErrorMessage("Due date cannot be in the past");
    }

    [Fact]
    public void CreateTodoRequest_ShouldNotHaveError_WhenDueDateIsToday()
    {
        // Arrange
        var validator = new CreateTodoRequestValidator();
        var request = new CreateTodoRequest
        {
            Title = "Valid Title",
            Priority = 1,
            DueDate = DateTime.UtcNow.Date // Today at midnight
        };

        // Act
        var result = validator.TestValidate(request);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.DueDate);
    }

    [Fact]
    public void CreateTodoRequest_ShouldNotHaveError_WhenAllFieldsAreValid()
    {
        // Arrange
        var validator = new CreateTodoRequestValidator();
        var request = new CreateTodoRequest
        {
            Title = "Valid Title",
            Description = "Valid Description",
            Priority = 2,
            DueDate = DateTime.UtcNow.AddDays(7),
            Tags = new List<string> { "tag1", "tag2" }
        };

        // Act
        var result = validator.TestValidate(request);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void UpdateTodoRequest_ShouldHaveError_WhenTitleIsEmpty()
    {
        // Arrange
        var validator = new UpdateTodoRequestValidator();
        var request = new UpdateTodoRequest
        {
            Title = "" // Empty string
        };

        // Act
        var result = validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Title)
            .WithErrorMessage("Title cannot be empty");
    }

    [Fact]
    public void UpdateTodoRequest_ShouldHaveError_WhenTitleExceedsMaxLength()
    {
        // Arrange
        var validator = new UpdateTodoRequestValidator();
        var request = new UpdateTodoRequest
        {
            Title = new string('a', 201)
        };

        // Act
        var result = validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Title)
            .WithErrorMessage("Title must not exceed 200 characters");
    }

    [Fact]
    public void UpdateTodoRequest_ShouldHaveError_WhenDescriptionExceedsMaxLength()
    {
        // Arrange
        var validator = new UpdateTodoRequestValidator();
        var request = new UpdateTodoRequest
        {
            Description = new string('a', 1001)
        };

        // Act
        var result = validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Description)
            .WithErrorMessage("Description must not exceed 1000 characters");
    }

    [Fact]
    public void UpdateTodoRequest_ShouldHaveError_WhenPriorityIsInvalid()
    {
        // Arrange
        var validator = new UpdateTodoRequestValidator();
        var request = new UpdateTodoRequest
        {
            Priority = 5
        };

        // Act
        var result = validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Priority)
            .WithErrorMessage("Priority must be between 0 (Low) and 3 (Urgent)");
    }

    [Fact]
    public void UpdateTodoRequest_ShouldNotHaveError_WhenFieldsAreNull()
    {
        // Arrange
        var validator = new UpdateTodoRequestValidator();
        var request = new UpdateTodoRequest
        {
            Title = null,
            Description = null,
            Priority = null
        };

        // Act
        var result = validator.TestValidate(request);

        // Assert - Should not validate null fields (partial update)
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void UpdateTodoRequest_ShouldNotHaveError_WhenOnlyUpdatingSomeFields()
    {
        // Arrange
        var validator = new UpdateTodoRequestValidator();
        var request = new UpdateTodoRequest
        {
            Priority = 3,
            IsCompleted = true
            // Title and Description are null (not being updated)
        };

        // Act
        var result = validator.TestValidate(request);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }
}
