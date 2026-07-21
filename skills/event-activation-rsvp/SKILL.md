---
name: event-activation-rsvp
version: 1.0.0
status: studio-standard
scope: reusable
visibility: internal
owner: Pauli Studio / Vibe Engineering
description: >
  A reusable event activation operating skill for designing, launching,
  monitoring, operating, and learning from RSVP-driven events. Converts an
  event concept into a capacity-aware RSVP system, staffing plan, communications
  flow, event-day operating system, evidence package, and post-event learning
  loop without overpromising capacity or collecting unnecessary personal data.
---

# Event Activation + RSVP Operating Skill

## 1. PURPOSE

This skill exists to turn events from:

> flyer + form + hope

into:

> verified event facts → capacity model → RSVP system → staffing ownership →
> communications → event-day operations → evidence → follow-up → learning.

The system must help humans operate better.

It must not create administrative complexity merely because automation is possible.

The agent may reason intelligently about the specific event, audience, venue,
resources, risks, culture, goals, and constraints.

However, every implementation must follow the minimum operating blueprint and
guardrails defined in this skill.

---

# 2. PRIME DIRECTIVES

## Verify It Before Everything

Never publish an event claim merely because it appears in:

- an old flyer;
- an email;
- a draft;
- a previous website;
- an AI-generated document;
- an unverified workbook;
- a social post.

Classify important facts as:

- CONFIRMED
- ESTIMATED
- UNKNOWN
- NEEDS CONFIRMATION

Public-facing claims must be supported by confirmed information.

---

## Protect the Experience Before Maximizing Attendance

A successful event is not defined by maximum registrations.

Optimize for:

- people actually served;
- manageable demand;
- clear expectations;
- safe operations;
- useful relationships;
- measurable outcomes;
- trust.

Never promote an event beyond its operational capacity simply to increase
registration numbers.

---

## RSVP Is Not Automatically a Guarantee

An RSVP can mean different things.

Before launch, explicitly define:

`RSVP_MEANING`

Possible examples:

- attendance planning only;
- admission reservation;
- service reservation;
- priority access;
- appointment;
- waitlist request;
- expression of interest.

Never allow ambiguous RSVP language.

If RSVP does not guarantee a service, the public interface must say so clearly.

---

# 3. CAPACITY LAW

Never treat "event capacity" as one number.

Always distinguish:

```text
EVENT CAPACITY
≠
SERVICE CAPACITY
≠
SUPPLY CAPACITY
≠
FOOD CAPACITY
≠
STAFFING CAPACITY
≠
VENUE CAPACITY
```

Example:

```text
General attendance: 150 possible
Haircuts: 40
Backpacks: 100
Meals: 125
Volunteer capacity: 12
Venue fire/safety limit: 175
```

These are separate constraints.

The system must identify the relevant bottleneck.

---

## Capacity Formula

For every constrained service, estimate:

```text
THEORETICAL CAPACITY
↓
OPERATIONAL BUFFER
↓
REALISTIC CAPACITY
↓
PUBLIC COMMITMENT
```

Do not publish theoretical maximums as guaranteed capacity.

Example:

```text
5 barbers
×
8 theoretical cuts
=
40 theoretical cuts

If organizers confirm 40 as realistic:
PUBLIC SERVICE CAPACITY = 40

Otherwise:
apply operational buffer.
```

Agents must use context and verified organizer input rather than blindly applying
a universal percentage.

---

# 4. HUMAN OWNERSHIP LAW

Every event must have:

```text
PRIMARY EVENT OWNER
+
BACKUP EVENT OWNER
```

Every critical operational function must have a named owner before the event.

Automation cannot replace ownership.

At minimum consider:

```text
Event lead
RSVP owner
RSVP backup
Check-in
Service queue
Supply distribution
Food
Volunteer coordination
Family/guest questions
Media consent
Photo/video coordination
Setup
Cleanup
Safety/escalation
Float/problem solver
```

Not every event requires every role.

The agent must intelligently adapt roles to the event.

However:

> "We have volunteers"

is not considered a staffing plan.

A staffing plan requires:

```text
ROLE
NEEDED
ASSIGNED
OWNER
STATUS
```

---

