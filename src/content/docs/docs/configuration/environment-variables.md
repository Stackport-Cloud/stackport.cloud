---
title: Environment Variables
description: Every StackPort setting, from the AWS endpoint and region to read-only mode, Learn, probing and the data directory.
---

StackPort is configured with environment variables. There is no config file to write. Endpoints you add from the Settings page and your lesson progress are saved under the data directory, covered below.

## AWS connection

| Variable | Default | Description |
|---|---|---|
| `AWS_ENDPOINT_URL` | *(unset)* | The AWS-compatible endpoint to browse, for example `http://localhost:4566`. Unset means real AWS through the standard credential chain. |
| `AWS_REGION` | `us-east-1` | Region for every AWS client. Individual endpoints can override it. |
| `AWS_ACCESS_KEY_ID` | *(unset)* | Access key. Unset means boto3 resolves credentials itself (profile, SSO, instance role). Emulators accept any value, such as `test`. |
| `AWS_SECRET_ACCESS_KEY` | *(unset)* | Secret key, paired with the one above. |
| `AWS_PROFILE` | *(unset)* | Named profile from `~/.aws/config`, read by boto3. Handy for real AWS, SSO and AssumeRole. |
| `STACKPORT_ENDPOINTS` | *(unset)* | Several named endpoints at once, as `name=url` pairs separated by commas. An empty URL means real AWS. See [Multiple Endpoints](/docs/configuration/endpoints/). |

The endpoint from `AWS_ENDPOINT_URL` (or `STACKPORT_ENDPOINTS`) is saved to the data directory the first time StackPort starts, and the saved copy is used from then on. If you later switch emulators, see [Saved endpoints](/docs/configuration/endpoints/#saved-endpoints-and-aws_endpoint_url). The CLI always honours `AWS_ENDPOINT_URL` and `--endpoint` directly.

StackPort reads `AWS_ENDPOINT_URL` at startup and then removes it from its own process environment, so that boto3's credential lookups (SSO, AssumeRole) still go to real AWS rather than to your emulator.

## StackPort settings

| Variable | Default | Description |
|---|---|---|
| `STACKPORT_PORT` | `8080` | HTTP port for the web UI and API. |
| `STACKPORT_ALLOW_WRITES` | `true` | Set to `false` for [read-only mode](/docs/configuration/real-aws/): every write request is refused by the server. |
| `STACKPORT_LEARN` | `true` | Set to `false` to remove the [guided lessons](/docs/learn/guided-lessons/), both the API routes and every trace of them in the UI. |
| `STACKPORT_S3_MAX_UPLOAD_MB` | `100` | Largest single S3 upload, in whole mebibytes. Checked in the browser and enforced by the server. |
| `STACKPORT_DATA_DIR` | `~/.stackport` | Where StackPort keeps `endpoints.json` (endpoints added in the UI) and `learn_progress.json` (lesson progress). |
| `LOG_LEVEL` | `INFO` | Python log level. `DEBUG` also shows health check requests, which are hidden otherwise. |

## Probing and caching

The dashboard probes each service with a cheap list call to count its resources. These settings control how.

| Variable | Default | Description |
|---|---|---|
| `STACKPORT_SERVICES` | *(all 35)* | Comma-separated list of services to probe. |
| `STACKPORT_PROBE_TIMEOUT` | `5` | Seconds before a single service probe gives up. |
| `STACKPORT_CACHE_TTL` | `5` | Seconds to cache the service stats between probes. |
| `STACKPORT_PROBE_WORKERS` | `10` | How many services are probed in parallel. |

The default service list is:

```text
s3,sqs,sns,dynamodb,lambda,iam,logs,ssm,secretsmanager,kinesis,events,ec2,
route53,kms,cloudformation,stepfunctions,rds,ecs,monitoring,ses,acm,wafv2,
ecr,elasticache,glue,athena,apigateway,firehose,cognito-idp,cognito-identity,
elasticmapreduce,elasticloadbalancing,elasticfilesystem,cloudfront,appsync
```

Narrowing it is useful when your endpoint only implements a few services, for example an S3-only store:

```bash
STACKPORT_SERVICES=s3 AWS_ENDPOINT_URL=http://localhost:9000 stackport
```

## Examples

```bash
# Local emulator on the default port
AWS_ENDPOINT_URL=http://localhost:4566 stackport

# Different port, larger uploads, no lessons
STACKPORT_PORT=9090 STACKPORT_S3_MAX_UPLOAD_MB=500 STACKPORT_LEARN=false \
  AWS_ENDPOINT_URL=http://localhost:4566 stackport

# Real AWS through a profile, with writes blocked
STACKPORT_ALLOW_WRITES=false AWS_PROFILE=my-profile AWS_REGION=eu-west-1 stackport
```
