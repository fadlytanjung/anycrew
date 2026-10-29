# Security

anycrew ships prompts, markdown and a small Node CLI. It runs no network calls and installs no
dependencies. The only executable it writes into your project is `.anycrew/hooks/lint-after-edit.sh`,
which runs your project's own linters on the file an agent just edited.

Report a vulnerability by opening a private security advisory on the GitHub repository, or an issue
with "security" in the title if advisories are unavailable. Please do not include working exploits
in public issues.
