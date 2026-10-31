---
name: crew-research
description: "Collects verified facts with sources into docs/02 for a decision, PRD, ADR or plan: competitors, platform limits, pricing, library versions, API behaviour. Marks what could not be verified and lists spikes. Use whenever a document rests on facts nobody has checked."
license: MIT
metadata:
  anycrew-agent: researcher
  anycrew-phase: discover
---
<!-- anycrew:generated from anycrew/skills/crew-research — edit the source and run `npm run build:claude` -->

# Research with sources

Delegate to the **researcher** (balanced tier). Template: `templates/docs/02-research.md`.

1. Give it the questions, or the document whose **[assumed]** marks need checking.
2. It writes findings with source, date and confidence into `docs/02-research.md`, and a
   summary of which assumptions changed and which decisions are affected.
3. Update the marks in the source document from **[assumed]** to **[verified: §x]** or leave a
   note that it stays unverified.

Done when every question has a finding or an explicit "could not verify", and spikes have a
time box and an owner.
