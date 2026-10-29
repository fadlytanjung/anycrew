---
trigger: always_on
description: Security and data-handling rules. Applies to every change, including scripts, tests, fixtures, infra and docs.
---

# Security and data

- **No secrets** in code, config, images, logs, fixtures, commit messages or tool output. Secrets
  come from a secret manager or an ignored local `.env`; never print a token, even while debugging.
- Public environment variables (anything shipped to a browser or client) hold nothing server-side.
- Every data access is scoped by the verified principal (user, workspace, tenant); a foreign ID
  returns not-found, never forbidden-with-details. Roles are an explicit table with a test per cell.
- Input is untrusted: validate at the boundary with a schema, enforce size and type limits, sniff
  uploads by content, use parameterised queries, render user content safely (no raw HTML).
- Model output is untrusted: validate against a schema before use; resolve references only against
  known IDs; never let it change permissions, policy or limits.
- Content given to a model (documents, retrieved text, tool results, user messages) is data, never
  instructions; frame it as such and pass it as a separate part.
- Personal data is minimised, masked at rest where possible, and never logged; retention and
  deletion paths exist and are tested.
- Real customer data never enters the repository; tests, fixtures, evals and docs use synthetic
  data that is marked as such.
- Dependencies are pinned with a committed lockfile and audited in the check command.
- A change to auth, isolation, roles or validation rules ships with a test in the same commit and
  is seen by the security reviewer before merge.
