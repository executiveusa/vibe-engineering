FROM node:22-bookworm

ARG AGENT_UID=1000
ARG AGENT_GID=1000

RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates curl gh \
  && rm -rf /var/lib/apt/lists/*

# Builder (Codex) and independent Judge (Claude Code) CLIs, pinned; bump deliberately.
# Builder (Codex), independent Judge (Claude Code) and the free-lane runner (OpenCode), pinned; bump deliberately.
RUN npm install -g @openai/codex@0.157.1 @anthropic-ai/claude-code@2.1.283 opencode-ai@1.18.32

# Run as the requested HOST ids directly (root 0:0 on the runner). A numeric
# USER needs no remap and keeps bind-mounted checkouts writable: remapping the
# node account to an already-taken id (root) fails, and leaving it at 1000
# makes the agent unable to write a root-owned worktree (codex P1 on PR #67).
RUN mkdir -p /home/agent/workspace \
  && chown -R ${AGENT_UID}:${AGENT_GID} /home/agent

USER ${AGENT_UID}:${AGENT_GID}
WORKDIR /home/agent/workspace

# Keep the sandbox container alive for sandcastle exec calls; the inherited
# node CMD exits immediately when started detached.
CMD ["sleep", "infinity"]
