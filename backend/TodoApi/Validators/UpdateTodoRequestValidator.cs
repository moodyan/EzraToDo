using FluentValidation;
using TodoApi.DTOs;

namespace TodoApi.Validators;

/// <summary>
/// Validator for UpdateTodoRequest
/// </summary>
public class UpdateTodoRequestValidator : AbstractValidator<UpdateTodoRequest>
{
    public UpdateTodoRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title cannot be empty")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters")
            .When(x => x.Title != null);

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.Priority)
            .InclusiveBetween(0, 3).WithMessage("Priority must be between 0 (Low) and 3 (Urgent)")
            .When(x => x.Priority.HasValue);

        RuleFor(x => x.DueDate)
            .Must((request, dueDate) => dueDate >= GetClientToday(request.TimezoneOffset))
            .WithMessage("Due date cannot be in the past")
            .When(x => x.DueDate.HasValue);
    }

    /// <summary>
    /// Gets "today" in the client's timezone, or UTC if no offset provided
    /// </summary>
    private static DateOnly GetClientToday(int? timezoneOffset)
    {
        if (timezoneOffset.HasValue)
        {
            // TimezoneOffset is in minutes (e.g., -480 for UTC-8)
            // JavaScript's getTimezoneOffset() returns positive for west of UTC
            var clientTime = DateTime.UtcNow.AddMinutes(-timezoneOffset.Value);
            return DateOnly.FromDateTime(clientTime);
        }
        return DateOnly.FromDateTime(DateTime.UtcNow);
    }
}
