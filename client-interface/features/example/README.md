# Feature Module: Example

This is an example feature module demonstrating the recommended structure.

## Structure

- **components/** - Feature-specific components
- **hooks/** - Custom hooks for this feature
- **utils/** - Utility functions for this feature
- **types.ts** - TypeScript types/interfaces for this feature

## Usage

Import components and utilities from this feature as needed:

\\\	sx
import { ExampleComponent } from '@/features/example/components/ExampleComponent';
import { useExample } from '@/features/example/hooks/useExample';
\\\

## Guidelines

1. Keep all feature-related code within this folder
2. Export only what's needed by other parts of the app
3. Keep internal utilities and components private when possible
4. Document complex logic and APIs
