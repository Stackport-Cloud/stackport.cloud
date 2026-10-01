---
title: Using StackPort with LocalStack
description: Run StackPort as a web console for LocalStack. Setup, a Docker Compose file, what works, and tips for browsing LocalStack resources in a UI.
---

[LocalStack](https://docs.localstack.cloud) is an AWS emulator that serves the whole API surface on a single port, `4566`. StackPort gives it a web console: a dashboard of every service with live resource counts, and dedicated views for S3, DynamoDB, Lambda, SQS and more.

StackPort talks to LocalStack over the standard AWS API, the same way the AWS CLI does. Nothing needs to be installed or enabled inside LocalStack.

## Setup

### 1. Start LocalStack

```bash
docker run -d -p 4566:4566 -e LOCALSTACK_AUTH_TOKEN=<your-token> localstack/localstack
```

LocalStack needs an auth token to start (see [Tips](#tips)). It also has its own CLI (`lstk`) that manages the container and the login for you. See the [LocalStack documentation](https://docs.localstack.cloud) for every option.

### 2. Start StackPort

```bash
pip install stackport
AWS_ENDPOINT_URL=http://localhost:4566 \
  AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test stackport
```

Or with Docker, reaching LocalStack on your host:

```bash
docker run -p 8080:8080 \
  -e AWS_ENDPOINT_URL=http://host.docker.internal:4566 \
  -e AWS_ACCESS_KEY_ID=test -e AWS_SECRET_ACCESS_KEY=test \
  davireis/stackport
```

Open **http://localhost:8080**. LocalStack accepts any credentials, but StackPort has no default ones and needs a pair to sign its requests. Without them, every service shows zero resources. With pip, credentials already in your shell or `~/.aws` work too; the Docker image only sees what you pass with `-e`.

## Docker Compose

Run LocalStack and StackPort together:

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
    restart: unless-stopped
    depends_on:
      localstack:
        condition: service_healthy

  localstack:
    image: localstack/localstack:latest
    ports:
      - "4566:4566"
    environment:
      LOCALSTACK_AUTH_TOKEN: ${LOCALSTACK_AUTH_TOKEN}   # required to start
      LOCALSTACK_HOST: localstack:4566   # hostname used in returned URLs
      SQS_ENDPOINT_STRATEGY: path        # queue URLs as http://localstack:4566/queue/...
    # Lambda runs functions in containers of their own, which needs the Docker socket:
    # volumes:
    #   - /var/run/docker.sock:/var/run/docker.sock
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4566/_localstack/health"]
      interval: 5s
      timeout: 3s
      retries: 10
```

The StackPort repository does not ship a LocalStack file, but the seed container from [`examples/docker-compose.yml`](https://github.com/DaviReisVieira/stackport/blob/main/examples/docker-compose.yml) works unchanged: copy the `seed` service into the file above and set its `AWS_ENDPOINT_URL` to `http://localstack:4566` (and its `depends_on` to `localstack`). Then:

```bash
docker compose up -d
```

The seed creates a few resources across S3, SQS, SNS, DynamoDB, Secrets Manager, IAM, CloudWatch Logs and Step Functions, so the dashboard has something to show on first load. If it stays empty, check `docker compose logs seed`.

## What works

- **The dashboard** probes all 35 services StackPort knows about. Services LocalStack implements show their resource counts; any it does not implement show as unavailable, and nothing else is affected.
- **All 13 service views** (S3, DynamoDB, Lambda, SQS, SNS, EC2, IAM, RDS, KMS, Step Functions, CloudWatch Logs, CloudWatch Metrics and Secrets Manager) use standard AWS API calls, so each one works as far as LocalStack implements the calls behind it.
- **Write operations** such as uploading to S3, editing DynamoDB items, sending SQS messages or starting Step Functions executions go straight to LocalStack.
- **[Guided lessons](/docs/learn/guided-lessons/)** run against LocalStack like any local endpoint, and verify each step against its real state.
- **The [CLI](/docs/cli/commands/)** works the same: `stackport status --endpoint http://localhost:4566`.

If a view behaves worse on LocalStack than on other emulators, please [open an issue](https://github.com/DaviReisVieira/stackport/issues). That is exactly the kind of gap the project wants to close.

## Tips

- **Returned URLs.** LocalStack builds the URLs it returns from `LOCALSTACK_HOST`. With the default SQS strategy, queue URLs use a subdomain such as `sqs.us-east-1.localhost.localstack.cloud`, which other containers usually cannot resolve, so the Compose file above follows the LocalStack SQS docs and sets `SQS_ENDPOINT_STRATEGY=path` together with `LOCALSTACK_HOST`.
- **Health endpoint.** LocalStack answers on `/_localstack/health` with the state of each service, which the Compose file above uses so StackPort only starts once LocalStack is ready. State is in memory by default, so a restart starts clean; persistence across restarts is part of LocalStack's paid plans.
- **Auth token.** Since release 2026.3.0, `localstack/localstack` needs an auth token to start; without one the container exits with "License activation failed". Create a LocalStack account, copy your token from the LocalStack web app and pass it as `LOCALSTACK_AUTH_TOKEN`. LocalStack offers a free Hobby plan for non-commercial use.
- **Switching emulators.** StackPort saves its endpoint the first time it starts. If you move between emulators, give each one a name with `STACKPORT_ENDPOINTS` and switch from the top bar. See [Saved endpoints](/docs/configuration/endpoints/#saved-endpoints-and-aws_endpoint_url).
- **Only probe what you use.** If LocalStack is slow to answer for services you never touch, set `STACKPORT_SERVICES` to the ones you need, for example `STACKPORT_SERVICES=s3,sqs,dynamodb,lambda`.

## Related

- [Emulators overview](/docs/configuration/emulators/) compares the setup for every supported emulator.
- [Docker](/docs/configuration/docker/) covers networking and health checks in more detail.
- [Service Browsers](/docs/services/overview/) lists what each view can do.
