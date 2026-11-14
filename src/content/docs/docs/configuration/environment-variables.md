---
title: Environment Variables
description: Every StackPort setting, from the AWS endpoint and region to read-only mode, network access, AWS Emulator files, Learn, probing and the data directory.
---

StackPort is configured with environment variables. There is no config file to write. Endpoints you add from the Settings page and your lesson progress are saved under the data directory, covered below.

## AWS connection

| Variable | Default | Description |
|---|---|---|
| `AWS_ENDPOINT_URL` | *(unset)* | The AWS-compatible endpoint to browse, for example `http://localhost:4566`. Unset means real AWS through the standard credential chain. |
| `AWS_REGION` | `us-east-1` | Region for every AWS client. Individual endpoints can override it. |
| `AWS_ACCESS_KEY_ID` | *(unset)* | Access key. Unset means boto3 resolves credentials itself (profile, SSO, instance role). Most emulators accept any value, such as `test`; for AWS Emulator, StackPort uses the emulator's own keys first. Empty counts as unset. |
| `AWS_SECRET_ACCESS_KEY` | *(unset)* | Secret key, paired with the one above. |
| `AWS_SESSION_TOKEN` | *(unset)* | Session token for temporary credentials (SSO exports, assumed roles). Only sent with the two keys above. Read at start-up, so a new token needs a restart. |
| `AWS_PROFILE` | *(unset)* | Named profile from `~/.aws/config`, read by boto3. Handy for real AWS, SSO and AssumeRole. |
| `STACKPORT_ENDPOINTS` | *(unset)* | Several named endpoints at once, as `name=url` pairs separated by commas. An empty URL means real AWS. See [Multiple Endpoints](/docs/configuration/endpoints/). |

The endpoint from `AWS_ENDPOINT_URL` (or `STACKPORT_ENDPOINTS`) is saved to the data directory the first time StackPort starts. Starting again with `AWS_ENDPOINT_URL` points the saved `default` endpoint at that URL for that run, and starting without it uses the saved URL. See [Saved endpoints](/docs/configuration/endpoints/#saved-endpoints-and-aws_endpoint_url). The CLI always honours `AWS_ENDPOINT_URL` and `--endpoint` directly.

StackPort reads `AWS_ENDPOINT_URL` at startup and then removes it from its own process environment, so that boto3's credential lookups (SSO, AssumeRole) still go to real AWS rather than to your emulator. Endpoint URLs meant for other AWS tools, such as `AWS_ENDPOINT_URL_S3` or a profile's `endpoint_url`, don't apply to StackPort.

## StackPort settings

| Variable | Default | Description |
|---|---|---|
| `STACKPORT_PORT` | `8080` | HTTP port for the web UI and API. |
| `STACKPORT_HOST` | `127.0.0.1` | Interface StackPort listens on. The Docker image sets `0.0.0.0`, which a container needs; publish it on `127.0.0.1` to keep it on your machine. StackPort has no login, so only open it to a network where that's fine. |
| `STACKPORT_ALLOW_WRITES` | `true` | Set to `false` for [read-only mode](/docs/configuration/real-aws/): every write request is refused by the server. |
| `STACKPORT_LEARN` | `true` | Set to `false` to remove the [guided lessons](/docs/learn/guided-lessons/), both the API routes and every trace of them in the UI. |
| `STACKPORT_S3_MAX_UPLOAD_MB` | `100` | Largest single S3 upload, in whole mebibytes. Checked in the browser and enforced by the server. |
| `STACKPORT_DATA_DIR` | `~/.stackport` | Where StackPort keeps `endpoints.json` (endpoints added in the UI) and `learn_progress.json` (lesson progress). |
| `STACKPORT_AWS_EMULATOR_DIR` | `~/.aws/emulator` | Where StackPort looks for the keys and certificate [AWS Emulator](/docs/guides/aws-emulator/) writes for each port. Empty turns the lookup off. |
| `LOG_LEVEL` | `INFO` | Python log level. `DEBUG` also shows health check requests, which are hidden otherwise. |
| `STACKPORT_LOG_AWS_WIRE` | `false` | Also log botocore's requests and responses at `DEBUG`. They include parameter values, secrets and session tokens, so turn it on only to debug a connection. |

## Browser access

StackPort refuses browser requests that come from other websites, or that reach it through a host name it doesn't know, so a page you visit can't drive a StackPort running on your machine. Scripts and health checks aren't affected. These settings open it up where you need to.

| Variable | Default | Description |
|---|---|---|
| `STACKPORT_ALLOWED_HOSTS` | *(empty)* | Host names browsers may use to open StackPort besides `localhost` and IP addresses, comma-separated (`*` for any). Needed behind a reverse proxy, a forwarded port with its own host name, or a machine name on your network. |
| `STACKPORT_CORS_ORIGINS` | *(empty)* | Origins allowed to call StackPort's API from another site, comma-separated. Empty means only StackPort's own pages. |

## Probing and caching

The dashboard probes each service with a cheap list call to count its resources. These settings control how.

| Variable | Default | Description |
|---|---|---|
| `STACKPORT_SERVICES` | *(all 51)* | Comma-separated list of services to probe. |
| `STACKPORT_PROBE_TIMEOUT` | `5` | Seconds to wait when connecting to a local emulator. Calls to local emulators aren't retried, so a stopped emulator shows up in seconds. |
| `STACKPORT_CACHE_TTL` | `5` | Seconds to cache the service stats between probes. |
| `STACKPORT_PROBE_WORKERS` | `10` | How many services are probed in parallel. |

The default service list is:

```text
s3,sqs,sns,dynamodb,lambda,iam,logs,ssm,secretsmanager,kinesis,events,ec2,
route53,kms,cloudformation,stepfunctions,rds,ecs,monitoring,ses,acm,wafv2,
ecr,elasticache,glue,athena,apigateway,firehose,cognito-idp,cognito-identity,
elasticmapreduce,elasticloadbalancing,elasticfilesystem,cloudfront,appsync,
scheduler,pipes,appconfig,servicediscovery,codebuild,codepipeline,codecommit,
codedeploy,batch,eks,es,kafka,bedrock,cloudtrail,xray,verifiedpermissions
```

The keys are the names services sign their requests with, which is not always the name you know them by: `monitoring` is CloudWatch, `es` is OpenSearch, `kafka` is MSK and `servicediscovery` is Cloud Map. Every service boto3 knows, listed here or not, can still be called from the [API Explorer](/docs/explorer/api-explorer/).

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

# AWS Emulator on its default port: no keys or certificate to pass
AWS_ENDPOINT_URL=https://127.0.0.1:9297 stackport

# Real AWS through a profile, with writes blocked
STACKPORT_ALLOW_WRITES=false AWS_PROFILE=my-profile AWS_REGION=eu-west-1 stackport

# Open to your network, reached as http://my-laptop.local:8080
STACKPORT_HOST=0.0.0.0 STACKPORT_ALLOWED_HOSTS=my-laptop.local stackport
```
