---
title: DynamoDB Browser
description: A web UI for DynamoDB tables on local emulators and DynamoDB Local. Scan and query items, create tables, and create, edit or delete items as plain JSON or DynamoDB JSON.
---

The DynamoDB view lets you look inside tables and change items without writing a single `put-item` command.

<picture>
  <source srcset="/images/dynamodb.webp" type="image/webp" />
  <img src="/images/dynamodb.png" alt="StackPort DynamoDB browser showing a table's items" width="4800" height="3000" loading="lazy" decoding="async" />
</picture>

## Tables

The table list shows each table's status, partition and sort keys, item count, size and billing mode, with a filter and sorting.

**Create table** takes a name, a partition key and an optional sort key (string, number or binary). The default is on-demand billing; **Customize** lets you choose provisioned capacity with read and write units.

Opening a table shows its status, keys and their types, billing mode, item count, size, global and local secondary index counts, creation date and tags.

## Reading items

The items panel switches between **Scan** and **Query**:

- **Scan** reads the table page by page (25, 50 or 100 items) with **Load more**.
- **Query** takes a partition key value and, optionally, a sort key condition: `=`, `<`, `<=`, `>`, `>=` or `begins_with`. Queries run against the base table.

Columns are built from the data: the keys first, then the first attributes found. Values are shown as plain JSON.

## Changing items

- **Create item** and **Edit** open a JSON editor with a toggle between **plain JSON** (`{"pk": "ORDER#1", "total": 42}`) and **DynamoDB JSON** (`{"pk": {"S": "ORDER#1"}, "total": {"N": "42"}}`). Editing replaces the whole item.
- **Delete** removes one item, and **Delete selected** removes several in one batch.

Binary attributes (`B` and `BS`) travel as base64 and are decoded when written. If an item uses binary values or sets (`SS`, `NS`, `BS`), switch the editor to DynamoDB JSON before editing so their exact types are kept.

## Links

Deep link to a table with `?table=Orders`.
