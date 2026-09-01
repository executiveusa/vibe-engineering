# Subtraction Gauntlet Standard

Layer 3 critic contract for design verification inside Vibe Engineering.

## Mission

Reduce an experience to the smallest form that preserves or improves the approved human outcome, comprehension, trust, accessibility, control, emotional resonance, and essential product identity.

This is not a generic comments pass and not aesthetic minimalism. It is an adversarial design review.

## Independence

The builder may explain intent and respond to findings but cannot be the only critic approving its own taste-sensitive work.

The critic inspects the actual artifact and the approved Intent → Standard → Evidence contract. When a named reference bar exists, inspect the real comparison.

## Classification

For every material interface element, content block, interaction, motion, setting, feature, state, and visual treatment, assign exactly one disposition:

- **KEEP** — necessary and justified.
- **MERGE** — combine with another element without loss.
- **INFER** — let the system safely derive or automate it.
- **DEFER** — reveal only when context requires it.
- **MOVE** — useful, but belongs in another surface, stage, or advanced workflow.
- **REMOVE** — consumes attention or effort without sufficient value.

## Questions

For each candidate ask:

1. Does it help the user understand, decide, act, verify, recover, or succeed?
2. Does it earn the attention and space it consumes?
3. Is it present because of product truth or because the model commonly generates it?
4. Can the system infer it safely?
5. Can it appear only when needed?
6. Can it merge with an adjacent concept?
7. Does it interrupt the primary journey?
8. Does it duplicate capability or explanation?
9. Does it create a decision the user should not have to make?
10. Is complexity being exposed that could remain behind the interface?
11. Would removing it reduce trust, accessibility, control, comprehension, emotional resonance, or task success?
12. If it stays, what approved intent or evidence justifies it?

## Psychological review

The critic also inspects the experience as an attention system:

- Is there a clear visual and conceptual entry point?
- Does the eye know where to go next?
- Is contrast meaningful rather than decorative?
- Is spacing creating hierarchy or merely emptiness?
- Does motion explain state, continuity, causality, or emphasis?
- Is the rhythm monotonous, chaotic, or deliberately varied?
- Is there an intentional emotional register appropriate to the product?
- Is there one memorable identity signal, or a pile of effects competing for attention?
- Does the experience create momentum without manipulating or confusing the user?

## Pass condition

The gauntlet passes only when:

- no unresolved REMOVE candidate remains;
- MERGE/INFER/DEFER/MOVE opportunities have been dispositioned;
- remaining elements can state why they exist;
- the primary journey is shorter or clearer without losing necessary capability;
- the critic can name the protected quality that stops further subtraction;
- accessibility, trust, control, and recovery have not been sacrificed for visual cleanliness;
- model-default design patterns have been deliberately accepted, replaced, or removed;
- the largest remaining design gap is either fixed or explicitly accepted by authorized review.

## Required critic output

```yaml
subtraction_review:
  artifact: <path/url/build>
  intent_contract: <path>
  reference_bar: <path/url|null>
  largest_remaining_gap: <specific gap>
  dispositions:
    keep: []
    merge: []
    infer: []
    defer: []
    move: []
    remove: []
  protected_quality_that_stops_further_subtraction: <quality + evidence>
  accessibility_regression: false
  trust_or_control_regression: false
  default_pattern_findings: []
  evidence_examined: []
  verdict: PASS | REVISE | HOLD
```

## Verdicts

- **PASS** — subtraction has converged and evidence supports the stopping point.
- **REVISE** — bounded design changes remain; return the largest gap and required dispositions.
- **HOLD** — a hard problem in accessibility, trust, safety, control, rights, evidence, or scope prevents design approval.

The critic does not ship. Judge and release authority remain separate.
