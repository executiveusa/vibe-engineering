// The models a factory lane launches, resolved exactly as factory/run-readiness-sandcastle.mts resolves them
// (tests/factory-exit-bar.test.mjs keeps the two in step). The deploy step derives the builder and Judge families from
// the repository's own lane settings, never from a dispatch input or a receipt an agent wrote.
// Like the runner, there is no default lane; the dry lane runs no model and is never deploy-eligible.
export function laneModels(env = process.env) {
  const lane = env.VIBE_MODEL_LANE;
  if (lane !== 'paid' && lane !== 'free')
    return { lane: lane || null, builderModel: null, judgeModel: null };
  return {
    lane,
    builderModel:
      env.VIBE_BUILDER_MODEL || (lane === 'paid' ? 'gpt-5.4' : 'openrouter/qwen/qwen3.8-27b:free'),
    judgeModel:
      env.VIBE_JUDGE_MODEL || (lane === 'paid' ? 'opus' : 'openrouter/google/gemma-4-31b-it:free'),
  };
}
