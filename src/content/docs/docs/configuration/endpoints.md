---
title: Multiple Endpoints and Authentication
description: Connect StackPort to several emulators and AWS accounts at once, each with its own region, credentials (profile, SSO, AssumeRole or keys) and certificate settings.
---

One StackPort can talk to several endpoints: a couple of local emulators, a shared staging emulator, and a real AWS account, for example. You switch between them from the endpoint menu in the top bar, and everything you see (API calls, caches, live dashboard updates) follows the active endpoint.

## Define endpoints with an environment variable

`STACKPORT_ENDPOINTS` takes `name=url` pairs separated by commas. An empty URL means real AWS. The first entry becomes the default.

```bash
STACKPORT_ENDPOINTS="local=http://localhost:4566,staging=http://staging.internal:4566,nprod=" \
  AWS_PROFILE=nprod AWS_REGION=us-west-1 stackport
```

Without `STACKPORT_ENDPOINTS`, StackPort creates a single endpoint called `default` from `AWS_ENDPOINT_URL`.

The [multi-endpoint Compose example](https://github.com/DaviReisVieira/stackport/blob/main/examples/docker-compose.multi-endpoint.yml) runs two emulators and a real AWS account side by side:

```bash
curl -O https://raw.githubusercontent.com/DaviReisVieira/stackport/main/examples/docker-compose.multi-endpoint.yml
docker compose -f docker-compose.multi-endpoint.yml up -d
```

## Manage endpoints from Settings

Open **Settings** (or press `g` then `s`) to see every endpoint with its URL, region, authentication type, health and source. From there you can:

- **Add** an endpoint with a name, a URL (or tick **Real AWS**), an optional region, an authentication type and, for an `https://` URL, [certificate settings](#certificates).
- **Test connection** before saving. StackPort tries a call with exactly the settings in the form. It names the emulator it found ("Connected to AWS Emulator", for example) and which credentials and certificate it used, or shows what went wrong and how to fix it.
- **Edit** the region, authentication and certificate settings of any endpoint, and the URL of endpoints you added yourself.
- **Set default**, which decides what the dashboard and the CLI use when no endpoint is chosen.
- **Delete** endpoints you added. Endpoints that come from `STACKPORT_ENDPOINTS` are marked *Environment* and stay until you remove them from the variable.

Changes are saved to `endpoints.json` in the [data directory](/docs/configuration/environment-variables/) (`~/.stackport` by default), so they survive restarts. New names added to `STACKPORT_ENDPOINTS` later are merged in on the next start. Endpoint management keeps working in read-only mode, since it changes StackPort's own settings and not anything in AWS.

### Saved endpoints and `AWS_ENDPOINT_URL`

The first time StackPort starts, it writes the endpoints it was given to `endpoints.json`. After that:

- **Starting with `AWS_ENDPOINT_URL` points the `default` endpoint at that URL for that run**, and `STACKPORT_ENDPOINTS` does the same for the endpoints it names. The region, authentication and certificate settings you made in Settings are kept. The file keeps the saved URL, so a one-off `AWS_ENDPOINT_URL=http://localhost:5000 stackport list s3` doesn't change what a later plain `stackport` uses.
- **Starting without them uses the saved URLs.** An unset `AWS_ENDPOINT_URL` means real AWS, so it never replaces an emulator you saved. To browse real AWS next to your emulators, add it as its own endpoint.

To keep several emulators at hand, give each one its own name, for example `STACKPORT_ENDPOINTS="ministack=http://localhost:4566,moto=http://localhost:5000"`, and switch from the top bar. To start over, point `STACKPORT_DATA_DIR` at a fresh directory or delete `~/.stackport/endpoints.json`. Containers started without a volume on the data directory begin fresh every time.

### Health

The health column comes from a quick S3 `ListBuckets` call against each endpoint. An endpoint without S3 (DynamoDB Local, for instance) shows as unhealthy there, even though its other services browse fine.

## Authentication per endpoint

Each endpoint picks one of three authentication types:

| Type | What it uses | Good for |
|---|---|---|
| **Default** | AWS Emulator's own keys for an AWS Emulator endpoint; otherwise `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` (with `AWS_SESSION_TOKEN`) from the environment, or boto3's normal chain (instance role, `AWS_PROFILE`) | Local emulators, StackPort running on EC2 or ECS |
| **AWS Profile** | A named profile from `~/.aws/config`, picked from a list of the profiles StackPort finds | SSO, AssumeRole, `credential_process`, several accounts |
| **Static Credentials** | An access key ID and secret entered for this endpoint | Service accounts, a second account with its own keys |

Profile authentication supports anything `boto3.Session(profile_name=...)` handles. If an SSO session has expired, StackPort answers with a 401 and the command to fix it: `aws sso login --profile <name>`.

Static credentials are stored in plain text in `endpoints.json`. Prefer a profile when you can, and keep the data directory private.

StackPort reads each set of credentials once and reuses it. After you change a static key in `~/.aws/credentials`, use **Test connection**, edit the endpoint, or restart StackPort. `AWS_SESSION_TOKEN` is read at start-up, so a new token needs a restart.

Endpoint URLs set up for other AWS tools don't apply to StackPort: neither `AWS_ENDPOINT_URL_<SERVICE>` variables (like `AWS_ENDPOINT_URL_S3`) nor a profile's `endpoint_url` and `services` settings. An endpoint without a URL reaches AWS itself for every service, and a profile still provides the credentials.

### Profiles inside Docker

Mount your AWS config so the container can see your profiles:

```yaml
services:
  stackport:
    image: davireis/stackport:latest
    volumes:
      - ~/.aws:/root/.aws:ro
```

## Certificates

An endpoint with an `https://` URL has a **Connection security** section in its settings:

- **CA bundle**: a PEM file, on the machine that runs StackPort, to trust for this endpoint. Useful for an emulator with a self-signed certificate.
- **Verify certificates**: turn it off only for an endpoint you trust whose certificate can't be verified. A CA bundle keeps the connection verified, so prefer it.

Both are set per endpoint on purpose: `AWS_CA_BUNDLE` replaces the system certificates, so setting it for the whole process would break a real AWS endpoint configured next to an emulator. AWS Emulator needs neither when StackPort reaches it on `127.0.0.1` or `localhost`: StackPort trusts the certificate the emulator wrote to `~/.aws/emulator/<port>/`. See [Using StackPort with AWS Emulator](/docs/guides/aws-emulator/#how-stackport-finds-the-keys-and-certificate).

## Local or real AWS?

StackPort treats an endpoint as **real AWS** when it has no URL or its URL contains `.amazonaws.com`. Anything else is treated as a local emulator. The difference matters in two places:

- Against real AWS, a warning banner stays at the top of every page: actions affect live resources and may cost money.
- [Guided lessons](/docs/learn/guided-lessons/) only run against local endpoints, since they create and delete resources.

To block writes entirely, see [Real AWS and Read-only Mode](/docs/configuration/real-aws/).

## The CLI and endpoints

CLI commands take `--endpoint` with a saved endpoint's name or a URL. A saved endpoint brings its profile or keys, region and certificate settings with it; a URL passed directly uses none of them, though StackPort still finds AWS Emulator's keys and certificate for it. Without `--endpoint` the CLI uses `AWS_ENDPOINT_URL` if set, and otherwise the default endpoint saved from the Settings page, so the CLI and the web UI agree on where they point. See [CLI Commands](/docs/cli/commands/).
