# Architecture

## Overview

TypeType is a privacy-respecting video platform. It is composed of two independent programs that communicate over HTTP: a Kotlin extraction server and a TypeScript frontend. This separation is both technical and legal — the extraction server is GPL v3, the frontend is MIT.

## Layers

```
PipePipeExtractor  (Java, GPL v3)
        |
        | linked directly
        v
Ktor Server  (Kotlin, GPL v3)
        |
        | REST / JSON over HTTP
        v
Frontend  (TypeScript + React, MIT)
```

### PipePipeExtractor

Java library maintained by InfinityLoop1308. Supports YouTube, NicoNico, BiliBili. Handles extraction, parsing, and format resolution. This is the engine — it is not modified, only consumed.

Repository: `https://github.com/InfinityLoop1308/PipePipeExtractor`

### Ktor Server (Kotlin, GPL v3)

A thin wrapper around PipePipeExtractor. Its only responsibility is to expose the extraction capabilities as a REST/JSON API. It does not contain business logic, user data management, or anything unrelated to extraction.

Because it links directly to PipePipeExtractor (GPL v3), this server must be distributed under GPL v3.

### Frontend (TypeScript + React, MIT)

The actual product. A single-page application that consumes the Ktor server's REST API. It contains all UI logic, user preferences, and client-side state. It is a separate program — it communicates with the backend over the network and is not subject to GPL v3.

## Frontend Stack

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

## License Constraints

- All frontend dependencies must be MIT or ISC licensed.
- The Kotlin server is GPL v3 — no frontend code enters it, no server code enters the frontend.
- The REST API is the hard boundary between the two licenses.
- Before adding any dependency to either layer, its license must be verified.

## Data Flow

```
User action (search, click, play)
        |
        v
TanStack Query (cache check)
        |
        | cache miss
        v
Ktor Server (REST request)
        |
        v
PipePipeExtractor (extraction)
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

## Repository Architecture

The project is split into two separate repositories with distinct licenses and toolchains.

### TypeType (this repository)

The frontend — a Bun monorepo with workspaces.

```
TypeType/
├── apps/
│   └── web/          (the React application)
└── packages/
    ├── ui/           (shared components)
    └── types/        (shared TypeScript types)
```

- Language: TypeScript
- Toolchain: Bun workspaces, Vite, Biome, Sherif, Knip
- License: MIT
- No Kotlin or Java code enters this repository

### TypeType-Server (separate repository)

The Kotlin wrapper — a Gradle project.

```
TypeType-Server/
├── src/
│   └── main/kotlin/  (Ktor server, PipePipeExtractor integration)
└── build.gradle.kts
```

- Language: Kotlin
- Toolchain: Gradle, Ktor, PipePipeExtractor
- License: GPL v3 (required by PipePipeExtractor)
- No TypeScript code enters this repository

### Boundary

The REST API is the only point of contact between the two repositories. No code, no types, no logic crosses this boundary. Types consumed by the frontend are defined in `packages/types` and derived from API contracts — not from Kotlin classes.

## API Contract

The Ktor server exposes three endpoints. All responses are JSON. Errors return `{ "error": "..." }` with HTTP 422.

The `service` parameter is an integer:

| Value | Platform |
|---|---|
| `0` | YouTube |
| `5` | BiliBili |
| `6` | NicoNico |

### `GET /streams?url={fullVideoUrl}`

Full video URL required — not a bare video ID.

```
StreamResponse
  id                      string
  title                   string
  uploaderName            string
  uploaderUrl             string
  thumbnailUrl            string
  description             string
  duration                number              (seconds)
  viewCount               number
  likeCount               number
  dislikeCount            number              (-1 if unavailable)
  uploadDate              string              (textual — not ISO 8601, render as-is)
  hlsUrl                  string              (empty string if unavailable)
  dashMpdUrl              string              (empty string if unavailable)
  videoStreams             VideoStreamItem[]   (muxed — video + audio)
  audioStreams             AudioStreamItem[]   (audio only)
  videoOnlyStreams         VideoStreamItem[]   (video only — no audio track)
  sponsorBlockSegments    SponsorBlockSegmentItem[]

VideoStreamItem
  url           string
  format        string              ("MPEG_4" | "WEBM" | "v3GPP")
  resolution    string              ("1080p", "720p", …)
  bitrate       number | null       (null if unavailable)
  codec         string              ("vp9", "avc1", "av01", … — empty string if unavailable)
  isVideoOnly   boolean

AudioStreamItem
  url           string
  format        string
  bitrate       number | null       (null if unavailable)
  codec         string              ("opus", "mp4a", … — empty string if unavailable)
  quality       string | null       ("medium", "low", … — null if unavailable)

SponsorBlockSegmentItem
  startTime     number              (milliseconds)
  endTime       number              (milliseconds)
  category      string              ("sponsor", "intro", "outro", "interaction", …)
  action        string              ("skip", "mute")
```

### `GET /search?q={query}&service={service}&nextpage={cursor}`

`nextpage` is optional. Omit it on the first request. Pass the value from the previous response to fetch the next page. An invalid cursor returns HTTP 400 `{ "error": "..." }`.

```
SearchPageResponse
  items       VideoItem[]
  nextpage    string | null   (null when no further pages are available)
```

### `GET /trending?service={service}`

Returns `VideoItem[]`:

```
VideoItem
  id                  string    (identical to url)
  title               string
  url                 string    (full video URL — pass this to /streams)
  thumbnailUrl        string
  uploaderName        string
  uploaderUrl         string    (channel page URL — empty string if unavailable)
  uploaderAvatarUrl   string    (avatar image URL — empty string if unavailable)
  duration            number    (seconds)
  viewCount           number
  uploadDate          string    (textual — empty string if unavailable)
```

### Behavioral notes

String fields are never JSON null — the server returns `""` when a value is unavailable. The only nullable fields are `bitrate` (`number | null`) and `quality` (`string | null`) on stream items.

`dislikeCount` is `-1` for NicoNico and BiliBili. YouTube returns real values.

`SponsorBlockSegmentItem.startTime` and `endTime` are in milliseconds.

`uploaderAvatarUrl` is present on `VideoItem`. It is not present on `StreamResponse`.

SponsorBlock is active for YouTube and BiliBili. NicoNico always returns `[]`.

| Field | YouTube | NicoNico | BiliBili |
|---|---|---|---|
| `dislikeCount` | real value | `-1` | `-1` |
| `uploadDate` | textual | `""` | textual |
| `hlsUrl` / `dashMpdUrl` | may be present | `""` | `""` |
| `AudioStreamItem.bitrate` | present | `null` | `null` |
| `codec` | detailed | `""` | detailed |
| `sponsorBlockSegments` | present | `[]` | present |

## Reference Material

These projects are maps of the territory — they inform UX and API decisions but share no code with TypeType.

- `TeamPiped/Piped` — Vue frontend, UX reference, API patterns
- `FreeTubeApp/FreeTube` — video player patterns
- `InfinityLoop1308/PipePipe` — multi-service support reference
- `InfinityLoop1308/PipePipeClient` — how PipePipeExtractor is consumed in Java
