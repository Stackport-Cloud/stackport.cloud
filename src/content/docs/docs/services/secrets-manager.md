---
title: Secrets Manager Browser
description: Browse and manage Secrets Manager secrets in a web UI. Reveal and copy values, edit them as text or JSON, duplicate, schedule deletion and restore.
---

The Secrets Manager view keeps values hidden until you ask for them, and covers the full secret lifecycle.

## Secrets

The secret list shows name, description, whether rotation is on, and when it last changed. Opening a secret shows its ARN, description, created, changed and accessed dates, rotation schedule and rotation Lambda, current version ID, tags, and badges for rotation and pending deletion.

## Values

Values are hidden by default. **Show value** reveals it and **Copy** puts it on your clipboard. JSON values are detected and pretty-printed. Binary secrets can be copied as base64.

## Changing secrets

- **Create secret** with a name, description and value.
- **Edit value** writes a new version. The editor switches between plain text and JSON, and validates JSON before saving.
- **Edit metadata** changes the description and replaces the tags.
- **Duplicate** opens the create form prefilled with `<name>-copy` and the current value.
- **Delete** schedules deletion with a 7-day recovery window, or deletes immediately when you tick **Force delete**.
- **Restore** cancels a scheduled deletion.

## Links

Deep link to a secret with `?secret=<name>`.
