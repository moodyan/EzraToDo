using System.Linq.Expressions;

namespace TodoApi.Extensions;

/// <summary>
/// Extension methods for IQueryable
/// </summary>
public static class QueryableExtensions
{
    /// <summary>
    /// Conditionally applies a Where clause if the condition is true
    /// </summary>
    public static IQueryable<T> WhereIf<T>(
        this IQueryable<T> query,
        bool condition,
        Expression<Func<T, bool>> predicate)
    {
        return condition ? query.Where(predicate) : query;
    }
}
