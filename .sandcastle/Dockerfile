FROM node:22-bookworm

ARG AGENT_UID=1000
ARG AGENT_GID=1000

RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates curl gh \
  && rm -rf /var/lib/apt/lists/*

# Builder (Codex) and independent Judge (Claude Code) CLIs, pinned; bump deliberately.
RUN npm install -g @openai/codex@0.157.1 @anthropic-ai/claude-code@2.1.283

RUN groupmod -g ${AGENT_GID} node \
  && usermod -u ${AGENT_UID} -g ${AGENT_GID} node

USER node
WORKDIR /home/agent/workspace
