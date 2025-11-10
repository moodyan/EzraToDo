# Todo Task Management Application

A production-ready, full-stack todo task management application built with .NET Core and React. This project demonstrates clean architecture, best practices, and professional development standards.

## 🎯 Project Overview

This application showcases:
- **Clean Architecture**: Separation of concerns with DTOs, Services, and Controllers
- **Validation**: Input validation with FluentValidation
- **Error Handling**: Global exception handling with consistent error responses
- **Type Safety**: Full TypeScript implementation on the frontend
- **State Management**: React Query for efficient data caching and synchronization
- **Testing**: Unit tests for both backend and frontend
- **API Documentation**: Interactive Swagger/OpenAPI documentation

## 🏗️ Architecture

### Backend (.NET Core 8.0)
```
backend/TodoApi/
├── Controllers/       # Thin controllers (API endpoints)
├── Services/          # Business logic layer
├── Models/            # Entity models (database entities)
├── DTOs/              # Data Transfer Objects (API contracts)
├── Validators/        # FluentValidation validators
├── Middleware/        # Global exception handler
└── Data/              # EF Core DbContext
```

**Key Design Decisions:**
- ✅ **DTOs for API Contracts**: Never expose EF entities directly
- ✅ **Service Layer**: Keeps controllers thin, business logic centralized
- ✅ **Repository Pattern via EF Core**: DbContext acts as unit of work
- ✅ **Dependency Injection**: All services registered with DI container

### Frontend (React + TypeScript)
```
frontend/src/
├── components/        # React components (modular, reusable)
├── hooks/             # Custom React Query hooks
├── services/          # API client functions
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

**Key Design Decisions:**
- ✅ **React Query**: Automatic caching, background refetching, optimistic updates
- ✅ **Component Modularity**: Separation of concerns (presentation vs. logic)
- ✅ **Error Boundaries**: Proper error and loading state handling
- ✅ **Type Safety**: Full TypeScript coverage

## 🚀 Getting Started

### Prerequisites
- .NET 8.0 SDK or later
- Node.js 18+ and npm
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/TodoApi
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Apply database migrations (creates SQLite database):
```bash
dotnet ef database update
```

4. Run the API:
```bash
dotnet run
```

The API will be available at `http://localhost:5000`
- Swagger UI: `http://localhost:5000` (root path)
- API Endpoints: `http://localhost:5000/api/todos`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🧪 Running Tests

### Backend Tests
```bash
cd backend/TodoApi.Tests
dotnet test
```

Tests cover:
- Creating todos
- Retrieving todos
- Updating todos
- Deleting todos
- Toggle completion
- Filtering by status and priority

### Frontend Tests
```bash
cd frontend
npm test
```

Tests cover:
- Component rendering
- User interactions
- Error handling
- Loading states

## 📋 API Documentation

Once the backend is running, visit `http://localhost:5000` to access the interactive Swagger UI.

Alternatively, use the provided `.http` file for testing:
```bash
# Use VS Code REST Client extension or similar
backend/TodoApi/api-tests.http
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos (with optional filters) |
| GET | `/api/todos/{id}` | Get a specific todo |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/{id}` | Update a todo |
| DELETE | `/api/todos/{id}` | Delete a todo |
| PATCH | `/api/todos/{id}/toggle` | Toggle completion status |

### Request/Response Examples

**Create Todo:**
```json
POST /api/todos
{
  "title": "Complete the take-home test",
  "description": "Build a production-ready todo app",
  "priority": 2,
  "dueDate": "2024-12-31T23:59:59Z",
  "tags": ["work", "urgent"]
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Complete the take-home test",
  "description": "Build a production-ready todo app",
  "isCompleted": false,
  "createdAt": "2024-01-15T10:30:00Z",
  "completedAt": null,
  "dueDate": "2024-12-31T23:59:59Z",
  "priority": 2,
  "priorityLabel": "High",
  "tags": ["work", "urgent"]
}
```

## ✨ Features

### Core Features
- ✅ Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Set priority levels (Low, Medium, High, Urgent)
- ✅ Add due dates
- ✅ Tag todos for organization
- ✅ Filter by completion status
- ✅ Filter by priority level

### Production-Ready Features
- ✅ Input validation with helpful error messages
- ✅ Global error handling
- ✅ Loading states throughout the UI
- ✅ Empty states when no data exists
- ✅ Error states with retry functionality
- ✅ Responsive design
- ✅ Optimistic UI updates
- ✅ Data caching and invalidation
- ✅ SQLite database (persistent, reproducible)
- ✅ Database migrations
- ✅ CORS configuration
- ✅ Structured logging

## 🎨 Frontend Features

- **Loading States**: Spinners while data is loading
- **Error States**: Clear error messages with retry buttons
- **Empty States**: Friendly messages when no todos exist
- **Filters**: Filter by completion status and priority
- **Statistics**: Real-time counts of total, pending, and completed todos
- **Inline Editing**: Edit todos directly in the list
- **Confirmation Dialogs**: Prevent accidental deletions
- **Visual Priority Indicators**: Color-coded priority badges
- **Tag Management**: Visual tag display and management

