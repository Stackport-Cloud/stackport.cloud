---
title: Installation
description: Install StackPort via pip, Docker, or Docker Compose.
---

## pip

```bash
pip install stackport
```

Then run:

```bash
stackport
```

StackPort starts on `http://localhost:8080` by default.

## Docker

```bash
docker run -p 8080:8080 \
  -e AWS_ENDPOINT_URL=http://host.docker.internal:4566 \
  davireis/stackport
```

Replace `4566` with whatever port your emulator runs on. Use `host.docker.internal` to reach services on the host machine.

## Docker Compose

The recommended way to run StackPort alongside an emulator:

```bash
curl -O https://raw.githubusercontent.com/DaviReisVieira/stackport/main/examples/docker-compose.yml
docker compose up -d
```

This starts StackPort + MiniStack together. The compose file:

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

## Requirements

- **Python 3.12+** (for pip install)
- **Docker** (for container-based setup)
- An AWS-compatible endpoint (emulator or real AWS credentials)