# 5. RSVP OWNER LAW

Before public launch, designate:

```text
PRIMARY RSVP OWNER
BACKUP RSVP OWNER
```

The RSVP owner is responsible for:

* monitoring registrations;
* watching capacity;
* reviewing unusual registrations;
* handling cancellations;
* managing waitlists where applicable;
* identifying demand spikes;
* communicating operational changes;
* ensuring event-day lists are accurate.

For first-time organizers, prefer keeping founders or event leaders close to the
RSVP process.

This helps them directly experience:

* community demand;
* registration patterns;
* questions;
* friction;
* channel effectiveness.

Delegation can happen after the process is understood.

---

# 6. MINIMUM RSVP DATA LAW

Collect the minimum information required to operate the event.

Default fields:

```text
adult_name
email
phone_optional
group_size
children_count_optional
service_interest_optional
source
contact_consent
event_slug
status
created_at
updated_at
```

Only add fields when they serve a real operational purpose.

---

## Sensitive Data Guardrail

Do not casually collect:

* children's full names;
* birth dates;
* medical information;
* immigration status;
* school records;
* disability details;
* financial hardship narratives;
* government IDs;
* private family stories;
* unnecessary demographic data.

If sensitive information is genuinely required:

1. document why;
2. minimize collection;
3. define retention;
4. define access;
5. obtain appropriate consent;
6. apply stronger security.

Children should not be treated as ordinary marketing leads.

---

# 7. CHILD SAFETY AND PRIVACY LAW

For youth/family events:

* minimize child-specific data;
* use parent/guardian contact when possible;
* do not expose attendee lists publicly;
* do not publicly display children's names;
* separate RSVP consent from media consent;
* never assume attendance equals permission to photograph or publish;
* provide a way to identify people who should not be photographed where needed.

Media consent must be independently defined.

---

# 8. STANDARD RSVP STATES

Default lifecycle:

```text
RECEIVED
CONFIRMED
WAITLISTED
CANCELLED
ATTENDED
NO_SHOW
```

Optional event-specific states may include:

```text
CHECKED_IN
SERVICE_COMPLETE
FOLLOW_UP_REQUIRED
DECLINED
```

Do not create excessive states without operational need.

Every state must have a clear meaning.

---

# 9. SOURCE ATTRIBUTION LAW

Every RSVP system should capture how the attendee found the event when useful.

Examples:

```text
founder
partner
venue
church
school
coach
mentor
flyer
QR code
Instagram
Facebook
email
referral
other
```

Prefer automatic source tracking when possible.

Examples:

```text
?src=tangles
?src=founder
?src=church-a
?src=instagram
```

This allows the event team to learn:

* which relationships matter;
* which promotion channels work;
* where demand comes from.

Do not overcomplicate attribution for very small events.

---

# 10. PUBLIC COMMUNICATION LAW

Public copy must distinguish:

```text
WHAT IS CONFIRMED
WHAT IS LIMITED
WHAT IS FIRST-COME
WHAT RSVP MEANS
WHAT RSVP DOES NOT GUARANTEE
WHAT REQUIRES ATTENDANCE
```

Example:

> RSVP helps us plan attendance, food, supplies, and staffing.
> Limited services are available while capacity lasts.

Never use misleading language such as:

> Reserve your spot!

unless a real reservation is being created.

---

# 11. LIMITED RESOURCE LAW

For every limited resource define:

```text
RESOURCE
QUANTITY
ELIGIBILITY
FULFILLMENT RULE
RESERVATION POLICY
WAITLIST POLICY
OWNER
```

Example:

```text
RESOURCE:
Backpacks

QUANTITY:
100

ELIGIBILITY:
Child must attend

FULFILLMENT:
One per child

RESERVATION:
Not reserved by RSVP

POLICY:
While supplies last
```

The agent must never infer eligibility rules.

Confirm them.

---

# 12. SERVICE QUEUE LAW

When services have limited throughput, do not automatically create physical
waiting lines.

Prefer:

```text
Check-in
↓
Service request
↓
Queue number / appointment / position
↓
Estimated status
↓
Guest participates in event
↓
Called when ready
```

Possible queue strategies:

