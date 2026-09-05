# Loop Engineering — concept

## The simple idea

A capable AI agent usually fails for one of four reasons: it loses context, works in the wrong order, stops at "looks done", or uses too much machinery. Loop Engineering gives each failure a separate control.

- **ICM** keeps durable context in small, inspectable files.
- **Graph engineering** decides what can happen in parallel and what must remain sequential.
- **Loop engineering** repeats only the part that failed until evidence clears the bar.
- **The skill router** loads specialist expertise only at the moment it is relevant.
- **The gauntlet** uses a fresh critic and a real comparison target so the builder cannot grade itself.
- **The release gate** protects production and owner control.

The governing equation is:

`Right context + right topology + bounded execution + independent proof + real bar = reliable agentic engineering`

## Why this is different from a giant master prompt

A giant prompt makes every agent carry every rule all the time. ICM does the opposite. The root skill only routes. Each numbered stage has one job and points to its exact inputs and references. The agent gets more capability behind the interface without more visible complexity.

## Zero-to-end lifecycle

`INTENT -> BAR -> LOCK -> DISCOVER -> ARCHITECT -> GRAPH -> SPEC -> SLICE -> BUILD -> VERIFY -> GAUNTLET -> RELEASE -> LEARN`

Greenfield and brownfield share the same spine but differ at discovery. Greenfield proves the customer/problem/analog before code. Brownfield records the current system, wiring, ownership, runtime, checks, blast radius, and rollback before edits.

## The key constraint

This system is autonomous between human gates, not autonomous over human authority. The owner chooses the bar and approves consequential/production actions. Everything else should be inspectable, resumable, and as automatic as the available tools safely allow.
