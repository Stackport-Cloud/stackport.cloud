---
title: CLI Commands
description: StackPort CLI reference for serve, status, list, describe and export, with output formats and endpoint flags for scripts and CI.
---

The `stackport` package installs a CLI alongside the web UI. It uses the same service registry as the dashboard, so anything you can see in the console you can list from a script or a CI job.

```bash
stackport --help
stackport --version
```

## Choosing the endpoint

Every command except `serve` accepts:

| Flag | Default | Description |
|---|---|---|
| `--endpoint` | `AWS_ENDPOINT_URL` | Endpoint URL to talk to. |
| `--region` | `AWS_REGION`, else `us-east-1` | AWS region. |

When neither `--endpoint` nor `AWS_ENDPOINT_URL` is set, the CLI uses the default endpoint saved from the web UI's Settings page, so the two agree on where they point.

```bash
stackport status --endpoint http://localhost:4566
AWS_ENDPOINT_URL=http://localhost:5000 stackport list s3
```

## `stackport serve`

Start the web server. Running `stackport` with no subcommand does the same.

```bash
stackport serve --port 9090
```

| Flag | Default | Description |
|---|---|---|
| `--port` | `STACKPORT_PORT`, else `8080` | HTTP port. |

## `stackport status`

Probe every enabled service and show whether it is available and what it holds.

```bash
stackport status
stackport status --output json
```

| Flag | Default | Description |
|---|---|---|
| `--output` | `table` | `table` or `json`. |

Example table output:

```text
SERVICE                   STATUS       RESOURCES
------------------------------------------------------------
dynamodb                  available    tables=1
iam                       available    roles=1
lambda                    available    -
s3                        available    buckets=1
sqs                       available    queues=2
...
```

The services probed follow `STACKPORT_SERVICES`, the same as the dashboard.

## `stackport list <service>`

List every resource of every type a service has.

```bash
stackport list s3
stackport list ec2 --output json
stackport list dynamodb --output csv
```

| Flag | Default | Description |
|---|---|---|
| `--output` | `table` | `table`, `json` or `csv`. |

`<service>` is the service key used across StackPort, such as `s3`, `sqs`, `lambda`, `monitoring` or `cognito-idp`. An unknown key prints the list of valid ones. The table output shows the first 20 resources per type; use `json` or `csv` for everything.

## `stackport describe <service> <resource_type> <resource_id>`

Fetch the full detail for one resource, the same JSON the console shows in its detail views.

```bash
stackport describe dynamodb tables Orders
stackport describe lambda functions my-func
stackport describe iam roles StackPortDemoRole --output table
```

| Flag | Default | Description |
|---|---|---|
| `--output` | `json` | `json` or `table`. |

The resource type is the plural name shown in the console and in `stackport list`, such as `buckets`, `tables`, `functions`, `queues`, `roles` or `state_machines`. The id is whatever the underlying AWS API expects: a name for most resources, a queue URL for SQS, an ARN for SNS topics and Step Functions state machines.

## `stackport export <service>`

Export all resources for a service. It runs the same lookup as `list`, with machine-readable output only.

```bash
stackport export lambda --format json > lambda.json
stackport export ec2 --format csv > ec2.csv
```

| Flag | Default | Description |
|---|---|---|
| `--format` | `json` | `json` or `csv`. |

## In CI

The CLI makes a simple smoke test after your infrastructure code runs against an emulator. `describe` exits with a non-zero code when a resource cannot be found, and the JSON from `list` is easy to check with `jq`:

```bash
stackport list sqs --output json | jq -e '.resources.queues | length > 0'
stackport describe dynamodb tables Orders > /dev/null
```

## VS Code extension

A StackPort extension for VS Code is in early development. The current Marketplace release reserves the name while the integration is built; the plan is a sidebar tree of services and resources and the dashboard inside an editor panel. Until then, the CLI and the web UI are the way to use StackPort.
