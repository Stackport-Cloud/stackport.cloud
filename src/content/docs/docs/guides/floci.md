---
title: Using StackPort with Floci
description: Run StackPort as a web console for Floci. Setup, a Docker Compose file, what works, and tips for browsing Floci resources in a UI.
---

[Floci](https://github.com/floci-io/floci) is an open-source AWS emulator that serves the whole API surface on a single port, `4566`. StackPort gives it a web console: a dashboard of every service with live resource counts, and dedicated views for S3, DynamoDB, Lambda, SQS and more.

StackPort talks to Floci over the standard AWS API, the same way the AWS CLI does. Nothing needs to be installed or enabled inside Floci.

## Setup

### 1. Start Floci

```bash
docker run -d -p 4566:4566 floci/floci
```

Floci also has its own CLI (`floci start`) that manages the container for you. See the [Floci README](https://github.com/floci-io/floci) for every option and for its full configuration.

### 2. Start StackPort

```bash
pip install stackport
AWS_ENDPOINT_URL=http://localhost:4566 \
  AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test stackport
```

Or with Docker, reaching Floci on your host:

```bash
docker run -p 8080:8080 \
  -e AWS_ENDPOINT_URL=http://host.docker.internal:4566 \
  -e AWS_ACCESS_KEY_ID=test -e AWS_SECRET_ACCESS_KEY=test \
  davireis/stackport
```

Open **http://localhost:8080**. Floci accepts any credentials, but StackPort has no default ones and needs a pair to sign its requests. Without them, every service shows zero resources. With pip, credentials already in your shell or `~/.aws` work too; the Docker image only sees what you pass with `-e`.

## Docker Compose

Run Floci and StackPort together:

```yaml
services:
  stackport:
    image: davireis/stackport:latest
    ports:
      - "8080:8080"
    environment:
      - AWS_ENDPOINT_URL=http://floci:4566
      - AWS_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
    restart: unless-stopped
    depends_on:
      floci:
        condition: service_healthy

  floci:
    image: floci/floci:latest
    ports:
      - "4566:4566"
    environment:
      FLOCI_HOSTNAME: floci          # must match the service name
      FLOCI_STORAGE_MODE: hybrid     # memory | persistent | hybrid | wal
    volumes:
      - floci-data:/app/data
    # The image ships its own HEALTHCHECK against /_floci/health.

volumes:
  floci-data:
```

This is the same setup as [`examples/docker-compose.floci.yml`](https://github.com/DaviReisVieira/stackport/blob/main/examples/docker-compose.floci.yml) in the StackPort repository, minus the seed container. To use the ready-made file with the seed included:

```bash
curl -O https://raw.githubusercontent.com/DaviReisVieira/stackport/main/examples/docker-compose.floci.yml
docker compose -f docker-compose.floci.yml up -d
```

The seed creates a few resources across S3, SQS, SNS, DynamoDB, Secrets Manager, IAM, CloudWatch Logs and Step Functions, so the dashboard has something to show on first load. If it stays empty, check `docker compose logs seed`.

## What works

- **The dashboard** probes all 35 services StackPort knows about. Services Floci implements show their resource counts; any it does not implement show as unavailable, and nothing else is affected.
- **All 13 service views** (S3, DynamoDB, Lambda, SQS, SNS, EC2, IAM, RDS, KMS, Step Functions, CloudWatch Logs, CloudWatch Metrics and Secrets Manager) use standard AWS API calls, so each one works as far as Floci implements the calls behind it.
- **Write operations** such as uploading to S3, editing DynamoDB items, sending SQS messages or starting Step Functions executions go straight to Floci.
- **[Guided lessons](/docs/learn/guided-lessons/)** run against Floci like any local endpoint, and verify each step against its real state.
- **The [CLI](/docs/cli/commands/)** works the same: `stackport status --endpoint http://localhost:4566`.

If a view behaves worse on Floci than on other emulators, please [open an issue](https://github.com/DaviReisVieira/stackport/issues). That is exactly the kind of gap the project wants to close.

## Tips

- **Returned URLs.** Floci takes the hostname for the URLs it returns (SQS queue URLs, pre-signed URLs, SNS callbacks) from `FLOCI_HOSTNAME`. Set it to the Compose service name, as above, so those URLs resolve from other containers. From your host, the same resources are reachable through `http://localhost:4566`.
- **Storage modes.** `FLOCI_STORAGE_MODE` picks between `memory`, `persistent`, `hybrid` and `wal`. The image defaults to `memory`, which gives you a throwaway stack; `hybrid` with the `floci-data` volume, as above, keeps your resources across restarts.
- **Docker-backed services.** Floci runs some services (Lambda, RDS, ElastiCache, ECS and others) in containers of their own, which needs the Docker socket mounted: `- /var/run/docker.sock:/var/run/docker.sock`. Without it you can still create and browse those resources, but Lambda invocations fail and RDS instances have no database behind them. It is off in the example because handing the socket to a container is equivalent to root on the host, so only add it when you need those services.
- **Switching emulators.** StackPort saves its endpoint the first time it starts. If you move between emulators, give each one a name with `STACKPORT_ENDPOINTS` and switch from the top bar. See [Saved endpoints](/docs/configuration/endpoints/#saved-endpoints-and-aws_endpoint_url).
- **Only probe what you use.** If Floci is slow to answer for services you never touch, set `STACKPORT_SERVICES` to the ones you need, for example `STACKPORT_SERVICES=s3,sqs,dynamodb,lambda`.

## Related

- [Emulators overview](/docs/configuration/emulators/) compares the setup for every supported emulator.
- [Docker](/docs/configuration/docker/) covers networking and health checks in more detail.
- [Service Browsers](/docs/services/overview/) lists what each view can do.
