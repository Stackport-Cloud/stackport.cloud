---
title: Installation
description: Install StackPort with pip, run the Docker image, or start it next to an emulator with Docker Compose.
---

StackPort is one Python package and one Docker image. Pick whichever fits how you already run your emulator.

## Requirements

- **Python 3.10 or newer** for the pip install.
- **Docker** for the container setup. The image is published for `linux/amd64` and `linux/arm64`.
- An AWS-compatible endpoint: a local emulator such as AWS Emulator, MiniStack, Floci, LocalStack or Moto, or a real AWS account.

## pip

```bash
pip install stackport
stackport
```

StackPort starts on `http://localhost:8080`, listening on `127.0.0.1` only, and connects to the endpoint in `AWS_ENDPOINT_URL`. With no endpoint set it uses real AWS through your normal credential chain, so for a local emulator set it explicitly, together with a pair of test credentials (most emulators accept any, but StackPort needs a pair to sign requests; with none in your shell or `~/.aws`, the dashboard says it has no credentials):

```bash
AWS_ENDPOINT_URL=http://localhost:4566 \
  AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test stackport
```

[AWS Emulator](/docs/guides/aws-emulator/) needs no credentials here: StackPort reads the keys and certificate it writes on each start.

```bash
AWS_ENDPOINT_URL=https://127.0.0.1:9297 stackport
```

`stackport` with no subcommand is the same as `stackport serve`. The same package installs the [CLI](/docs/cli/commands/).

## Docker

The image is `davireis/stackport` on Docker Hub, tagged `latest` and with each release version.

```bash
docker run -p 127.0.0.1:8080:8080 \
  -e AWS_ENDPOINT_URL=http://host.docker.internal:4566 \
  -e AWS_ACCESS_KEY_ID=test -e AWS_SECRET_ACCESS_KEY=test \
  davireis/stackport
```

`host.docker.internal` reaches an emulator running on your host machine. Replace `4566` with your emulator's port if it differs (Moto uses `5000` by default). `127.0.0.1:8080` keeps StackPort on your machine. For AWS Emulator, use its Compose file below instead: its certificate only covers `127.0.0.1` and `localhost`.

## Docker Compose

The StackPort repository ships ready-to-run Compose files. Each one starts an emulator, StackPort, and a one-shot `seed` container that creates a few demo resources (S3, SQS, SNS, DynamoDB, Secrets Manager, IAM, CloudWatch Logs and Step Functions), so the dashboard has something to show on first load.

**AWS Emulator** (builds the emulator image from AWS's Dockerfile on the first run)

```bash
curl -O https://raw.githubusercontent.com/DaviReisVieira/stackport/main/examples/docker-compose.aws-emulator.yml
docker compose -f docker-compose.aws-emulator.yml up -d
```

**MiniStack**

```bash
curl -O https://raw.githubusercontent.com/DaviReisVieira/stackport/main/examples/docker-compose.yml
docker compose up -d
```

**Floci**

```bash
curl -O https://raw.githubusercontent.com/DaviReisVieira/stackport/main/examples/docker-compose.floci.yml
docker compose -f docker-compose.floci.yml up -d
```

**LocalStack and Moto** work the same way with a small Compose file of your own. The [LocalStack guide](/docs/guides/localstack/) and [Moto guide](/docs/guides/moto/) have one you can copy.

Then open **http://localhost:8080**. If the dashboard is empty, check the seed output with `docker compose logs seed` (add `-f` and the file name for the AWS Emulator and Floci files).

See [Docker](/docs/configuration/docker/) for networking, health checks and mounting AWS profiles into the container.

## Upgrading

```bash
pip install --upgrade stackport
# or
docker pull davireis/stackport:latest
```

Run `stackport --version` to see what you have installed.
