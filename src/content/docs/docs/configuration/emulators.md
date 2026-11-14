---
title: Emulators
description: StackPort works with AWS Emulator, MiniStack, Floci, LocalStack, Moto and any other AWS-compatible endpoint. How to connect each one, side by side.
---

StackPort only speaks the standard AWS API, so any emulator that implements it can sit behind StackPort. There is nothing emulator-specific to install or enable. You set one URL and StackPort probes every service it knows about; services an emulator does not implement are marked on the dashboard and nothing else is affected. StackPort also recognises which emulator answers and shows its name next to the endpoint.

The emulators below are documented side by side in a fixed order: AWS Emulator first as AWS's own emulator, then MiniStack as StackPort's partner project and origin (StackPort started as a MiniStack pull request), then Floci, LocalStack and Moto. Every one of them gets the same console.

| Emulator | Default endpoint | One-line start | Guide |
|---|---|---|---|
| [AWS Emulator](https://github.com/aws/aws-emulator) | `https://127.0.0.1:9297` | `aws-emulator` (Linux package; a container on macOS and Windows) | [Using StackPort with AWS Emulator](/docs/guides/aws-emulator/) |
| [MiniStack](https://github.com/ministackorg/ministack) | `http://localhost:4566` | `docker run -d -p 4566:4566 ministackorg/ministack` | [Using StackPort with MiniStack](/docs/guides/ministack/) |
| [Floci](https://github.com/floci-io/floci) | `http://localhost:4566` | `docker run -d -p 4566:4566 floci/floci` | [Using StackPort with Floci](/docs/guides/floci/) |
| [LocalStack](https://docs.localstack.cloud) | `http://localhost:4566` | `docker run -d -p 4566:4566 -e LOCALSTACK_AUTH_TOKEN=<your-token> localstack/localstack` | [Using StackPort with LocalStack](/docs/guides/localstack/) |
| [Moto](https://github.com/getmoto/moto) | `http://localhost:5000` | `docker run -d -p 5000:5000 motoserver/moto` | [Using StackPort with Moto](/docs/guides/moto/) |

AWS Emulator is installed from AWS's packages, or run in a container you build from AWS's Dockerfile; its guide links to both. LocalStack needs a LocalStack account and an auth token to start, and its guide covers where to get one.

With the emulator running, start StackPort against it:

```bash
AWS_ENDPOINT_URL=https://127.0.0.1:9297 stackport   # AWS Emulator
AWS_ENDPOINT_URL=http://localhost:4566 \
  AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test stackport   # MiniStack, Floci, LocalStack
AWS_ENDPOINT_URL=http://localhost:5000 \
  AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test stackport   # Moto
```

Most emulators accept any credentials, but StackPort needs a pair to sign its requests. AWS Emulator is different: it only accepts the keys it creates on each start, and StackPort reads them, together with the emulator's certificate, from `~/.aws/emulator/<port>/`. See [How StackPort finds the keys and certificate](/docs/guides/aws-emulator/#how-stackport-finds-the-keys-and-certificate).

Each guide follows the same structure: setup, a Compose file, what works, and tips specific to that emulator.

## Other AWS-compatible endpoints

Anything that answers the AWS API works the same way. Two common cases:

- **S3-compatible storage** such as MinIO: `AWS_ENDPOINT_URL=http://localhost:9000 stackport`. Only S3 will report as available.
- **DynamoDB Local**: `AWS_ENDPOINT_URL=http://localhost:8000 stackport`. Only DynamoDB will report as available.

For single-service endpoints like these, set `STACKPORT_SERVICES` to just that service so the dashboard does not probe the rest. See [Browse local S3 and DynamoDB](/docs/guides/local-s3-dynamodb/).

An endpoint served over HTTPS with its own certificate can have a CA bundle, or certificate checks turned off, in its settings. See [Certificates](/docs/configuration/endpoints/#certificates).

## Real AWS

Leave `AWS_ENDPOINT_URL` unset and StackPort uses real AWS through your credential chain. See [Real AWS and Read-only Mode](/docs/configuration/real-aws/).

## Several at once

You can register every emulator and account you work with and switch between them from the top bar. See [Multiple Endpoints and Authentication](/docs/configuration/endpoints/).

## Something works worse on your emulator?

If a view behaves differently on one emulator than on the others, please [open an issue](https://github.com/DaviReisVieira/stackport/issues). Closing that kind of gap is exactly what the project wants to do, and pull requests that improve support for any emulator are very welcome.
