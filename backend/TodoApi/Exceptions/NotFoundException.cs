namespace TodoApi.Exceptions;

/// <summary>
/// Exception thrown when a requested resource is not found
/// </summary>
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message)
    {
    }

    public NotFoundException(string resourceName, int id)
        : base($"{resourceName} with ID {id} not found")
    {
    }
}
