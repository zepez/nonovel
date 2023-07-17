# nonovel.io

The launch of NoNovel can be split into three phases.

### Phase 1

NoNovel can only be used to read public domain books. There are no options to self publish or monetize books. Users can create accounts and NoNovel will track their progress for each project.

Before Launch:

- [x] Basic schema (profile, user, project, chapter)
- [ ] OAuth
  - [x] Github
  - [ ] Google
  - [ ] Discord
- [x] Basic Chapter Reading Settings
- [x] Project genres
- [x] Profile country code
- [x] View tracking
- [x] Chapter navigation
- [x] Review system (project)
- [x] Omni-search profiles by username and project by name (\* only projects for now.)
- [x] Comment system (profile, project, chapter)
- [x] Epub parsing library
- [x] Epub CLI
- [x] Split seeding script into fake and real data. Seed genres for real, make idempotent (pre-generate ids with ON CONFLICT)
  - [x] seed genres
- [x] Add genre support to the CLI
- [x] AI generated synopsis for public domain books?
- [x] AI selected genres for public domain books?
- [x] Compress + convert cover images to jpg before converting to base64
- [ ] Clean up epub / cli packages
- [ ] Decide on header links and make responsive
- [ ] Comments:
  - [ ] paginate
  - [ ] editing
  - [ ] delete
  - [ ] delete from settings/comments page
- [ ] Reviews
  - [ ] paginate
  - [ ] delete from settings/reviews page
- [ ] Voting system (chapter (repurpose as a `like`?), comment, review)
- [ ] Report system (profile, project, chapter, comment)
- [ ] File uploading via UploadThing (\* base64 for project cover, uploadthing for profile pictures)
- [ ] Upload a lot of public domain books
- [ ] Browse by category and ranking pages
- [ ] Home and about pages
- [ ] Custom login / register / logout pages or modals
- [ ] Callback URL on successful login/register/logout
- [ ] Logo?
- [ ] SEO / page metadata

After Launch:

- [ ] Reaction system (?) (chapter)
- [ ] Project tags (?)

### Phase 2

CMS. Users can publish and edit content for themselves.

### Phase 3

Monetization. Potential revshare.

## Technology

- [Next.js 13 App Directory](https://nextjs.org/docs/getting-started/project-structure)
- [React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [Next Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Auth.js](https://next-auth.js.org/)
- [PostgreSQL (NeonDB)](https://neon.tech/)
- [Redis (Upstash)](https://upstash.com/)
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)
- [Shadcn UI](https://ui.shadcn.com/)
- [Radix](https://www.radix-ui.com/)
- [TailwindCSS](https://tailwindcss.com/)

## Packages

- `config-client` - Validated environment variables, available on the client. Must be prefixed with `NEXT_PUBLIC_`.
- `config-server` - Validated environment variables, only available on the server. Contains secrets and extends `config-client`.
- `db` - Postgres client, migration script, migrations, schema and seeding script.
- `drizzle-adapter` - Custom adapter for Auth.js to work with Drizzle ORM
- `kv` - Redis client and helpers.
- `lib` - Helpers
- `query` - Prepared queries along with interface containing error handling and validation.
- `validator` - Custom zod schemas for validating database and form entries. Used instead of `drizzle-zod` so that validator can be used on the server and client.
- `web` - The primary NoNovel.io Next.js app.
