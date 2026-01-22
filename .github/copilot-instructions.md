# GitHub Copilot Instructions

This repository contains a React TypeScript application with Vite, using TanStack Query and Router for state management and routing.

## Development Scripts

### Running the Application

To run the application in development mode:
```bash
npm run dev
```

To build the application for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

### Testing

To run tests in watch mode:
```bash
npm test
```

To run tests with UI:
```bash
npm run test:ui
```

To run tests with coverage:
```bash
npm run test:coverage
```

### Linting

To check for linting errors:
```bash
npm run lint
```

To automatically fix linting errors:
```bash
npm run lint:fix
```

## Project Structure

- `src/` - Main source code directory
  - `components/` - React components
  - `routes/` - Application routes
  - `services/` - API services and data fetching logic
  - `hooks/` - Custom React hooks
  - `contexts/` - React contexts
  - `types/` - TypeScript type definitions
  - `test/` - Test utilities and setup

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest with Testing Library
- **Routing**: TanStack Router
- **State Management**: TanStack Query (React Query)
- **Linting**: ESLint with TypeScript support
- **Styling**: CSS

## Getting Started

Before running any commands, make sure to install dependencies:
```bash
npm ci
```
