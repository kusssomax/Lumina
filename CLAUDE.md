# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (Next.js)
npm run build    # Production build
npm run lint     # ESLint
```

No test suite is configured yet.

## Architecture

**Lumina** is a Next.js 16 app (React 19, TypeScript, Tailwind CSS v4) that lets authenticated users upload PDF books, which are parsed client-side, uploaded to Vercel Blob, and stored with text segments in MongoDB.

### Key data flow for book upload

1. **Client** (`UploadForm`) — validates via `react-hook-form` + Zod (`upload-form.schema.ts`), parses the PDF with `pdfjs-dist` in the browser (`parsePDFFile` in `src/lib/utils.ts`), and uploads files to Vercel Blob via the `/api/upload` route handler.
2. **API route** (`src/app/api/upload/route.ts`) — Vercel Blob server-side token generation; enforces Clerk auth and file size/type limits.
3. **Server actions** (`src/lib/actions/createBook.ts`) — `createBook` and `saveBookSegments` write to MongoDB via Mongoose; `isBookExists` prevents duplicates by slug.

### Database (`src/database/`)

- `mongoose.ts` — cached connection helper using `global.monggoseCache`.
- Models: `Book`, `BookSegment`, `VoiceSession` — all defined under `src/database/models/`.
- Types for all models live in `types.d.ts` at the project root.

### Auth

Clerk (`@clerk/nextjs`) handles authentication. Middleware is in `src/proxy.ts` (note: non-standard filename — Next.js middleware). `userId` (Clerk) is stored as `clerkId` on all database documents.

### UI

- `src/components/ui/` — shadcn/ui primitives.
- `src/components/UploadForm/` — multi-field form with file dropzone, voice persona picker, and loading overlay.
- Route `(root)` group: `/` (library) and `/books/new` (upload form).

### Environment variables required

- `MONGODB_URI` — MongoDB connection string.
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token.
- Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`).
