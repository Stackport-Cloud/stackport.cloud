---
title: Guided lessons
description: Learn AWS hands-on without an AWS account or a bill. StackPort's guided lessons run inside the console against your local emulator and check your real resources as you go.
---

StackPort includes guided lessons that teach AWS by doing it, against your own local emulator. You need no AWS account, no credit card, and nothing you do can show up on a bill.

A panel walks you through each lesson step by step, while markers in the console point at the actual buttons and fields to use. StackPort checks the real state of your emulator as you work, so a step only turns green when the bucket, queue or table genuinely exists.

## Starting a lesson

1. Start StackPort against a local emulator (see [Quick Start](/docs/quickstart/)).
2. Open **Learn** in the side navigation, or press `g` then `l`.
3. Pick a lesson and press **Start lesson**. The Learn panel opens on the right of the console and stays with you as you move between pages.

Lessons are grouped into trails. The first trail, **AWS first steps**, starts with S3: create a bucket, put a file in it, and read back what S3 recorded about it. Each lesson card shows the service, the level and roughly how long it takes.

## Two ways through every step

Every step gives you a choice:

- **Do it here.** The panel points at the control in the console to use, with the exact values to type, ready to copy.
- **With the CLI.** The AWS CLI command, already filled in with your endpoint and your resource names, plus a note on what each flag does.

Either way works, and you can mix them within a lesson. Steps also explain *why it matters*, linking to the AWS documentation where it helps, so you come away knowing what the service does rather than which buttons to press.

## You pick the names

Each lesson generates names for the resources it asks you to create, such as `stackport-learn-k3xz`, and every command and field on screen uses them, so commands can be copied and run without editing. You can change them under **Names used in this lesson**, and everything on screen follows. Names are checked against that resource's naming rules, so you learn the rules a real account would enforce.

## How verification works

When you finish a step, press **Check my work**. StackPort calls the real AWS API on your emulator (a fresh call, not a cached one) and tells you what it found: "Bucket found", or "No object `hello.txt` in this bucket yet".

- **It notices work done elsewhere.** If you run the command in your own terminal, the step turns green by itself within a few seconds. StackPort re-checks every few seconds while the Learn panel is open and the tab is visible, and stops after a couple of minutes.
- **Nothing is a gate.** Any step can be skipped. Skipped steps are marked as moved past rather than done, and **Check it now** re-checks them whenever you come back.
- **"Not done yet" and "can't reach your emulator" are different.** If the emulator is down, the step says so instead of quietly waiting.

Progress is saved on your machine in `~/.stackport/learn_progress.json` (or under [`STACKPORT_DATA_DIR`](/docs/configuration/environment-variables/)). You can reset it from the Learn page at any time.

## Local only

Lessons create and delete resources, so they only run against a local emulator. When the active endpoint is real AWS, the Learn page and panel explain that and stay disabled, and no background checks run. Switch to a local endpoint from the top bar to continue.

In [read-only mode](/docs/configuration/real-aws/) lessons stay readable and saving progress still works, but the console cannot create anything, so steps that ask you to create a resource only pass if it already exists.

## Turning Learn off

Learn is on by default. To use StackPort purely as a resource browser:

```bash
STACKPORT_LEARN=false stackport
```

This removes the Learn routes from the server and every trace of lessons from the UI: the navigation entry, the panel, the shortcut and the console markers.

## Writing a lesson

Lessons are plain JSON files in the StackPort repository, under [`backend/learn/trails/`](https://github.com/DaviReisVieira/stackport/tree/main/backend/learn/trails). If you know a service well and want to help others learn it, contributions are very welcome.

### The shape of a trail

A trail has an `id`, a `title`, a `description` and a list of `lessons`. Each lesson has an `id`, a `title`, a `summary`, optional metadata (`service`, `level`, `durationMinutes`, `docsUrl`), the `variables` it uses and its `steps`. A step looks like this:

```json
{
  "id": "create-bucket",
  "title": "Create your bucket",
  "instruction": "Create a bucket called {{bucket}}.",
  "console": {
    "hotspotId": "s3-buckets-create",
    "route": "/resources/s3",
    "label": "Create bucket",
    "fields": [{ "label": "Bucket name", "value": "{{bucket}}" }]
  },
  "commands": {
    "cli": "aws --endpoint-url={{endpointUrl}} s3api create-bucket --bucket {{bucket}}"
  },
  "cliNotes": [{ "flag": "s3api", "note": "The one-to-one mapping onto the S3 API." }],
  "whyItMatters": "Real S3 encrypts new objects by default.",
  "verify": { "type": "s3_bucket_exists", "params": { "bucket": "{{bucket}}" } },
  "autoVerify": true,
  "hint": "The name has to match {{bucket}} exactly."
}
```

- **Variables.** `{{name}}` placeholders are filled in when the lesson is served. A lesson declares its variables with a `name`, a `label` and a `default` (which can include `{{suffix}}` for a random tail), plus an optional `pattern` and `patternMessage` for validation. `{{endpointUrl}}` is always available and filled in with the learner's endpoint.
- **Console path.** `console.route` is the page the step happens on, and `console.hotspotId` is the marker the panel points at. Hotspot ids are listed in `backend/learn/hotspots.py` and mirrored in the UI. Adding a new one means rendering the marker next to the control in the frontend and adding the id to both lists; a test fails if they drift apart.
- **Verification.** `verify.type` names a check from the registry in `backend/learn/verify.py`: for example `s3_bucket_exists`, `s3_object_exists`, `dynamodb_table_exists`, `dynamodb_item_count`, or the generic `resource_exists`. `all_of` combines several. Use `"verify": null` for steps that are about looking rather than creating, and `autoVerify: true` to re-check in the background.

### Validation catches mistakes early

Trail files are validated when StackPort loads them, by `backend/learn/content.py`, and the test suite runs the same validation over every file that ships. A missing field, a duplicate id, an unknown `verify.type`, a `hotspotId` the UI never renders, a hotspot reused within a lesson, or a `{{placeholder}}` the lesson never declared all fail in CI, long before a learner could get stuck on them. A file that fails validation is skipped with a warning rather than taking StackPort down.

### Good lessons

- Teach the service, not StackPort. The console is a means to an end; the `whyItMatters` notes are where most of the learning happens.
- Keep steps small, with one thing to create or observe in each.
- Make every created resource checkable, so learners get real feedback instead of a checkbox.
- Prefer behaviour every emulator implements. Lessons should work the same on any local endpoint.

Open a pull request with your trail, or [start an issue](https://github.com/DaviReisVieira/stackport/issues) first to talk through an idea.
