---
title: SQS Browser
description: Browse SQS queues, send and receive messages, and manage queue operations.
---

The SQS browser provides full queue management with message-level operations.

## Features

- **Queue list** with depth badges and queue type indicators (Standard/FIFO)
- **Message browser** with JSON support
- **Send messages** with custom body and attributes
- **Receive messages** with visibility timeout control
- **Delete messages** individually
- **Purge queues** to clear all messages
- **Batch send** multiple messages at once
- **Queue attributes** — ARN, visibility timeout, retention period
- **Tagging** support

## Write Operations

| Operation | Description |
|---|---|
| Send message | Custom body, message attributes, delay |
| Receive | Fetch messages with configurable visibility timeout |
| Delete | Remove individual messages |
| Purge | Clear all messages from a queue |
| Batch send | Send multiple messages in one operation |
| Create queue | Create new Standard or FIFO queues |
| Delete queue | Remove a queue entirely |
