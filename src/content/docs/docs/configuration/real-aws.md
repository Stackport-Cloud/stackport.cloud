---
title: Real AWS and Read-only Mode
description: Browse a real AWS account with StackPort using profiles, SSO or keys, and turn on read-only mode so every write is refused by the server.
---

StackPort is built for local emulators, but nothing stops it from browsing a real account. It is a convenient way to look around a sandbox or staging account with the same views you use locally.

## Connect to real AWS

Leave `AWS_ENDPOINT_URL` unset and StackPort uses boto3's normal credential chain:

```bash
# A named profile (SSO and AssumeRole profiles work too)
AWS_PROFILE=my-profile AWS_REGION=eu-west-1 stackport

# Explicit keys
AWS_ACCESS_KEY_ID=AKIA... AWS_SECRET_ACCESS_KEY=... AWS_REGION=us-west-2 stackport
```

If you have run StackPort against an emulator before, it remembers that endpoint (see [Saved endpoints](/docs/configuration/endpoints/#saved-endpoints-and-aws_endpoint_url)). Add real AWS as its own endpoint instead, or use a separate `STACKPORT_DATA_DIR`.

You can add a real AWS endpoint from **Settings** next to your emulators, with its own region and its own profile or keys. See [Multiple Endpoints and Authentication](/docs/configuration/endpoints/).

## What changes against real AWS

- A warning banner stays at the top of every page: *Connected to real AWS. Actions here affect live resources and may incur costs.*
- [Guided lessons](/docs/learn/guided-lessons/) are disabled, since they create and delete resources. Their automatic re-checks are off too, so StackPort does not make billed API calls in the background on your behalf.
- The S3 bucket list skips the per-bucket object counts, sizes and settings it computes locally, so opening it does not walk every bucket in the account.

Writes are **not** blocked just because the endpoint is real AWS. If you want that guarantee, turn on read-only mode.

## Read-only mode

```bash
STACKPORT_ALLOW_WRITES=false AWS_PROFILE=my-profile stackport
```

With `STACKPORT_ALLOW_WRITES=false`:

- The server refuses every `POST`, `PUT`, `PATCH` and `DELETE` that would change AWS, with a `403` and a message naming the setting. This is enforced in the backend, so it holds for the UI, the API and anything else that talks to StackPort.
- A **Read-only** badge appears in the top bar.
- A few requests that use `POST` but only read are still allowed: DynamoDB queries, CloudWatch metric data for dashboards, and Lambda invocations.
- Managing endpoints and saving lesson progress keep working, because they change StackPort's own local files and not your account.

:::caution
Lambda **Invoke** stays available in read-only mode. Invoking a function runs its code, and that code can write to anything its role allows. Only use Invoke against a real account if you know what the function does.
:::

Read-only mode applies to the whole StackPort process, across every endpoint. If you want to browse an account safely while keeping writes for your emulator, run two StackPort instances on different ports, each with its own data directory:

```bash
AWS_ENDPOINT_URL=http://localhost:4566 stackport serve --port 8080
STACKPORT_DATA_DIR=~/.stackport-prod STACKPORT_ALLOW_WRITES=false AWS_PROFILE=prod \
  stackport serve --port 8081
```

## Least privilege

StackPort only does what its credentials allow, so the safest setup is a role that can only read. The AWS managed `ReadOnlyAccess` and `ViewOnlyAccess` policies are good starting points. Combined with `STACKPORT_ALLOW_WRITES=false`, that gives you two independent layers: StackPort refuses to send a write, and AWS would refuse it anyway.

## Running it for a team

StackPort has no login of its own. Anyone who can reach its port can use it with the credentials it runs with. Keep it on `localhost`, behind a VPN, or behind an authenticating proxy, and never expose an instance holding real AWS credentials to the internet.
