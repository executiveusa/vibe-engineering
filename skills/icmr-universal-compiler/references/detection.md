# ICMR Detection Rules

## Primary form decision tree

1. Does the same ordered sequence repeat and end in a deliverable?
   - yes → Pipeline
2. Are there multiple distinct ordered sequences sharing the same stable references?
   - yes → Umbrella
3. Is the durable unit a client/person/case/deal/session/item that accumulates over time?
   - yes → Record library
4. Is the deliverable a navigable body of knowledge/model/reference system?
   - yes → Knowledge bundle
5. Is the main need to map teams, jobs, processes, data, governance, and relationships?
   - yes → Context map
6. More than one is independently true?
   - Composite; declare primary + nested forms.

## Role detection

A role is a bounded responsibility contract. Detect:
- accountable outcome;
- recipient/customer/system;
- authority;
- forbidden actions;
- recurring jobs;
- triggers/cadence;
- required inputs;
- artifacts produced;
- escalation conditions;
- validation/proof.

Do not encode traits or persona unless behavior/voice is itself a stable reference requirement.

## Confidence

- 0.90–1.00: direct evidence; architecture explicit
- 0.70–0.89: strong inference; small assumptions
- 0.50–0.69: ambiguous; compile provisional ICMR and mark assumptions
- <0.50: architecture-affecting ambiguity; request the missing fact only if execution cannot be safely bounded

## Composite examples

- Agency: Umbrella → Pipeline per offer → Record Library per client
- Software studio: Context Map → Pipeline per release → Knowledge Bundle for standards
- Case manager: Record Library per client → Pipeline per service request
- Research lab: Knowledge Bundle → Pipeline for intake/review → Record Library for studies
