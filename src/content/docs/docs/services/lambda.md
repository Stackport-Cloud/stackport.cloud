---
title: Lambda Browser
description: Inspect Lambda functions on local emulators or AWS, invoke them with event templates, edit memory, timeout and environment variables, and download the code package.
---

The Lambda view shows how each function is configured and lets you invoke it and adjust it on the spot.

<picture>
  <source srcset="/images/lambda.webp" type="image/webp" />
  <img src="/images/lambda.png" alt="StackPort Lambda browser showing a function's configuration" width="4800" height="3000" loading="lazy" decoding="async" />
</picture>

## Functions

The function list shows name, runtime, memory, timeout, code size, state and last modified, with a filter and sorting. Opening a function shows its ARN, runtime and state, with tabs for:

- **Configuration**: handler, memory, timeout, architectures, IAM role, package type, tracing, VPC, log group, environment variables and layers.
- **Code**: size, SHA-256 and a **Download code package** button (zip-packaged functions; container images have no package to download).
- **Aliases & Versions**.
- **Event sources**: the queues, streams and tables that trigger the function, with state, batch size and the last processing result.
- **Tags**.

## Invoke

**Invoke** runs the function synchronously with a JSON payload. Start from a template (API Gateway, S3, SQS, CloudWatch Events) or write your own. The result shows the status code, the version that ran, any function error, the response payload and the last 4 KB of the function's logs.

Invoking runs the function's code, which can change anything its role allows. Invoke stays available in [read-only mode](/docs/configuration/real-aws/), so be deliberate about using it against a real account.

## Edit configuration

**Edit configuration** changes the description, handler, runtime, memory (128 to 10,240 MB), timeout (1 to 900 seconds) and environment variables. Only the fields you change are sent.

## Links

Deep link to a function with `?function=my-func`.
