# Source and provenance contract

Use this reference whenever an external method, prompt, template, skill, code sample, design system, article, research paper, dataset, image, audio file, or other third-party material materially influences the project.

Record the source before treating the borrowed pattern as a project standard.

Minimum record:

```markdown
## <source name>
- Source: <URL, repository, paper, vendor, or supplied artifact>
- Author / owner: <known owner or unknown>
- License / terms: <license, terms URL, or UNVERIFIED>
- What we used: <idea, code, text, visual reference, data, media, process>
- What we changed: <adaptation or boundary>
- Distribution impact: <none / attribution / notice / permission / rights review>
- Adopted in: <decision, spec, stage, or file>
- Last checked: <date>
```

## Rules

1. A concept can influence Vibe Engineering without its original expression being copied.
2. Copying code/text/templates requires the applicable license and notices to be honored.
3. Media intended for public release needs a rights record appropriate to that use; user possession of a file is not by itself a distribution license.
4. Prefer linking/installing a replaceable upstream capability over silently forking it when practical.
5. When an upstream source changes materially, review compatibility before adopting the new version.
6. If terms are unknown, mark the source `UNVERIFIED` and do not distribute the material until the rights question is resolved.