---
title: SNS Browser
description: Browse SNS topics and subscriptions in a web UI. Create Standard or FIFO topics, publish messages with attributes, subscribe SQS queues, Lambda functions, HTTP endpoints or email, and inspect filter policies.
---

The SNS view shows how messages fan out from each topic, and lets you publish and wire up subscribers.

## Topics

The topic list shows each topic's type (Standard or FIFO), display name and subscriptions as confirmed and pending counts.

**Create topic** takes a name, an optional display name, and FIFO with optional content-based deduplication (the `.fifo` suffix is added for you).

Opening a topic shows its ARN and two tabs:

- **Subscriptions**: protocol, endpoint and status for each subscriber, with a link to its filter policy.
- **Attributes**: every raw topic attribute.

## Publish

**Publish message** sends a message with an optional subject and message attributes (`String`, `Number` or `String.Array`). FIFO topics also take a message group ID, and a deduplication ID unless content-based deduplication is on.

## Subscribe and unsubscribe

**Subscribe** adds an SQS, Lambda, HTTP, HTTPS or email subscriber. The endpoint field suggests the queues and functions that already exist on the endpoint. You can add a filter policy (validated as JSON) and turn on raw message delivery for SQS and HTTP(S).

**Unsubscribe** removes a confirmed subscription. **Delete topic** asks you to type the topic name to confirm.

## Links

Deep link to a topic with `?topic=<topic ARN>`.
