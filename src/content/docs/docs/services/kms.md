---
title: KMS Browser
description: A read-only web view of AWS KMS keys with their key policies, grants, aliases and rotation settings, for local emulators or real AWS.
---

The KMS view is read-only and shows everything that decides who can use a key and how.

<picture>
  <source srcset="/images/kms.webp" type="image/webp" />
  <img src="/images/kms.png" alt="StackPort KMS browser showing a key's details" width="4800" height="3000" loading="lazy" decoding="async" />
</picture>

## Keys

The key list shows key ID, ARN, creation date, key usage, key spec and status (enabled, disabled, pending deletion and the other key states), with a filter and sorting. Opening a key shows:

- **Details**: status, description, origin, expiry, and rotation (whether it is on, the rotation period, the next rotation date).
- **Policy**: the key policy as formatted JSON.
- **Grants**: each grant's ID, grantee, creation date and allowed operations.
- **Aliases**: every alias pointing at the key.
- **Tags**.

If an emulator does not implement grants, the tab shows an empty list rather than an error.

## Links

Deep link to a key with `?id=<key ID>`.