* numbered tickets;
* digital queue;
* scheduled appointments;
* time windows;
* SMS notification;
* first-come queue;
* priority queue.

Choose based on:

* event size;
* audience;
* connectivity;
* staff capability;
* accessibility;
* service duration.

Keep the simplest reliable solution.

---

# 13. WAITLIST LAW

A waitlist should exist when:

```text
DEMAND > VERIFIED CAPACITY
```

The system must clearly distinguish:

```text
INTEREST
WAITLIST
CONFIRMED SERVICE
```

Do not imply waitlisted attendees are guaranteed service.

When possible, waitlist data should help organizers decide whether to:

* recruit additional providers;
* increase supplies;
* extend hours;
* add another event;
* communicate limits earlier.

---

# 14. WARM NETWORK FIRST LAW

For a first-time or operationally uncertain event:

Prefer:

```text
Warm network
↓
Partners
↓
Known community
↓
Measure RSVP velocity
↓
Verify capacity
↓
Expand promotion if appropriate
```

Do not default to mass promotion.

Promotion intensity must be proportional to operational readiness.

---

# 15. RSVP VELOCITY LAW

Track not only total RSVPs but rate of demand.

Useful metrics:

```text
registrations per day
registrations by source
children per registration
service interest
capacity utilization
waitlist growth
cancellation rate
```

Agents should detect when demand is approaching constraints.

Example:

```text
40 haircut capacity
32 haircut requests

STATUS:
80% utilized
```

At defined thresholds, alert the event owner.

Suggested configurable thresholds:

```text
70% = WATCH
85% = WARNING
100% = CAPACITY REACHED
```

Agents may adjust thresholds when justified.

---

# 16. STAFFING PLANNER BLUEPRINT

Every event implementation should include or generate:

| Role               | Needed | Assigned | Owner | Status |
| ------------------ | -----: | -------: | ----- | ------ |
| Event Lead         |        |          |       |        |
| RSVP / Check-in    |        |          |       |        |
| Queue Management   |        |          |       |        |
| Distribution       |        |          |       |        |
| Food               |        |          |       |        |
| Guest Support      |        |          |       |        |
| Media / Consent    |        |          |       |        |
| Setup              |        |          |       |        |
| Cleanup            |        |          |       |        |
| Float / Escalation |        |          |       |        |

Agents must adapt the table.

Do not force irrelevant roles.

Required statuses:

```text
NOT ASSESSED
NEEDS ASSIGNMENT
PARTIALLY STAFFED
READY
BLOCKED
```

---

# 17. MINIMUM EVENT OPERATING BLUEPRINT

Every implementation must reason through these phases.

## PHASE 1 — EVENT TRUTH

Confirm:

```text
event name
purpose
date
start/end time
timezone
location
audience
organizer
public contact
partners
services
supplies
food
eligibility
```

Output:

`EVENT_FACT_SHEET`

---

## PHASE 2 — CAPACITY

Determine:

```text
attendance capacity
venue constraints
service capacities
supply capacities
food capacity
staffing capacity
safety constraints
```

Output:

`CAPACITY_MODEL`

---

## PHASE 3 — RSVP SEMANTICS

Define:

```text
what RSVP means
what it guarantees
what it does not guarantee
capacity behavior
waitlist behavior
cancellation behavior
```

Output:

`RSVP_POLICY`

---

## PHASE 4 — OWNERSHIP

Assign:

```text
event owner
backup
RSVP owner
backup
critical operational roles
```

Output:

`STAFFING_PLAN`

---

## PHASE 5 — PUBLIC RSVP

Build:

```text
RSVP form
confirmation state
receipt email
capacity messaging
privacy/consent
source tracking
```

Output:

`PUBLIC_RSVP_ARTIFACT`

---

## PHASE 6 — COMMAND CENTER

Provide organizers:

```text
total RSVPs
families
children
service interest
capacity utilization
waitlist
cancellations
source attribution
staffing readiness
alerts
```

Output:

`RSVP_COMMAND_CENTER`

---

## PHASE 7 — EVENT-DAY OPERATIONS

Provide:

```text
mobile check-in
searchable attendee list
walk-in support
queue management
resource distribution
service completion
incident/escalation path
```

Output:

