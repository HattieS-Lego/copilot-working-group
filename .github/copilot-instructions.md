# Copilot Instructions for Copilot Working Group

## Project Overview

This is a React + TypeScript application built with Vite. It uses TanStack Router for routing and TanStack Query for data fetching. The project serves as a workshop repository for learning GitHub Copilot.

## Technology Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Router**: TanStack Router
- **State Management**: TanStack Query (React Query)
- **Testing**: Vitest with Testing Library
- **Linting**: ESLint 9 with flat config
- **Styling**: CSS

## How to Run the Application

### Development Server
```bash
npm run dev
```
Starts the Vite development server. The app will be available at `http://localhost:5173` by default.

### Build
```bash
npm run build
```
Compiles TypeScript and builds the production bundle using Vite.

### Preview
```bash
npm run preview
```
Preview the production build locally.

## Testing

### Run Tests
```bash
npm test
```
Runs tests in watch mode using Vitest.

### Run Tests with UI
```bash
npm run test:ui
```
Opens the Vitest UI for interactive test running.

### Run Tests with Coverage
```bash
npm run test:coverage
```
Generates test coverage report.

## Linting

### Check for Lint Errors
```bash
npm run lint
```
Runs ESLint to check for code quality issues.

### Auto-fix Lint Errors
```bash
npm run lint:fix
```
Automatically fixes fixable ESLint issues.

## Project Structure

- **`src/`**: Source code
  - **`components/`**: React components
  - **`routes/`**: TanStack Router route components
  - **`services/`**: API services and interfaces
  - **`types/`**: TypeScript type definitions
  - **`hooks/`**: Custom React hooks
  - **`contexts/`**: React context providers
  - **`test/`**: Test utilities and setup
- **`assets/`**: Static assets
- **`.github/`**: GitHub configuration and workflows

## Important Notes

- Always run `npm ci` to install dependencies (not `npm install`) to ensure reproducible builds
- The project uses ESLint flat config format (`eslint.config.js`)
- Tests are located alongside components with `.test.tsx` extension
- The router uses file-based routing with TanStack Router
- Type checking is done separately from linting using TypeScript compiler
