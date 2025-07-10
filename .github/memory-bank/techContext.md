# Tech Context: Full Stack FastAPI Template

## Technology Stack

### Backend Technologies
- **FastAPI 0.115+**: Modern Python web framework
  - Automatic OpenAPI documentation
  - Built-in request/response validation
  - Async support and high performance
  - Dependency injection system

- **SQLModel**: Database ORM and validation
  - Single model definition for API and DB
  - Built on SQLAlchemy and Pydantic
  - Type safety across data layer
  - Automatic migration generation

- **PostgreSQL**: Primary database
  - ACID compliance and reliability
  - JSON support for flexible schemas
  - Full-text search capabilities
  - Robust ecosystem and tooling

- **Alembic**: Database migration management
  - Version control for database schema
  - Auto-generation from model changes
  - Production-safe migration strategies

### Frontend Technologies
- **React 18+**: Component-based UI framework
  - Hooks for state management
  - Concurrent features for performance
  - Strong ecosystem and community

- **TypeScript 5+**: Type-safe JavaScript
  - Compile-time error catching
  - Enhanced IDE support
  - Better code documentation

- **Vite**: Build tool and dev server
  - Fast hot module replacement
  - Modern ES modules support
  - Optimized production builds

- **TanStack Router**: Type-safe routing
  - File-based route generation
  - Layout components and nested routes
  - Search params and route params validation

- **Chakra UI**: Component library
  - Accessibility-first design
  - Dark mode support
  - Customizable theme system
  - Responsive design primitives

- **TanStack Query**: Server state management
  - Caching and background updates
  - Optimistic updates
  - Error handling and retries

### Development Tools
- **Docker & Docker Compose**: Containerization
  - Consistent development environment
  - Production deployment strategy
  - Service orchestration

- **Pytest**: Python testing framework
  - Comprehensive test coverage
  - Fixtures and parameterization
  - Integration with FastAPI testing

- **Playwright**: End-to-end testing
  - Cross-browser testing
  - Visual regression testing
  - API testing capabilities

- **Biome**: Code formatting and linting
  - Fast Rust-based tooling
  - TypeScript and JavaScript support
  - Consistent code style

## Development Setup

### Prerequisites
- **Docker Desktop**: Latest stable version
- **Node.js**: 18+ (for local frontend development)
- **Python**: 3.11+ (for local backend development)
- **Git**: Version control

### Environment Configuration
```bash
# Required environment variables (.env file)
PROJECT_NAME="FastAPI Project"
SECRET_KEY="your-secret-key"
FIRST_SUPERUSER="admin@example.com"
FIRST_SUPERUSER_PASSWORD="changethis"
POSTGRES_PASSWORD="changethis"
POSTGRES_USER="postgres"
POSTGRES_DB="app"
POSTGRES_SERVER="db"
```

### Local Development Commands
```bash
# Start all services
docker-compose up -d

# Backend only (with auto-reload)
cd backend && uvicorn app.main:app --reload

# Frontend only (with hot reload)
cd frontend && npm run dev

# Generate TypeScript client
cd frontend && npm run generate-client

# Run tests
docker-compose exec backend pytest
cd frontend && npx playwright test
```

## Technical Constraints

### Security Requirements
- **Password Security**: bcrypt hashing with salt
- **JWT Tokens**: Secure token generation and validation
- **CORS Policy**: Configurable cross-origin settings
- **Input Validation**: Pydantic models for all API inputs
- **SQL Injection Prevention**: SQLAlchemy ORM usage
- **XSS Protection**: React's built-in escaping

### Performance Constraints
- **Database Connections**: Connection pooling with SQLAlchemy
- **Response Times**: API responses < 200ms for simple operations
- **Bundle Size**: Frontend bundle < 2MB compressed
- **Memory Usage**: Backend < 512MB per instance
- **Database Queries**: Avoid N+1 queries with proper joins

### Compatibility Requirements
- **Browser Support**: Modern browsers (ES2020+)
- **Python Version**: 3.11+ for backend
- **PostgreSQL**: Version 13+ recommended
- **Docker**: Compatible with Docker Desktop and Linux containers

## Dependencies Management

### Backend Dependencies (pyproject.toml)
```toml
[tool.uv.sources]
# Core dependencies
fastapi = "^0.115.0"
sqlmodel = "^0.0.16"
pydantic = "^2.5.0"
uvicorn = "^0.24.0"

# Database
psycopg = {extras = ["binary"], version = "^3.1.18"}
alembic = "^1.13.1"

# Security
python-jose = {extras = ["cryptography"], version = "^3.3.0"}
passlib = {extras = ["bcrypt"], version = "^1.7.4"}

# Development
pytest = "^7.4.3"
httpx = "^0.25.2"
```

### Frontend Dependencies (package.json)
```json
{
  "dependencies": {
    "@chakra-ui/react": "^3.8.0",
    "@tanstack/react-query": "^5.28.14",
    "@tanstack/react-router": "1.19.1",
    "axios": "1.9.0",
    "react": "^18.2.0",
    "react-hook-form": "7.49.3"
  },
  "devDependencies": {
    "@biomejs/biome": "1.9.4",
    "@hey-api/openapi-ts": "^0.57.0",
    "@playwright/test": "^1.52.0",
    "typescript": "^5.2.2",
    "vite": "^6.3.4"
  }
}
```

## Tool Usage Patterns

### Code Generation
1. **OpenAPI Client**: Backend changes → Frontend client regeneration
2. **Database Migrations**: Model changes → Alembic migration generation
3. **Route Types**: TanStack Router file-based generation

### Testing Strategy
- **Backend**: Unit tests with pytest, integration tests with TestClient
- **Frontend**: Component tests with React Testing Library, E2E with Playwright
- **API**: Contract testing with generated OpenAPI specs

### Development Workflow
1. **Feature Development**: Backend API → Frontend components → Integration
2. **Database Changes**: SQLModel updates → Migration generation → Frontend client update
3. **Deployment**: Docker builds → Container registry → Production deployment

### Monitoring and Debugging
- **Backend**: FastAPI automatic documentation at `/docs`
- **Frontend**: React DevTools and TanStack Query DevTools
- **Database**: PostgreSQL logs and query analysis
- **Production**: Sentry integration for error tracking