`EVENT_DAY_OPERATING_VIEW`

---

## PHASE 8 — EVIDENCE

Capture:

```text
registered
attended
services delivered
supplies distributed
volunteers
partners
media captured
quotes/testimonials with consent
problems
unexpected outcomes
```

Output:

`EVENT_EVIDENCE_RECORD`

---

## PHASE 9 — FOLLOW-UP

Handle:

```text
thank-you messages
volunteer follow-up
partner follow-up
attendee follow-up
unserved demand
future interest
```

Output:

`FOLLOW_UP_QUEUE`

---

## PHASE 10 — LEARNING LOOP

Compare:

```text
planned
vs
actual
```

Ask:

```text
What happened?
What exceeded expectations?
What failed?
What constrained capacity?
What did attendees ask for?
Which channels worked?
What should change next time?
What new opportunity was discovered?
```

Output:

`EVENT_RETROSPECTIVE`

---

# 18. REUSABLE ARTIFACT STACK

A complete implementation may generate:

## Public artifacts

```text
Event landing page
RSVP form
Confirmation screen
QR code
Calendar link
Public FAQ
Capacity notices
```

## Communication artifacts

```text
RSVP receipt email
Reminder email
Capacity update
Waitlist notice
Cancellation notice
Day-before instructions
Post-event thank-you
```

## Organizer artifacts

```text
RSVP dashboard
Staffing planner
Capacity planner
Supply tracker
Source attribution dashboard
Readiness checklist
```

## Event-day artifacts

```text
Mobile check-in
Printable roster
Queue system
Service completion tracker
Distribution tracker
Volunteer assignment sheet
```

## Post-event artifacts

```text
Attendance reconciliation
Metrics summary
Follow-up queue
Evidence package
Case-study inputs
Retrospective
```

Not every event requires every artifact.

Agents must choose the smallest useful set.

---

# 19. AGENT REASONING PERMISSION

Agents are explicitly allowed and expected to reason.

Do not mechanically apply templates.

Before implementation, ask:

```text
What is this event actually trying to accomplish?

What would make it fail even if attendance were high?

What resource becomes constrained first?

What promise could disappoint attendees?

What information does the organizer actually need?

What can be removed?

What needs human ownership?

What should be automated?

What should remain human?

What evidence would prove success?
```

Agents may:

* remove unnecessary fields;
* simplify workflows;
* recommend different queue models;
* change promotion pacing;
* recommend additional staffing;
* recommend capacity reductions;
* propose additional event sessions;
* recommend not promoting yet;
* suggest operational improvements.

Agents may not violate the laws in this skill.

---

# 20. COMPLEXITY GUARDRAIL

Prefer:

> the simplest system that safely operates the event.

Do not introduce:

* microservices;
* unnecessary queues;
* multiple databases;
* duplicate RSVP stores;
* excessive dashboards;
* unnecessary AI agents;
* unnecessary dependencies;
* complex authentication for simple public RSVP;
* custom infrastructure where existing studio infrastructure works.

Reuse before adding.

---

# 21. SINGLE SOURCE OF TRUTH LAW

There must be one canonical RSVP record system.

Correct:

```text
Public RSVP
↓
API
↓
Canonical database
↓
Dashboard
↓
Workbook / analytics views
```

Incorrect:

```text
Public RSVP database

+

Workbook RSVP database

+

Spreadsheet RSVP list

+

Event-day unrelated list
```

Views may differ.

Truth must not.

---

# 22. OFFLINE / FAILURE GUARDRAIL

Event-day operations must not collapse because Wi-Fi fails.

Every implementation must define:

```text
OFFLINE FALLBACK
```

Examples:

* cached roster;
* printable list;
* downloadable CSV;
* manual numbered tickets;
* paper check-in fallback.

Do not require continuous internet for basic event operation unless unavoidable.

---

# 23. DUPLICATE / DATA QUALITY LAW

RSVP systems should reasonably handle:

* duplicate emails;
* duplicate phone numbers;
* repeat submissions;
* household updates;
* cancellations;
* accidental double registrations.

Do not silently delete ambiguous records.

Flag or merge with evidence.

---

# 24. WALK-IN LAW

Before launch, define:

```text
WALK_IN_POLICY
```

