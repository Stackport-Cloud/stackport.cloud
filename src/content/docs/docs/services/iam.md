---
title: IAM Browser
description: A read-only web view of IAM users, groups, roles and customer-managed policies, with trust policies, attached and inline policies, access keys and policy documents.
---

The IAM view is read-only. It answers the usual questions quickly: who is in this group, what can this role do, who can assume it, where is this policy attached.

## Users, groups, roles and policies

Four tabs, each with a count, a filter, sorting and pagination:

- **Users**: open one for its details (ID, ARN, path, created, password last used), attached and inline policies, groups, access keys with their status, and tags.
- **Groups**: details, members and policies.
- **Roles**: details including the maximum session duration, the **trust policy**, attached and inline policies, and tags.
- **Policies**: customer-managed policies. Open one for its default version, attachment count, the policy **document**, what it is attached to (users, roles and groups), and tags.

Policy documents are decoded and pretty-printed as JSON, and inline policies expand in place.

## Links

Deep link with `?type=user|group|role|policy&name=<name>`. For policies, `name` is the policy ARN.

To create or change IAM resources, use the AWS CLI or your infrastructure code. The view picks up the changes on its next refresh.
