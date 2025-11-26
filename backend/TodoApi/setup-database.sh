#!/bin/bash

# Todo API Database Setup Script

echo "Setting up Todo API Database..."
echo ""

# Restore dependencies
echo "Restoring dependencies..."
dotnet restore

echo ""
echo "Dependencies restored!"
echo ""

# Apply migration to database
echo "Applying migration to database..."
dotnet ef database update

echo ""
echo "Database created successfully!"
echo ""
echo "Setup complete! You can now run: dotnet run"
