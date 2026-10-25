const HOUSE_GROWTH_CONTROLS = Object.freeze([
  "Read and obey the canonical Vibe Engineering House Skill and project-local ICM/owner rules before performing any task.",
  "Default to read-only inspection. Separate verified facts from assumptions and cite actual evidence; never invent results.",
  "No spending, public publishing, client/partner contact, account changes, data collection, live-site changes or channel messages without explicit owner authorization for that exact action.",
  "All automations start OFF; for Digital Home engagements never execute email actions, including drafts, sending, replies or sequences.",
  "Use consented minimal data; maintain strict client separation, intellectual-property rights, safety, accessibility and local venue permissions.",
  "Builder cannot self-approve. Require independent review, House Judge decision and tested rollback before any production/public release.",
  "Do not claim live visibility, virality, conversion gains or revenue without exact-campaign, observed proof."
]);

export const CONTAGIOUS_SKILLS = Object.freeze([
  {
    "id": "contagious-campaign-director",
    "title": "Contagious Campaign Director",
    "summary": "Orchestrate ethical marketing experiments for an existing business.",
    "steps": [
      "Identify one buyer, offer and owned destination.",
      "Audit current conversion before changing anything.",
      "Select one lead STEPPS mechanism.",
      "Rank three reversible experiments for customer value, cost and risk.",
      "Obtain approval for publishing, outreach and spending.",
      "Route implementation through Vibe House; measure conversion against baseline."
    ],
    "category": "growth",
    "family": "contagious-guerrilla-growth",
    "handcrafted": true,
    "invocation": "both",
    "aliases": [],
    "outputs": [
      "evidence",
      "bounded campaign proposal",
      "owner approval gate"
    ],
    "attribution": "Handcrafted Vibe Engineering adaptation of Jonah Berger's STEPPS framework (Contagious, 2013)."
  },
  {
    "id": "word-of-mouth-site-audit",
    "title": "Word-of-Mouth Site Audit",
    "summary": "Read-only diagnosis of shareability, trust and customer acquisition.",
    "steps": [
      "Inspect one real website and classify its niche.",
      "Check audience, offer, proof, CTA, mobile, accessibility and all six STEPPS dimensions.",
      "Inspect sharing friction, channel dependence and measurement.",
      "Mark every finding observed, inferred, unverified or not applicable with URL evidence.",
      "Propose three bounded fixes; do not mutate the site.",
      "Record actual baseline or explicitly mark unavailable."
    ],
    "category": "growth",
    "family": "contagious-guerrilla-growth",
    "handcrafted": true,
    "invocation": "both",
    "aliases": [],
    "outputs": [
      "evidence",
      "bounded campaign proposal",
      "owner approval gate"
    ],
    "attribution": "Handcrafted Vibe Engineering adaptation of Jonah Berger's STEPPS framework (Contagious, 2013)."
  },
  {
    "id": "social-currency-lab",
    "title": "Social Currency Lab",
    "summary": "Create genuine reasons for satisfied people to recommend a business.",
    "steps": [
      "Study what customers want to express about identity or expertise.",
      "Choose one real achievement or useful insider resource.",
      "Produce a small artifact designed for voluntary sharing.",
      "Never fabricate popularity, endorsements or exclusivity.",
      "Track consented referrals leading to an owned conversion goal."
    ],
    "category": "growth",
    "family": "contagious-guerrilla-growth",
    "handcrafted": true,
    "invocation": "both",
    "aliases": [],
    "outputs": [
      "evidence",
      "bounded campaign proposal",
      "owner approval gate"
    ],
    "attribution": "Handcrafted Vibe Engineering adaptation of Jonah Berger's STEPPS framework (Contagious, 2013)."
  },
  {
    "id": "trigger-design",
    "title": "Trigger Design",
    "summary": "Associate helpful resources with naturally recurring customer moments.",
    "steps": [
      "List customer need-moments and recurring contexts.",
      "Score frequency, relevance and nonintrusiveness.",
      "Choose one helpful checklist, approved sign or user-saved reminder.",
      "No unsolicited messaging, personal tracking or spam.",
      "Compare valuable actions with a baseline."
    ],
    "category": "growth",
    "family": "contagious-guerrilla-growth",
    "handcrafted": true,
    "invocation": "both",
    "aliases": [],
    "outputs": [
      "evidence",
      "bounded campaign proposal",
      "owner approval gate"
    ],
    "attribution": "Handcrafted Vibe Engineering adaptation of Jonah Berger's STEPPS framework (Contagious, 2013)."
  },
  {
    "id": "emotion-design",
    "title": "Emotion Design",
    "summary": "Design compelling truthful stories without fear, outrage or exploitation.",
    "steps": [
      "Identify a relevant emotional state and useful next action.",
      "Use authentic events and consented, licensed materials.",
      "Favor pride, awe, care or constructive surprise.",
      "Independently review dignity, accessibility and accuracy.",
      "Measure qualified action, not reaction counts."
    ],
    "category": "growth",
    "family": "contagious-guerrilla-growth",
    "handcrafted": true,
    "invocation": "both",
    "aliases": [],
    "outputs": [
      "evidence",
      "bounded campaign proposal",
      "owner approval gate"
    ],
    "attribution": "Handcrafted Vibe Engineering adaptation of Jonah Berger's STEPPS framework (Contagious, 2013)."
  },
  {
    "id": "public-proof",
    "title": "Public Proof",
    "summary": "Make genuine outcomes and participation visible without deception.",
    "steps": [
      "Inventory verified results, source material and consent.",
      "Design a transparent work gallery, demonstration or progress ledger.",
      "Show dates and contextual limits for claims.",
      "No fake reviews, crowd counts or social proof.",
      "Measure trust-building actions with source evidence."
    ],
    "category": "growth",
    "family": "contagious-guerrilla-growth",
    "handcrafted": true,
    "invocation": "both",
    "aliases": [],
    "outputs": [
      "evidence",
      "bounded campaign proposal",
      "owner approval gate"
    ],
    "attribution": "Handcrafted Vibe Engineering adaptation of Jonah Berger's STEPPS framework (Contagious, 2013)."
  },
  {
    "id": "practical-value-engine",
    "title": "Practical Value Engine",
    "summary": "Create useful, shareable tools from actual buyer questions.",
    "steps": [
      "Identify an expensive or recurring customer problem.",
      "Produce a grounded guide, estimator, checklist or decision tool.",
      "Source assertions, label assumptions and keep the tool actually useful.",
      "Offer an optional owned-site next step without coerced signup.",
      "Measure completed use and downstream customer action."
    ],
    "category": "growth",
    "family": "contagious-guerrilla-growth",
    "handcrafted": true,
    "invocation": "both",
    "aliases": [],
    "outputs": [
      "evidence",
      "bounded campaign proposal",
      "owner approval gate"
    ],
    "attribution": "Handcrafted Vibe Engineering adaptation of Jonah Berger's STEPPS framework (Contagious, 2013)."
  },
  {
    "id": "story-carrier",
    "title": "Story Carrier",
    "summary": "Make the actual product or mission integral to a memorable true story.",
    "steps": [
      "Find a documented customer challenge and resolution.",
      "Define the one verifiable fact people should retell.",
      "Write a concise tension-action-outcome narrative.",
      "Secure rights and consent; avoid generic invented hero stories.",
      "Test unprompted recall and qualified next-step action."
    ],
    "category": "growth",
    "family": "contagious-guerrilla-growth",
    "handcrafted": true,
    "invocation": "both",
    "aliases": [],
    "outputs": [
      "evidence",
      "bounded campaign proposal",
      "owner approval gate"
    ],
    "attribution": "Handcrafted Vibe Engineering adaptation of Jonah Berger's STEPPS framework (Contagious, 2013)."
  },
  {
    "id": "guerrilla-field-activations",
    "title": "Guerrilla Field Activations",
    "summary": "Design low-cost permission-based local marketing tied to a website.",
    "steps": [
      "Choose one specific audience and legitimate real-world benefit.",
      "Prefer permitted partner cards, workshops and community events.",
      "Confirm site permissions, safety, accessibility and participant rights.",
      "Predefine spend cap, teardown, cleanup and emergency stop.",
      "Obtain owner approval before any public act; measure qualified visits or bookings."
    ],
    "category": "growth",
    "family": "contagious-guerrilla-growth",
    "handcrafted": true,
    "invocation": "both",
    "aliases": [],
    "outputs": [
      "evidence",
      "bounded campaign proposal",
      "owner approval gate"
    ],
    "attribution": "Handcrafted Vibe Engineering adaptation of Jonah Berger's STEPPS framework (Contagious, 2013)."
  },
  {
    "id": "word-of-mouth-experiment-loop",
    "title": "Word-of-Mouth Experiment Loop",
    "summary": "Run reversible campaigns and retain evidence from success or failure.",
    "steps": [
      "Freeze the hypothesis, primary metric and sourced baseline.",
      "Limit cash, duration, privacy impact and reputational downside.",
      "Use one STEPPS mechanism per experiment.",
      "Secure owner authorization and independent review before execution.",
      "Compare outcomes against precommitted bar; label uncertainty.",
      "Decide KEEP, KILL, ITERATE or INCONCLUSIVE and record rollback and lessons."
    ],
    "category": "growth",
    "family": "contagious-guerrilla-growth",
    "handcrafted": true,
    "invocation": "both",
    "aliases": [],
    "outputs": [
      "evidence",
      "bounded campaign proposal",
      "owner approval gate"
    ],
    "attribution": "Handcrafted Vibe Engineering adaptation of Jonah Berger's STEPPS framework (Contagious, 2013)."
  }
].map((skill) => Object.freeze({ ...skill, steps: Object.freeze([...HOUSE_GROWTH_CONTROLS, ...skill.steps]) })));
