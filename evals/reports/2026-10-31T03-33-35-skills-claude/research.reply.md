Spot-check matches the researcher's FastAPI finding. The document follows the template, and `docs/README.md` already lists research as document 02, so no index change is needed. No repo doc carries **[assumed]** marks, so there was nothing to flip to **[verified]**.

**Written:** `docs/02-research.md` (not committed, as the branch was clean and no commit was requested).

**Findings, all checked 2026-10-31:**

- **FastAPI** stable release is 0.162.0, published 2026-10-23, requiring Python 3.10 or newer. Verified from the PyPI JSON API and the release notes. The local machine has an older 0.141.1 installed, so the backend pin needs to be explicit.
- **Postgres row-level security** can enforce per-workspace isolation, with caveats from the official 5.9 docs. Table owners bypass policies unless the table uses FORCE ROW LEVEL SECURITY, and superusers and BYPASSRLS roles always bypass them. Policies are per table, and a table with RLS on but no policy denies everything. The doc treats RLS as defence in depth on top of application scoping.
- **Neon Free tier** gives 1 GB storage per project and 20 GB total, 100 compute-unit hours per project per month, 100 projects with 10 branches each, forced scale to zero after 5 minutes, and no credit card. Compute pauses when the hour limit is hit and writes block when storage is exceeded.

**Marked unverified or partially verified:** the specific policy pattern keyed on a session setting is not shown in the PostgreSQL docs, and the connection-pooling leak risk is an inference from SET LOCAL lifetime rules rather than a pooler's documentation. Both are captured as spikes owned by backend with time boxes, alongside spikes on the runtime role's bypass status and on whether Neon Free fits Teamly's latency and data size.

**Next:** the decisions these affect are the backend pin in `docs/13-conventions.md`, the tenant-isolation design in the security and data-model docs, and the hosting choice, which needs an ADR before a provider is picked.