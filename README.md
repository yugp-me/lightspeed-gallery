# Lightspeed Gallery

A self-hosted photography gallery built with Next.js, TypeScript, SQLite, Prisma, and Sharp.

## Local setup

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Set `ADMIN_PASSWORD_HASH` to the supplied bcrypt hash and replace `SESSION_SECRET` with a random secret. In `.env.`, escape each hash dollar sign as `\$` because Next.js expands `$` references in environment files.
5. Run `npm run db:push`.
6. Start with `npm run dev` and open `http://localhost:3000`.

Uploaded originals are stored in `photos/og`, gallery thumbnails in `photos/thumbs`, and lightbox images in `photos/big`.

## Checks

Use `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` before deployment.