Possible:

```text
allowed
limited
not allowed
service subject to remaining capacity
```

Do not assume every attendee will RSVP.

Event-day planning should account for walk-ins when appropriate.

---

# 25. ACCESSIBILITY LAW

RSVP and event-day systems must consider:

* mobile usability;
* readable typography;
* clear language;
* keyboard accessibility;
* screen-reader semantics;
* language needs;
* low-bandwidth users;
* people uncomfortable with digital forms.

Provide reasonable alternatives where needed.

---

# 26. LANGUAGE LAW

Use plain human language.

Avoid:

* operational jargon in public interfaces;
* AI marketing language;
* bureaucratic copy;
* ambiguous promises.

A user should understand within seconds:

```text
What is this?
Who is it for?
When?
Where?
What do I need to do?
What is limited?
What does RSVP mean?
```

Apply Krug-style clarity:

> Do not make people think unnecessarily.

---

# 27. NOTIFICATION LAW

Do not spam organizers with useless notifications.

Define:

```text
WHO
GETS
WHAT
WHEN
WHY
```

Possible alerts:

```text
new RSVP
capacity threshold
waitlist triggered
cancellation
unusual group size
service demand spike
critical staffing gap
```

For high-volume events, prefer digests and threshold alerts over one email per
registration.

For first-time small events, individual RSVP notifications may be useful because
organizers learn demand firsthand.

Agents should reason based on scale.

---

# 28. EMAIL DELIVERY LAW

Transactional communication should be separated from marketing.

Examples:

Transactional:

```text
RSVP received
confirmation
waitlist
reminder
cancellation
event update
```

Marketing:

```text
newsletter
future fundraising
campaign promotion
```

Do not silently convert event RSVPs into marketing subscribers.

Require appropriate consent.

---

# 29. SECURITY LAW

Never expose:

* database service-role keys;
* SMTP credentials;
* API secrets;
* object-storage admin credentials;
* private attendee records.

Use:

* server-side secrets;
* scoped credentials;
* signed upload URLs;
* authenticated organizer dashboards;
* least privilege.

Public RSVP forms may be public.

Organizer data must not be public.

---

# 30. FILE / MEDIA LAW

If the event system accepts:

* audio;
* images;
* PDFs;
* waivers;
* documents;

use object storage.

Do not store large files as base64 in database records.

Store metadata and secure object references.

Define retention and access.

---

# 31. MEDIA CONSENT LAW

Attendance does not equal media consent.

Where media is captured:

define:

```text
MEDIA_POLICY
CONSENT_METHOD
NO-PHOTO IDENTIFICATION PROCESS
MEDIA_OWNER
```

For youth events, apply heightened care.

---

# 32. EVIDENCE LAW

Do not claim success because:

* the page deployed;
* the RSVP form worked;
* people registered;
* photos looked good.

Event success requires real evidence.

Possible metrics:

```text
registrations
attendance
children served
services delivered
supplies distributed
meals served
volunteers
partners
waitlist demand
no-show rate
source effectiveness
follow-up opportunities
```

Only report verified metrics.

---

# 33. CASE-STUDY LAW

The event system should make it easy to create a case study later.

Preserve:

```text
baseline
goal
plan
constraints
capacity
promotion approach
registrations
actual attendance
outputs
problems
adaptations
outcomes
quotes
media
lessons
next iteration
```

Do not fabricate impact.

Separate:

```text
OUTPUT
from
OUTCOME
from
LONG-TERM IMPACT
```

Example:

```text
OUTPUT:
100 backpacks distributed.

OUTCOME:
Families received school supplies.

LONG-TERM IMPACT:
Improved educational outcomes.
```

The third claim requires evidence beyond the event.

---

# 34. BEAD / PROVENANCE LAW

Every major event decision should be traceable.

Use Beads or equivalent identifiers for:

```text
meeting decisions
capacity changes
policy changes
public copy changes
launch approvals
incident decisions
post-event findings
```

Example:

```text
EVENT-ASC3ND-20260830-RSVP-001
```

Agents updating strategy must cite the source evidence or Bead.

---

# 35. MEETING OS INTEGRATION

When Meeting OS is available:

