# Architecture

TypeType is split into independently versioned repositories. This repository owns the product stack and coordinates releases; it does not contain component source code or Git submodules.

## Runtime

```text
Browser
  |
  v
TypeType-Frontend
  |
  v
TypeType-Server --------> TypeType-Token
  |
  +---------------------> TypeType-Downloader
                              |
                              v
                           Garage

TypeType-Server --------> PostgreSQL
TypeType-Server --------> Dragonfly
```

The frontend and backend communicate over HTTP. TypeType-Server accesses TypeType-Token and TypeType-Downloader through internal HTTP endpoints. Each component owns its implementation and tests.

## Repository Ownership

| Repository | Owns |
| --- | --- |
| TypeType | Compose files, installer, stack updates, release coordination |
| TypeType-Frontend | Web UI and browser playback integration |
| TypeType-Server | Extraction API, authentication, and user data |
| TypeType-Player | MSE and SABR playback package |
| TypeType-Token | YouTube player decoding and token generation |
| TypeType-Downloader | Download jobs, media assembly, and artifacts |
| Docs-TypeType | User and self-hosting documentation |

## Release Coordination

Component repositories build and publish their own artifacts. A successful `dev` image publication sends its component, version, revision, image, and digest to the `TypeType` repository. The central workflow validates this payload and serializes beta updates. Stable component notifications are recorded without triggering an update.

## License Boundary

Every repository keeps its own license. TypeType-Server and TypeType-Downloader are GPL components. The web frontend is an independent MIT program and communicates with the backend only through HTTP.
