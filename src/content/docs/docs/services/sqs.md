---
title: SQS Browser
description: Manage SQS queues in a web UI. Create Standard or FIFO queues with a dead-letter queue, send single or batch messages, poll, delete, purge, and keep saved messages for testing.
---

The SQS view covers the whole life of a queue, from creating it to replaying test messages into it.

<picture>
  <source srcset="/images/sqs.webp" type="image/webp" />
  <img src="/images/sqs.png" alt="StackPort SQS browser showing queues and message counts" width="4800" height="3000" loading="lazy" decoding="async" />
</picture>

## Queues

The queue list shows each queue's type, available, in-flight and delayed message counts, visibility timeout and dead-letter queue. Star a queue to mark it as a favorite. Select a queue to act on it from the toolbar, or use `j`, `k` and `Enter` to move and open.

**Create queue** supports Standard and FIFO (the `.fifo` suffix is added for you), content-based deduplication, visibility timeout, retention, delay, maximum message size, receive wait time and encryption with SSE-SQS or a KMS key. Tick **Create a dead-letter queue** to create `<name>-dlq` alongside it with the max receive count you choose.

## Messages

- **Send message**: body and delay for Standard queues, group ID and deduplication ID for FIFO.
- **Send batch**: a JSON array of up to 10 messages, each with an optional delay, group ID and deduplication ID.
- **Poll for messages** peeks at up to 10 messages without hiding them from other consumers. Open one to see its body, MD5, receipt handle, and system and message attributes.
- **Delete** a message, or **Delete selected** for several.

### Saved messages

Keep messages you send often as **saved messages** on the queue: write one from scratch, star a message you polled, or save a selection. From there you can view, edit, copy and send them again. They are stored in your browser.

## Queue settings

- **Configuration** shows the ARN, URL, type, timeouts, retention, delay, maximum size, deduplication and dead-letter settings.
- **Edit** changes the queue attributes and sets or clears the redrive policy.
- **Tags** has an editor.
- **Purge** and **Delete queue** ask you to type the queue name to confirm.

## Links

Deep link to a queue with `?queue=orders`.