```text
Meeting
↓
Meeting Bead
↓
Confirmed event facts
↓
Event Activation skill
↓
RSVP / staffing / capacity artifacts
↓
Event operation
↓
Evidence
↓
Strategy update proposal
```

Agents must inspect relevant meeting evidence before asking organizers to repeat
information.

---

# 36. GRILL FOLLOW-UP INTEGRATION

If important information is missing:

Do not generate assumptions.

Use a Grill-style follow-up.

Rules:

1. inspect existing evidence first;
2. identify decision branches;
3. ask one material question at a time;
4. provide a recommended answer and reasoning;
5. resolve upstream dependencies first;
6. stop when enough shared understanding exists.

Examples of material questions:

```text
What does RSVP guarantee?

What is the actual service capacity?

Who owns the RSVP list?

What happens when capacity is reached?

Are walk-ins allowed?

What does a child need to receive supplies?

Who can approve public claims?
```

Do not grill users about irrelevant details.

---

# 37. PRE-LAUNCH READINESS GATE

Before public launch, verify:

## Event Truth

* [ ] Date confirmed
* [ ] Time confirmed
* [ ] Timezone confirmed
* [ ] Location confirmed
* [ ] Audience confirmed
* [ ] Public contact confirmed

## Capacity

* [ ] Event capacity assessed
* [ ] Service capacity assessed
* [ ] Supply capacity assessed
* [ ] Food capacity assessed if relevant
* [ ] Venue limits assessed
* [ ] Staffing capacity assessed

## RSVP

* [ ] RSVP meaning defined
* [ ] Guarantee language defined
* [ ] Waitlist policy defined
* [ ] Walk-in policy defined
* [ ] Cancellation handling defined

## Ownership

* [ ] Event owner assigned
* [ ] Backup assigned
* [ ] RSVP owner assigned
* [ ] RSVP backup assigned
* [ ] Critical roles assigned or visibly flagged

## Technology

* [ ] Form tested
* [ ] Persistence tested
* [ ] Confirmation tested
* [ ] Notifications tested
* [ ] Dashboard tested
* [ ] Mobile tested
* [ ] Offline fallback available

## Privacy

* [ ] Minimum data collected
* [ ] Consent language reviewed
* [ ] Media consent separated where needed
* [ ] Organizer dashboard protected
* [ ] Secrets server-side

## Public Communication

* [ ] No unsupported claims
* [ ] Limited resources clearly described
* [ ] RSVP semantics clear
* [ ] Contact method works

---

# 38. RELEASE LAW

Never say:

> Event system complete.

unless evidence proves:

```text
form works
↓
server persists
↓
confirmation works
↓
organizer can see RSVP
↓
capacity logic works
↓
mobile works
↓
failure path works
↓
rollback exists
```

A successful build is not proof of a successful system.

---

# 39. ROLLBACK LAW

Every implementation must define rollback.

Possible rollback:

```text
disable public RSVP
restore previous event page
switch to manual form
export current RSVP records
preserve database
disable broken automation
use offline roster
```

Never make attendee data dependent on one fragile deployment.

---

# 40. STUDIO REUSE LAW

Before building event infrastructure:

1. search current repository;
2. search Vibe Engineering shared capabilities;
3. search approved skills;
4. identify existing RSVP/event modules;
5. extend rather than duplicate when safe.

Do not create another RSVP architecture merely because a new framework is
available.

---

# 41. CLIENT ISOLATION LAW

Reusable logic belongs in the studio layer.

Client-specific configuration belongs with the client.

Example:

```text
VIBE ENGINEERING

skills/event-activation-rsvp/
    reusable laws
    schemas
    templates
    adapters
    tests

ASC3ND

event-config/
    event facts
    capacity
    branding
    fields
    copy
```

Do not leak one client's:

* attendees;
* branding;
* private information;
* database records;
* credentials;

into another client implementation.

---

# 42. REFERENCE ARCHITECTURE

Preferred conceptual architecture:

