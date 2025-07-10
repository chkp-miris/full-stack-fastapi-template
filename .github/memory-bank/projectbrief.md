# Project Brief: Full Stack FastAPI Template

## Core Purpose
A production-ready full-stack application template built with FastAPI (backend) and React (frontend), designed to accelerate development of modern web applications with authentication, CRUD operations, and deployment capabilities.

## Key Requirements

### Primary Goals
- **Complete Full-Stack Solution**: Backend API + Frontend UI + Database + Authentication
- **Production Ready**: Docker deployment, CI/CD, security best practices
- **Developer Experience**: Fast setup, hot reload, automatic client generation
- **Extensible Foundation**: Clean architecture for building custom applications

### Core Features
- **Authentication System**: JWT-based auth with email/password, password recovery
- **User Management**: Admin panel, user CRUD, role-based access
- **Item Management**: Generic CRUD operations as example implementation
- **API Documentation**: Automatic OpenAPI/Swagger documentation
- **Frontend Client**: Auto-generated TypeScript client from OpenAPI spec

### Technical Stack
- **Backend**: FastAPI + SQLModel + PostgreSQL + Alembic
- **Frontend**: React + TypeScript + Vite + Chakra UI + TanStack Router
- **Infrastructure**: Docker Compose + Traefik + GitHub Actions
- **Testing**: Pytest (backend) + Playwright (frontend)

## Success Criteria
1. **Quick Setup**: Clone and run with minimal configuration
2. **Scalable Architecture**: Clean separation of concerns, modular design
3. **Security**: Secure defaults, password hashing, JWT tokens
4. **Maintainability**: Type safety, automated testing, CI/CD
5. **Documentation**: Clear setup instructions, API docs, examples

## Target Users
- **Full-Stack Developers**: Building modern web applications
- **Teams**: Need production-ready foundation with authentication
- **Startups**: Rapid prototyping and MVP development
- **Enterprise**: Base template for internal applications

## Project Constraints
- Must support both development and production environments
- Database agnostic (PostgreSQL primary, but configurable)
- Cross-platform compatibility (Docker-based)
- Modern web standards and security practices
