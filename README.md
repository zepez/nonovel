# nonovel.io

The launch of NoNovel can be split into three phases.

### Phase 1

NoNovel can only be used to read public domain books. There are no options to self publish or monetize books. Users can create accounts and NoNovel will track their progress for each project.

### Phase 2

Book Clubs. Users can upload epubs for private reading and invite other users to their `club`. All users in the club have access to the epub. Features:

- [ ] Uploading epubs
- [ ] Parse epub on demand
- [ ] Regenerate epub covers on demand
- [ ] Proper `library` support, show titles in library
- [ ] Club support, invite others
- [ ] Clubs show book progress

## Technology

- [Next.js 13 App Directory](https://nextjs.org/docs/getting-started/project-structure)
- [React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [Next Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Auth.js](https://next-auth.js.org/)
- [PostgreSQL (NeonDB)](https://neon.tech/)
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)
- [Shadcn UI](https://ui.shadcn.com/)
- [Radix](https://www.radix-ui.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Puppeteer](https://pptr.dev/)
- [ModelFusion](https://modelfusion.dev/guide/)

## Packages

- `config-client` - Validated environment variables, available on the client. Must be prefixed with `NEXT_PUBLIC_`.
- `config-server` - Validated environment variables, only available on the server. Contains secrets and extends `config-client`.
- `db` - Postgres client, migration script, migrations, schema and seeding script.
- `drizzle-adapter` - Custom adapter for Auth.js to work with Drizzle ORM
- `lib` - Helpers
- `query` - Prepared queries along with interface containing error handling and validation.
- `validator` - Custom zod schemas for validating database and form entries. Used instead of `drizzle-zod` so that validator can be used on the server and client.
- `web` - The primary NoNovel.io Next.js app.

## Building (docker 🐳)

1. docker buildx create --use
2. docker buildx build --platform linux/amd64 --load -t nonovel .
3. docker run --env-file ./.env -it nonovel web:dev --concurrency 20
