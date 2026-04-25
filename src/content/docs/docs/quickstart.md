---
title: Quick Start
description: Get StackPort running in under a minute.
---

## 1. Start StackPort with an emulator

The fastest way is Docker Compose with MiniStack:

```bash
curl -O https://raw.githubusercontent.com/DaviReisVieira/stackport/main/examples/docker-compose.yml
docker compose up -d
```

Or pip install both:

```bash
pip install ministack stackport
ministack &
stackport
```

## 2. Open the dashboard

Navigate to **http://localhost:8080**. You'll see the service dashboard showing available AWS services and their resource counts.

## 3. Create some resources

Use the AWS CLI against your emulator to create resources:

```bash
export AWS_ENDPOINT_URL=http://localhost:4566
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test

aws s3 mb s3://my-bucket
aws sqs create-queue --queue-name my-queue
aws lambda create-function \
  --function-name hello \
  --runtime python3.12 \
  --handler lambda_function.handler \
  --zip-file fileb://function.zip \
  --role arn:aws:iam::000000000000:role/lambda-role
```

## 4. Browse and interact

Refresh the StackPort dashboard — your resources appear immediately. Click into any service to see the dedicated browser:

- **S3**: Navigate folders, upload/download files, delete objects
- **Lambda**: View config, invoke with custom payloads, download code
- **SQS**: Send and receive messages, purge queues, batch operations
- **DynamoDB**: Query by partition/sort key, scan tables, view items

## 5. Use the CLI

StackPort also ships a CLI for scripting:

```bash
# Show all services with resource counts
stackport status

# List S3 buckets
stackport list s3

# Describe a specific Lambda function
stackport describe lambda functions hello

# Export all SQS queues to CSV
stackport export sqs --format csv
```

## Other emulators

StackPort works with any AWS-compatible endpoint:

```bash
# LocalStack
AWS_ENDPOINT_URL=http://localhost:4566 stackport

# Moto
AWS_ENDPOINT_URL=http://localhost:5000 stackport

# Real AWS (uses credential chain)
AWS_PROFILE=my-profile stackport

# Real AWS in read-only mode
STACKPORT_ALLOW_WRITES=false AWS_PROFILE=production stackport
```
