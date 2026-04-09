# TypeType

TypeType is a self-hosted, privacy-respecting video platform frontend.

It is a clean TypeScript rewrite and runs as a SPA served by nginx.

Current focus is a reliable desktop-first UX with responsive support for mobile layouts.

## Core product areas

- Watch experience (video playback, subtitles, audio language selection, history/progress).
- Shorts experience (vertical navigation, subscriptions feed, blended discovery support).
- Import and restore tools (YouTube Takeout import and PipePipe backup restore).
- User controls (settings, recommendation privacy, playlists, favorites, watch later).

## Runtime services

TypeType frontend depends on:

- TypeType-Server (API, auth, extraction): `http://localhost:8080`
- TypeType-Token (PO token helper): `http://localhost:8081`
- TypeType-Downloader (download jobs, internal)
- Garage (S3-compatible storage for downloader artifacts, internal)

The easiest setup is Docker Compose at repository root.

## Quick start (Docker)

End-user one-liner installer (no git/clone needed):

```sh
curl -fsSL https://raw.githubusercontent.com/Priveetee/TypeType/main/scripts/install-stack.sh | bash
```

By default, this installs to `~/typetype-stack` and starts the stack.

When `.env` is created, downloader S3 credentials are generated uniquely (random) for this host.
No hardcoded shared downloader secret is used at install time.

Requirements before running this command:

- Docker installed
- Docker Compose v2 available (`docker compose version`)
- Ports `8080`, `8081`, `8082` must be free

---

One-command interactive setup (recommended):

```sh
./scripts/setup-stack.sh
```

This script:

- asks for env values (with safe defaults)
- writes `.env`
- pulls images
- starts containers
- bootstraps Garage for downloader artifacts
- prints `docker compose ps`

If you already run another stack on ports `8080/8081/8082`, stop it first or change port mappings in `docker-compose.yml`.

Manual setup (if you prefer):

1) Create `.env` in repo root:

```sh
cp .env.example .env
```

2) Start stack:

```sh
docker compose pull
docker compose up -d
docker compose ps
```

The frontend container mounts local `nginx.conf` by default, so proxy and upload-limit updates are applied from this repository file.

3) Initialize Garage (required once for downloader artifacts):

```sh
./scripts/bootstrap-garage.sh
```

4) Open:

- Frontend: `http://localhost:8082`
- Server API: `http://localhost:8080`
- Token service: `http://localhost:8081`
- Downloader service (internal Docker network): `http://typetype-downloader:18093`
- Downloader API from frontend/server flow: `/api/downloader/*`

## Synology notes

- Use Container Manager > Project and point it to this `docker-compose.yml`.
- Put the `.env` file next to `docker-compose.yml` before starting the project.
- If port `8082` is already used, change `docker-compose.yml` to another host port, for example `8088:80`, and set `ALLOWED_ORIGINS=http://localhost:8088`.
- First start can take a few minutes while images are pulled.

## Troubleshooting

- `.env not found`: create `.env` in repository root (same folder as `docker-compose.yml`).
- Frontend not loading: run `docker compose logs typetype`.
- Backend API not responding: run `docker compose logs typetype-server`.
- Downloader artifact issues: run `./scripts/bootstrap-garage.sh` again, then restart downloader with `docker compose up -d typetype-downloader`.
- Port already in use: change host ports in `docker-compose.yml` and restart with `docker compose up -d`.
- After updating `nginx.conf`: restart frontend with `docker compose up -d typetype`.

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

## API contract notes

- Frontend runtime uses `/api` proxy in production container mode.
- Authenticated endpoints require `Authorization: Bearer <token>`.
- Recommendation personalization is controlled through `/settings`.

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
