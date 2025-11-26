using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Data;

/// <summary>
/// Database context for the Todo application
/// </summary>
public class TodoDbContext : DbContext
{
    public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options)
    {
    }

    public DbSet<TodoItem> TodoItems { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure TodoItem entity
        modelBuilder.Entity<TodoItem>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Description)
                .HasMaxLength(1000);

            // Note: Default values are handled in the application layer (TodoService)
            // rather than database defaults to avoid EF Core sentinel value issues
            // and to keep business logic in one place
            entity.Property(e => e.IsCompleted)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.Priority)
                .IsRequired();

            entity.Property(e => e.Tags)
                .HasMaxLength(500);

            // Configure DateOnly conversion for SQLite (stores as TEXT)
            entity.Property(e => e.DueDate)
                .HasConversion(
                    v => v.HasValue ? v.Value.ToString("yyyy-MM-dd") : null,
                    v => v != null ? DateOnly.Parse(v) : null
                );

            // Create index for common queries
            entity.HasIndex(e => e.IsCompleted);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.Priority);
        });
    }
}
