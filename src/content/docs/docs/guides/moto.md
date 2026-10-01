---
title: Using StackPort with Moto
description: Run StackPort as a web console for Moto. Setup, a Docker Compose file, what works, and tips for browsing Moto resources in a UI.
---

[Moto](https://github.com/getmoto/moto) is the open-source library that mocks AWS services for Python tests. Its server mode exposes the same mocks over HTTP on a single port, `5000` by default. StackPort gives it a web console: a dashboard of every service with live resource counts, and dedicated views for S3, DynamoDB, Lambda, SQS and more.

StackPort talks to Moto over the standard AWS API, the same way the AWS CLI does. Nothing needs to be installed or enabled inside Moto.

## Setup

### 1. Start Moto

```bash
docker run -d -p 5000:5000 motoserver/moto
```

Moto can also run without Docker: `pip install "moto[server]"` and then `moto_server -H 0.0.0.0 -p 5000`. See the [Moto documentation](https://docs.getmoto.org) for every option.

### 2. Start StackPort

```bash
pip install stackport
AWS_ENDPOINT_URL=http://localhost:5000 \
  AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test stackport
```

Or with Docker, reaching Moto on your host:

```bash
docker run -p 8080:8080 \
  -e AWS_ENDPOINT_URL=http://host.docker.internal:5000 \
  -e AWS_ACCESS_KEY_ID=test -e AWS_SECRET_ACCESS_KEY=test \
  davireis/stackport
```

Open **http://localhost:8080**. Moto accepts any credentials, but StackPort has no default ones and needs a pair to sign its requests. Without them, every service shows zero resources. With pip, credentials already in your shell or `~/.aws` work too; the Docker image only sees what you pass with `-e`.

## Docker Compose

Run Moto and StackPort together:

```yaml
services:
  stackport:
    image: davireis/stackport:latest
    ports:
      - "8080:8080"
    environment:
      - AWS_ENDPOINT_URL=http://moto:5000
      - AWS_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
    restart: unless-stopped
    depends_on:
      moto:
        condition: service_healthy

  moto:
    image: motoserver/moto:latest
    ports:
      - "5000:5000"
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:5000/moto-api/')"]
      interval: 5s
      timeout: 3s
      retries: 5
```

The StackPort repository does not ship a Moto file, but the seed container from [`examples/docker-compose.yml`](https://github.com/DaviReisVieira/stackport/blob/main/examples/docker-compose.yml) works unchanged: copy the `seed` service into the file above and set its `AWS_ENDPOINT_URL` to `http://moto:5000` (and its `depends_on` to `moto`). Then:

```bash
docker compose up -d
```

The seed creates a few resources across S3, SQS, SNS, DynamoDB, Secrets Manager, IAM, CloudWatch Logs and Step Functions, so the dashboard has something to show on first load. If it stays empty, check `docker compose logs seed`.

## What works

- **The dashboard** probes all 35 services StackPort knows about. Services Moto implements show their resource counts; any it does not implement show as unavailable, and nothing else is affected.
- **All 13 service views** (S3, DynamoDB, Lambda, SQS, SNS, EC2, IAM, RDS, KMS, Step Functions, CloudWatch Logs, CloudWatch Metrics and Secrets Manager) use standard AWS API calls, so each one works as far as Moto implements the calls behind it.
- **Write operations** such as uploading to S3, editing DynamoDB items, sending SQS messages or starting Step Functions executions go straight to Moto.
- **[Guided lessons](/docs/learn/guided-lessons/)** run against Moto like any local endpoint, and verify each step against its real state.
- **The [CLI](/docs/cli/commands/)** works the same: `stackport status --endpoint http://localhost:5000`.

If a view behaves worse on Moto than on other emulators, please [open an issue](https://github.com/DaviReisVieira/stackport/issues). That is exactly the kind of gap the project wants to close.

## Tips

- **Returned URLs.** Moto builds the SQS queue URLs it returns from the request `Host` header, so they resolve from wherever the request came from. Moto runs on port `5000`, not `4566`, so remember the port in `AWS_ENDPOINT_URL`. When you run `moto_server` yourself it listens on `127.0.0.1` by default, so bind it to `0.0.0.0` (with `-H 0.0.0.0`) if StackPort runs in a container, otherwise the container cannot reach it.
- **In-memory state and reset.** Moto keeps everything in memory, so a restart starts clean. To wipe state without restarting, `POST` to `/moto-api/reset`; Moto also serves a small dashboard of its own at `/moto-api/`.
- **Same mocks as your tests.** If your test suite already uses Moto's decorators, server mode gives you the same behaviour, so StackPort shows you what your tests would see. Resources created inside a decorator live in your test process, though, so StackPort only sees what is sent to the server.
- **Switching emulators.** StackPort saves its endpoint the first time it starts. If you move between emulators, give each one a name with `STACKPORT_ENDPOINTS` and switch from the top bar. See [Saved endpoints](/docs/configuration/endpoints/#saved-endpoints-and-aws_endpoint_url).
- **Only probe what you use.** If Moto is slow to answer for services you never touch, set `STACKPORT_SERVICES` to the ones you need, for example `STACKPORT_SERVICES=s3,sqs,dynamodb,lambda`.

## Related

- [Emulators overview](/docs/configuration/emulators/) compares the setup for every supported emulator.
- [Docker](/docs/configuration/docker/) covers networking and health checks in more detail.
- [Service Browsers](/docs/services/overview/) lists what each view can do.
