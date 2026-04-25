---
title: Introduction
description: What StackPort is and why it exists.
---

StackPort is an open-source, universal AWS resource browser. It connects to any AWS-compatible endpoint — **LocalStack**, **MiniStack**, **Moto**, **MinIO**, or **real AWS** — and gives you a web UI and CLI to browse, inspect, and manage resources across 35 services.

## Why StackPort?

When developing with AWS emulators, you often end up running one-off CLI commands to check if your resources were created correctly, if a message landed in the right queue, or if a Lambda function deployed. StackPort replaces that workflow with a visual dashboard that shows everything at a glance.

## What it does

- **Browses 35 AWS services** with a unified interface
- **8 dedicated service browsers** for S3, DynamoDB, Lambda, SQS, EC2, IAM, CloudWatch Logs, and Secrets Manager
- **Write operations** for Lambda (invoke), SQS (send/receive/purge), S3 (upload/delete), EC2 (start/stop/terminate), and DynamoDB (query/scan)
- **Real-time dashboard** with WebSocket-powered live resource counts
- **CLI** for scripting — `stackport status`, `list`, `describe`, `export`
- **Export** resources as JSON or CSV

## Architecture

StackPort is a Python **FastAPI** backend serving a React/**TypeScript** frontend from a single process. The backend talks to AWS services via **boto3**, and the frontend communicates over REST + WebSocket.

```
┌──────────────────────┐
│   React/TypeScript   │ ← Browser UI
├──────────────────────┤
│   FastAPI + uvicorn  │ ← REST API + WebSocket
├──────────────────────┤
│       boto3          │ ← AWS SDK
├──────────────────────┤
│  LocalStack / Moto   │ ← Any AWS endpoint
│  MiniStack / AWS     │
└──────────────────────┘
```
