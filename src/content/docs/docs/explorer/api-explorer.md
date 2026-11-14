---
title: API Explorer
description: Call any operation of any AWS service boto3 knows from a web UI, against your emulator or AWS account, and copy it as an AWS CLI command or boto3 code.
head:
  - tag: title
    content: 'API Explorer: call any AWS API from a web UI | StackPort'
  - tag: meta
    attrs:
      property: og:image
      content: https://stackport.cloud/images/og/explorer.png
  - tag: meta
    attrs:
      property: og:image:alt
      content: The StackPort API Explorer running a DynamoDB Scan
  - tag: meta
    attrs:
      name: twitter:image
      content: https://stackport.cloud/images/og/explorer.png
  - tag: meta
    attrs:
      name: twitter:image:alt
      content: The StackPort API Explorer running a DynamoDB Scan
---

The [service views](/docs/services/overview/) cover what StackPort knows about, and emulators implement much more. The API Explorer calls any operation of any service boto3 knows against the selected endpoint, including services StackPort has no view for. It works the same with [AWS Emulator](/docs/guides/aws-emulator/), [MiniStack](/docs/guides/ministack/), [Floci](/docs/guides/floci/), [LocalStack](/docs/guides/localstack/), [Moto](/docs/guides/moto/), any other AWS-compatible endpoint, and [real AWS](/docs/configuration/real-aws/).

Open **API Explorer** in the side navigation, or press `g` then `e`.

<picture>
  <source srcset="/images/explorer.webp" type="image/webp" />
  <img src="/images/explorer.png" alt="The API Explorer with DynamoDB selected: the operation list with Read and Write badges, the Scan operation's form with the TableName field, and the response with status 200, duration, request ID and the items as JSON" width="3200" height="2000" loading="lazy" decoding="async" />
</picture>

## Pick an operation

Choose a service, then an operation. Both lists come from botocore's own service models, the same ones the AWS CLI and boto3 use, so every service and operation they know is there. Each operation shows its documentation and a **Read** or **Write** badge, and you can filter the list to either kind.

## Build the request

The **Form** tab is built from the operation's input:

- Required fields come first; the optional ones sit in their own section.
- Enums become dropdowns, maps get a key and value editor, and nested structures take JSON.
- Each field shows its type and limits from the model, such as `String, 1 to 1024 characters`.

The **JSON** tab holds the whole request as boto3 takes it. Edits in either tab show up in the other.

Bytes that aren't text travel as `{"$base64": "..."}`, both in responses and in the parameters you send.

## Run it

Press **Run** and the response comes back as JSON, with its HTTP status, request ID, duration and retries. Errors come back with the endpoint's own status and message, so you see what your emulator or AWS actually said.

- **Pages.** For paginated operations, **Follow pages** keeps calling with each response's next token, up to 50 pages in one run. **Fetch next page** continues where a run stopped.
- **Large responses.** Streamed responses (an S3 object, a Lambda invoke) show their first 1 MB. Responses over 5 MB of JSON aren't shown.
- **Event streams.** Operations that stream events can be built and copied, but not run.

## Copy it as AWS CLI or boto3

The **AWS CLI** and **Python (boto3)** tabs show the same request as a command or code to copy, pointed at the selected endpoint.

When the endpoint's emulator needs more than `--endpoint-url`, the tabs show the shell setup to run first, the same as [guided lessons](/docs/learn/guided-lessons/) do. Today that is AWS Emulator, which needs its keys, its certificate and host prefixes turned off. See [The AWS CLI next to StackPort](/docs/guides/aws-emulator/#the-aws-cli-next-to-stackport).

## Links and history

- Links like `/explorer?service=sqs&operation=ListQueues` open an operation directly, so you can bookmark or share one.
- **History** keeps your last 15 requests in this browser. Values the API marks as sensitive, such as secret strings, are left out.

## Read-only mode and real AWS

In [read-only mode](/docs/configuration/real-aws/#read-only-mode) (`STACKPORT_ALLOW_WRITES=false`), the server only runs operations that read: Describe, Get, List and similar. A few count as writes even though their names sound like reads:

- operations that create something, and
- operations that hand out credentials, tokens or passwords, such as `sts GetSessionToken` or `ecr GetAuthorizationToken`.

Reading a stored value, such as a secret's value, stays a read, as it is in the console's views. Operations that write stay visible, so you can still build the request and copy it.

On real AWS, and while StackPort can't yet tell whether the endpoint is AWS, operations that write ask for confirmation before they run.

## Related

- [Service Browsers](/docs/services/overview/) for the services that have a view or a resource table.
- [CLI Commands](/docs/cli/commands/) for listing and exporting resources from scripts.
- [Real AWS and Read-only Mode](/docs/configuration/real-aws/) for browsing an account safely.
