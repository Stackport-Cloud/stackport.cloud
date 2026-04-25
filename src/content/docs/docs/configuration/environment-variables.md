---
title: Environment Variables
description: All configuration options for StackPort.
---

StackPort is configured entirely through environment variables. No config files needed.

## AWS Connection

| Variable | Default | Description |
|---|---|---|
| `AWS_ENDPOINT_URL` | *(unset)* | AWS endpoint URL. Unset uses real AWS via credential chain. |
| `AWS_REGION` | `us-east-1` | AWS region. |
| `AWS_ACCESS_KEY_ID` | *(unset)* | AWS access key. Unset uses credential chain. |
| `AWS_SECRET_ACCESS_KEY` | *(unset)* | AWS secret key. Unset uses credential chain. |
| `AWS_PROFILE` | *(unset)* | AWS named profile from `~/.aws/credentials`. |

## StackPort Settings

| Variable | Default | Description |
|---|---|---|
| `STACKPORT_PORT` | `8080` | Server port. |
| `STACKPORT_ALLOW_WRITES` | `true` | Enable write operations (POST/PUT/DELETE). Set to `false` for read-only mode. |
| `STACKPORT_S3_MAX_UPLOAD_MB` | `100` | Maximum S3 upload size per object in MiB. |
| `STACKPORT_SERVICES` | *(all 35)* | Comma-separated list of services to probe. |
| `STACKPORT_PROBE_TIMEOUT` | `5` | Seconds before a service probe times out. |
| `STACKPORT_CACHE_TTL` | `5` | Seconds to cache service stats. |
| `STACKPORT_PROBE_WORKERS` | `10` | Max concurrent workers for service probing. |
| `LOG_LEVEL` | `INFO` | Python log level. `DEBUG` shows healthcheck logs. |

## Multiple Endpoints

Connect to several AWS environments at once:

```bash
STACKPORT_ENDPOINTS="local=http://localhost:4566,staging=http://staging:4566,prod=" \
  AWS_PROFILE=prod AWS_REGION=us-west-1 stackport
```

The format is `name=url` pairs, comma-separated. An empty URL (like `prod=`) uses the default credential chain for real AWS.
