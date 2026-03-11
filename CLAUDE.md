# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server with Turbopack (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest unit tests (jsdom environment)
npm run setup        # First-time setup: install + prisma generate + migrate
npm run db:reset     # Reset SQLite DB and re-run migrations
```

## Architecture

**UIGen** is an AI-powered React component generator with a three-panel layout:
- **Left (35%):** Chat interface for AI conversations
- **Right (65%):** Preview tab (live JSX preview in iframe) + Code tab (file tree + Monaco editor)

### Key Data Flow

1. User sends a chat message → `src/app/api/chat/route.ts` (streaming API)
2. Claude responds with tool calls (`str_replace_editor`, `file_manager`) to create/modify files
3. File changes update the virtual file system (`src/lib/file-system.ts`) held in `FileSystemContext`
4. JSX files are transformed via `src/lib/transform/jsx-transformer.ts` (Babel standalone + import maps) for live preview in iframe
5. Project state (messages + virtual FS) is serialized to JSON and persisted in SQLite via Prisma

### Database
- The database schema is defined in the @prisma/schema.prisma file.  Reference it anytime you need to understand the structure of data stored in the databases.

### State Management

- `src/lib/contexts/chat-context.tsx` — message history, input, streaming state
- `src/lib/contexts/file-system-context.tsx` — in-memory virtual file system, refresh triggers
- No Redux/Zustand; uses React Context + server actions

### Auth

JWT tokens in HTTP-only cookies (`src/lib/auth.ts`). Anonymous users are supported — work is tracked via `src/lib/anon-work-tracker.ts`. Auth check happens in `src/middleware.ts`.

### AI Provider

`src/lib/provider.ts` wraps Anthropic Claude via Vercel AI SDK. Falls back to a mock provider (static component output) when `ANTHROPIC_API_KEY` is absent.

### Database

SQLite via Prisma. Two models: `User` and `Project`. Project stores `messages` and `data` (virtual FS) as JSON strings.

### Path Alias

`@/*` → `src/*`

## Environment

- `ANTHROPIC_API_KEY` — optional; enables real AI. Without it, mock provider is used.
- `JWT_SECRET` — optional in dev; defaults to a dev key.
