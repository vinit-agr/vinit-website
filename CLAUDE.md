# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

This is a **Next.js 14 personal website** using the App Router with TypeScript, TailwindCSS, and shadcn/ui components.

### Directory Structure

- **`app/`** - Next.js App Router pages and API routes. Each feature has its own directory with `page.tsx`, `components/`, and `api/` subdirectories.
- **`components/`** - Global shared components (navigation, footer, theme provider)
- **`components/ui/`** - shadcn/ui primitives (buttons, dialogs, cards, etc.)
- **`app/shared/`** - Shared backend utilities (MongoDB, OpenAI, S3 uploader)
- **`lib/utils.ts`** - Contains the `cn()` helper for merging Tailwind classes

### Feature Modules

Each feature under `app/` is self-contained:
- `cyber-sign/` - PDF signing functionality
- `emoji-maker/` - Custom emoji generation with OpenAI
- `image-generator/` - Image generation via Replicate
- `meme-generator/` - Meme template browser
- `openapi-describer/` - OpenAPI specification tool
- `slack_analyzer/` - Slack message analysis
- `prompt_generator/` - AI prompt generator

### API Route Pattern

API routes follow the Next.js App Router convention at `app/[feature]/api/[endpoint]/route.ts`. They export named functions (`GET`, `POST`, etc.).

### Styling

- Uses TailwindCSS with CSS variables for theming (dark/light mode via `next-themes`)
- shadcn/ui components configured with `@/components/ui` path alias
- Global styles in `app/globals.css`

### Path Aliases

```
@/* -> ./*
```

Use `@/components`, `@/lib/utils`, etc. for imports.

### Code Style Guidelines

From `.cursor/rules/front-end-cursor-rules.mdc`:
- Use early returns for readability
- Use Tailwind classes exclusively for styling (no CSS files or `<style>` tags)
- Event handlers should use "handle" prefix (e.g., `handleClick`, `handleKeyDown`)
- Use `const` arrow functions over `function` declarations
- Include accessibility attributes (tabindex, aria-label, keyboard handlers)
