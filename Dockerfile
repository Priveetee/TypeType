FROM oven/bun:1.3.10-slim AS builder

WORKDIR /app

COPY bun.lock package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/

RUN bun install --frozen-lockfile

COPY apps/web ./apps/web
COPY packages ./packages

RUN bun run --cwd apps/web build

FROM nginx:alpine AS runner

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
