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
    }
}
