---
title: Introduction
description: StackPort is a free, open-source web console for AWS Emulator, MiniStack, Floci, LocalStack, Moto and real AWS. What it does and where to start.
---

StackPort is an open-source web console for AWS. Point it at a local emulator such as **AWS Emulator**, **MiniStack**, **Floci**, **LocalStack** or **Moto**, or at a real AWS account, and it shows you what is running there: buckets, tables, queues, functions, secrets and more, across 51 services. Anything else the endpoint implements is one click away in the API Explorer.

It ships as a single Docker image or a `pip install`, and talks to your endpoint over the standard AWS API with boto3. There is nothing to install inside the emulator and nothing emulator-specific to configure.

## Why it exists

When you build against an emulator, it is easy to lose track of what you actually created. Did the queue get the message? Did the table get the item? Is the function deployed with the right environment? The usual answer is another round of `aws --endpoint-url ...` commands.

StackPort gives you a console for that instead: a dashboard of every service with live resource counts, and dedicated views for the services you touch most. It started as a web UI pull request to [MiniStack](/docs/guides/ministack/), and the MiniStack maintainers suggested it would be more useful as a standalone tool that works with any emulator. That is what it became, and MiniStack is still StackPort's partner project: the two work closely together.

StackPort is an independent open-source project. It is not affiliated with or endorsed by AWS.

## What it does

- **Dashboard for 51 AWS services.** Each service is probed concurrently, the counts update live over a WebSocket, and services the endpoint doesn't have are marked as not supported.
- **13 dedicated service views**: S3, DynamoDB, Lambda, SQS, SNS, EC2, IAM, RDS, KMS, Step Functions, CloudWatch Logs, CloudWatch Metrics and Secrets Manager. Every other service gets a searchable resource table with a JSON detail view.
- **[API Explorer](/docs/explorer/api-explorer/)** to call any operation of any service boto3 knows, from a form built from the API's own model, and copy it as an AWS CLI command or boto3 code.
- **Write operations where they help**: upload to S3, edit DynamoDB items, invoke Lambda, send and receive SQS messages, publish to SNS, start Step Functions executions, start and stop EC2 instances, manage secrets and log groups. See [Service Browsers](/docs/services/overview/) for the full list.
- **Guided lessons.** Hands-on AWS tutorials that run inside the console against your own emulator, and check your real resource state as you go. See [Guided lessons](/docs/learn/guided-lessons/).
- **Real AWS and multiple endpoints.** Switch between emulators and accounts from the top bar, each with its own region, credentials and certificate settings. Turn on [read-only mode](/docs/configuration/real-aws/) to block every write at the server.
- **CLI** for scripts and CI: `stackport status`, `list`, `describe` and `export`. See [CLI Commands](/docs/cli/commands/).
- **Keyboard shortcuts**, light and dark themes, favorites, deep links to resources, and JSON or CSV export.

## Architecture

StackPort is a Python **FastAPI** backend that serves a React and TypeScript frontend built with the Cloudscape Design System, the same component library the AWS console uses. The backend calls your endpoint with **boto3**. The browser talks to the backend over REST and a WebSocket.

```text
┌──────────────────────────────┐
│  React + Cloudscape UI       │  browser
├──────────────────────────────┤
│  FastAPI + uvicorn           │  REST API + WebSocket
├──────────────────────────────┤
│  boto3                       │  AWS SDK
├──────────────────────────────┤
│  AWS Emulator · MiniStack ·  │  any AWS-compatible endpoint
│  Floci · LocalStack · Moto · │
│  real AWS                    │
└──────────────────────────────┘
```

Settings come from environment variables. Endpoints you add in the UI and your lesson progress are saved under `~/.stackport` (see [`STACKPORT_DATA_DIR`](/docs/configuration/environment-variables/)).

## Where to go next

- [Installation](/docs/installation/) covers pip, Docker and Docker Compose.
- [Quick Start](/docs/quickstart/) gets you from zero to a populated dashboard.
- The guides for [AWS Emulator](/docs/guides/aws-emulator/), [MiniStack](/docs/guides/ministack/), [Floci](/docs/guides/floci/), [LocalStack](/docs/guides/localstack/) and [Moto](/docs/guides/moto/) walk through each emulator side by side.
- [API Explorer](/docs/explorer/api-explorer/) covers calling any AWS operation from the browser.
