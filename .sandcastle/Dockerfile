FROM node:22-bookworm

ARG AGENT_UID=1000
ARG AGENT_GID=1000

RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates curl gh \
  && rm -rf /var/lib/apt/lists/*

# Builder (Codex) and independent Judge (Claude Code) CLIs, pinned; bump deliberately.
# Builder (Codex), independent Judge (Claude Code) and the free-lane runner (OpenCode), pinned; bump deliberately.
RUN npm install -g @openai/codex@0.157.1 @anthropic-ai/claude-code@2.1.283 opencode-ai@1.18.32

# Remap only when the requested ids differ, and tolerate collisions: the build
# tool passes the HOST user ids (root 0:0 on the runner), and groupmod/usermod
# exit 4 when the target id already belongs to another account.
RUN if [ "$(id -g node)" != "${AGENT_GID}" ]; then \
      if getent group "${AGENT_GID}" >/dev/null; then usermod -g ${AGENT_GID} node; \
      else groupmod -g ${AGENT_GID} node && usermod -g ${AGENT_GID} node; fi; \
    fi \
  && if [ "$(id -u node)" != "${AGENT_UID}" ] && ! getent passwd "${AGENT_UID}" >/dev/null; then \
      usermod -u ${AGENT_UID} node; \
    fi

USER node
WORKDIR /home/agent/workspace
