# TypeType

Self-hosted, privacy-respecting video platform for YouTube, NicoNico, and BiliBili. A clean TypeScript rewrite — not a fork of any existing frontend.

Read the [Manifesto](./MANIFESTO.md) to understand why this exists and the decisions behind it.

## Requirements

TypeType is a frontend-only SPA. It requires two backend services to function:

- **TypeType-Server** — Kotlin/Ktor extraction server wrapping PipePipeExtractor, backed by PostgreSQL and Dragonfly
- **TypeType-Token** — Bun microservice that generates PO tokens for YouTube (required for reliable YouTube playback)

The easiest way to run everything together is with the provided [docker-compose.yml](./docker-compose.yml).

## Docker (recommended)

Create a `.env` file at the repository root. At minimum:

```
ALLOWED_ORIGINS=http://localhost:80
DATABASE_URL=jdbc:postgresql://postgres:5432/typetype
DATABASE_USER=typetype
DATABASE_PASSWORD=typetype
DRAGONFLY_URL=redis://dragonfly:6379
```

Then start all services:

```sh
docker compose up -d
```

Container tags are published to GHCR with:

- `latest` on default branch builds
- `sha-<short-sha>` on every build
- branch tags (for example `main`)
- release tags when pushing Git tags like `v1.2.3` (`1.2.3` and `1.2`)

| Service | Port | Description |
|---|---|---|
| TypeType (frontend) | `80` | nginx serving the React SPA |
| TypeType-Server | `8080` | Kotlin extraction + user data API |
| TypeType-Token | `8081` | YouTube PO token generator |
| PostgreSQL 17 | `5432` | User data persistence |
| DragonflyDB | `6379` | Extraction result cache |

The frontend is available at `http://localhost:80`.

## Development

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- A running TypeType-Server instance (see [TypeType-Server](https://github.com/Priveetee/TypeType-Server))

### Setup

```sh
bun install
```

### Configure

```sh
cp apps/web/.env.example apps/web/.env
```

Set `VITE_API_URL` to the URL of your running TypeType-Server:

```
VITE_API_URL=http://localhost:8080
```

### Run

```sh
bun run dev
```

The app is available at `http://localhost:5173`.

### Build

```sh
bun run build
```

### Lint

```sh
bun run check
```

## Stack

| Role | Tool |
|---|---|
| Language | TypeScript (strict) |
| Runtime / Package manager | Bun |
| Build | Vite |
| Framework | React |
| Routing | TanStack Router |
| Server state | TanStack Query |
| Client state | Zustand |
| Player | Vidstack |
| Styling | Tailwind CSS |
| Components | shadcn/ui + Radix UI |
| Lint / Format | Biome |
| Monorepo consistency | Sherif |
| Dead code | Knip |

## Architecture

See [Architecture.md](./Architecture.md) for the full architectural overview, license boundaries, and API contract.

## License

MIT
