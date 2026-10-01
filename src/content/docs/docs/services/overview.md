---
title: Service Browsers
description: StackPort's 13 dedicated service views and the generic resource table for the other 22 AWS services, with the write operations each one supports.
---

StackPort covers 35 AWS services. Thirteen of them have a **dedicated view** built around how you actually use that service. The other 22 get a **generic resource table** that still lets you search, inspect and export everything.

## Dedicated views

| Service | What you can browse | What you can change |
|---|---|---|
| [S3](/docs/services/s3/) | Buckets, folders, objects and their metadata | Create buckets, upload, download, create folders, delete objects and prefixes, edit tags, versioning, lifecycle, CORS and notifications |
| [DynamoDB](/docs/services/dynamodb/) | Tables, keys, indexes, items (scan and query) | Create tables, create, edit and delete items |
| [Lambda](/docs/services/lambda/) | Functions, configuration, aliases, versions, event sources | Invoke with event templates, edit configuration and environment, download code |
| [SQS](/docs/services/sqs/) | Queues, depths, messages, configuration | Create queues (with a DLQ), send single and batch messages, delete messages, purge, delete queues, edit attributes, redrive and tags |
| [SNS](/docs/services/sns/) | Topics, subscriptions, filter policies, attributes | Create topics, publish, subscribe, unsubscribe, delete topics |
| [EC2](/docs/services/ec2/) | Instances, security group rules, VPCs and subnets, Auto Scaling groups | Start, stop, reboot and terminate instances, edit instance tags |
| [IAM](/docs/services/iam/) | Users, groups, roles, customer-managed policies, trust policies | Read-only |
| [RDS](/docs/services/rds/) | Instances, clusters, snapshots, parameter groups | Read-only |
| [KMS](/docs/services/kms/) | Keys, key policies, grants, aliases | Read-only |
| [Step Functions](/docs/services/step-functions/) | State machines, definition graph, executions, timeline | Start and stop executions |
| [CloudWatch Logs](/docs/services/cloudwatch-logs/) | Log groups, streams, events, live tail | Create and delete log groups, delete streams, set retention, edit tags |
| [CloudWatch Metrics](/docs/services/cloudwatch-metrics/) | Dashboards with metric charts, alarms | Read-only |
| [Secrets Manager](/docs/services/secrets-manager/) | Secrets, values, rotation, versions | Create, edit value and metadata, duplicate, delete, restore |

Write operations follow `STACKPORT_ALLOW_WRITES`. In [read-only mode](/docs/configuration/real-aws/) the server refuses them and the top bar shows a **Read-only** badge.

## Generic resource table

Every other service opens in a generic view:

- One tab per resource type, with a count on each.
- A table whose columns come from the data, with a property filter (`:`, `!:`, `=`, `!=`), sorting, resizable columns and a page size of 25, 50 or 100.
- `j` and `k` to move between rows and `Enter` to open one.
- A detail modal with the full describe response as JSON.
- Tags for supported resource types, editable when writes are enabled.
- Export of each tab to JSON or CSV.

The services on the generic table are ACM, API Gateway (REST and HTTP APIs), AppSync, Athena, CloudFormation, CloudFront, Cognito User Pools, Cognito Identity Pools, ECR, ECS, EFS, ElastiCache, Elastic Load Balancing, EMR, EventBridge, Firehose, Glue, Kinesis, Route 53, SES, Systems Manager Parameter Store and WAFv2.

## Tags

StackPort reads tags on 24 resource types and edits them on 23 (CloudFormation stacks are read-only). Editing replaces the full tag set with what you save. Where tags are editable depends on the view: the generic table, S3 buckets, SQS queues, EC2 instances and CloudWatch log groups have an editor, and Secrets Manager edits tags with the secret's metadata. The other dedicated views show tags read-only.

## Across every page

- **Dashboard.** Every service with its status and resource counts, live over a WebSocket (falling back to polling), as cards or a table. Star a service to pin it first and add it to the top bar.
- **Service search.** `Alt+S` (`Option+S` on macOS) jumps to any service.
- **Deep links.** Views put the selected resource in the URL (`?bucket=`, `?table=`, `?queue=`, `?function=` and so on), so you can bookmark or share exactly what you are looking at.
- **Export.** Many tables export to JSON or CSV, named `stackport-<service>-<type>-<timestamp>`.
- **Themes.** Light, dark, or follow the system.
- **Confirmation for destructive actions.** Purging or deleting a queue, deleting a topic, and deleting log groups and streams ask you to type the name first.

## Keyboard shortcuts

Press `?` anywhere to see them all.

| Keys | Action |
|---|---|
| `?` | Show keyboard shortcuts |
| `Alt+S` / `Option+S` | Focus service search |
| `b` | Toggle the side navigation |
| `t` | Toggle theme |
| `g` `d` | Go to Dashboard |
| `g` `r` | Go to Resources |
| `g` `s` | Go to Settings |
| `g` `a` | Go to About |
| `g` `l` | Go to Learn (when Learn is enabled) |
| `Esc` | Close a modal |
| `r` | Refresh the dashboard |
| `v` | Switch the dashboard between grid and list |
| `j` / `k` | Next or previous row in a table |
| `Enter` | Open the selected row |

Two-key sequences need to be pressed within a second. Shortcuts are ignored while you are typing in a field.
