# Todo Task Management Application

A production-ready, full-stack todo task management application built with .NET and React. This project demonstrates clean architecture, best practices, and professional development standards.

## Project Overview

This application showcases:
- **Clean Architecture**: Separation of concerns with DTOs, Services, and Controllers
- **Validation**: Input validation with FluentValidation
- **Error Handling**: Global exception handling with consistent error responses
- **Type Safety**: Full TypeScript implementation on the frontend
- **State Management**: React Query for efficient data caching and synchronization
- **Security**: Rate limiting, CORS restrictions, and input sanitization
- **Testing**: Unit tests for both backend and frontend
- **API Documentation**: Interactive Swagger/OpenAPI documentation

## Architecture

### Backend (.NET 8.0)
```
backend/TodoApi/
├── Controllers/       # Thin controllers (API endpoints)
├── Services/          # Business logic layer
├── Models/            # Entity models (database entities)
├── DTOs/              # Data Transfer Objects (API contracts)
├── Validators/        # FluentValidation validators
├── Middleware/        # Global exception handler
├── Migrations/        # EF Core database migrations
└── Data/              # EF Core DbContext
```

**Key Design Decisions:**
- DTOs for API Contracts: Never expose EF entities directly
- Service Layer: Keeps controllers thin, business logic centralized
- Repository Pattern via EF Core: DbContext acts as unit of work
- Dependency Injection: All services registered with DI container

### Frontend (React + TypeScript)
```
frontend/src/
├── components/        # React components (modular, reusable)
├── hooks/             # Custom React Query hooks and context providers
├── services/          # API client functions
├── types/             # TypeScript type definitions
└── utils/             # Utility functions including sanitization
```

**Key Design Decisions:**
- React Query: Automatic caching, background refetching, optimistic updates
- Component Modularity: Separation of concerns (presentation vs. logic)
- Error Boundaries: Graceful error handling to prevent app crashes
- Toast Notifications: User feedback for all operations
- Type Safety: Full TypeScript coverage

