# Gates and Human-in-the-Loop

**Definition.** A gate is a point in the lifecycle where a person decides before the next phase
starts. Inside a phase, agents work without asking; at a gate, they stop and present a short,
concrete question.

| Gate | The question | Who answers |
|---|---|---|
| Decision | "This is what we build and why. Yes?" | founder / team |
| P0 scope | "This is P0 and the cut line. Right?" | product owner |
| ADRs | "Accept these decisions?" | tech lead |
| Spec Ready | "This spec is implementable. Ready?" | owner of the feature |
| Drift | "Spec and code disagree here; which one changes?" | owner of the feature |
| Critical finding | "Fix now, or accept with a reason?" | tech lead |
| Production deploy | "Deploy this commit to production?" | whoever owns production |

## Why

Coding agents are good at the inside of a phase and bad at knowing when a decision is theirs to
make. Naming the gates removes both failure modes: no permission-asking for routine work, no
silent scope or architecture changes.

## Mechanics in anycrew

- The crew lead reports at a gate in the person's terms: what was decided, what changed, what
  needs a decision.
- Agents never approve their own work. The reviewer reports; a person accepts or rejects a finding.
- Rules encode the stop conditions ("stop and ask when the spec contradicts another doc", "when a
  test can only pass by weakening a guard", "when a new managed service appears").
- Everything a model proposes about a user's own data is a suggestion until a person accepts it
  (this applies both to anycrew's agents and to the products built with them).

## Related

[Lifecycle and Phases](Lifecycle-and-Phases.md) · [Implementation Status](Implementation-Status.md)
