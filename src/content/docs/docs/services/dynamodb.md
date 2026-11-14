---
title: DynamoDB Browser
description: A web UI for DynamoDB tables on local emulators and DynamoDB Local. Scan and query items, create tables, and create, edit or delete items as plain JSON or DynamoDB JSON.
head:
  - tag: meta
    attrs:
      property: og:image
      content: https://stackport.cloud/images/og/dynamodb.png
  - tag: meta
    attrs:
      property: og:image:alt
      content: 'The StackPort DynamoDB browser showing a table''s items'
  - tag: meta
    attrs:
      name: twitter:image
      content: https://stackport.cloud/images/og/dynamodb.png
  - tag: meta
    attrs:
      name: twitter:image:alt
      content: 'The StackPort DynamoDB browser showing a table''s items'
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

The item count and size come from the table's description, which AWS updates about every six hours, so they are labelled as approximate. **Get live item count** counts the items now with a scan. On real AWS it asks first, since the scan is billed.

## Reading items

The items panel switches between **Scan** and **Query**:

- **Scan** reads the table page by page (25, 50 or 100 items) with **Load more**.
- **Query** takes a partition key value and, optionally, a sort key condition: `=`, `<`, `<=`, `>`, `>=` or `begins_with`. Queries run against the base table.

Columns are built from the data: the keys first, then the first attributes found. Values are shown as plain JSON. A table that doesn't exist shows a clear "not found" error rather than an empty list.

## Changing items

- **Create item** and **Edit** open a JSON editor with a toggle between **plain JSON** (`{"pk": "ORDER#1", "total": 42}`) and **DynamoDB JSON** (`{"pk": {"S": "ORDER#1"}, "total": {"N": "42"}}`). Editing replaces the whole item. Numbers save exactly in plain JSON too, including decimals with more digits than a float holds.
- **Delete** removes one item, and **Delete selected** removes several in one batch.

Binary attributes (`B` and `BS`) travel as base64 and are decoded when written. If an item uses binary values or sets (`SS`, `NS`, `BS`), switch the editor to DynamoDB JSON before editing so their exact types are kept.

## Links

Deep link to a table with `?table=Orders`.
