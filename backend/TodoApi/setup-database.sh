#!/bin/bash

# Todo API Database Setup Script

echo "🔧 Setting up Todo API Database..."
echo ""

# Update EF Core tools to version 8.0.0
echo "📦 Updating Entity Framework Core tools to version 8.0.0..."
dotnet tool update --global dotnet-ef --version 8.0.0

echo ""
echo "✅ EF Core tools updated!"
echo ""

# Create initial migration
echo "📝 Creating initial database migration..."
dotnet ef migrations add InitialCreate

echo ""
echo "✅ Migration created!"
echo ""

# Apply migration to database
echo "🗄️  Applying migration to database..."
dotnet ef database update

echo ""
echo "✅ Database created successfully!"
echo ""
echo "🎉 Setup complete! You can now run: dotnet run"