```text
                    EVENT CONFIG
                         │
                         ▼
PUBLIC EVENT PAGE → RSVP FORM
                         │
                         ▼
                  VALIDATION / API
                         │
                         ▼
               CANONICAL DATA STORE
                  /      |       \
                 /       |        \
                ▼        ▼         ▼
        EMAIL RECEIPT  DASHBOARD  ALERTS
                         │
                         ▼
                  EVENT-DAY VIEW
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
          CHECK-IN     QUEUE      DISTRIBUTION
             │           │           │
             └───────────┼───────────┘
                         ▼
                    ACTUAL RESULTS
                         │
                         ▼
                 FOLLOW-UP / EVIDENCE
                         │
                         ▼
                 CASE STUDY / STRATEGY
```

This is a blueprint, not a mandatory technology stack.

Agents may implement it using the approved project stack.

---

# 43. DEFAULT STUDIO DATA MODEL

Suggested entities:

```text
events
event_capacity
event_roles
event_rsvps
event_services
event_service_requests
event_checkins
event_distributions
event_sources
event_notifications
event_evidence
```

Do not create all tables automatically.

Use only those justified by the event.

For small events, a simpler schema may be superior.

---

# 44. MINIMUM RSVP RECORD

Recommended baseline:

```json
{
  "id": "uuid",
  "event_id": "uuid",
  "adult_name": "string",
  "email": "string",
  "phone": "string|null",
  "group_size": 1,
  "children_count": 0,
  "service_interest": {},
  "source": "string|null",
  "contact_consent": true,
  "status": "RECEIVED",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

Extend only when necessary.

---

# 45. EVENT CONFIG CONTRACT

Every event should be representable as configuration.

Example:

```yaml
event:
  slug: community-cuts-2026
  name: Community Cuts for Kids

rsvp:
  meaning: attendance_planning
  attendance_guaranteed: false

services:
  haircut:
    capacity: 40
    fulfillment: first_come
    guaranteed_by_rsvp: false

supplies:
  backpack:
    quantity: 100
    rule: one_per_child
    child_must_be_present: true
    reserved_by_rsvp: false

promotion:
  mode: warm_network_first

ownership:
  event_owner: TBD
  backup: TBD
  rsvp_owner: TBD
  rsvp_backup: TBD
```

This configuration must not substitute for verified facts.

---

# 46. AGENT DECISION FRAMEWORK

When an agent encounters a new event, reason in this order:

```text
1. WHAT IS THE OUTCOME?

2. WHO IS THE EVENT FOR?

3. WHAT IS CONFIRMED?

4. WHAT IS LIMITED?

5. WHAT CAN FAIL?

6. WHAT DOES RSVP NEED TO ACCOMPLISH?

7. WHO OWNS THE SYSTEM?

8. WHAT IS THE SIMPLEST SAFE WORKFLOW?

9. WHAT MUST WORK OFFLINE?

10. WHAT EVIDENCE WILL PROVE SUCCESS?
```

Then build.

---

# 47. STOP CONDITIONS

Stop implementation and request clarification when:

```text
RSVP meaning is unknown
AND public wording depends on it

service capacity is unknown
AND RSVP may imply guaranteed service

location/date/time are contradictory

eligibility rules are unclear

sensitive child data appears unnecessary

no human owns the event

no one owns the RSVP list

public claims cannot be verified

the implementation would create a duplicate source of truth

security requires exposing secrets

the event appears operationally unsafe
```

Do not stop for minor details that can safely remain configurable.

---

# 48. REASONABLE DEFAULTS

Agents may use safe defaults when they do not create commitments.

Examples:

```text
status = RECEIVED

phone = optional

marketing consent = false unless explicitly opted in

service guarantee = false unless explicitly confirmed

public quantities = not shown unless confirmed

