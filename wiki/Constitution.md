# Constitution

**Definition.** The constitution (`docs/00-constitution.md`) is the short list of non-negotiable
principles for a product. Every spec, plan, task and pull request is checked against it. Changing a
principle requires a team decision recorded as an [ADR](Architecture-Decision-Record.md).

The idea is borrowed from spec-kit's constitution and from how shipped products ended up writing
one anyway: a page that answers "what do we never do here?" so that agents and people do not
relitigate it in every review.

## What goes in

- Principles that would change the design if dropped (e.g. "numbers come from code, words from
  models", "a person resolves exceptions", "one cloud only", "synthetic data outside production").
- A quality bar for every pull request (gates green, no secrets, status updated).

## What stays out

- Coding conventions (those go in `docs/13` and the rules).
- Anything that changes monthly.

## How anycrew applies it

`/crew-init` creates the file with eight generic principles (spec before code; numbers from code;
every claim has evidence; input is adversarial; a person decides; platform and data boundaries;
P0 first; test what matters, evaluate what is fuzzy). The product-manager, architect and
spec-writer each include a **constitution check** table in their documents. The reviewer checks
changes against it, not only against their own spec.

## Example

Kredibel's P2, "Numbers come from code; words come from models", meant that a model may read an
invoice and explain a risk level but never compute a total or decide a match. Every design review
asked "does this node compute or explain?" and the answer was decided in seconds.

## Related

[ADR](Architecture-Decision-Record.md) · [Spec-Driven Development](Spec-Driven-Development.md)