## Getting Started

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or later
- [Node.js 18+](https://nodejs.org/) and npm
- [Git](https://git-scm.com/downloads)

### Backend Setup

#### Option 1: Automated Setup (Recommended)

**On Linux/Mac:**
```bash
cd backend/TodoApi
chmod +x setup-database.sh
./setup-database.sh
dotnet run
```

**On Windows:**
```bash
cd backend/TodoApi
setup-database.bat
dotnet run
```

#### Option 2: Manual Setup

1. Navigate to the backend directory:
```bash
cd backend/TodoApi
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Apply database migrations:
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

## Running Tests

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
- Input validation

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

## API Documentation

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
  "title": "Complete the project",
  "description": "Build a production-ready todo app",
  "priority": 2,
  "dueDate": "2024-12-31",
  "tags": ["work", "urgent"]
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Complete the project",
  "description": "Build a production-ready todo app",
  "isCompleted": false,
  "createdAt": "2024-01-15T10:30:00Z",
  "completedAt": null,
  "dueDate": "2024-12-31",
  "priority": 2,
  "priorityLabel": "High",
  "tags": ["work", "urgent"]
}
```

## Features

### Core Features
- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Set priority levels (Low, Medium, High, Urgent)
- Add due dates with validation
- Tag todos for organization
- Filter by completion status
- Filter by priority level
- Sort by date created, priority, due date, or title

### Security Features
- Rate limiting (configurable requests per time window)
- CORS restrictions with configurable origins
- Input sanitization to prevent XSS
- Due date validation (prevents past dates)

### Production-Ready Features
- Input validation with helpful error messages
- Global error handling
- Error boundaries for graceful failure recovery
- Toast notifications for user feedback
- Loading states throughout the UI
- Empty states when no data exists
- Error states with retry functionality
- Responsive design
- Data caching and invalidation
- SQLite database (persistent, reproducible)
- Database migrations

## Frontend Features

- **Loading States**: Spinners while data is loading
- **Error States**: Clear error messages with retry buttons
- **Empty States**: Friendly messages when no todos exist
- **Filters**: Filter by completion status and priority
- **Sorting**: Sort by date, priority, due date, or title
- **Statistics**: Real-time counts of total, pending, and completed todos
- **Inline Editing**: Edit todos directly in the list
- **Confirmation Dialogs**: Modal dialogs to prevent accidental deletions
- **Toast Notifications**: Success and error feedback for all operations
- **Visual Priority Indicators**: Color-coded priority badges
- **Tag Management**: Visual tag display

## Validation

### Backend Validation
- Title: Required, max 200 characters
- Description: Max 1000 characters
- Priority: Must be 0-3
- Due Date: Cannot be in the past (enforced on create and update)

### Frontend Validation
- Real-time validation feedback
- Disabled submit buttons for invalid input
- Max length enforcement on inputs
- HTML tag stripping for XSS prevention

## Error Handling

### Backend
- Global exception handler middleware
- Consistent error response format
- Appropriate HTTP status codes
- Trace IDs for debugging

### Frontend
- Error boundaries for component failures
- Toast notifications for operation feedback
- User-friendly error messages
- Retry mechanisms for failed operations

## Configuration

### Backend Configuration (appsettings.json)

```json
{
  "Cors": {
    "AllowedOrigins": ["http://localhost:5173", "http://localhost:4173", "http://localhost:3000"]
  },
  "RateLimiting": {
    "PermitLimit": 100,
    "WindowSeconds": 60
  }
}
```
## My Thought Process

### Architecture Decisions
The backend uses .NET 8 (the current release of .NET Core) with Entity Framework Core and SQLite. I chose SQLite over an in-memory database because it provides persistence between sessions while remaining zero-configuration.

For the frontend, I selected React over Vue primarily because of TypeScript integration. While both frameworks support TypeScript well, React's ecosystem has more mature TypeScript tooling and type definitions. React's component model also aligns naturally with the unidirectional data flow I wanted for this application, making state changes predictable and easier to debug. I also have never used React or Vue (I use Angular at my job currently) and I was most interested in learning React.

For state management, I chose React Query rather than a more traditional solution like Redux. React Query provides caching, background refetching, and optimistic updates with significantly less boilerplate, which is well-suited to an application where most state lives on the server.

The backend follows a clean layered architecture: Controllers handle HTTP concerns, Services contain business logic, and DTOs define the API contracts. Entity Framework entities are never exposed directly to the API—this separation allows the database schema to evolve independently from the API contract.

### User Experience Considerations
I invested effort into the small interactions that make an application feel polished. The create form collapses by default when todos exist to reduce visual clutter, but auto-expands when the list is empty to guide new users. Editing happens inline rather than in a modal because it creates a more natural workflow (and made the most sense for this project).

For validation, I replaced the browser's default tooltip with a custom "Required" indicator. Native validation renders differently across browsers and does not match the application's visual style. The save button disables when required fields are empty, providing immediate feedback without intrusive error messages.

Confirmation dialogs protect against accidental deletions.

### Handling Timezones
One notable challenge involved due date handling. During testing, I observed that selecting December 25th would occasionally display as December 24th, and selecting the current day would result in an exception. This occurs because JavaScript dates include timezone information, and UTC conversion on the server can shift dates backward.

The solution was to use DateOnly on the backend (which carries no time component) and transmit the user's timezone offset from the frontend. This ensures the date selected by the user is the date that gets persisted, regardless of their geographic location.

### Styling Approach
I began with inline styles for rapid iteration, then refactored to CSS Modules for production readiness. CSS Modules provide scoped styles without the naming collision issues of global CSS, while remaining more maintainable than inline styles distributed throughout components.

Native HTML select elements and date pickers render inconsistently across browsers. I replaced them with Radix UI dropdowns and react-datepicker to ensure visual consistency across Chrome, Firefox, and Safari. This added complexity, but the uniform appearance justified the trade-off.

### Security and Error Handling
Even for a demonstration application, I wanted to show awareness of production security concerns. The backend implements rate limiting to prevent abuse and CORS restrictions to control which origins can access the API. The frontend sanitizes input to prevent XSS attacks by stripping HTML tags before transmission to the server.

For error handling, I implemented a global exception handler on the backend that returns consistent error responses with appropriate HTTP status codes. On the frontend, error boundaries prevent individual component failures from crashing the entire application, and toast notifications provide clear feedback when operations fail.

### Trade-offs and Scope Decisions
I made deliberate decisions about what to exclude. There is no authentication because it would add significant complexity without demonstrating anything new about todo management. There is no pagination because a single-user todo application is unlikely to contain thousands of items. There is no WebSocket-based real-time synchronization because with a single user, no external modifications will occur while viewing the application.

I prioritized doing the core functionality well rather than spreading effort across features that add limited value for this use case.

### Future Improvements
The most valuable additions would be authentication for multi-user support, pagination for large datasets, and search functionality for quickly locating specific items. I would also add Docker configuration for simplified deployment and end-to-end tests with Playwright or Cypress for comprehensive user flow validation.

For a production MVP of a personal todo application, however, I believe the current implementation covers the essentials: reliable CRUD operations, thoughtful validation, clear error handling, and responsive design that provides a good user experience across device sizes.


## Trade-offs and Assumptions

### Assumptions
1. **Single User**: No authentication/authorization implemented
2. **Local Database**: SQLite for simplicity and reproducibility
3. **Simple Tags**: Tags stored as comma-separated strings (not normalized)
4. **No Pagination**: Assumes reasonable number of todos per user
5. **No Real-time Updates**: No WebSocket/SignalR for multi-client sync

### Trade-offs

**Simplicity Over Complexity**
- SQLite over PostgreSQL: Easier setup, reproducible, sufficient for demo
- Inline editing over modal: Better UX, more natural workflow
- Service layer over repository pattern: Less boilerplate, EF Core is already abstracted

**Performance Over Features**
- React Query over Redux: Built-in caching, less boilerplate
- No virtual scrolling: Simpler implementation, sufficient for expected data size
- Client-side sorting: Reduces API calls, works well for small datasets

**Testability**
- Dependency Injection: Makes testing easier
- Service separation: Can mock services in controller tests
- Component modularity: Each component testable in isolation

## Future Improvements

### High Priority
1. Authentication and Authorization: User accounts, JWT tokens
2. Pagination: API pagination for large datasets
3. Search: Full-text search across titles and descriptions
4. Subtasks: Nested todo items
5. Categories/Projects: Group todos into projects

### Medium Priority
6. Notifications: Due date reminders
7. Recurring Tasks: Daily, weekly, monthly tasks
8. File Attachments: Upload files to todos
9. Activity Log: Track changes and history
10. Dark Mode: Theme toggle
11. Bulk Operations: Select multiple todos for bulk actions

### Performance and Scalability
12. Caching: Redis for distributed caching
13. Database Optimization: Indexes on frequently queried columns
14. API Versioning: Support multiple API versions

### DevOps and Monitoring
15. Docker: Containerize both frontend and backend
16. CI/CD: Automated testing and deployment
17. Health Checks: Endpoint for monitoring system health
18. Structured Logging: Serilog integration

### Testing
19. Integration Tests: Test full request/response cycle
20. E2E Tests: Playwright or Cypress tests
21. Load Testing: Performance under load

## License

MIT License - See LICENSE file for details.
