---
title: Docker Configuration
description: Running StackPort with Docker and Docker Compose.
---

## Docker Image

StackPort is published to Docker Hub as `davireis/stackport`.

```bash
docker run -p 8080:8080 \
  -e AWS_ENDPOINT_URL=http://host.docker.internal:4566 \
  davireis/stackport
```

### Networking

When your emulator runs on the host machine, use `host.docker.internal` as the hostname. When both run in Docker Compose, use the service name:

```yaml
environment:
  - AWS_ENDPOINT_URL=http://ministack:4566   # service name
```

## Docker Compose Examples

### With MiniStack

```yaml
services:
  stackport:
    image: davireis/stackport:latest
    ports:
      - "8080:8080"
    environment:
      - AWS_ENDPOINT_URL=http://ministack:4566
      - AWS_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
    restart: unless-stopped
    depends_on:
      ministack:
        condition: service_healthy

  ministack:
    image: ministackorg/ministack:latest
    ports:
      - "4566:4566"
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:4566/_ministack/health')"]
      interval: 5s
      timeout: 3s
      retries: 5
```

### With LocalStack

```yaml
services:
  stackport:
    image: davireis/stackport:latest
    ports:
      - "8080:8080"
    environment:
      - AWS_ENDPOINT_URL=http://localstack:4566
      - AWS_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
    depends_on:
      localstack:
        condition: service_healthy

  localstack:
    image: localstack/localstack:latest
    ports:
      - "4566:4566"
```

### Read-Only Mode

For shared or production-connected instances:

```yaml
environment:
  - STACKPORT_ALLOW_WRITES=false
  - AWS_PROFILE=production
```

## Health Check

StackPort exposes a health endpoint at `/api/health`:

```yaml
healthcheck:
  test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8080/api/health')"]
  interval: 10s
  timeout: 3s
  retries: 3
```
