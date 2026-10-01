---
title: Emulators
description: StackPort works with MiniStack, Floci, LocalStack, Moto and any other AWS-compatible endpoint. How to connect each one.
---

StackPort only speaks the standard AWS API, so any emulator that implements it can sit behind StackPort. There is nothing emulator-specific to install or enable. You set one URL and StackPort probes every service it knows about; services an emulator does not implement simply show as unavailable on the dashboard.

The emulators below are documented side by side in a fixed order. MiniStack is listed first because StackPort grew out of a MiniStack pull request, not because it is preferred.

| Emulator | Default endpoint | One-line start | Guide |
|---|---|---|---|
| [MiniStack](https://github.com/ministackorg/ministack) | `http://localhost:4566` | `docker run -d -p 4566:4566 ministackorg/ministack` | [Using StackPort with MiniStack](/docs/guides/ministack/) |
| [Floci](https://github.com/floci-io/floci) | `http://localhost:4566` | `docker run -d -p 4566:4566 floci/floci` | [Using StackPort with Floci](/docs/guides/floci/) |
| [LocalStack](https://docs.localstack.cloud) | `http://localhost:4566` | `docker run -d -p 4566:4566 -e LOCALSTACK_AUTH_TOKEN=<your-token> localstack/localstack` | [Using StackPort with LocalStack](/docs/guides/localstack/) |
| [Moto](https://github.com/getmoto/moto) | `http://localhost:5000` | `docker run -d -p 5000:5000 motoserver/moto` | [Using StackPort with Moto](/docs/guides/moto/) |

LocalStack needs a LocalStack account and an auth token to start. Its guide covers where to get one.

With the emulator running, start StackPort against it:

```bash
AWS_ENDPOINT_URL=http://localhost:4566 stackport   # MiniStack, Floci, LocalStack
AWS_ENDPOINT_URL=http://localhost:5000 stackport   # Moto
```

Each guide follows the same structure: setup, a Compose file, what works, and tips specific to that emulator.

## Other AWS-compatible endpoints

Anything that answers the AWS API works the same way. Two common cases:

- **S3-compatible storage** such as MinIO: `AWS_ENDPOINT_URL=http://localhost:9000 stackport`. Only S3 will report as available.
- **DynamoDB Local**: `AWS_ENDPOINT_URL=http://localhost:8000 stackport`. Only DynamoDB will report as available.

For single-service endpoints like these, set `STACKPORT_SERVICES` to just that service so the dashboard does not probe the rest. See [Browse local S3 and DynamoDB](/docs/guides/local-s3-dynamodb/).

## Real AWS

Leave `AWS_ENDPOINT_URL` unset and StackPort uses real AWS through your credential chain. See [Real AWS and Read-only Mode](/docs/configuration/real-aws/).

## Several at once

You can register every emulator and account you work with and switch between them from the top bar. See [Multiple Endpoints and Authentication](/docs/configuration/endpoints/).

## Something works worse on your emulator?

If a view behaves differently on one emulator than on the others, please [open an issue](https://github.com/DaviReisVieira/stackport/issues). Closing that kind of gap is exactly what the project wants to do, and pull requests that improve support for any emulator are very welcome.
