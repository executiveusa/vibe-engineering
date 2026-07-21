FROM node:22-bookworm

ARG AGENT_UID=1000
ARG AGENT_GID=1000

RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates curl gh \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g @openai/codex

RUN groupmod -g ${AGENT_GID} node \
  && usermod -u ${AGENT_UID} -g ${AGENT_GID} node

USER node
WORKDIR /home/agent/workspace
