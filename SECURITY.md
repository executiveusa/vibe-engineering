# Security Policy

## Reporting

Do not publish secrets, active credentials, private user data, or exploitable details in a public issue.

Use GitHub's private vulnerability reporting feature for this repository when available. Include:

- affected area,
- impact,
- reproduction conditions,
- evidence,
- recommended containment.

## Release hard stop

Security below 7/10 is an automatic `HOLD`, regardless of the total Vibe Score.

## Upstream picomatch risk (2026-11-19)

The previously vendored picomatch fork was removed in favor of the upstream transitive dependency resolved by the lockfile (picomatch 4.0.7). The GitHub advisory GHSA-fc5q-39xc-vjpf was withdrawn on 2026-11-18; withdrawal is not proof that pathological glob processing is safe.

**Known limitation:** upstream picomatch 4.0.7 can hang on repeated-extglob patterns such as `+(*)a` against an adversarial non-matching input. This project currently uses picomatch only through build-time, repository-controlled configuration. Never pass untrusted or user-generated patterns into this parser or treat it as a bounded-time validator. If untrusted patterns become necessary, restore a bounded-time isolation strategy or replace the parser after security review.

A dependency audit passing does not mitigate this runtime-complexity behavior. Keep package and lockfile integrity checks and independent security review on any future dependency changes.
