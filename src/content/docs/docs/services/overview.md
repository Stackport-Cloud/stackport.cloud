---
title: Service Browsers
description: Overview of StackPort's 8 custom service browsers and the generic resource table.
---

StackPort provides **8 dedicated service browsers** with service-specific interactions, plus a **generic resource table** for the remaining 27 services.

## Custom Browsers

| Service | Browse | Write Operations |
|---|---|---|
| [S3](/docs/services/s3/) | Buckets, objects, folder navigation | Upload, download, delete, batch delete |
| [DynamoDB](/docs/services/dynamodb/) | Tables, items, schema | Query by key, scan |
| [Lambda](/docs/services/lambda/) | Functions, aliases, versions, event sources | Invoke with payload, download code |
| [SQS](/docs/services/sqs/) | Queues, messages, attributes | Send, receive, delete, purge, batch send |
| [EC2](/docs/services/ec2/) | Instances, VPCs, subnets, security groups | Start, stop, reboot, terminate |
| [IAM](/docs/services/iam/) | Users, roles, groups, policies | Read-only |
| [CloudWatch Logs](/docs/services/cloudwatch-logs/) | Log groups, streams, events | Read-only |
| [Secrets Manager](/docs/services/secrets-manager/) | Secrets, rotation status | Read-only |

## Generic Resource Table

All other services use a generic browser with:

- Searchable resource table
- JSON detail view for each resource
- Pagination
- Export to JSON or CSV
- Tag viewing

## Common Features

Every browser (custom and generic) supports:

- **Search** — filter resources by name or ID
- **Pagination** — navigate large resource lists
- **Export** — download as JSON or CSV
- **Tags** — view and manage tags (21 resource types)
- **Breadcrumbs** — navigate back through resource hierarchy
- **Favorites** — bookmark frequently accessed resources
- **Dark/light theme** — follows system preference or manual toggle
