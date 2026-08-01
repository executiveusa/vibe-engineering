# {{PROJECT_NAME}} workspace router

## Project

- **Mode:** {{PROJECT_MODE}}
- **Domain:** {{PROJECT_DOMAIN}}
- **Primary audience:** {{PROJECT_AUDIENCE}}
- **Current stage:** Read `.factory/state.json`.

## Stage route

| Need | Stage |
|---|---|
| Understand the request and baseline | `00_intake` |
| Define the human outcome | `01_vision` |
| Create the product and architecture contract | `02_blueprint` |
| Implement the approved slice | `03_build` |
| Test claims and run code review | `04_verify` |
| Challenge value, architecture, failure, security, taste, and sovereignty | `05_council` |
| Score and decide SHIP or HOLD | `06_judge` |
| Prepare a reversible owner-controlled release | `07_ship` |
| Measure reality and improve | `08_improve` |

## Loading rule

Read only the current stage contract, the references it names, and the previous stage outputs it names. Do not load every stage at once.

## Human edit surfaces

Every `output/` folder is readable and editable. The next stage must use the human-reviewed files that are actually present, not an agent's memory of earlier drafts.