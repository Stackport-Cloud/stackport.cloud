---
title: Using StackPort with AWS Emulator
description: AWS Emulator has no graphical interface. StackPort is a free, open-source web UI and console for it that finds the emulator's keys and certificate by itself.
head:
  - tag: title
    content: 'AWS Emulator UI: a web console for AWS Emulator | StackPort'
  - tag: meta
    attrs:
      property: og:title
      content: 'AWS Emulator UI: a web console for AWS Emulator'
---

[AWS Emulator](https://github.com/aws/aws-emulator) is AWS's local emulator of the AWS APIs. It serves every service on a single HTTPS port, `9297`, and has no graphical interface of its own: you use it through the AWS CLI and the SDKs. StackPort gives it a web UI: a dashboard of every service with live resource counts, dedicated views for S3, DynamoDB, Lambda, SQS and more, and an [API Explorer](/docs/explorer/api-explorer/) for every other operation.

StackPort talks to AWS Emulator over the standard AWS API, the same way the AWS CLI does. Nothing needs to be installed or enabled inside the emulator, and StackPort picks up the keys and certificate the emulator creates on every start by itself. StackPort is an independent open-source project, not made or endorsed by AWS.

<picture>
  <source srcset="/images/dashboard.webp" type="image/webp" />
  <img src="/images/dashboard.png" alt="The StackPort dashboard connected to AWS Emulator, with 51 of 51 services available and resource counts for EC2, IAM, S3, SQS, DynamoDB and more" width="3200" height="2000" loading="lazy" decoding="async" />
</picture>

## Setup

### 1. Start AWS Emulator

AWS publishes AWS Emulator as Linux packages (RPM and Debian, for x86_64 and Arm). On macOS and Windows you run it in a container built from a short Dockerfile, since there is no prebuilt image. Follow AWS's guide for your system, [Getting started on Linux](https://docs.aws.amazon.com/emulator/latest/userguide/getting-started-linux.html) or [Getting started with Docker](https://docs.aws.amazon.com/emulator/latest/userguide/getting-started-docker.html). With the Linux package installed, start it with:

```bash
aws-emulator
```

By default it serves HTTPS on `127.0.0.1:9297`, so only your own machine can reach it. Every time it starts, it writes a new certificate and a new pair of access keys to `~/.aws/emulator/9297/`, and by default it only accepts requests signed with those keys.

AWS's Docker command mounts `~/.aws/emulator` into the container, so the files land in the same folder on your machine. On Linux, add `--user "$(id -u):$(id -g)"` to it as AWS's guide says, so the files belong to you and StackPort can read them.

### 2. Start StackPort

```bash
pip install stackport
AWS_ENDPOINT_URL=https://127.0.0.1:9297 stackport
```

Open **http://localhost:8080**. There are no credentials or certificate settings to pass: StackPort finds both in `~/.aws/emulator/9297/` (see [How StackPort finds the keys and certificate](#how-stackport-finds-the-keys-and-certificate)). Use the address from AWS's guide, `https://127.0.0.1:9297`: the emulator's certificate only covers `127.0.0.1` and `localhost`.

To run StackPort in Docker too, use the Compose file below. A StackPort container can't use `host.docker.internal` here, because the certificate doesn't cover that name, so the Compose file puts StackPort on the emulator's own network instead.

## Docker Compose

The StackPort repository has a ready-made file that runs AWS Emulator, StackPort and a seed container together:

```bash
curl -O https://raw.githubusercontent.com/DaviReisVieira/stackport/main/examples/docker-compose.aws-emulator.yml
docker compose -f docker-compose.aws-emulator.yml up -d
```

Open **http://localhost:8080**. The seed creates a few resources across S3, SQS, SNS, DynamoDB, Secrets Manager, IAM, CloudWatch Logs and Step Functions, so the dashboard has something to show on first load. If it stays empty, check `docker compose -f docker-compose.aws-emulator.yml logs seed`.

[`examples/docker-compose.aws-emulator.yml`](https://github.com/DaviReisVieira/stackport/blob/main/examples/docker-compose.aws-emulator.yml) is shaped around how AWS Emulator works:

- **It builds the emulator image.** The first `up` builds one from the Dockerfile in AWS's guide, with the package for your CPU (x86_64, or Arm such as Apple silicon). To move to a newer release, run `docker compose -f docker-compose.aws-emulator.yml build --no-cache aws-emulator` and start it again.
- **StackPort shares the emulator's network.** StackPort and the seed run with `network_mode: service:aws-emulator`, so they reach the emulator on `https://127.0.0.1:9297`, the address its certificate covers. That is also why both published ports, `127.0.0.1:8080` for StackPort and `127.0.0.1:9297` for the emulator, sit on the emulator's service.
- **A volume holds the keys and certificate.** The emulator writes them to the `aws-emulator-files` volume, which StackPort reads at `/root/.aws/emulator`. StackPort needs no `AWS_ACCESS_KEY_ID` or certificate settings, and follows the new ones after a restart.
- **Memory is capped at 2 GiB**, as in AWS's guide. Past that the container stops with exit code 137 and the emulated resources are gone. `docker compose -f docker-compose.aws-emulator.yml up -d --force-recreate` brings everything back.

It needs Docker Compose 2.17 or later with BuildKit, which is the default.

## How StackPort finds the keys and certificate

For an endpoint at `https://127.0.0.1:<port>` or `https://localhost:<port>`, with the port written out, StackPort looks in `~/.aws/emulator/<port>/`, the folder AWS Emulator writes for that port:

- **`emulator_credentials`**: the keys StackPort signs requests with, when the endpoint uses the **Default** authentication type. They come before `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`, so test keys left in your shell don't get in the way.
- **`ca.pem`**: the certificate StackPort trusts, for that endpoint only. StackPort doesn't need `AWS_CA_BUNDLE`, which would replace the system certificates for every endpoint, real AWS included.

StackPort notices when those files change. After the emulator restarts with new keys and a new certificate, StackPort uses them without a restart of its own. An endpoint you give its own profile, keys or CA bundle in **Settings** uses those instead. If the emulator runs with `--auth off`, it writes no keys. StackPort then signs with `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` if you set them, and otherwise with placeholder keys, so it never reaches for your AWS profile.

`STACKPORT_AWS_EMULATOR_DIR` changes where StackPort looks (default `~/.aws/emulator`), and an empty value turns the lookup off. See [Environment Variables](/docs/configuration/environment-variables/).

To check what StackPort used, edit the endpoint in **Settings** and press **Test connection**. It names the emulator it found, "Connected to AWS Emulator", and shows which keys and certificate it used.

## The AWS CLI next to StackPort

The console needs none of this setup, but the AWS CLI does. When a [guided lesson](/docs/learn/guided-lessons/) shows a CLI command, or the [API Explorer](/docs/explorer/api-explorer/) shows a request as an AWS CLI command or boto3 code, StackPort adds the lines AWS Emulator needs, to run once in your terminal:

```bash
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN AWS_PROFILE
export AWS_SHARED_CREDENTIALS_FILE=~/.aws/emulator/9297/emulator_credentials
export AWS_CA_BUNDLE=~/.aws/emulator/9297/ca.pem
export AWS_DISABLE_HOST_PREFIX_INJECTION=true
```

<picture>
  <source srcset="/images/explorer-cli.webp" type="image/webp" />
  <img src="/images/explorer-cli.png" alt="The API Explorer's AWS CLI tab for SQS ListQueues, with a box titled 'AWS Emulator needs a little setup first' holding the unset and export lines above the aws sqs list-queues command" width="3200" height="2000" loading="lazy" decoding="async" />
</picture>

These follow AWS's guide, [Pointing your AWS SDK at AWS Emulator](https://docs.aws.amazon.com/emulator/latest/userguide/point-sdk-to-emulator.html): clear real credentials from the shell, sign with the emulator's keys, trust its certificate, and stop the CLI from adding a prefix to the host name. StackPort only shows them when it uses the emulator's own files for that endpoint.

When StackPort runs in a container, the lines use the paths on your machine, and a note explains how to copy the files out of the Compose volume (again after each restart):

```bash
mkdir -p ~/.aws/emulator
docker compose -f docker-compose.aws-emulator.yml cp aws-emulator:/home/emulator/.aws/emulator/9297 ~/.aws/emulator/
```

## What works

- **The dashboard** probes all 51 services StackPort knows about and names the emulator it is connected to. Services AWS Emulator implements show their resource counts; any it does not implement show as "Not supported", and nothing else is affected. With AWS Emulator 1.0.367, all 51 answered.
- **All 13 service views** (S3, DynamoDB, Lambda, SQS, SNS, EC2, IAM, RDS, KMS, Step Functions, CloudWatch Logs, CloudWatch Metrics and Secrets Manager) use standard AWS API calls, so each one works as far as AWS Emulator implements the calls behind it. AWS publishes [fidelity scores](https://github.com/aws/aws-emulator/releases) per service with each release.
- **Write operations** such as uploading to S3, editing DynamoDB items, sending SQS messages or starting Step Functions executions go straight to the emulator. S3 uploads of 8 MiB or more go up in 8 MiB parts, under the emulator's 16 MiB limit per request.
- **The [API Explorer](/docs/explorer/api-explorer/)** runs any operation against the emulator, including services StackPort has no view for, and copies it with the setup above.
- **[Guided lessons](/docs/learn/guided-lessons/)** run against AWS Emulator like any local endpoint, and verify each step against its real state.
- **The [CLI](/docs/cli/commands/)** finds the keys and certificate the same way: `stackport status --endpoint https://127.0.0.1:9297`.

If a view behaves worse on AWS Emulator than on other emulators, please [open an issue](https://github.com/DaviReisVieira/stackport/issues). That is exactly the kind of gap the project wants to close.

## Tips

- **A restart starts empty.** The emulator keeps everything in memory and has no route to reset it, so restarting it is how you start over. Its keys and certificate change at the same time, and StackPort follows them by itself.
- **Several emulators.** Run each one on its own port (`aws-emulator -p 9300`); each port gets its own folder of keys. Add each as an endpoint in StackPort, or name them with `STACKPORT_ENDPOINTS="emulator-a=https://127.0.0.1:9297,emulator-b=https://127.0.0.1:9300"`, and switch from the top bar.
- **One account, one Region.** The emulator acts as a single account, `000000000000`, and AWS's guide suggests one Region per emulator. StackPort uses `us-east-1`, the Region in the emulator's own config file, unless you set `AWS_REGION` or a region on the endpoint.
- **Host prefixes.** For a few operations, such as Cloud Map `DiscoverInstances`, SDKs add a prefix to the host name, which doesn't resolve for `127.0.0.1`. StackPort turns those prefixes off for every local endpoint, so the console and the API Explorer reach the emulator; the CLI needs `AWS_DISABLE_HOST_PREFIX_INJECTION=true`, which the setup above sets.
- **Telemetry.** AWS Emulator sends usage data to AWS by default; [its README](https://github.com/aws/aws-emulator#telemetry) explains what is collected. `aws-emulator --telemetry off` turns it off for a run, and the Compose file has a commented `command: [ "--telemetry", "off" ]` line for it. StackPort itself has no telemetry.
- **Switching emulators.** Starting StackPort with a different `AWS_ENDPOINT_URL` points the `default` endpoint there for that run only. To keep several emulators at hand, give each one a name with `STACKPORT_ENDPOINTS` and switch from the top bar. See [Saved endpoints](/docs/configuration/endpoints/#saved-endpoints-and-aws_endpoint_url).
- **Only probe what you use.** Set `STACKPORT_SERVICES` to the services you need, for example `STACKPORT_SERVICES=s3,sqs,dynamodb,lambda`, to keep the dashboard focused.

## Related

- [Emulators overview](/docs/configuration/emulators/) compares the setup for every supported emulator.
- [Multiple Endpoints and Authentication](/docs/configuration/endpoints/) covers per-endpoint keys and certificate settings.
- [API Explorer](/docs/explorer/api-explorer/) calls any operation, with the AWS CLI setup above built in.
- [Service Browsers](/docs/services/overview/) lists what each view can do.
