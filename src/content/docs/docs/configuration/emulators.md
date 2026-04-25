---
title: Emulator Setup
description: Configure StackPort with LocalStack, MiniStack, Moto, or real AWS.
---

StackPort works with any service that speaks the AWS API. Here's how to connect each one.

## MiniStack

[MiniStack](https://github.com/MiniStackOrg/ministack) is a lightweight AWS emulator. It's the recommended pairing with StackPort.

```bash
pip install ministack stackport
ministack &
stackport
```

Or with Docker:

```bash
docker compose up -d  # using the example docker-compose.yml
```

Default endpoint: `http://localhost:4566`

## LocalStack

[LocalStack](https://localstack.cloud) is the most popular AWS emulator with broad service coverage.

```bash
AWS_ENDPOINT_URL=http://localhost:4566 stackport
```

Or in Docker Compose, set `AWS_ENDPOINT_URL=http://localstack:4566`.

## Moto

[Moto](https://github.com/getmoto/moto) can run as a standalone server:

```bash
pip install moto[server]
moto_server -p 5000 &
AWS_ENDPOINT_URL=http://localhost:5000 stackport
```

## MinIO (S3-only)

[MinIO](https://min.io) provides S3-compatible storage:

```bash
AWS_ENDPOINT_URL=http://localhost:9000 stackport
```

Only S3 resources will be available.

## Real AWS

Omit `AWS_ENDPOINT_URL` to connect to real AWS using your credential chain:

```bash
# Using a named profile
AWS_PROFILE=my-profile stackport

# Using explicit credentials
AWS_ACCESS_KEY_ID=AKIA... AWS_SECRET_ACCESS_KEY=... AWS_REGION=us-west-2 stackport

# Read-only mode (recommended for real accounts)
STACKPORT_ALLOW_WRITES=false AWS_PROFILE=production stackport
```

## Multiple Endpoints

Connect to several environments simultaneously:

```bash
STACKPORT_ENDPOINTS="local=http://localhost:4566,staging=http://staging.internal:4566,prod=" \
  AWS_PROFILE=prod stackport
```

The UI will show an endpoint selector to switch between environments.
