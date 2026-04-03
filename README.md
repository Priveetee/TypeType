# TypeType

TypeType is a self-hosted, privacy-respecting video platform frontend.

It is a clean TypeScript rewrite and runs as a SPA served by nginx.

Current focus is desktop and laptop UX. Mobile support is planned for a later phase.

## Runtime services

TypeType frontend depends on:

- TypeType-Server (API, auth, extraction): `http://localhost:8080`
- TypeType-Token (PO token helper): `http://localhost:8081`

The easiest setup is Docker Compose at repository root.

## Quick start (Docker)

Create `.env` in repo root:

```env
ALLOWED_ORIGINS=http://localhost:80
DATABASE_URL=jdbc:postgresql://postgres:5432/typetype
DATABASE_USER=typetype
DATABASE_PASSWORD=typetype
DRAGONFLY_URL=redis://dragonfly:6379
```

Start stack:

```sh
docker compose up -d
```

Open:

- Frontend: `http://localhost:80`
- Server API: `http://localhost:8080`
- Token service: `http://localhost:8081`

## Local development

### Prerequisites

- Bun >= 1.0
- Running TypeType-Server

### Install

```sh
bun install
```

### Configure frontend env

```sh
cp apps/web/.env.example apps/web/.env
```

Set API base URL in `apps/web/.env`:

```env
VITE_API_URL=http://localhost:8080
```

### Run dev server

```sh
bun run dev
```

Open `http://localhost:5173`.

### Build and checks

```sh
bun run build
bun run check
```

## Docker image tags (GHCR)

Published tags:

- `latest` on default branch
- `sha-<short-sha>` on every build
- branch tags (for example `main`)
- release tags from git tags like `v1.2.3` (`1.2.3`, `1.2`)

## Documentation

- Architecture and API boundary: `Architecture.md`
- Agent operating rules: `AGENTS.md`

## Roadmap

- Continue stabilizing desktop watch experience
- Add dedicated mobile UX and layout support
- Keep API compatibility with TypeType-Server

## Acknowledgments

A huge thanks to the projects that made this possible. TypeType is a clean rewrite, and this frontend would not exist without the work these teams published first.

- [TeamPiped/Piped-Frontend](https://github.com/TeamPiped/Piped-Frontend) - UX and API pattern reference
- [FreeTubeApp/FreeTube](https://github.com/FreeTubeApp/FreeTube) - video player behavior reference
- [InfinityLoop1308/PipePipe](https://github.com/InfinityLoop1308/PipePipe) - multi-service behavior reference
- [InfinityLoop1308/PipePipeExtractor](https://github.com/InfinityLoop1308/PipePipeExtractor) - extraction engine used by the backend API

## License

MIT
