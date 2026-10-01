---
title: Docker
description: Run the StackPort Docker image on its own or in Docker Compose, with networking, health checks, AWS profiles and persistent settings.
---

## The image

StackPort is published to Docker Hub as `davireis/stackport`, for `linux/amd64` and `linux/arm64`. Every release is tagged with its version (for example `0.4.5`) and `latest` follows the newest one. The image is built in two stages: Node builds the UI, then a slim Python image runs the backend and serves the UI from the same port.

```bash
docker run -p 8080:8080 \
  -e AWS_ENDPOINT_URL=http://host.docker.internal:4566 \
  -e AWS_ACCESS_KEY_ID=test -e AWS_SECRET_ACCESS_KEY=test \
  davireis/stackport
```

All [environment variables](/docs/configuration/environment-variables/) work the same inside the container.

## Networking

Inside a container, `localhost` is the container itself, so the endpoint URL depends on where the emulator runs:

- **Emulator on your host:** use `http://host.docker.internal:<port>`. On Linux, add `--add-host=host.docker.internal:host-gateway` to `docker run`.
- **Emulator in the same Compose project:** use the service name, such as `http://ministack:4566`, `http://floci:4566`, `http://localstack:4566` or `http://moto:5000`.

Some emulators build the URLs they return (SQS queue URLs, pre-signed URLs) from a configured hostname. Each [emulator guide](/docs/configuration/emulators/) shows the setting that keeps those URLs reachable from other containers.

## Compose examples

The repository has three ready-made files under [`examples/`](https://github.com/DaviReisVieira/stackport/tree/main/examples):

| File | What it runs |
|---|---|
| `docker-compose.yml` | MiniStack, StackPort and a seed container |
| `docker-compose.floci.yml` | Floci, StackPort and the same seed container |
| `docker-compose.multi-endpoint.yml` | Two MiniStack instances plus a real AWS account through a profile |

The seed creates a few resources across S3, SQS, SNS, DynamoDB, Secrets Manager, IAM, CloudWatch Logs and Step Functions. It is safe to re-run: once it completes it writes a marker object and later runs skip. Drop it once you point StackPort at your own stack.

The [MiniStack](/docs/guides/ministack/), [Floci](/docs/guides/floci/), [LocalStack](/docs/guides/localstack/) and [Moto](/docs/guides/moto/) guides each include a complete Compose file.

A minimal StackPort service looks like this. Swap the endpoint for your emulator's service name and port:

```yaml
services:
  stackport:
    image: davireis/stackport:latest
    ports:
      - "8080:8080"
    environment:
      - AWS_ENDPOINT_URL=http://my-emulator:4566
      - AWS_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
    restart: unless-stopped
```

## Health check

StackPort answers on `/api/health` with its version, the active endpoint, whether it is local or real AWS, and whether writes and lessons are enabled. The image includes Python, so a health check needs no extra tools:

```yaml
healthcheck:
  test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8080/api/health')"]
  interval: 10s
  timeout: 3s
  retries: 3
```

Health check requests are left out of the logs unless `LOG_LEVEL=DEBUG`.

## AWS profiles and SSO in the container

To use named profiles, SSO or AssumeRole from inside the container, mount your AWS config. Read-only is enough:

```yaml
services:
  stackport:
    image: davireis/stackport:latest
    volumes:
      - ~/.aws:/root/.aws:ro
    environment:
      - AWS_PROFILE=my-profile
      - STACKPORT_ALLOW_WRITES=false
```

If an SSO session expires, StackPort answers with a clear message asking you to run `aws sso login --profile <name>` on the host. See [Real AWS and Read-only Mode](/docs/configuration/real-aws/).

## Keeping settings across restarts

Endpoints added from the Settings page and lesson progress live in `/root/.stackport` inside the container. Mount a volume there to keep them:

```yaml
services:
  stackport:
    image: davireis/stackport:latest
    volumes:
      - stackport-data:/root/.stackport

volumes:
  stackport-data:
```