walk-ins = UNKNOWN until decided
```

Never default into a stronger promise.

---

# 49. POST-EVENT RETROSPECTIVE

Within a reasonable period after the event, capture:

```text
How many registered?
How many attended?
How many children?
How many services delivered?
How many supplies distributed?
What remained unused?
Where did people come from?
What bottleneck occurred?
What surprised the organizers?
What did attendees request?
Which volunteers/partners should be thanked?
Who needs follow-up?
What should change next time?
```

Generate:

```text
EVENT ACTUALS
LESSONS
FOLLOW-UP
STRATEGY UPDATE CANDIDATES
NEXT EVENT RECOMMENDATIONS
```

---

# 50. COMMERCIAL / STUDIO LEARNING

The studio should learn from every event implementation.

Track reusable lessons such as:

```text
Which RSVP fields were actually useful?
Which notification pattern worked?
Which queue model worked?
Which source channels converted?
Which staffing roles were missing?
Which artifacts were used?
Which were unnecessary?
```

Improve the reusable skill.

Do not blindly copy event-specific behavior into the global standard.

Require repeated evidence before promoting a pattern to studio law.

---

# 51. FIRST REFERENCE IMPLEMENTATION — ASC3ND

This is a reference example, not a universal rule.

Known meeting evidence at the time this skill was defined:

```text
EVENT:
Community Cuts for Kids / Back-to-School Bash

DATE:
August 30, 2026

TIME:
12:00 PM–3:00 PM

LOCATION:
Tangles & Locs
7425 Hardeson Rd
Everett, WA 98203

BARBERS:
5 confirmed

HAIRCUT CAPACITY:
40 total

BACKPACKS:
100 confirmed

BACKPACK POLICY:
One per child.
Child must be present.
Not automatically reserved by RSVP.
While supplies last unless organizers later approve another policy.

FOOD:
Hot dogs/burgers discussed.
Organizers consider food scalable.
Exact quantity not yet confirmed.

VOLUNTEERS:
Available.
Exact staffing assignments not yet confirmed.

DEMAND:
Strong warm-lead response.
Online RSVP list not yet established.

RECOMMENDED RSVP MODEL:
Attendance planning + haircut interest.

HAIRCUT MODEL:
First-come operational queue.
RSVP does not automatically guarantee haircut.

PROMOTION:
Warm-network-first until demand and capacity are visible.

STAFFING:
Create staffing planner and require role ownership.

RSVP OWNERSHIP:
Founders should remain close to the first RSVP cycle.
Choose one primary owner and one backup.
```

Do not treat this example as a template for unrelated events.

---

# 52. ASC3ND FIRST-INSTANCE LEARNING GOAL

The first implementation should prove:

```text
Can a nontechnical nonprofit founder:

understand incoming demand
↓
monitor capacity
↓
see registrations arrive
↓
manage event readiness
↓
operate check-in
↓
record actual outcomes
↓
learn from the event
```

If the system requires the studio to operate everything forever, it has failed
the augmentation goal.

The system should increase owner capability.

---

# 53. REQUIRED AGENT OUTPUT BEFORE BUILDING

Before substantial implementation, return:

```text
MODE:
greenfield / brownfield

OUTCOME:
measurable event outcome

TARGET:
organizer / attendee / system

CONFIRMED:
verified facts

UNKNOWN:
material unknowns

CAPACITY:
known constraints

RSVP_MEANING:
defined / unresolved

OWNERS:
event + RSVP

RISKS:
top operational risks

MINIMUM_ARTIFACTS:
what must actually be built

REUSE:
existing components/skills found

PROOF:
how success will be verified

ROLLBACK:
how the system can safely fall back
```

---

# 54. REQUIRED AGENT OUTPUT AFTER BUILDING

Return:

```text
DECISION

CHANGES

PROOF

STATUS

EVENT READINESS

CAPACITY STATUS

RSVP STATUS

STAFFING STATUS

PRIVACY / SECURITY

RISKS

ROLLBACK

NEXT

HUMAN APPROVAL REQUIRED
```

Do not claim `READY` without evidence.

---

# 55. SUCCESS STANDARD

A successful Event Activation system should allow an organizer to answer:

```text
How many people are coming?

How many children?

What are they interested in?

Where did they hear about us?

What are we close to running out of?

Who is responsible for each part?

Who is waiting?

Who actually attended?

What did we actually deliver?

Who needs follow-up?

What did we learn?
```

without needing to ask a developer.

---

# 56. FINAL OPERATING PRINCIPLE

The RSVP form is not the product.

The dashboard is not the product.

The event page is not the product.

The product is:

> a clear, manageable path from community interest to a well-run event and
> measurable human outcomes.

Use technology only where it improves that path.

Build the smallest reliable operating system that helps the people closest to
the event make better decisions.

Then learn from reality and improve the next activation.
