---
title: CloudWatch Metrics Browser
description: View CloudWatch dashboards as live metric charts and inspect CloudWatch alarms, their state, thresholds and reasons, in a read-only web UI.
---

The CloudWatch view (the `monitoring` service in StackPort) is read-only and covers dashboards and alarms.

## Dashboards

The dashboard list shows each dashboard's name, last modified time and size. Opening a dashboard renders its widgets in a two-column grid:

- **Metric widgets** become line charts, or bar charts when the widget uses the bar view.
- **Text widgets** show their markdown source as text.
- Other widget types and metric math expressions are not drawn yet, and say so in place.

Pick a time range of 15 minutes, 1, 3, 12 or 24 hours (3 hours by default). Data is fetched at a 60-second period. Fetching metric data is a read, so dashboards keep working in [read-only mode](/docs/configuration/real-aws/).

## Alarms

The alarm list shows each metric alarm's name, state (`OK`, `ALARM` or `INSUFFICIENT_DATA`), metric, condition (for example "Average CPUUtilization > 80") and when its state last changed. Opening an alarm shows the state reason (highlighted when in alarm), namespace, metric, condition, evaluation periods, description and dimensions.

## Links

Deep link to a dashboard with `?dashboard=<name>`.
