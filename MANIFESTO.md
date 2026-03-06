# Manifesto

## Context

Piped and PipePipe represent years of serious work by contributors who gave their time to build privacy-respecting alternatives to mainstream video platforms. That work is the foundation TypeType is built on. The UX decisions in Piped, the extraction capabilities in PipePipeExtractor, the multi-service support in PipePipe — none of this appeared from nothing. TypeType exists because of it.

Projects have natural lifecycles. Piped's Vue frontend has slowed significantly. PipePipe-X, an ambitious rewrite, is archived. This is not a failure of the people involved — it is the reality of open-source software maintained by individuals with finite time and energy.

TypeType picks up from where that work left off, with a different stack and a different structure, and with full respect for what came before.

## Technical Decisions

**React.**
Not because it is the most elegant framework. Solid.js has a more refined reactivity model. But React has thirteen years of production use, the largest contributor pool of any frontend framework, and the deepest library ecosystem. For an open-source project, the pool of people who can read, fix, and extend the code matters. The weaknesses commonly attributed to React are execution problems, not design flaws.

**TypeScript, strict.**
The web is JavaScript. TypeScript is the only sane way to write it at scale. No `any`. Types are not optional documentation. They are the contract.

**Bun.**
Fast, all-in-one runtime, package manager, and bundler. The definitive answer for JavaScript tooling in 2026.

**SPA.**
TypeType is a self-hosted platform. The person deploying it controls the network and the reverse proxy. A single-page application served as static files is simpler to deploy, simpler to maintain, and simpler to upgrade than a server-side rendered application with a permanent runtime process.

**Two repositories, one boundary.**
PipePipeExtractor is GPL v3. The Kotlin wrapper that links to it is GPL v3. The TypeScript frontend is MIT. These are separate programs that communicate over HTTP. The REST API is the legal and architectural boundary between them. No code crosses it.

## Philosophy

Open-source projects are not eternal. They are started by people with energy and conviction, and they end when that energy runs out. That is the natural lifecycle of this kind of work.

TypeType might not work. It might stall, lose momentum, or be abandoned one day. That is an honest possibility. This project exists first for its author, and is shared with anyone who finds it useful. At some point it will end. That is normal. That is the principle of open source.

What matters is that the work does not disappear. A fork is not a betrayal. It is the continuation of an idea by someone who still cares about it. The license exists precisely for this.

TypeType is that continuation.
