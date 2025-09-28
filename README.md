# System Design Playground

A learning playground for designing and building production-like systems with clear business domains and pragmatic architecture patterns. Includes ready-to-run observability stacks (LGTM and ELK) to practice metrics, logs, and traces locally.

```mermaid
graph TD
    subgraph "Application"
        API[HTTP API / Workers]
        Queue[(Redis Queue)]
        DB[(Postgres/Drizzle ORM)]
        API --> Queue
        API --> DB
    end

    subgraph "Observability"
        Prom[Prometheus]
        Loki[Loki]
        Tempo[Tempo]
        Grafana[Grafana]
        ES[Elasticsearch]
        LS[Logstash]
        Kib[Kibana]
        Filebeat[Filebeat]
        API -->|logs| Loki
        API -->|OTLP traces| Tempo
        k6[k6] -->|remote write| Prom
        Filebeat -->|Beats| LS --> ES --> Kib
        Grafana --> Prom
        Grafana --> Loki
        Grafana --> Tempo
    end
```

## What is this?

- Business-driven services to practice design and implementation
- Opinionated architecture principles (DDD, Hexagonal, DI, explicit side effects)
- Two observability stacks you can switch between: LGTM and ELK
- Load testing via k6 with Prometheus remote write

## Quick start

Requirements: Node.js, Docker, and Docker Compose installed.

Install deps and build:

```bash
yarn
yarn build
```

Start the app during development:

```bash
yarn dev
```

## Containerized local development (hot reload)

This repo includes a lightweight dev image and run scripts that mount your source code for hot reload while keeping dependencies cached in a named Docker volume.

### Build the dev image

```bash
yarn docker:build:dev
```

Key points from `dev.Dockerfile`:
- Installs build tools once, installs deps via Yarn, and exposes port 3300.
- Uses a dedicated volume for `node_modules` so host bind-mounts don’t clobber container deps.

```1:12:/Users/roackb2/Studio/projects/Playground/system-design-playground/dev.Dockerfile
FROM node:20-bullseye-slim
WORKDIR /app
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
 && rm -rf /var/lib/apt/lists/*
COPY package.json yarn.lock ./
RUN corepack enable && yarn config set nodeLinker node-modules && yarn install
VOLUME ["/app/node_modules"]
EXPOSE 3300
CMD ["yarn","dev"]
```

### Run the API with hot reload

```bash
yarn dev:docker
```

What it does:
- Binds repo root to `/app` so edits trigger `tsx watch` hot reload.
- Mounts a named volume at `/app/node_modules` to cache deps across runs.

If you run Redis/Postgres on your host, use Docker’s host alias in envs:
- Redis: set `REDIS_URL=redis://host.docker.internal:6379`
- Postgres: set `DATABASE_URL=postgres://USER:PASS@host.docker.internal:5432/DBNAME`

You can pass these to `docker run` or export them and reference in your scripts.

### Run the onboarding worker in a container

```bash
yarn dev:docker:worker:onboarding
```

This mirrors the API container settings and uses the same mounts and envs.

### Dependency caching behavior

- `node_modules` is stored in the named volume `system-design-playground_node_modules`.
- The first run seeds it from the image; subsequent runs reuse it (fast startup).
- When `yarn.lock` changes, rebuild the image to capture new deps:
  ```bash
  yarn docker:build:dev
  ```
- To force a clean install without rebuilding, remove the volume:
  ```bash
  docker volume rm system-design-playground_node_modules
  ```

## Observability

See [docs/obs-stack.md](docs/obs-stack.md) for diagrams and details. Short commands:

### LGTM (Loki, Grafana, Tempo, Prometheus)

```bash
npm run obs:lgtm:start
npm run obs:lgtm:stop
npm run obs:lgtm:down
npm run obs:lgtm:destroy
```
- Grafana: http://localhost:3300
- Prometheus remote write (for k6): http://localhost:9091/api/v1/write
- Loki: http://localhost:33100
- Tempo: http://localhost:33200 (OTLP gRPC 24317, OTLP HTTP 24318)

### ELK (Elasticsearch, Logstash, Kibana) + Filebeat

```bash
npm run obs:elk:start
npm run obs:elk:stop
npm run obs:elk:down
npm run obs:elk:destroy
```
- Kibana: http://localhost:5601
- Elasticsearch: http://localhost:9200

#### Application logs → ELK pipeline (local dev)

- App logging: `pino` writes newline-delimited JSON to `logs/app.json` and stdout
- Mount: Filebeat service mounts repo `logs/` to container path `/host-logs`
- Filebeat: reads `/host-logs/app.json` as NDJSON and ships to Logstash
- Logstash: normalizes to ECS (`message`, `log.level`, `process.pid`, `host.hostname`)
- Labels added for easy filtering: `project=system-design-playground`, `source=application|stack`, `service.name=system-design-playground-app`

Key files:
- [observability/stacks/elk/docker-compose.elk.yml](observability/stacks/elk/docker-compose.elk.yml)
- [observability/stacks/elk/filebeat/filebeat.yml](observability/stacks/elk/filebeat/filebeat.yml)
- [observability/stacks/elk/logstash/pipeline/logstash.conf](observability/stacks/elk/logstash/pipeline/logstash.conf)
- [src/lib/logger.ts](src/lib/logger.ts)

Kibana setup:
- Stack Management → Data views → New
  - Index pattern: `logs-*`
  - Timestamp field: `@timestamp`
- Discover filters:
  - Application logs: `project:"system-design-playground" AND source:"application"`
  - Stack logs: `project:"system-design-playground" AND source:"stack"`

## Project layout

- `src/` — services, domains, workers, and infrastructure
- `observability/` — docker-compose stacks and configs for LGTM and ELK
- `tests/load/` — k6 load tests
- `docs/` — product, system, observability documentation

Docs quick links:
- [docs/product.md](docs/product.md) — product scope and services
- [docs/system.md](docs/system.md) — design principles
- [docs/obs-stack.md](docs/obs-stack.md) — observability stacks, ports, commands
- [docs/implementation_status.md](docs/implementation_status.md) — current TODOs/next steps

## Architecture principles

Summarized from [docs/system.md](docs/system.md):
- Ubiquitous language aligned with business terms
- Domain-Driven Design for modular boundaries
- Hexagonal Architecture with clear ports/adapters
- Dependency Injection; wire concrete adapters at composition root
- Explicit side effects placed at the end of service flows

## Product context

From [docs/product.md](docs/product.md) (draft): onboarding/KYC, credit approval, loan application, cash inventory management, and risk mitigation are modeled as separate domains for practice.

## Current implementation status

- Queue abstraction and Redis adapter:
  - [src/infra/queue/QueuePort.ts](src/infra/queue/QueuePort.ts)
  - [src/infra/queue/RedisQueueAdapter.ts](src/infra/queue/RedisQueueAdapter.ts)
- Onboarding domain wiring:
  - [src/services/onboarding/OnboardingService.ts](src/services/onboarding/OnboardingService.ts) (enqueue on submit)
  - [src/services/onboarding/OnboardingRepository.ts](src/services/onboarding/OnboardingRepository.ts) (persist/query)
  - [src/services/onboarding/processors/OnboardingApplicationProcessor.ts](src/services/onboarding/processors/OnboardingApplicationProcessor.ts) (worker logic)
  - [src/workers/onboarding/OnboardingApplicationWorker.ts](src/workers/onboarding/OnboardingApplicationWorker.ts) (entrypoint)
- See [docs/implementation_status.md](docs/implementation_status.md) for next steps.

## License

ISC
