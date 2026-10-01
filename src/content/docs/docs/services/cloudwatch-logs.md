---
title: CloudWatch Logs Browser
description: Browse CloudWatch log groups, streams and events in a web UI, filter with CloudWatch patterns and time ranges, and tail logs live from your local emulator.
---

The CloudWatch Logs view takes you from log group to stream to individual events, and can follow a stream live.

## Log groups and streams

The log group list shows name, stored size, retention and creation date. Search matches the start of the group name, the same way CloudWatch does.

- **Create log group** with a name, a retention period (or never expire) and tags.
- **Edit retention** from the list. Choosing never expire removes the retention policy.
- **Delete** a group or a stream. Both ask you to type the name to confirm.
- Each group has a **Tags** tab with an editor.

Open a group to see its streams with their last event time and size.

## Events

Open a stream to read its events. Each event shows its absolute and relative timestamp, and JSON messages are detected and pretty-printed. Copy any message with one click.

- **Filter pattern**: any CloudWatch Logs filter pattern, such as `ERROR` or `{ $.level = "error" }`.
- **Time range**: the last hour, 6 hours or 24 hours.
- **Load more** fetches the next 100 events.
- **Export** the events you loaded to JSON or CSV.

## Live tail

Turn on **Tail** to follow a stream as it is written. StackPort streams new events over a WebSocket, checking the emulator every second, honours your filter pattern, and scrolls to the newest event. If the WebSocket cannot connect, it falls back to polling every few seconds.

## Links

Deep link with `?group=/aws/lambda/my-func&stream=<stream name>`.
