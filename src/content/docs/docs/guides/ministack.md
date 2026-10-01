---
title: Using StackPort with MiniStack
description: Run StackPort as a web console for MiniStack. Setup, a Docker Compose file, what works, and tips for browsing MiniStack resources in a UI.
---

[MiniStack](https://github.com/ministackorg/ministack) is an open-source AWS emulator that serves the whole API surface on a single port, `4566`. StackPort gives it a web console: a dashboard of every service with live resource counts, and dedicated views for S3, DynamoDB, Lambda, SQS and more.

StackPort talks to MiniStack over the standard AWS API, the same way the AWS CLI does. Nothing needs to be installed or enabled inside MiniStack.

## Setup

### 1. Start MiniStack

```bash
docker run -d -p 4566:4566 ministackorg/ministack
```

MiniStack can also run without Docker: `pip install ministack && ministack`. See the [MiniStack README](https://github.com/ministackorg/ministack) for every option.

### 2. Start StackPort

```bash
pip install stackport
AWS_ENDPOINT_URL=http://localhost:4566 \
  AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test stackport
```

Or with Docker, reaching MiniStack on your host:

```bash
docker run -p 8080:8080 \
  -e AWS_ENDPOINT_URL=http://host.docker.internal:4566 \
  -e AWS_ACCESS_KEY_ID=test -e AWS_SECRET_ACCESS_KEY=test \
  davireis/stackport
```

Open **http://localhost:8080**. MiniStack accepts any credentials, but StackPort has no default ones and needs a pair to sign its requests. Without them, every service shows zero resources. With pip, credentials already in your shell or `~/.aws` work too; the Docker image only sees what you pass with `-e`.

## Docker Compose

Run MiniStack and StackPort together:

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

This is the same setup as [`examples/docker-compose.yml`](https://github.com/DaviReisVieira/stackport/blob/main/examples/docker-compose.yml) in the StackPort repository, minus the seed container. To use the ready-made file with the seed included:

```bash
curl -O https://raw.githubusercontent.com/DaviReisVieira/stackport/main/examples/docker-compose.yml
docker compose up -d
```

The seed creates a few resources across S3, SQS, SNS, DynamoDB, Secrets Manager, IAM, CloudWatch Logs and Step Functions, so the dashboard has something to show on first load. If it stays empty, check `docker compose logs seed`.

## What works

- **The dashboard** probes all 35 services StackPort knows about. Services MiniStack implements show their resource counts; any it does not implement show as unavailable, and nothing else is affected.
- **All 13 service views** (S3, DynamoDB, Lambda, SQS, SNS, EC2, IAM, RDS, KMS, Step Functions, CloudWatch Logs, CloudWatch Metrics and Secrets Manager) use standard AWS API calls, so each one works as far as MiniStack implements the calls behind it.
- **Write operations** such as uploading to S3, editing DynamoDB items, sending SQS messages or starting Step Functions executions go straight to MiniStack.
- **[Guided lessons](/docs/learn/guided-lessons/)** run against MiniStack like any local endpoint, and verify each step against its real state.
- **The [CLI](/docs/cli/commands/)** works the same: `stackport status --endpoint http://localhost:4566`.

If a view behaves worse on MiniStack than on other emulators, please [open an issue](https://github.com/DaviReisVieira/stackport/issues). That is exactly the kind of gap the project wants to close.

## Tips

- **Returned URLs.** MiniStack builds the SQS queue URLs it returns from the request `Host` header, so they resolve from other containers and from your host without any extra setting. If you set `MINISTACK_HOST`, that fixed hostname is used instead.
- **Health, reset and persistence.** MiniStack answers on `/_ministack/health`, which the Compose file above uses so StackPort only starts once MiniStack is ready. State lives in memory by default, so a restart starts clean. To wipe state without restarting, `POST` to `/_ministack/reset`; to keep it across restarts, set `PERSIST_STATE=1`.
- **Several MiniStacks at once.** The [multi-endpoint example](https://github.com/DaviReisVieira/stackport/blob/main/examples/docker-compose.multi-endpoint.yml) runs two MiniStack containers (on `4566` and `4567`) plus a real AWS account behind one StackPort.
- **Switching emulators.** StackPort saves its endpoint the first time it starts. If you move between emulators, give each one a name with `STACKPORT_ENDPOINTS` and switch from the top bar. See [Saved endpoints](/docs/configuration/endpoints/#saved-endpoints-and-aws_endpoint_url).
- **Only probe what you use.** If MiniStack is slow to answer for services you never touch, set `STACKPORT_SERVICES` to the ones you need, for example `STACKPORT_SERVICES=s3,sqs,dynamodb,lambda`.

## Related

- [Emulators overview](/docs/configuration/emulators/) compares the setup for every supported emulator.
- [Docker](/docs/configuration/docker/) covers networking and health checks in more detail.
- [Service Browsers](/docs/services/overview/) lists what each view can do.
