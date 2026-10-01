---
title: Quick Start
description: Start StackPort next to MiniStack, Floci, LocalStack or Moto, create a few resources, and browse them in under a minute.
---

## 1. Start an emulator and StackPort

Pick the emulator you use. Each line starts it on your machine; StackPort itself is the same in every case.

```bash
# MiniStack
docker run -d -p 4566:4566 ministackorg/ministack

# Floci
docker run -d -p 4566:4566 floci/floci

# LocalStack (needs an account and auth token, see the LocalStack guide)
docker run -d -p 4566:4566 -e LOCALSTACK_AUTH_TOKEN=<your-token> localstack/localstack

# Moto
docker run -d -p 5000:5000 motoserver/moto
```

Then start StackPort and point it at the emulator:

```bash
pip install stackport
AWS_ENDPOINT_URL=http://localhost:4566 \
  AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test stackport   # use :5000 for Moto
```

Emulators accept any credentials, but StackPort needs a pair to sign its requests. If your shell or `~/.aws` already has some, you can leave the two `test` variables out.

Prefer containers for everything? The [MiniStack](/docs/guides/ministack/), [Floci](/docs/guides/floci/), [LocalStack](/docs/guides/localstack/) and [Moto](/docs/guides/moto/) guides each have a Compose file that runs the emulator and StackPort together.

## 2. Open the dashboard

Go to **http://localhost:8080**. The dashboard lists the 35 services StackPort knows about, with a resource count for each, and updates live as things change.

## 3. Create some resources

Use the AWS CLI against your emulator, or create them straight from the console (S3 buckets, DynamoDB tables, SQS queues, SNS topics, secrets and log groups all have a Create button).

```bash
export AWS_ENDPOINT_URL=http://localhost:4566
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_REGION=us-east-1

aws s3 mb s3://my-bucket
aws sqs create-queue --queue-name my-queue
aws dynamodb create-table --table-name Orders \
  --attribute-definitions AttributeName=pk,AttributeType=S \
  --key-schema AttributeName=pk,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

## 4. Browse and interact

The counts on the dashboard pick up the new resources within a few seconds. Click a service to open its view:

- **S3**: browse folders, upload by drag and drop, download, edit versioning, lifecycle, CORS and notifications.
- **DynamoDB**: scan or query by key, then create, edit and delete items as JSON.
- **SQS**: send single or batch messages, poll, delete, purge, and keep reusable saved messages.
- **Lambda**: inspect configuration, invoke with an event template, edit memory, timeout and environment.

Every view is listed in [Service Browsers](/docs/services/overview/).

## 5. Try a guided lesson

Open **Learn** in the side navigation (or press `g` then `l`). Lessons walk you through real AWS tasks against your emulator, and each step turns green once StackPort sees the resource actually exists. See [Guided lessons](/docs/learn/guided-lessons/).

## 6. Use the CLI

The same package installs a CLI for scripts and CI:

```bash
stackport status                          # every service with its resource counts
stackport list s3                         # list buckets
stackport describe dynamodb tables Orders # full detail as JSON
stackport export dynamodb --format csv    # export for a spreadsheet or a diff
```

See [CLI Commands](/docs/cli/commands/) for every flag.

## Next steps

- Connect to [several endpoints at once](/docs/configuration/endpoints/), each with its own credentials.
- Browse a [real AWS account](/docs/configuration/real-aws/) in read-only mode.
- Tune what gets probed with [environment variables](/docs/configuration/environment-variables/).
