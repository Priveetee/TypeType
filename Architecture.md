# Architecture

## Overview

TypeType is a single-page application. It communicates with TypeType-Server over HTTP and renders everything client-side. There is no server-side rendering, no build-time data fetching, no runtime process.

## Stack

| Role | Tool | License |
|---|---|---|
| Language | TypeScript (strict) | Apache 2.0 |
| Runtime / Package manager | Bun | MIT |
| Build | Vite | MIT |
| Framework | React | MIT |
| Routing | TanStack Router | MIT |
| Server state | TanStack Query | MIT |
| Client state | Zustand | MIT |
| Video player | Vidstack | MIT |
| Styling | Tailwind CSS | MIT |
| Components | shadcn/ui + Radix UI | MIT |
| Lint / Format | Biome | MIT / Apache 2.0 |
| Monorepo consistency | Sherif | MIT |
| Dead code | Knip | ISC |

## Repository Structure

```
TypeType/
├── apps/
│   └── web/              (the React application)
│       ├── src/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── routes/
│       │   └── types/
│       └── public/
├── Dockerfile
├── nginx.conf
└── docker-compose.yml
```

## Data Flow

```
User action (search, click, play)
        |
        v
TanStack Query (cache check)
        |
        | cache miss
        v
TypeType-Server  GET http://localhost:8080/...
        |
        v
JSON response
        |
        v
TanStack Query (cache store)
        |
        v
React component (render)
```

## Services

The frontend depends on two backend services at runtime:

**TypeType-Server** (`http://localhost:8080`) — Kotlin/Ktor server. Handles all extraction (YouTube, NicoNico, BiliBili) and user data (history, playlists, subscriptions, etc.). The frontend communicates exclusively with this service.

**TypeType-Token** (`http://localhost:8081`) — Bun microservice that generates YouTube PO tokens. The frontend never contacts it directly — TypeType-Server calls it internally before serving stream data.

## Backend Contract

Base URL: `http://localhost:8080` (configurable via `VITE_API_URL`).

All responses are JSON. Errors return `{ "error": "..." }` with an appropriate HTTP status code.

### Authentication

Protected endpoints require an `X-Instance-Token` header. Obtain it once on startup via `GET /token` and reuse it for the session.

### Service IDs

The `service` query parameter is an integer:

| Value | Platform |
|---|---|
| `0` | YouTube |
| `5` | BiliBili |
| `6` | NicoNico |

### Extraction endpoints (no auth)

| Method | Path | Description |
|---|---|---|
| GET | `/streams?url=` | Full stream info for a video |
| GET | `/streams/manifest?url=` | DASH MPD built from extracted streams |
| GET | `/streams/native-manifest?url=` | YouTube native DASH manifest, URLs proxied |
| GET | `/search?q=&service=&nextpage=` | Paginated search |
| GET | `/suggestions?query=&service=` | Autocomplete suggestions |
| GET | `/trending?service=` | Trending items |
| GET | `/comments?url=&nextpage=` | Paginated comments |
| GET | `/comments/replies?url=&repliesPage=` | Paginated comment replies |
| GET | `/channel?url=&nextpage=` | Channel info and videos |
| GET | `/bullet-comments?url=&nextpage=` | Danmaku (NicoNico, BiliBili) |
| GET | `/proxy?url=` | Media proxy — forwards Range headers |
| GET | `/token` | Returns `{ "token": "..." }` |

### User data endpoints (require `X-Instance-Token`)

| Method | Path |
|---|---|
| GET / POST / DELETE | `/history`, `/history/{id}` |
| GET / POST / DELETE | `/subscriptions`, `/subscriptions/{channelUrl}` |
| GET / POST / GET / PUT / DELETE | `/playlists`, `/playlists/{id}` |
| POST / DELETE | `/playlists/{id}/videos`, `/playlists/{id}/videos/{videoUrl}` |
| GET / POST / DELETE | `/favorites`, `/favorites/{videoUrl}` |
| GET / POST / DELETE | `/watch-later`, `/watch-later/{videoUrl}` |
| GET / PUT | `/progress/{videoUrl}` |
| GET / PUT | `/settings` |
| GET / POST / DELETE | `/search-history` |
| GET / POST / DELETE | `/blocked/channels`, `/blocked/channels/{url}` |
| GET / POST / DELETE | `/blocked/videos`, `/blocked/videos/{url}` |

### Key behavioral notes

- `GET /progress/{videoUrl}` returns 404 when no position has been recorded — treat as `position: 0`, not an error
- `GET /streams/native-manifest` — use this first for YouTube; fall back to `/streams/manifest` on 422
- `GET /streams/manifest` for NicoNico returns 422 — no DASH possible, expected
- `GET /channel` pagination: metadata fields are only populated on page 1 — cache them client-side
- String fields are never JSON null — the server returns `""` when a value is unavailable
- `StreamResponse.uploaded` is a Unix timestamp in milliseconds, `-1` when unavailable
- `SponsorBlockSegmentItem.startTime` / `endTime` are in seconds (Double)

## License Boundary

TypeType-Server is GPL v3. TypeType is MIT. They are separate programs communicating over HTTP. No code, no types, no logic crosses this boundary. Types in `apps/web/src/types/` are derived from the API contract, not from Kotlin classes.

All frontend dependencies must be MIT or ISC licensed.
