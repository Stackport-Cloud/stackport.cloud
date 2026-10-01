---
title: RDS Browser
description: A read-only web view of RDS DB instances, Aurora clusters, snapshots and parameter groups, with copyable connection endpoints for local emulators or AWS.
---

The RDS view is read-only and focuses on what you need to connect to and understand a database.

## Instances

The instance list shows identifier, engine, status, class, endpoint and port, and Multi-AZ. Opening an instance shows a connection panel with a copy button, and tabs for:

- **Details**: engine and version, status, class, master username, availability zone, Multi-AZ, creation time, and read replica relationships.
- **Storage**: type, size, IOPS, encryption and KMS key.
- **Networking**: public accessibility, subnet group and VPC security groups.
- **Backup**: retention, backup and maintenance windows, and the restorable time range.
- **Tags** and **Raw** JSON.

## Clusters

Opening a cluster shows its writer and reader endpoints (both copyable), its members with their writer or reader role and promotion tier, and its parameter group, subnet group and backup settings.

## Snapshots and parameter groups

- **Snapshots** lists DB instance snapshots with their source, type, status, engine, size, encryption and creation time.
- **Parameter groups** lists instance and cluster parameter groups together. Opening one shows every parameter with its value, whether it is modifiable, its apply method and allowed values.

## Links and export

- Deep link with `?instance=`, `?cluster=`, or `?parameterGroup=<name>&parameterGroupSource=instance|cluster`.
- Export instances, clusters and snapshots to JSON or CSV.
