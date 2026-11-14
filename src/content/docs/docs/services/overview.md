---
title: Service Browsers
description: 'The 51 AWS services StackPort browses: 13 dedicated views, a searchable resource table for the other 38, and the write operations each view supports.'
---

StackPort covers 51 AWS services. Thirteen of them have a **dedicated view** built around how you actually use that service. The other 38 get a **generic resource table** that still lets you search, inspect and export everything. For any operation of any service boto3 knows, with or without a view, there is the [API Explorer](/docs/explorer/api-explorer/).

## Dedicated views

| Service | What you can browse | What you can change |
|---|---|---|
| [S3](/docs/services/s3/) | Buckets, folders, objects and their metadata | Create buckets, upload, download, create folders, delete objects and prefixes, edit tags, versioning, lifecycle, CORS and notifications |
| [DynamoDB](/docs/services/dynamodb/) | Tables, keys, indexes, items (scan and query), live item count | Create tables, create, edit and delete items |
| [Lambda](/docs/services/lambda/) | Functions, configuration, aliases, versions, event sources | Invoke with event templates, edit configuration and environment, download code |
| [SQS](/docs/services/sqs/) | Queues, depths, messages, configuration | Create queues (with a DLQ), send single and batch messages, delete messages, purge, delete queues, edit attributes, redrive and tags |
| [SNS](/docs/services/sns/) | Topics, subscriptions, filter policies, attributes | Create topics, publish, subscribe, unsubscribe, delete topics |
| [EC2](/docs/services/ec2/) | Instances, security group rules, VPCs and subnets, Auto Scaling groups, key pairs | Start, stop, reboot and terminate instances, edit instance tags |
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

The services on the generic table, with the resource types each one lists:

| Service | Resource types |
|---|---|
| ACM | Certificates |
| API Gateway | REST APIs, HTTP and WebSocket APIs |
| AppConfig | Applications |
| AppSync | GraphQL APIs |
| Athena | Workgroups |
| AWS Batch | Compute environments, job queues |
| Bedrock | Custom models |
| Cloud Map | Namespaces, services |
| CloudFormation | Stacks |
| CloudFront | Distributions |
| CloudTrail | Trails |
| CodeBuild | Projects |
| CodeCommit | Repositories |
| CodeDeploy | Applications |
| CodePipeline | Pipelines |
| Cognito User Pools | User pools |
| Cognito Identity | Identity pools |
| ECR | Repositories |
| ECS | Clusters, task definitions |
| EFS | File systems |
| EKS | Clusters |
| ElastiCache | Cache clusters |
| Elastic Load Balancing | Load balancers |
| EMR | Clusters |
| EventBridge | Rules, event buses |
| EventBridge Pipes | Pipes |
| EventBridge Scheduler | Schedules, schedule groups |
| Firehose | Delivery streams |
| Glue | Databases, crawlers |
| Kinesis | Streams |
| MSK | Clusters |
| OpenSearch | Domains |
| Route 53 | Hosted zones |
| SES | Identities, configuration sets, email templates |
| Systems Manager Parameter Store | Parameters |
| Verified Permissions | Policy stores |
| WAFv2 | Web ACLs |
| X-Ray | Groups |

## Service status

Each service on the dashboard shows one of three states:

- **Available**: the endpoint answered, with the resource counts.
- **Not supported**: the endpoint doesn't implement the service. That is a fact about the endpoint, not an error, and nothing else is affected.
- **Unavailable**: the call failed, with the reason and what to do about it: rejected credentials, an untrusted certificate, or an endpoint that isn't running. When the whole endpoint is down, one banner says so.

`STACKPORT_SERVICES` narrows the list the dashboard probes. See [Environment Variables](/docs/configuration/environment-variables/#probing-and-caching).

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
| `g` `e` | Go to API Explorer |
| `g` `s` | Go to Settings |
| `g` `a` | Go to About |
| `g` `l` | Go to Learn (when Learn is enabled) |
| `Esc` | Close a modal |
| `r` | Refresh the dashboard |
| `v` | Switch the dashboard between grid and list |
| `j` / `k` | Next or previous row in a table |
| `Enter` | Open the selected row |

Two-key sequences need to be pressed within a second. Shortcuts are ignored while you are typing in a field.
