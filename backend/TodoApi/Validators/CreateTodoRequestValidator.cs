using FluentValidation;
using TodoApi.DTOs;

namespace TodoApi.Validators;

/// <summary>
/// Validator for CreateTodoRequest
/// </summary>
public class CreateTodoRequestValidator : AbstractValidator<CreateTodoRequest>
{
    public CreateTodoRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.Priority)
            .InclusiveBetween(0, 3).WithMessage("Priority must be between 0 (Low) and 3 (Urgent)");

        // Allow dates from yesterday to account for timezone differences
        RuleFor(x => x.DueDate)
            .GreaterThanOrEqualTo(DateTime.UtcNow.Date.AddDays(-1))
            .WithMessage("Due date cannot be in the past")
            .When(x => x.DueDate.HasValue);
    }
}
