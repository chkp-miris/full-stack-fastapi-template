# System Patterns: Full Stack FastAPI Template

## Overall Architecture

### System Design
```
Frontend (React/Vite) ←→ Backend (FastAPI) ←→ Database (PostgreSQL)
         ↓                      ↓                    ↓
    Chakra UI             SQLModel/Alembic      Docker Volume
    TanStack Router       Pydantic Validation   Backup Strategy
    Auto-generated Client OpenAPI Docs          Migration Scripts
```

### Deployment Architecture
```
Internet → Traefik (Reverse Proxy) → Frontend/Backend Services → PostgreSQL
                ↓
           SSL Termination
           Load Balancing
           Rate Limiting
```

## Core Technical Patterns

### Backend Patterns

#### 1. Layered Architecture
- **API Layer** (`app/api/`): Route handlers, request/response models
- **Core Layer** (`app/core/`): Configuration, security, database connection
- **CRUD Layer** (`app/crud.py`): Database operations abstraction
- **Models Layer** (`app/models.py`): SQLModel database models
- **Dependencies** (`app/api/deps.py`): Dependency injection patterns

#### 2. Configuration Management
```python
# Centralized settings with environment overrides
class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../.env",
        env_ignore_empty=True,
        extra="ignore",
    )
```

#### 3. Database Patterns
- **SQLModel**: Single model definition for API and DB
- **Alembic**: Database migration management
- **Connection Pooling**: Managed by SQLAlchemy
- **Transaction Management**: Automatic rollback on errors

#### 4. Security Patterns
- **JWT Authentication**: Stateless token-based auth
- **Password Hashing**: bcrypt with salt
- **CORS Configuration**: Environment-specific origins
- **Dependency Injection**: Secure route protection

### Frontend Patterns

#### 1. Component Architecture
```
src/
├── components/
│   ├── Common/      # Shared UI components
│   ├── Items/       # Feature-specific components
│   ├── Admin/       # Admin-only components
│   └── ui/          # Base UI components
```

#### 2. State Management
- **TanStack Query**: Server state management
- **React Hook Form**: Form state and validation
- **Local State**: Component-level state with hooks
- **Theme Context**: Dark/light mode persistence

#### 3. Routing Patterns
- **File-based Routing**: TanStack Router configuration
- **Layout Components**: Shared layouts with nested routes
- **Protected Routes**: Authentication-based access control
- **Route Generation**: Type-safe route definitions

#### 4. API Integration
- **Generated Client**: Auto-generated from OpenAPI spec
- **Axios Configuration**: Centralized HTTP client setup
- **Error Handling**: Global error boundaries and toasts
- **Optimistic Updates**: UI updates before server confirmation

## Key Design Decisions

### 1. Type Safety Strategy
- **Shared Models**: SQLModel provides both API and DB types
- **Generated Client**: OpenAPI → TypeScript client generation
- **Strict TypeScript**: No `any` types in production code
- **Runtime Validation**: Pydantic for API validation

### 2. Development Experience
- **Hot Reload**: Both frontend and backend support live reload
- **Docker Development**: Consistent environment across team
- **Code Generation**: Automatic client updates on API changes
- **Testing Strategy**: Unit tests (backend) + E2E tests (frontend)

### 3. Production Considerations
- **Container Strategy**: Multi-stage builds for optimization
- **Reverse Proxy**: Traefik handles SSL and load balancing
- **Environment Configuration**: 12-factor app principles
- **Monitoring**: Sentry integration for error tracking

## Critical Implementation Paths

### 1. Authentication Flow
```python
# Backend: JWT token creation and validation
def create_access_token(subject: str) -> str
def verify_token(token: str) -> User | None

# Frontend: Token storage and API integration
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
```

### 2. CRUD Operations
```python
# Backend: Generic CRUD base class
class CRUDBase[ModelType, CreateSchemaType, UpdateSchemaType]

# Frontend: React hooks for data fetching
const { data, isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: ItemsService.readItems
})
```

### 3. Database Migration Path
```bash
# Development: Auto-generate migrations
alembic revision --autogenerate -m "description"
alembic upgrade head

# Production: Managed migrations in Docker startup
```

### 4. Client Generation Workflow
```bash
# 1. Backend starts → OpenAPI spec available
# 2. Frontend build → Generate TypeScript client
# 3. Type checking → Catch API/frontend mismatches
```

## Component Relationships

### Backend Dependencies
- **FastAPI** → **SQLModel** → **PostgreSQL**
- **Pydantic** → **Data Validation** → **Type Safety**
- **Alembic** → **Schema Management** → **Database Evolution**
- **JWT** → **Authentication** → **Route Protection**

### Frontend Dependencies
- **React** → **Component Architecture** → **User Interface**
- **TanStack Router** → **Navigation** → **Route Management**
- **Chakra UI** → **Design System** → **Consistent Styling**
- **Generated Client** → **API Communication** → **Type Safety**

### Cross-Stack Integration
- **OpenAPI Spec** → **Documentation** + **Client Generation**
- **Docker Compose** → **Development Environment** + **Production Deployment**
- **Environment Variables** → **Configuration Management** → **Security**
