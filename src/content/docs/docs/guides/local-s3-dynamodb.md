---
title: Browse local S3 and DynamoDB in a web UI
description: Use StackPort as a GUI for local S3 and DynamoDB, including DynamoDB Local and MinIO. Browse tables and buckets, edit items, upload files, no AWS console needed.
---

S3 and DynamoDB are often the first two services people run locally, and the ones where a visual view helps most: what is in this bucket, what did that write actually store. StackPort gives you a browser-based console for both, against whatever you run locally.

## With a full emulator

If you already run MiniStack, Floci, LocalStack or Moto, point StackPort at it and both views are there, next to every other service. The guides cover each one:

- [Using StackPort with MiniStack](/docs/guides/ministack/)
- [Using StackPort with Floci](/docs/guides/floci/)
- [Using StackPort with LocalStack](/docs/guides/localstack/)
- [Using StackPort with Moto](/docs/guides/moto/)

## With DynamoDB Local

[DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) speaks the DynamoDB API on port `8000`.

```bash
docker run -d -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb

STACKPORT_SERVICES=dynamodb AWS_ENDPOINT_URL=http://localhost:8000 \
  AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test stackport
```

- `STACKPORT_SERVICES=dynamodb` keeps the dashboard from probing services that are not there.
- Without `-sharedDb`, DynamoDB Local keeps a separate database per access key and region. If your tables seem to be missing, either start it with `-sharedDb` or give StackPort the same key and region your application uses.
- The endpoint health in Settings is checked with an S3 call, so it reads as unhealthy here. The DynamoDB view itself works normally.
- DynamoDB Local does not support tags, so opening a table shows a "Failed to fetch data" error and no tags. The rest of the table page works normally.

## With MinIO or another S3-compatible store

MinIO's community repository is no longer maintained, and the `minio/minio` image is no longer available on Docker Hub. If you already run MinIO, or any other S3-compatible store, point StackPort at its S3 port:

```bash
STACKPORT_SERVICES=s3 AWS_ENDPOINT_URL=http://localhost:9000 \
  AWS_ACCESS_KEY_ID=minioadmin AWS_SECRET_ACCESS_KEY=minioadmin stackport
```

Use the credentials your store expects. MinIO's defaults are shown above. StackPort sends path-style S3 requests to a custom endpoint, so the store does not need wildcard DNS for bucket names.

## What you can do

**[DynamoDB](/docs/services/dynamodb/)**

- See every table with its keys, item count, size and billing mode.
- Scan with "load more", or query by partition key with an optional sort key condition.
- Create tables, and create, edit and delete items as plain JSON or DynamoDB JSON.

**[S3](/docs/services/s3/)**

- Browse buckets and folders with breadcrumbs and a filter.
- Upload by drag and drop, download, create folders, and delete objects or whole prefixes.
- Inspect object metadata, and edit bucket tags, versioning, lifecycle rules, CORS and event notifications.

Both views have deep links (`?table=Orders`, `?bucket=my-bucket&prefix=data/`) you can share or bookmark.
