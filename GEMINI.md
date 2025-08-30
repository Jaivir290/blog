# GEMINI.md

## Project Overview

This is a web application built with Vite, React, and TypeScript. It uses Shadcn-UI and Tailwind CSS for styling. The project is a blog platform that includes features like authentication, a rich text editor for writing posts, and an admin dashboard.

### Key Technologies

*   **Framework:** React
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS, Shadcn-UI
*   **Routing:** React Router
*   **Data Fetching:** TanStack Query
*   **Authentication:** Supabase (currently using a mock implementation)

## Building and Running

### Prerequisites

*   Node.js and npm

### Development

To run the development server:

```bash
npm run dev
```

This will start the Vite development server with hot reloading.

### Build

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.

### Linting

To lint the codebase:

```bash
npm run lint
```

## Development Conventions

*   **Component-Based Architecture:** The project follows a component-based architecture, with components located in the `src/components` directory.
*   **Styling:** Styling is done using Tailwind CSS and Shadcn-UI. Custom styles are in `src/App.css` and `src/index.css`.
*   **State Management:** The project uses a combination of React's built-in state management and TanStack Query for server state.
*   **Authentication:** Authentication is handled via `src/contexts/AuthContext.tsx`. It's currently a mock implementation but is set up to use Supabase.
*   **File Paths:** The project uses a path alias `@` to refer to the `src` directory.