## 🔐 Validation

### Backend Validation
- Title: Required, max 200 characters
- Description: Max 1000 characters
- Priority: Must be 0-3
- Due Date: Cannot be in the past

### Frontend Validation
- Real-time validation feedback
- Disabled submit buttons for invalid input
- Max length enforcement on inputs

## 🛡️ Error Handling

### Backend
- Global exception handler middleware
- Consistent error response format
- Appropriate HTTP status codes
- Trace IDs for debugging

### Frontend
- Try-catch blocks in async operations
- Error boundaries for component failures
- User-friendly error messages
- Retry mechanisms

## 📊 Trade-offs and Assumptions

### Assumptions
1. **Single User**: No authentication/authorization implemented (out of scope)
2. **Local Database**: SQLite for simplicity and reproducibility
3. **Simple Tags**: Tags stored as comma-separated strings (not normalized)
4. **No Pagination**: Assumes reasonable number of todos per user
5. **No Real-time Updates**: No WebSocket/SignalR for multi-client sync

### Trade-offs

#### ✅ Chose Simplicity Over Complexity
- **SQLite over PostgreSQL**: Easier setup, reproducible, sufficient for demo
- **Inline editing over modal**: Better UX but slightly more complex component
- **Service layer over repository pattern**: Less boilerplate, EF Core is already abstracted

#### ✅ Chose Performance Over Features
- **React Query over Redux**: Built-in caching, less boilerplate
- **No virtual scrolling**: Simpler implementation, sufficient for expected data size
- **Client-side filtering**: Reduces API calls, works well for small datasets

#### ✅ Chose Testability
- **Dependency Injection**: Makes testing easier
- **Service separation**: Can mock services in controller tests
- **Component modularity**: Each component testable in isolation

## 🚀 Future Improvements

### High Priority
1. **Authentication & Authorization**: User accounts, JWT tokens
2. **Pagination**: API pagination for large datasets
3. **Search**: Full-text search across titles and descriptions
4. **Sorting**: Custom sort orders (by date, priority, title)
5. **Subtasks**: Nested todo items
6. **Categories/Projects**: Group todos into projects

### Medium Priority
7. **Notifications**: Due date reminders
8. **Recurring Tasks**: Daily, weekly, monthly tasks
9. **File Attachments**: Upload files to todos
10. **Activity Log**: Track changes and history
11. **Dark Mode**: Theme toggle
12. **Bulk Operations**: Select multiple todos for bulk actions

### Performance & Scalability
13. **Caching**: Redis for distributed caching
14. **Rate Limiting**: Protect API from abuse
15. **Database Optimization**: Indexes on frequently queried columns
16. **API Versioning**: Support multiple API versions
17. **GraphQL**: Alternative to REST for flexible queries

### DevOps & Monitoring
18. **Docker**: Containerize both frontend and backend
19. **CI/CD**: Automated testing and deployment
20. **Application Insights**: Monitoring and telemetry
21. **Health Checks**: Endpoint for monitoring system health
22. **Logging**: Structured logging with Serilog
23. **API Gateway**: If microservices architecture is needed

### Testing
24. **Integration Tests**: Test full request/response cycle
25. **E2E Tests**: Playwright or Cypress tests
26. **Load Testing**: Performance under load
27. **Code Coverage**: Aim for 80%+ coverage

## 🏆 Highlights

### What Makes This Submission Stand Out

1. **Production-Ready Code**: Not just functional, but maintainable and scalable
2. **Clean Architecture**: Clear separation of concerns, easy to extend
3. **Comprehensive Error Handling**: Never leaves users in the dark
4. **User Experience**: Loading, error, and empty states throughout
5. **Type Safety**: Full TypeScript coverage prevents runtime errors
6. **Documentation**: Clear README with setup instructions and reasoning
7. **Testing**: Both backend and frontend tests included
8. **API Documentation**: Interactive Swagger UI for easy API exploration
9. **Best Practices**: Follows .NET and React best practices

### Code Quality
- ✅ No EF entities exposed in API responses
- ✅ Thin controllers with business logic in services
- ✅ Input validation on all endpoints
- ✅ Consistent error response format
- ✅ React Query for optimal data management
- ✅ Modular, reusable components
- ✅ Proper TypeScript types throughout
- ✅ Clear naming conventions

## 📝 License

MIT License - See LICENSE file for details

## 👤 Author

This project was created as a take-home test for a Full Stack Developer position, demonstrating expertise in:
- Backend: .NET Core, Entity Framework, Clean Architecture
- Frontend: React, TypeScript, React Query
- Best Practices: Testing, Documentation, Error Handling
- Production Readiness: Validation, Logging, User Experience

---

**Note**: This application is designed for demonstration purposes and showcases production-ready patterns and practices. For a full production deployment, consider implementing the improvements listed in the "Future Improvements" section.
