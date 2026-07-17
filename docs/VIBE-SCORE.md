# Vibe Score

The Vibe Score makes quality discussable and release decisions repeatable.

## Dimensions

| Dimension | Core question |
|---|---|
| Clarity | Can the owner and user explain the product, limits, and next action? |
| Reliability | Does behavior hold under realistic conditions and failure? |
| Security | Are access, data, secrets, dependencies, and abuse paths controlled? |
| Maintainability | Can another builder understand, test, modify, deploy, and roll back it? |
| Taste | Is the product coherent, restrained, accessible, original, and finished? |
| Ownership | Does the customer control code, data, accounts, access, documentation, and exports? |

## Release policy

- Average release floor: **8.5/10**
- Security minimum: **7/10**
- Reliability minimum: **7/10**
- Ownership minimum: **7/10**

A high average cannot override a hard stop.

## Score bands

- **9.5–10:** exceptional, proven, and unusually coherent
- **8.5–9.4:** release quality
- **7.0–8.4:** valid direction, requires correction
- **5.0–6.9:** fragile or incomplete
- **0–4.9:** unsafe, unclear, or substantially nonfunctional

## Judge output

The Judge returns one state:

- `SHIP`
- `HOLD`
- `REJECT`
