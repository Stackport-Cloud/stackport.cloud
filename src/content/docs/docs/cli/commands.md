---
title: CLI Commands
description: StackPort CLI reference — serve, status, list, describe, export.
---

StackPort includes a CLI for scripting and CI/CD integration.

## `stackport serve`

Start the web server (default command).

```bash
stackport serve --port 8080
```

| Flag | Default | Description |
|---|---|---|
| `--port` | `8080` | Server port |

Running `stackport` with no subcommand is equivalent to `stackport serve`.

## `stackport status`

Show all services with availability and resource counts.

```bash
stackport status
stackport status --output json
```

| Flag | Default | Description |
|---|---|---|
| `--endpoint` | env var | AWS endpoint URL |
| `--region` | `us-east-1` | AWS region |
| `--output` | `table` | Output format: `table`, `json` |

Example output:

```
SERVICE         STATUS    RESOURCES
s3              active    3
dynamodb        active    5
lambda          active    2
sqs             active    8
ec2             inactive  0
...
```

## `stackport list <service>`

List resources for a specific service.

```bash
stackport list s3
stackport list dynamodb --output csv
stackport list lambda --output json
```

| Flag | Default | Description |
|---|---|---|
| `--endpoint` | env var | AWS endpoint URL |
| `--region` | `us-east-1` | AWS region |
| `--output` | `table` | Output format: `table`, `json`, `csv` |

## `stackport describe <service> <resource_type> <resource_id>`

Get detailed information about a specific resource.

```bash
stackport describe s3 buckets my-bucket
stackport describe lambda functions my-func --output json
stackport describe sqs queues my-queue
```

| Flag | Default | Description |
|---|---|---|
| `--endpoint` | env var | AWS endpoint URL |
| `--region` | `us-east-1` | AWS region |
| `--output` | `json` | Output format: `json`, `table` |

## `stackport export <service>`

Export all resources for a service to JSON or CSV.

```bash
stackport export lambda --format json
stackport export ec2 --format csv
stackport export s3 --format json > s3-backup.json
```

| Flag | Default | Description |
|---|---|---|
| `--endpoint` | env var | AWS endpoint URL |
| `--region` | `us-east-1` | AWS region |
| `--format` | `json` | Output format: `json`, `csv` |
