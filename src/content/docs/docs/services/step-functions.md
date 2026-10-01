---
title: Step Functions Browser
description: Visualize Step Functions state machines as a graph, start and stop executions, and follow each run on an execution path overlay and a per-state timeline.
---

The Step Functions view draws your state machine and shows exactly which path each execution took through it.

<picture>
  <source srcset="/images/stepfunctions.webp" type="image/webp" />
  <img src="/images/stepfunctions.png" alt="StackPort Step Functions view showing a state machine graph and execution path" width="4800" height="3000" loading="lazy" decoding="async" />
</picture>

## State machines

The list shows each state machine's name, type (Standard or Express), status and creation date. Opening one gives you three tabs:

- **Executions**: recent executions with status, start time and duration, filterable by status (running, succeeded, failed, timed out, aborted).
- **Definition**: the state machine as a **graph**, its **JSON**, or both side by side. Clicking a state in the graph jumps to it in the JSON.
- **Details**: ARN, type, status, role, creation date and logging settings.

## The graph

The definition graph lays out every state top to bottom: Pass, Task, Choice, Wait, Succeed, Fail, Parallel and Map. Parallel branches and Map iterations are drawn as grouped boxes, and edges show Choice rules, defaults and Catch handlers. Zoom with the mouse wheel or the buttons, and drag to pan.

## Executions

**Start execution** takes an optional name (one is generated if you leave it blank) and a JSON input, which is validated before it is sent. **Stop** ends a running execution.

Opening an execution shows:

- **Overview**: status, start and stop time, duration, error, input and output, and the **execution path**: the graph with the states that ran colored by outcome and the edges it followed highlighted.
- **Timeline**: one row per state with its type, when it started relative to the execution, and how long it took. Expand a row for its input, output and error.
- **Raw**: the execution record as JSON.

## Links

Deep link to a state machine with `?machine=<state machine ARN>`.
