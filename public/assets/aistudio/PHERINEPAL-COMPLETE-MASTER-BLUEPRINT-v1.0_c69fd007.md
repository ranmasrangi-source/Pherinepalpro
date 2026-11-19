# PHERINEPAL

# COMPLETE MASTER PRODUCT & TECHNICAL BLUEPRINT

**Document ID:** PNP-MASTER-ARCH-001\
**Version:** 1.0 --- Reconstructed Master Specification\
**Status:** Master product and engineering specification; owner
decisions and external approvals remain explicitly gated\
**Scope:** Complete PheriNepal product, all 31 service categories, all
user journeys, UI/UX, platform architecture, data, APIs, security,
payments, AI, safety, operations, governance, testing and phase-by-phase
implementation.

------------------------------------------------------------------------

## Document control and rules

### Status vocabulary

-   **FINAL** --- Product requirement accepted as part of this
    blueprint.
-   **RECOMMENDED** --- Technical/product recommendation; owner may
    approve or replace it through a recorded decision.
-   **PENDING** --- A decision, evidence, contract, legal opinion or
    provider capability is not yet confirmed.
-   **GATED** --- Must remain disabled until named operational, legal,
    security or provider conditions are evidenced.
-   **VERIFIED** --- May be used only when supported by current
    repository, test, provider or documentary evidence. A statement in
    this blueprint alone is never proof of implementation.

### Non-negotiable rules

1.  This document is the authoritative product and engineering
    specification. The phase register in Part II is the authoritative
    delivery order.
2.  Preserve every feature requirement unless an explicit owner-approved
    change record supersedes it.
3.  Never invent legal approval, licence, insurance, provider agreement,
    partner verification, credentials, test output or production
    readiness.
4.  A feature can be visible as planned without being available to use.
    `Coming Soon`, `Information Only`, `Available`,
    `Temporarily Unavailable` and `Restricted` must have precise
    behaviour.
5.  No booking is accepted merely because a payment request succeeded.
    Booking state, inventory state and payment state are separate state
    machines.
6.  No payment is described as escrow or "protected until service
    completion" unless the actual legal structure and payment provider
    contract support that exact claim.
7.  Never expose an SOS or 24/7 emergency promise unless staffed
    response operations, escalation, verified contacts and drills are
    approved.
8.  Every privileged action, financial transition, verification decision
    and sensitive-data access must be authorized and auditable.
9.  All critical business rules must be enforced server-side and, where
    applicable, by database constraints---not only in the browser.
10. AI may assist but must not independently approve partners, confirm
    bookings, move money, decide refunds, or dispatch emergency
    responders.
11. Work must be completed phase by phase. A phase is complete only when
    its exit evidence is attached and the owner accepts the report.
12. Do not call the whole project "complete" while any release-blocking
    defect, unapproved gate, critical security issue or required
    operational dependency remains unresolved.

### Source and decision discipline

This blueprint retains the original PheriNepal scope: Nepal-focused
travel companion; complete Before / During / After journey; 31 service
categories; eight dashboards; 240 phase-register feature modules;
English and Nepali initial content; responsive mobile/tablet/desktop; 18
delivery phases (00--17). Recommendations added here are labelled as
recommendations. Any implementation claim requires repository evidence.
All unresolved decisions belong in `DECISIONS.md` with ID, options,
impact, owner, approver, due date and final decision.

------------------------------------------------------------------------

# PART I --- PRODUCT DEFINITION

## 1. Vision, promise and positioning

### 1.1 Vision

PheriNepal is a Nepal-focused travel platform that helps a traveler
plan, discover, arrange, experience and remember a trip through one
coherent account and trip workspace.

**Brand line:** Your Complete Nepal Travel Companion.\
**Lifecycle line:** Before You Go. While You Explore. After You Return.
PheriNepal Is With You.\
**Product idea:** One Account. One Trip. One Support System. Entire
Nepal.

### 1.2 Product promise

The platform aims to provide: - clear and current service information; -
transparent, complete pricing before commitment; - partner identity and
category-appropriate verification; - traceable booking, payment, refund
and support records; - trip information usable before and during
travel; - a useful post-trip record and feedback loop.

These are product objectives, not claims that every category or partner
is already operational. Public claims must reflect actual live coverage.

### 1.3 Trust principles

-   **Truthful availability:** show accurate category and location
    status.
-   **Verified supply:** define verification evidence by service
    category, expiry and re-check frequency.
-   **Financial integrity:** quote, charge, refund and payout records
    must reconcile.
-   **Safety first:** publish source, timestamp, coverage and
    limitations for safety information.
-   **Privacy by design:** collect minimum data, obtain clear consent
    and restrict access.
-   **Local inclusion:** support Nepali-first partner workflows,
    assisted onboarding and low-connectivity contexts.
-   **Human accountability:** identify a responsible person/team for
    each operationally sensitive workflow.

## 2. Market and competitor context

Market statistics, competitor capabilities and industry claims must be
stored in a research register with source URL, publisher, publication
date, retrieval date, geography, definition, methodology and confidence.
Do not publish unsourced figures as facts.

The earlier market context contains monthly 2026 visitor-arrival figures
and qualitative claims about trekking infrastructure, guide trust,
digital access, visitor spending, commissions, transport safety and
information confusion. Treat these as **research leads**, not verified
facts, until checked against primary NTB/government datasets and
reliable evidence.

Required research: - official visitor arrivals and source-market data; -
seasonality and regional distribution; - visitor spend and
length-of-stay definitions; - partner supply and licensing requirements
by category; - competitor listing, verification, price, booking, support
and review workflows; - realistic addressable market and bottom-up unit
economics.

Competitor review candidates previously named include Booking.com,
Airbnb, eSewa Hotels, ghumNepal, Hop Nepal/local agencies and Hotel
Nepal app. Do not call any one the closest competitor until the
comparison has been performed and dated.

## 3. Users and personas

The platform must account for: 1. international traveler; 2. Nepali
domestic traveler; 3. Nepali diaspora traveler; 4. hotel/resort
operator; 5. homestay host; 6. guide/porter; 7. transport
operator/driver; 8. adventure/trekking/climbing operator; 9.
restaurant/local experience partner; 10. shopping seller; 11. customer
support/operations staff; 12. verification/compliance staff; 13. finance
staff; 14. content/editorial staff; 15. administrator/owner.

Personas are role/workflow descriptions, not assumptions about identity
or ability. Validate them through interviews and usability tests.

## 4. Core product principles

1.  Show all 31 planned categories with an honest status.
2.  `Coming Soon` categories have no live price, inventory, checkout or
    booking action.
3.  No transactional category goes live until legal, licence, partner,
    safety, payment, support and operational readiness gates pass.
4.  Admins can configure category and location status without code
    deployment, subject to permissions and audit logs.
5.  Payment success alone never confirms a booking.
6.  Information-only services are never represented as bookable
    products.
7.  Do not advertise 24/7 support or emergency response without staffed
    coverage.
8.  Every quote is server-calculated and has an expiry and immutable
    price snapshot.
9.  Each service booking has its own state and financial records, even
    when grouped under one Trip ID.
10. The platform must degrade safely when an external provider is
    unavailable.

## 5. Service catalogue --- 31 categories

  --------------------------------------------------------------------------------------
                     \# Category key         Display category Initial behaviour
  --------------------- -------------------- ---------------- --------------------------
                      1 hotels               Hotels & Resorts Status-gated transactional

                      2 homestays            Homestays        Status-gated transactional

                      3 adventures           Adventures &     Status-gated transactional
                                             Experiences      

                      4 trekking             Trekking         Status-gated transactional

                      5 peak-climbing        Peak Climbing    Restricted/status-gated

                      6 guides               Guides & Porters Status-gated transactional

                      7 transport            Transport        Status-gated transactional

                      8 flights              Flights          Provider-dependent;
                                                              information or integration

                      9 luggage              Luggage Services Status-gated transactional

                     10 nearby-services      Nearby Services  Information/discovery

                     11 esim                 eSIM             Provider-dependent
                                                              transactional

                     12 sim-info             SIM Information  Information only unless
                                                              approved

                     13 offline-maps         Offline Maps     Licence-gated

                     14 shopping             Shopping         Status-gated marketplace

                     15 restaurants          Restaurants      Reservation/booking gated

                     16 local-experiences    Local            Status-gated transactional
                                             Experiences      

                     17 hidden-nepal         Hidden Nepal     Editorial/discovery

                     18 ai-guide             AI Travel Guide  Assistive; safety-gated

                     19 trip-planning        Trip Planning    Planning tool

                     20 weather-alerts       Weather Alerts   Official-source dependent

                     21 sos                  SOS              GATED until staffed
                                                              response

                     22 qr-scan              QR Scan Nepal    Information/discovery

                     23 passport             Digital Travel   Account feature
                                             Passport         

                     24 memories             Travel Memories  User-controlled media

                     25 reviews              Reviews          Moderated;
                                                              booking-verified
                                                              eligibility

                     26 rewards              Rewards          Gated until
                                                              financial/accounting rules
                                                              approved

                     27 lost-found           Lost & Found     Moderated support workflow

                     28 companion-matching   Travel Companion GATED pending
                                             Matching         safety/privacy controls

                     29 group-travel         Group Travel &   Staged release
                                             Community        

                     30 travel-wallet        Travel Wallet    GATED pending
                                                              legal/payment/accounting
                                                              review

                     31 support              Travel Support & Service hours and staffing
                                             Dispute          must be explicit
                                             Assistance       
  --------------------------------------------------------------------------------------

The category key, display name, transactional flag, status and owning
phase must live in one canonical catalogue registry. No duplicated
hard-coded category lists across UI, API, admin and analytics. The
initial transactional classification must be verified against the actual
repository and owner-approved category policy.

### 5.1 Category status state machine

`PLANNED → COMING_SOON → INFORMATION_ONLY / AVAILABLE → TEMPORARILY_UNAVAILABLE / RESTRICTED → RETIRED`

Rules: - `AVAILABLE` requires a completed readiness record, two distinct
approvals for high-risk launch gates, active partner supply and
operational coverage. - `INFORMATION_ONLY` disables price, inventory,
checkout and booking. - `TEMPORARILY_UNAVAILABLE` prevents new
transactions but preserves existing booking/support access. -
`RESTRICTED` explains the restriction without disclosing sensitive
internal reasons. - Every status change records actor, timestamp,
reason, affected geography, effective time and prior value. - Emergency
disable must be available to authorized operators and must not erase
existing records.

## 6. Eight dashboards --- required role mapping

The original scope specifies eight dashboards. The following is a
**proposed explicit mapping** to resolve the previous corrupted
dashboard table. Owner approval is required before treating names as
final.

1.  **Traveler Dashboard** --- profile, trips, saved places, bookings,
    vouchers, payments/refunds, support, consent and memories.
2.  **Partner Dashboard** --- organization profile, listings,
    availability, bookings, staff, documents, performance and payout
    statements.
3.  **Guide/Operator Dashboard** --- qualifications, assignments,
    schedules, group capacity, trip updates and incident escalation.
4.  **Admin Dashboard** --- global configuration, category/location
    status, user/partner administration, feature flags and audit
    visibility.
5.  **Verification & Compliance Dashboard** --- partner evidence,
    expiry, review queue, approval separation, restrictions and
    compliance history.
6.  **Finance Dashboard** --- payment reconciliation, ledger views,
    refund approvals, commissions, payouts, disputes and financial
    reports.
7.  **Support & Safety Dashboard** --- tickets, complaints, incident
    triage, escalation, service hours and approved emergency workflows.
8.  **Content & Intelligence Dashboard** --- destination content, source
    verification, localization, moderation, SEO, AI quality and
    analytics.

A role may have access to more than one dashboard, but access is
permission-based, not inferred from dashboard visibility.
Owner/super-admin access must be protected with MFA and audited.

## 7. Travel lifecycle

### 7.1 Before travel

Destination discovery; category and service discovery; route and season
information; permit/visa information; quote and budget; saved itinerary;
partner and listing verification status; booking; payment status;
cancellation terms; packing checklist; documents; emergency information;
offline preparation.

### 7.2 During travel

Trip timeline; vouchers; provider contact; route and location tools;
check-in/check-out; schedule updates; weather/closure notices; offline
itinerary; translation/phrase help; nearby services; support ticket;
incident reporting; consent-controlled location sharing.

### 7.3 After travel

Trip completion; actual versus estimated spend; receipts/refunds;
verified review invitation; complaint and dispute follow-up; travel
passport; memories; privacy-controlled sharing; rewards only when
approved; repeat-trip recommendations.

------------------------------------------------------------------------

# PART II --- PRODUCT AND ENGINEERING ARCHITECTURE

## 8. Technology baseline and decision policy

The following is the recommended baseline. Phase 00 must check
compatibility with the existing repository, deployment host, team
capability and supported runtime before pinning exact versions. Do not
upgrade an existing working repository blindly.

  -----------------------------------------------------------------------
  Layer                   Recommended baseline    Mandatory
                                                  decision/evidence
  ----------------------- ----------------------- -----------------------
  Web                     Next.js 16, React 19,   Confirm
                          TypeScript strict mode  repository/runtime
                                                  compatibility

  Styling/UI              Design tokens,          Select one consistent
                          accessible component    system; no ad-hoc
                          system, Tailwind CSS or styling
                          equivalent              

  API                     Modular domain          Decide Next.js route
                          services; typed         handlers vs separate
                          REST/OpenAPI contracts  NestJS service by
                                                  documented ADR

  Database                PostgreSQL, supported   Pin exact major/minor
                          stable major version    supported by host and
                                                  migration tests

  ORM/data access         Typed SQL/ORM with      Choose one; preserve DB
                          explicit migrations     constraints and
                                                  transaction control

  Cache                   Redis-compatible cache  Define TTL,
                          only where measured     invalidation and
                          need exists             failure behaviour

  Jobs                    Durable queue with      Provider/technology
                          retry/dead-letter       selected in Phase 02
                          support                 

  Object storage          S3-compatible private   Encryption, signed
                          storage                 URLs, retention and
                                                  malware scan

  Search                  PostgreSQL search       Measure relevance and
                          initially; dedicated    load before adding
                          engine only when needed infrastructure

  Maps                    Licensed                Contract, attribution,
                          map/geocoding/routing   quotas, offline rights
                          provider adapter        

  Payments                Provider adapter        Merchant approval,
                          framework               permitted flow,
                                                  settlement and refund
                                                  contract

  Auth                    Secure server-managed   MFA, recovery, session
                          sessions; optional      revocation, provider
                          managed identity        review
                          provider                

  Observability           Structured logs,        PII redaction and
                          metrics, traces, error  retention policy
                          reporting               

  CI/CD                   Automated lint,         Protected branch and
                          typecheck, tests,       deployment approval
                          migrations and security 
                          checks                  

  Mobile                  Native Android/iOS in   Do not block web
                          Phase 16; API-first     architecture on native
                                                  app
  -----------------------------------------------------------------------

### 8.1 Architecture style

Start with a **modular monolith** organized by business domains, with
explicit interfaces and dependency direction. Extract independent
services only when justified by scale, isolation, team ownership or
provider constraints. Avoid premature microservices and distributed
transactions.

### 8.2 Logical modules

-   Identity & Access
-   User & Organization
-   Partner Verification & Compliance
-   Category Catalogue & Feature Configuration
-   Destination & Content
-   Search & Discovery
-   Trip & Itinerary
-   Inventory & Availability
-   Quote & Pricing
-   Booking
-   Payment Orchestration
-   Ledger & Reconciliation
-   Refunds, Disputes & Payouts
-   Reviews & Moderation
-   Notifications & Messaging
-   Support & Incident Management
-   Maps & External Data
-   AI Travel Intelligence
-   Analytics & Audit
-   Admin Configuration

Each module owns its domain rules and data access. Cross-module writes
must use documented application services/events, not arbitrary table
updates.

### 8.3 Environment separation

-   **Local:** synthetic data and test provider mocks.
-   **CI:** isolated ephemeral test database/services.
-   **Development:** shared non-production environment; no live money.
-   **Staging:** production-like configuration with sandbox providers
    and synthetic/test data.
-   **Production:** restricted access, approved secrets, backups,
    monitoring and controlled releases.

No production personal data in local/dev/test. Secrets must be stored in
a secret manager/environment injection system, never committed to Git.

## 9. Data architecture

### 9.1 Core data domains

-   Identity: users, credentials/identity provider references, sessions,
    MFA methods, devices, consents.
-   Organizations: organizations, memberships, roles, partner profiles,
    staff.
-   Verification: evidence documents, verification checks, decisions,
    expiry, reviewer, audit history.
-   Catalogue: categories, category status, geography, service type,
    feature flags.
-   Content: destinations, points of interest, articles, sources,
    translations, media rights, revisions.
-   Inventory: resources, units, capacities, schedules, rate plans,
    blocks, holds.
-   Commercial: quotes, price components, policies, discounts, taxes and
    currency.
-   Booking: trips, bookings, booking items, state transitions,
    vouchers, check-in/out.
-   Money: payment intents, provider transactions, ledger accounts,
    journal entries, refunds, commissions, payouts, settlements,
    disputes.
-   Trust: reviews, moderation cases, reports, partner performance.
-   Operations: tickets, incidents, escalation, contacts, service
    schedules.
-   AI: knowledge sources, retrieval records, prompt/model version,
    evaluations, feedback and safety events.
-   Governance: audit events, decisions, approvals, feature flags,
    operational configuration.

### 9.2 Database rules

-   Use primary keys that are stable and non-guessable externally; never
    expose sequential internal IDs as authorization.
-   Use foreign keys, unique constraints, check constraints and
    appropriate indexes.
-   Store timestamps in UTC; retain the IANA timezone and local-time
    meaning for destination-based bookings.
-   Store money in integer minor units or approved fixed precision;
    never binary floating point.
-   Store ISO currency code with every amount.
-   Use immutable snapshots for quotes, booking policy versions and
    financial transactions.
-   Use append-only journal entries for ledger history; corrections use
    reversing/adjusting entries, never destructive edits.
-   Use soft-delete only where justified; define actual
    erasure/anonymization workflow for privacy requests.
-   Define tenant/organization ownership and row-level access
    boundaries.
-   Sensitive documents must not be publicly addressable.
-   Every migration must have forward and rollback/restore strategy,
    tested on a copy of representative data.

### 9.3 Minimum schema catalogue

Exact physical schema and column types are produced in Phase 02
companion specification. At minimum include: `users`, `user_profiles`,
`sessions`, `mfa_factors`, `consents`, `organizations`,
`organization_members`, `roles`, `permissions`, `role_permissions`,
`partner_profiles`, `partner_documents`, `verification_cases`,
`verification_decisions`, `categories`, `category_statuses`,
`locations`, `destinations`, `places`, `content_items`,
`content_sources`, `media_assets`, `listings`, `resources`,
`inventory_slots`, `rate_plans`, `quotes`, `quote_items`, `trips`,
`bookings`, `booking_items`, `booking_events`, `payment_intents`,
`provider_transactions`, `ledger_accounts`, `journal_entries`,
`journal_lines`, `refunds`, `commissions`, `payouts`, `settlements`,
`disputes`, `reviews`, `moderation_cases`, `support_tickets`,
`incidents`, `notifications`, `outbox_events`, `inbox_events`,
`audit_events`, `feature_flags`, `ai_sources`, `ai_evaluations`.

This list is a minimum domain inventory, not a substitute for a reviewed
ERD. Avoid one giant generic table for unrelated service types.

## 10. API and integration contracts

### 10.1 API principles

-   Version public APIs (`/api/v1/...`) and document them with OpenAPI.
-   Validate all input at the boundary; reject unknown or malformed
    fields where appropriate.
-   Authorize every request at object and action level.
-   Use consistent error envelope: stable machine code, safe human
    message, correlation ID and field errors where appropriate.
-   Use cursor pagination for large/volatile lists; cap page size.
-   Apply rate limits to authentication, OTP, search, AI, upload,
    checkout and public endpoints.
-   Use idempotency keys for payment, booking creation, refund and other
    retry-sensitive mutations.
-   Never trust client-supplied price, role, partner ownership, booking
    status or payment status.
-   Avoid leaking internal stack traces, secrets or personal data in
    errors.

### 10.2 API groups

`/auth`, `/users`, `/organizations`, `/partners`, `/verification`,
`/catalogue`, `/categories`, `/destinations`, `/content`, `/search`,
`/maps`, `/trips`, `/itineraries`, `/inventory`, `/quotes`, `/bookings`,
`/payments`, `/refunds`, `/ledger` (restricted), `/payouts`, `/reviews`,
`/moderation`, `/notifications`, `/support`, `/incidents`, `/ai`,
`/admin`, `/analytics`, `/webhooks`.

Each endpoint contract must specify actor, permission, input schema,
output schema, validation, side effects, idempotency, rate limit, audit
event, errors and tests.

### 10.3 External provider adapter

Every external provider integration must have: - provider-neutral
internal interface; - sandbox and test fixtures; - credentials stored
outside code; - request signing/authentication; - timeout and retry
policy; - idempotency and duplicate webhook handling; - provider status
mapping; - reconciliation process; - failure/fallback behaviour; -
contract and data-processing review; - monitoring and support owner.

Never retry non-idempotent financial requests blindly.

## 11. Booking and inventory engine

### 11.1 Separate state dimensions

**Booking:** `REQUESTED`, `PENDING_PARTNER`, `APPROVED`, `CONFIRMED`,
`CHECKED_IN`, `IN_SERVICE`, `COMPLETED`, `DECLINED`, `EXPIRED`,
`CANCELLED`, `NO_SHOW`, `DISPUTED`.

**Inventory hold:** `HELD`, `CONFIRMED`, `RELEASED`, `EXPIRED`.

**Payment:** `CREATED`, `REQUIRES_ACTION`, `AUTHORIZED`, `CAPTURED`,
`FAILED`, `PARTIALLY_REFUNDED`, `REFUNDED`, `DISPUTED`, `REVERSED`.

**Payout:** `NOT_ELIGIBLE`, `PENDING_REVIEW`, `APPROVED`, `PROCESSING`,
`PAID`, `FAILED`, `ON_HOLD`.

Actual transitions must be specified and validated; these labels are a
recommended starting point, not an instruction to force every category
into identical semantics.

### 11.2 Booking modes

-   **Instant Booking:** server validates listing, partner, inventory,
    quote and all gates; atomically reserves inventory; executes the
    permitted payment flow; confirms only after the required conditions
    are met.
-   **Approval Booking:** creates a time-limited request; partner
    accepts/declines within a configured response window; expiry and
    decline release inventory and follow the approved payment policy.
-   Both modes must be independently configurable by category, location
    and partner readiness.

### 11.3 Atomicity and concurrency

-   Inventory reservation and booking creation must be atomic.
-   Use database transactions, row locks or an appropriate
    serializable/optimistic strategy.
-   Enforce capacity with database-level constraints/locking;
    application-only checks are insufficient.
-   Temporary holds have configurable expiry and durable cleanup.
-   Expiry jobs must be safe to run more than once.
-   Duplicate client requests and provider webhooks must not create
    duplicate bookings or charges.
-   Test simultaneous attempts for the final available
    room/seat/table/unit.
-   Record all state transitions with actor, reason and correlation ID.

### 11.4 Mandatory booking gate

A transaction is permitted only when: 1. global booking switch is
enabled; 2. category is transactional and enabled; 3. location/category
status is `AVAILABLE`; 4. booking mode is enabled; 5. partner is active
and verified for that category; 6. listing is approved and not
suspended; 7. required licence/insurance/evidence is valid; 8. inventory
is available and quote is valid; 9. payment/provider path is approved
and operational; 10. cancellation/refund policy is attached; 11.
support/incident operations meet the category readiness standard; 12.
required approvals are recorded by distinct authorized people.

The server must enforce the gate on every relevant write path. A hidden
or disabled button is not a security control.

## 12. Payments, ledger and financial operations

### 12.1 Financial model

Payment-provider authorization, capture, settlement, platform
commission, partner receivable, refund and payout are different events.
Do not call a flow escrow unless legal counsel and provider contract
explicitly establish a lawful escrow arrangement.

The original concept of "hold and release at check-in" is not assumed to
be technically or legally available. The final flow must be chosen after
written provider and legal review.

### 12.2 Money invariants

-   Every financial operation has a unique internal ID and provider
    reference where applicable.
-   Use immutable transaction records and append-only double-entry
    ledger.
-   Total debits equal total credits per journal.
-   Amount, currency, exchange rate, rate timestamp and rounding rule
    are explicit.
-   No negative/over-refund beyond policy and captured amount.
-   Reconciliation compares internal records with provider settlement
    reports.
-   Manual adjustments require permission, reason, evidence and audit.
-   Rewards points are separate from cash ledger.
-   Partner payouts require eligibility checks, approvals and
    reconciliation.
-   Refund and cancellation policies are versioned and snapshotted at
    booking time.

### 12.3 Provider readiness

eSewa, Khalti, Fonepay and international providers such as Stripe or
equivalents are candidates only. Availability, merchant eligibility,
supported flows, cross-border collection, split settlement, refund and
payout capabilities must be confirmed directly with each provider. Do
not assume a provider supports authorization/capture, escrow or
marketplace payouts.

### 12.4 Customer-facing money transparency

Before commitment show: - base price and quantity/duration; - taxes and
mandatory fees; - optional fees; - discounts/rewards; - total payable; -
currency; - cancellation/no-show terms; - payment timing and status; -
refund method/timing subject to provider; - partner/platform fee
disclosures where contractually and legally appropriate.

## 13. Partner verification and marketplace operations

Verification must be category-specific. Collect only required evidence
and restrict access to it.

Minimum workflow: 1. application and organization identity; 2.
registration evidence where applicable; 3. category-specific
licence/permit; 4. insurance evidence where required; 5.
ownership/authority declaration; 6. bank/settlement verification through
approved process; 7. document review and expiry; 8. two-person approval
for high-risk categories; 9. agreement and policy acceptance; 10.
listing review and publication; 11. ongoing performance/compliance
checks; 12. suspension, restriction, appeal and reinstatement.

A badge must explain what was checked and when. "Verified" does not mean
every service quality or safety outcome is guaranteed.

## 14. Trust, safety and incident management

-   Publish source and update timestamp for emergency contacts, weather,
    route and official advisories.
-   No claim of real-time monitoring unless a monitored feed and owner
    exist.
-   SOS remains GATED until staffing, escalation, response hours,
    responder contacts, location consent, drills, incident records and
    legal review are complete.
-   Emergency information pages must remain accessible without login
    where safe and appropriate.
-   Location sharing is opt-in, purpose-limited, revocable and
    time-limited.
-   Incident severity, triage, escalation, handoff and closure must be
    documented.
-   Do not imply that PheriNepal replaces emergency services.
-   Define abuse, false-report, harassment and retaliation controls.
-   Keep incident data access tightly restricted and audited.

## 15. Identity, authorization and security

### 15.1 Authentication

-   Secure server-managed sessions with `HttpOnly`, `Secure`,
    appropriate `SameSite` cookies.
-   Strong password hashing using a current approved
    algorithm/parameters if passwords are managed directly.
-   MFA for admins, finance, verification and privileged partner
    accounts.
-   Rate-limited OTP with expiry, replay prevention and abuse detection.
-   Secure recovery with notification and session revocation.
-   Session rotation after login/privilege change; device/session
    management.

### 15.2 Authorization

-   RBAC plus organization/record-level authorization.
-   Deny by default.
-   Separate permissions for view, create, approve, refund, payout,
    suspend and configure.
-   Separation of duties for partner verification and financial
    approvals.
-   Prevent IDOR/BOLA by checking ownership and permission server-side.
-   Audit privileged read and write access to sensitive records.

### 15.3 Application security

-   Threat modelling for auth, booking, payment, upload, admin, AI,
    location and marketplace abuse.
-   OWASP ASVS-aligned verification target; OWASP Top 10 coverage.
-   CSRF, XSS, SSRF, SQL injection, command injection, path traversal
    and insecure deserialization controls.
-   CSP and security headers; strict CORS policy.
-   Secrets scanning, dependency scanning, SAST and container/image
    scanning where applicable.
-   Upload MIME/content verification, size limits, malware scanning,
    private storage and signed access.
-   Webhook signature validation and replay protection.
-   Encryption in transit and at rest; key rotation policy.
-   No secrets, tokens, payment data or sensitive personal data in logs.

### 15.4 Security operations

Incident response plan; vulnerability intake; patch SLAs; access
reviews; backup encryption; production access logging; breach assessment
and notification workflow as determined by applicable law.

## 16. Privacy and data governance

-   Maintain a data inventory and purpose/legal-basis register.
-   Collect minimum necessary personal data.
-   Separate optional consent from required service terms.
-   Provide accessible privacy notices and preference controls.
-   Define export, correction, deletion, retention and legal-hold
    workflows.
-   Do not retain precise location after the stated purpose/period.
-   Define children/minor handling before enabling relevant community or
    companion features.
-   Define cross-border storage and processor/subprocessor review.
-   Redact personal data from analytics, logs, AI prompts and support
    exports.
-   User-generated media must have privacy, reporting, removal and
    retention controls.

Legal obligations and exact retention periods remain PENDING
professional review.

## 17. Localization, accessibility and responsive UX

### 17.1 Localization

-   Initial content priority: English and Nepali.
-   Architecture must support 12 or more locales without schema
    redesign.
-   Use translation keys, locale-aware formatting and translated content
    workflow.
-   Support Nepali Unicode, font rendering, search normalization and
    date/number formatting.
-   Support RTL only when an RTL locale is enabled.
-   Never concatenate translated fragments in ways that break grammar.
-   Keep canonical internal values language-neutral.

### 17.2 Accessibility

Target WCAG 2.2 AA: - keyboard operation and visible focus; - semantic
landmarks and heading hierarchy; - screen-reader labels and status
announcements; - contrast and non-colour status indicators; - accessible
forms and validation; - reduced-motion preference; - touch target
sizing; - accessible maps with list alternatives; - captions/transcripts
for meaningful media.

### 17.3 Responsive design

Design and test at mobile, tablet and desktop widths. Define breakpoints
through design tokens. Every page must have loading, empty, error,
offline, permission-denied, success and disabled states where relevant.

### 17.4 Design-first workflow

Before coding a user-facing feature: 1. user flow and information
architecture; 2. low-fidelity wireframe; 3. high-fidelity responsive
design; 4. interaction and state specification; 5. accessibility review;
6. design sign-off; 7. implementation and visual regression; 8.
usability review.

UI/UX is not postponed until the end; Phase 01 establishes the system
and every later phase extends it.

## 18. Search, maps, location and official information

-   Store coordinates with coordinate reference expectations and
    location accuracy/source.
-   Distinguish destination, administrative region, address and point of
    interest.
-   Map provider licensing, attribution, caching and offline permissions
    must be documented.
-   Search results must disclose availability freshness and data source
    where relevant.
-   Nearby service records require last-verified timestamp, source,
    contact and opening-hours confidence.
-   Official information registry stores publisher, URL,
    publication/effective date, checked date, geographic scope,
    language, reviewer and expiry/review schedule.
-   Never convert stale or uncertain information into a definitive
    safety instruction.

## 19. AI travel intelligence

AI is an assistive feature with explicit boundaries.

Capabilities: - grounded destination Q&A; - itinerary drafting and
refinement; - budget-aware planning; - multilingual assistance; -
weather/context-aware suggestions when trusted data is available; -
editorial drafting for human review; - recommendation explanation.

Requirements: - retrieval from approved, current sources with citations
and timestamps; - source freshness and conflict handling; - explicit
uncertainty and "not verified" messaging; - prompt injection resistance
for retrieved content; - no hidden tool instructions from external
content; - privacy filters before sending data to model providers; -
model/provider fallback and rate/cost limits; - evaluation dataset for
factuality, safety, language quality and harmful recommendations; -
human review for high-impact content; - feedback, incident and
regression monitoring.

AI must never independently: approve partner evidence, change category
readiness, confirm bookings, execute payments/refunds/payouts, promise
availability, diagnose emergencies or dispatch responders.

## 20. Notifications and communication

Support in-app and email initially; SMS/WhatsApp/push only through
approved providers and consent/contract review. Notification types
include account security, booking, payment, refund, partner action,
itinerary disruption, support and incident. Use templates, locale,
delivery status, retry policy, deduplication and user preferences. Avoid
sensitive details in lock-screen notifications.

## 21. Operations, support and governance

### 21.1 Operating model

Define owner, backup owner, operating hours, response target, escalation
and handoff for: - partner onboarding; - verification/compliance; -
content/source updates; - booking support; -
payment/refund/reconciliation; - complaints/disputes; - safety
incidents; - security incidents; - AI quality; - platform reliability.

A feature cannot go live without an operational owner and a documented
fallback.

### 21.2 Support readiness

Publish actual support hours, languages and response expectations. Do
not advertise 24/7 if not staffed. Define ticket categories, severity,
SLA, evidence handling, escalation and closure.

### 21.3 Governance

Maintain: - `DECISIONS.md`; - `REQUIREMENTS.md` or feature register; -
`RISK_REGISTER.md`; - `DATA_DICTIONARY.md`; - `API_CONTRACTS/`; -
`ADR/`; - `RUNBOOKS/`; - `SECURITY/THREAT_MODEL.md`; -
`TEST_EVIDENCE/`; - `RELEASE_NOTES.md`.

Changes to scope, money flow, data collection, legal claims, provider,
category readiness or security controls require documented review and
owner approval.

## 22. Legal and external approval register

This is a planning checklist, not legal advice. Obtain advice from
qualified Nepal counsel/accountants and relevant authorities.

Track applicability and evidence for: - company registration and
permitted business activities; - tourism/travel agency and tour operator
rules; - trekking, guide, porter and mountaineering rules; - transport
and aviation intermediary restrictions; - accommodation/homestay and
local registration requirements; - food/restaurant and marketplace
seller obligations; - consumer protection, advertising and price
disclosure; - payment collection, marketplace settlement, refunds and
wallet/e-money rules; - tax, VAT, invoices and accounting; - privacy,
cybersecurity, data transfers and retention; - insurance and
liability; - employment/contractor arrangements; - intellectual
property, map/media licences and content rights; - emergency/SOS
representations and duty of care; - terms, privacy notice, cancellation
and dispute policies.

Each item requires: question, jurisdiction, category, authority/counsel,
written response, evidence reference, effective date, expiry/review
date, owner and launch gate. No feature goes live based on a verbal
assumption.

------------------------------------------------------------------------

# PART III --- DELIVERY PLAN

## 23. Delivery model

There are **18 phases, Phase 00 through Phase 17**. This is a
phase-by-phase delivery plan, not a milestone-based implementation
contract. Phases may overlap only where dependencies and evidence
permit. Do not begin dependent transactional activation before upstream
gates pass.

### Definition of Done for every feature

A feature is complete only when: 1. requirement and acceptance criteria
are linked to its feature ID; 2. UX flow, responsive designs and all
states are approved; 3. schema/migrations and data ownership are
documented; 4. API contract and authorization are implemented; 5.
frontend/backend behaviour is complete; 6. unit, integration, E2E and
negative tests pass; 7. accessibility and localization checks pass; 8.
security and privacy impact is reviewed; 9. observability and audit
events exist; 10. documentation and runbook are updated; 11.
deployment/rollback plan is tested where applicable; 12. evidence is
attached and owner accepts the phase report.

## 24. Master feature register --- 240 modules

### Phase 00 --- Product discovery, governance and technical foundation (12)

-   PH00-F001 Product vision, positioning and measurable outcomes
-   PH00-F002 Traveler and partner persona validation
-   PH00-F003 Before/during/after journey maps
-   PH00-F004 31-category taxonomy and category ownership
-   PH00-F005 Product requirement and acceptance-criteria template
-   PH00-F006 Feature register with unique IDs and phase ownership
-   PH00-F007 Decision log and unresolved-decision workflow
-   PH00-F008 Risk, dependency and assumption register
-   PH00-F009 Content source and verification policy
-   PH00-F010 Legal, licensing, insurance and tax question register
-   PH00-F011 Pilot-region and pilot-category selection framework
-   PH00-F012 AI coding-agent operating contract and evidence-report
    format

### Phase 01 --- Premium brand, UI/UX and design system (16)

-   PH01-F001 Brand strategy, positioning and voice
-   PH01-F002 Logo system and asset rules
-   PH01-F003 Semantic colour tokens and contrast
-   PH01-F004 Typography with Nepali/Latin font testing
-   PH01-F005 Spacing, grid, sizing, elevation and radius tokens
-   PH01-F006 Iconography and illustration direction
-   PH01-F007 Photography and media art direction
-   PH01-F008 Reusable component library
-   PH01-F009 Navigation, header, footer and responsive menu
-   PH01-F010 Mobile/tablet/desktop layout system
-   PH01-F011 Light/dark themes and contrast
-   PH01-F012 Forms, validation, feedback and notification patterns
-   PH01-F013 Tables, filters, search, cards and map patterns
-   PH01-F014 Design tokens and developer handoff
-   PH01-F015 Interaction, motion and micro-interaction guidelines
-   PH01-F016 Accessibility-first design patterns, WCAG 2.2 AA target

### Phase 02 --- Platform foundation, database and developer experience (14)

-   PH02-F001 Repository structure and package boundaries
-   PH02-F002 Environment configuration and validation
-   PH02-F003 Reproducible local development
-   PH02-F004 PostgreSQL schema and migration framework
-   PH02-F005 Constraints, indexes and transaction policy
-   PH02-F006 Domain layer and service boundaries
-   PH02-F007 API framework and versioning
-   PH02-F008 Typed validation and shared schemas
-   PH02-F009 Error model and correlation IDs
-   PH02-F010 Logging, metrics and tracing baseline
-   PH02-F011 File/object storage abstraction
-   PH02-F012 Background job/event-processing foundation
-   PH02-F013 CI, code quality and dependency scanning
-   PH02-F014 Seed data, fixtures and test infrastructure

### Phase 03 --- Identity, accounts, roles and consent (12)

-   PH03-F001 Traveler registration and account creation
-   PH03-F002 Email/phone verification and OTP lifecycle
-   PH03-F003 Secure login, logout and sessions
-   PH03-F004 Password management and recovery
-   PH03-F005 MFA for privileged accounts
-   PH03-F006 Role-based access control
-   PH03-F007 Organization and partner membership
-   PH03-F008 Tenant and record-level isolation
-   PH03-F009 Profile and traveler preferences
-   PH03-F010 Consent, privacy and notification preferences
-   PH03-F011 Export, correction, deletion and retention workflow
-   PH03-F012 Session/device management and suspicious-login controls

### Phase 04 --- Catalogue, destination content and information intelligence (16)

-   PH04-F001 31-category catalogue and metadata
-   PH04-F002 Category/location availability status
-   PH04-F003 Status history and audit trail
-   PH04-F004 Category-specific information templates
-   PH04-F005 Destination profiles and editorial pages
-   PH04-F006 Province/district/municipality/locality taxonomy
-   PH04-F007 Attraction and point-of-interest records
-   PH04-F008 History, culture and local etiquette
-   PH04-F009 Best-season and climate information
-   PH04-F010 Permit, visa and entry information library
-   PH04-F011 Official contact and public-service directory
-   PH04-F012 Source registry, citations and verification workflow
-   PH04-F013 Content freshness, expiry and review scheduling
-   PH04-F014 English/Nepali editorial workflow
-   PH04-F015 Media rights and moderation
-   PH04-F016 SEO metadata, canonical URLs and structured data

### Phase 05 --- Search, maps, discovery and trip planning (16)

-   PH05-F001 Global category/destination search
-   PH05-F002 Suggestions and typo tolerance
-   PH05-F003 Filters and sorting
-   PH05-F004 Map-based discovery
-   PH05-F005 Distance and geospatial search
-   PH05-F006 Nearby services discovery
-   PH05-F007 Destination comparison
-   PH05-F008 Attraction/activity discovery
-   PH05-F009 Date/guest/requirement-aware search
-   PH05-F010 Saved places and wishlists
-   PH05-F011 Trip itinerary builder
-   PH05-F012 Day-by-day schedule and timeline
-   PH05-F013 Travel time, distance and route planning
-   PH05-F014 Budget calculator and cost breakdown
-   PH05-F015 Packing/preparation checklists
-   PH05-F016 Permit/document planning checklist

### Phase 06 --- Partner onboarding, verification and supply (14)

-   PH06-F001 Partner application and business profile
-   PH06-F002 Identity and registration evidence
-   PH06-F003 Licence, permit and insurance evidence
-   PH06-F004 Document review and verification queue
-   PH06-F005 Two-person approval and separation of duties
-   PH06-F006 Category-specific partner readiness checklist
-   PH06-F007 Partner agreement and terms acceptance
-   PH06-F008 Listing creation and editing
-   PH06-F009 Listing photos, media and ownership declaration
-   PH06-F010 Staff invitations and roles
-   PH06-F011 Partner availability and operating schedule
-   PH06-F012 Suspension, restriction and reinstatement
-   PH06-F013 Partner performance and compliance history
-   PH06-F014 Assisted onboarding and audit history

### Phase 07 --- Stay inventory and booking engine (16)

-   PH07-F001 Property/accommodation listing model
-   PH07-F002 Room/unit and occupancy model
-   PH07-F003 Rate plans, taxes, fees and price breakdown
-   PH07-F004 Availability calendar and inventory rules
-   PH07-F005 Minimum/maximum stay and booking windows
-   PH07-F006 Search-to-listing availability validation
-   PH07-F007 Expiring temporary inventory holds
-   PH07-F008 Instant Booking workflow
-   PH07-F009 Approval Booking workflow
-   PH07-F010 Booking state machine and transition policy
-   PH07-F011 Confirmation and traveler notifications
-   PH07-F012 Check-in/check-out and service completion
-   PH07-F013 Modification and rescheduling
-   PH07-F014 Cancellation, no-show and partial fulfilment
-   PH07-F015 Multi-service Trip ID with independent booking records
-   PH07-F016 Booking history, vouchers and receipts

### Phase 08 --- Payments, ledger, refunds and financial operations (14)

-   PH08-F001 Payment provider adapter framework
-   PH08-F002 Payment intent and checkout session
-   PH08-F003 Payment status state machine
-   PH08-F004 Signed, idempotent webhook processing
-   PH08-F005 Double-entry financial ledger
-   PH08-F006 Booking-to-payment allocation
-   PH08-F007 Refund calculation and execution
-   PH08-F008 Partial refund and cancellation fee rules
-   PH08-F009 Commission calculation and disclosure
-   PH08-F010 Partner payout and approval
-   PH08-F011 Reconciliation and settlement reporting
-   PH08-F012 Dispute/chargeback evidence workflow
-   PH08-F013 Tax, invoice and receipt records
-   PH08-F014 Finance dashboard and financial audit log

### Phase 09 --- Adventure, trekking, guides and transport (16)

-   PH09-F001 Adventure activity catalogue/detail
-   PH09-F002 Trek route and itinerary catalogue
-   PH09-F003 Trek package and departure dates
-   PH09-F004 Peak-climbing product and expedition details
-   PH09-F005 Guide/porter profile and qualifications
-   PH09-F006 Guide availability and assignment
-   PH09-F007 Operator/agency profile
-   PH09-F008 Group size and capacity
-   PH09-F009 Equipment and inclusion/exclusion details
-   PH09-F010 Permit/restricted-area checklist integration
-   PH09-F011 Safety briefing and risk acknowledgement
-   PH09-F012 Vehicle, fleet and driver profiles
-   PH09-F013 Transport routes, schedules and seat capacity
-   PH09-F014 Airport transfer and private hire booking
-   PH09-F015 Flight search/information provider integration
-   PH09-F016 Luggage storage, transfer and tracking workflow

### Phase 10 --- Restaurants, local experiences, shopping and luggage (14)

-   PH10-F001 Restaurant profiles and menus
-   PH10-F002 Table reservation and party-size rules
-   PH10-F003 Reservation confirmation and cancellation
-   PH10-F004 Food preferences and allergen disclosure
-   PH10-F005 Local experience catalogue
-   PH10-F006 Community tourism and host experiences
-   PH10-F007 Event, workshop and festival listings
-   PH10-F008 Experience schedule, capacity and booking
-   PH10-F009 Shopping seller onboarding
-   PH10-F010 Product catalogue, variants and inventory
-   PH10-F011 Shopping cart and checkout
-   PH10-F012 Order fulfilment, delivery and tracking
-   PH10-F013 Returns, refunds and seller disputes
-   PH10-F014 Local partner settlement and payout reporting

### Phase 11 --- During-trip tools, connectivity, offline and translation (14)

-   PH11-F001 My Trip live trip dashboard
-   PH11-F002 Trip timeline and itinerary updates
-   PH11-F003 GPS sharing with explicit consent
-   PH11-F004 Route navigation and saved routes
-   PH11-F005 Licensed offline map downloads
-   PH11-F006 Offline itinerary and vouchers
-   PH11-F007 Offline emergency information pack
-   PH11-F008 Connectivity and SIM information
-   PH11-F009 eSIM catalogue and purchase flow
-   PH11-F010 Translation and phrase assistance
-   PH11-F011 Weather and official alert feed
-   PH11-F012 Travel disruption and route closure alerts
-   PH11-F013 Nearby hospital/pharmacy/ATM/bank/fuel discovery
-   PH11-F014 Sync queue and conflict-safe offline synchronization

### Phase 12 --- AI travel intelligence and personalization (12)

-   PH12-F001 AI travel assistant
-   PH12-F002 Grounded destination Q&A
-   PH12-F003 Personalized itinerary generation
-   PH12-F004 Trip plan refinement and constraint checks
-   PH12-F005 Budget-aware recommendations
-   PH12-F006 Weather/context-aware trusted-source suggestions
-   PH12-F007 Multilingual conversational assistance
-   PH12-F008 AI-assisted content drafting for human review
-   PH12-F009 Recommendation ranking and explanation
-   PH12-F010 Preference and personalization controls
-   PH12-F011 AI evaluation, feedback and quality dashboard
-   PH12-F012 AI safety, abuse, cost and provider fallback controls

### Phase 13 --- Safety, emergency, incidents and support (14)

-   PH13-F001 Safety information hub
-   PH13-F002 Verified emergency contact directory
-   PH13-F003 SOS interface and activation policy
-   PH13-F004 Incident reporting and case creation
-   PH13-F005 Severity classification and triage
-   PH13-F006 Escalation and responder assignment
-   PH13-F007 Emergency contact notification with consent
-   PH13-F008 Incident timeline and status updates
-   PH13-F009 Traveler support center and help articles
-   PH13-F010 Support ticket/live chat where staffed
-   PH13-F011 Complaint and dispute intake
-   PH13-F012 Lost-document/property assistance
-   PH13-F013 Fraud/scam reporting and abuse controls
-   PH13-F014 Post-incident follow-up and audit

### Phase 14 --- After-trip, reviews, memories, passport and rewards (12)

-   PH14-F001 Trip completion and post-trip summary
-   PH14-F002 Actual versus estimated expenditure
-   PH14-F003 Booking/payment/receipt/refund history
-   PH14-F004 Verified review invitation and submission
-   PH14-F005 Review moderation and appeal
-   PH14-F006 Partner reply and service recovery
-   PH14-F007 Digital travel passport and stamps
-   PH14-F008 Private travel memories/media album
-   PH14-F009 Shareable trip story with privacy controls
-   PH14-F010 Rewards and loyalty rules
-   PH14-F011 Separate rewards ledger and redemption
-   PH14-F012 Personalized repeat-trip recommendations

### Phase 15 --- Group travel, community and advanced features (12)

-   PH15-F001 Group trip creation and invitations
-   PH15-F002 Shared itinerary and collaborative editing
-   PH15-F003 Group member roles and permissions
-   PH15-F004 Group expense splitting and settlement records
-   PH15-F005 Travel community posts and questions
-   PH15-F006 Community moderation and reporting
-   PH15-F007 QR Scan Nepal information experience
-   PH15-F008 Hidden Nepal editorial discovery
-   PH15-F009 Companion discovery and matching
-   PH15-F010 Companion safety checks, blocking and reporting
-   PH15-F011 Sustainable/responsible travel guidance
-   PH15-F012 Accessibility and inclusive-travel preference discovery

### Phase 16 --- Mobile apps, integrations, analytics and expansion (10)

-   PH16-F001 Android application using stable API
-   PH16-F002 iOS application using stable API
-   PH16-F003 Push notification integration
-   PH16-F004 Deep links and universal links
-   PH16-F005 Partner/provider integration hub
-   PH16-F006 Public/partner API governance and webhooks
-   PH16-F007 Business intelligence and operations dashboards
-   PH16-F008 Multi-currency display and exchange-rate source
-   PH16-F009 Corporate/group travel account support
-   PH16-F010 New destination and international-market configuration

### Phase 17 --- Production hardening, launch and continuous operations (6)

-   PH17-F001 Production deployment and environment promotion
-   PH17-F002 Security assessment and penetration testing
-   PH17-F003 Performance, load, stress and soak testing
-   PH17-F004 Backup, disaster recovery and restore drills
-   PH17-F005 Monitoring, alerting, SLOs and incident response
-   PH17-F006 Controlled launch, rollback and continuous improvement

**Feature register total: 240 modules.** The 31-category catalogue and
the 240 feature modules are different counting units. Dashboard count is
eight; travel lifecycle count is three; delivery phase count is 18.

## 25. Phase dependency map

-   Phase 00 establishes requirements, decisions, risks and gates.
-   Phase 01 establishes brand, design system and UI/UX rules; design
    continues in every phase.
-   Phase 02 establishes architecture, data, CI and developer workflow.
-   Phase 03 is required before personal accounts, partner portals and
    transactions.
-   Phase 04 provides canonical categories, destination data and source
    governance.
-   Phase 05 consumes catalogue/location data for discovery and trip
    planning.
-   Phase 06 establishes verified supply and partner readiness.
-   Phase 07 implements booking and inventory; must pass concurrency and
    failure tests.
-   Phase 08 enables real money only after legal/provider/accounting
    approvals and booking invariants pass.
-   Phases 09--10 activate service-specific categories independently
    after category readiness.
-   Phase 11 requires licensed maps/connectivity providers and offline
    data policy.
-   Phase 12 AI must be grounded, evaluated and bounded.
-   Phase 13 emergency/SOS activation requires staffed operations and
    drills.
-   Phase 14 requires moderation, privacy and retention controls.
-   Phase 15 requires abuse, safety and community moderation.
-   Phase 16 adds native apps and approved integrations after stable API
    governance.
-   Phase 17 hardens and launches; it does not replace quality work in
    earlier phases.

## 26. Phase acceptance evidence

Each phase report must include: - phase ID and exact scope; - feature
IDs completed/not completed; - requirement-to-code traceability; -
repository branch and commit hash; - changed files and migrations; -
exact commands run; - test counts and pass/fail/skip output; - real
database and integration evidence where required; - browser/device and
responsive screenshots; - accessibility and localization results; -
security/authorization checks; - performance observations; - known
defects and risk; - `PENDING`/`GATED` items; - rollback and operational
runbook; - evidence references; - owner decision/approval required.

No report may say "all tests pass" without listing the commands and
actual output. No phase may be marked complete if its exit criteria are
unmet.

------------------------------------------------------------------------

# PART IV --- QUALITY, RELIABILITY AND LAUNCH

## 27. Testing strategy

### 27.1 Test layers

-   Static checks: formatting, lint, typecheck, dependency and secret
    scanning.
-   Unit tests: domain rules, state transitions, pricing, permissions.
-   Integration tests: database, queue, storage, provider adapters and
    webhooks.
-   API contract tests: schema, auth, validation and error contract.
-   E2E tests: traveler, partner, admin and finance journeys.
-   Visual regression: approved design states and responsive
    breakpoints.
-   Accessibility: automated plus manual keyboard/screen-reader checks.
-   Security: authorization, IDOR/BOLA, injection, CSRF, XSS, SSRF,
    upload and rate-limit tests.
-   Performance: baseline, load, stress, soak and capacity tests.
-   Recovery: backup restore, queue replay, provider outage and
    deployment rollback.
-   Localization: Nepali text rendering, long strings, dates, numbers
    and locale routing.

### 27.2 Critical scenarios

-   two users attempt the final inventory unit simultaneously;
-   duplicate checkout and duplicate webhook;
-   payment success but booking transaction fails;
-   booking confirmed but notification fails;
-   partner approval expires during checkout;
-   quote expires or price changes;
-   refund requested after partial fulfilment;
-   partner suspended with future bookings;
-   user loses network during payment;
-   queue worker crashes after side effect;
-   provider outage or slow response;
-   user attempts access to another tenant's booking/document;
-   admin/finance user attempts an unauthorized approval;
-   stale emergency/route information;
-   offline sync conflict;
-   account deletion request with active legal/financial records.

### 27.3 Release blockers

Any critical security vulnerability, cross-tenant data exposure,
unreconciled financial mismatch, overbooking race, unapproved payment
flow, missing audit trail for money/admin action, false emergency
promise, invalid legal gate, data-loss risk or unresolved critical
defect blocks release.

## 28. Reliability and DevOps

-   CI must run lint, typecheck, unit/integration tests, build and
    security checks.
-   Protect main branch; require review and green checks.
-   Use immutable build artifacts and controlled environment promotion.
-   Database migrations must be backward-compatible where rolling deploy
    requires it.
-   Health checks must distinguish liveness and readiness.
-   Use structured logs with correlation IDs and redaction.
-   Monitor error rate, latency, saturation, queue age, job failures,
    payment failures, webhook lag, booking conflicts and reconciliation
    drift.
-   Define SLOs, RPO and RTO after hosting and business impact review;
    do not invent targets as commitments.
-   Backups must be encrypted and restore-tested.
-   Define incident severity, on-call ownership, escalation and
    postmortem.
-   Feature flags must have owner, purpose, expiry/review date and audit
    history.

## 29. Analytics and metrics

Product analytics must be privacy-conscious and avoid sensitive data.
Define events and metrics for: - acquisition and onboarding
completion; - search-to-detail and detail-to-booking conversion; -
category/location availability; - partner onboarding and verification
time; - quote abandonment; - booking confirmation, cancellation and
no-show; - payment success/failure and reconciliation variance; - refund
cycle time; - support response/resolution; - review completion and
moderation; - AI answer quality, citation coverage and escalation; -
reliability, latency and error budgets.

Do not optimize conversion by hiding fees, safety warnings or
cancellation terms.

## 30. Pilot and launch

### 30.1 Pilot selection

Choose region/category using verified supply, legal readiness,
operational staffing, demand evidence, manageable geography, partner
quality and support capacity. Record why each alternative was rejected.

### 30.2 Pilot gates

-   legal and provider approvals documented;
-   partner verification complete;
-   listing and inventory accuracy tested;
-   payment/refund/reconciliation tested in sandbox and approved
    production path;
-   support and incident operations staffed;
-   user terms/privacy/cancellation policy approved;
-   security and accessibility checks passed;
-   monitoring, backup and rollback ready;
-   pilot success metrics and stop conditions agreed.

### 30.3 Controlled rollout

Use internal testing, invited pilot, limited public availability and
gradual expansion. Define kill switches by category, location, provider
and payment method. Preserve existing bookings and support records when
disabling new transactions.

## 31. Budget and commercial model

Do not invent a total project budget or revenue forecast. Build a
bottom-up model including: - engineering/design/QA/operations
staffing; - hosting, database, storage, queue, CDN and monitoring; -
maps, geocoding, routing and offline licensing; -
email/SMS/WhatsApp/push; - AI model and retrieval costs; - payment
gateway, refund and settlement fees; - legal, accounting, tax and
compliance; - insurance and partner onboarding; - customer support and
incident operations; - app store, domain and security assessment.

Revenue candidates include commission, service fees, partner
subscriptions, promoted listings with disclosure, B2B tools and other
approved models. Each requires owner approval, unit economics and legal
review. Never assume a commission percentage or payment flow.

## 32. Owner decisions register

The following remain PENDING until explicitly decided: - pilot region
and first live category; - final eight dashboard labels and ownership; -
category-level transactional classification; - final tagline and visual
identity; - company structure and business activities; - commission
basis and rates; - support hours/languages and staffing; - payment
provider(s), merchant eligibility and settlement flow; - lawful handling
of collected funds; - booking approval response windows and hold
duration by category; - refund/cancellation/no-show policy; - tax and
invoice treatment; - hosting/database/queue/storage/monitoring
providers; - exact runtime, framework and PostgreSQL versions after
repository compatibility review; - Next.js route handlers versus
separate NestJS API; - authentication provider; - map/geocoding/routing
and offline map licences; - AI provider, model, budget and
data-processing terms; - retention, deletion and cross-border data
policy; - SLO/RPO/RTO; - native app timing; - companion matching and SOS
activation; - final partner verification rules per category.

Every decision must have an ADR or decision-log entry and must not be
silently assumed by an AI coding agent.

------------------------------------------------------------------------

# PART V --- GOOGLE AI IMPLEMENTATION CONTRACT

## 33. Required operating procedure

Google AI (or any coding agent) must follow this sequence:

1.  Read this entire blueprint and relevant companion specifications.
2.  Inspect the actual repository, branch, commit, package files,
    runtime and database migrations.
3.  Report the verified baseline before changing code.
4.  Compare existing implementation with the exact phase feature IDs.
5.  Identify conflicts and propose a decision; do not silently resolve
    owner decisions.
6.  Produce the phase UI/UX design and acceptance criteria before
    implementing user-facing screens.
7.  Implement only the approved phase scope.
8.  Add migrations, constraints, authorization and tests with each
    feature.
9.  Run exact test commands and capture output.
10. Verify with real PostgreSQL and provider sandbox where the phase
    requires it.
11. Review security, accessibility, localization and responsive
    behaviour.
12. Update documentation, decision register and traceability.
13. Report incomplete work honestly.
14. Stop at the phase boundary and wait for owner approval before
    starting the next phase.

### 33.1 Repository safety

-   Do not delete working features to simplify implementation.
-   Do not rewrite the project without a documented reason and approval.
-   Do not change package versions blindly.
-   Do not run destructive database commands against production.
-   Do not commit `.env`, secrets, real customer data or provider
    credentials.
-   Do not fabricate test results, screenshots, commits or deployment
    status.
-   Reproduce a defect before claiming it exists; cite file path,
    symbol, command and evidence.
-   Keep unrelated refactors out of a phase.
-   Never bypass booking gates, DB constraints, permission checks,
    financial invariants or audit logs.

### 33.2 Required phase completion report

``` text
PHASE:
FEATURE IDS:
REPOSITORY:
BRANCH:
COMMIT:

1. Requirements reviewed:
2. Existing baseline verified:
3. UI/UX screens and states completed:
4. Frontend changes:
5. Backend/domain changes:
6. Database migrations and constraints:
7. API contracts:
8. Authorization/security controls:
9. Integrations and provider sandbox:
10. Tests executed (exact commands):
11. Test output (pass/fail/skip):
12. Real database verification:
13. Browser/device/responsive verification:
14. Accessibility/localization verification:
15. Monitoring/audit/documentation:
16. Files changed:
17. Known defects and limitations:
18. PENDING items:
19. GATED items:
20. Evidence references:
21. Rollback/recovery plan:
22. Owner decision or approval required:
23. Phase exit recommendation: PASS / PASS WITH CONDITIONS / FAIL
```

## 34. Final completeness checklist

-   [ ] 31 categories exist in one canonical registry.
-   [ ] 240 feature modules have unique IDs and phase ownership.
-   [ ] Eight dashboards have approved role/permission mapping.
-   [ ] Before/during/after journeys are covered.
-   [ ] Category status and booking gates are enforced server-side.
-   [ ] Partner verification is category-specific and auditable.
-   [ ] Booking, inventory, payment and payout states are separate.
-   [ ] Concurrency and idempotency tests prevent duplicate
    bookings/charges.
-   [ ] Financial ledger balances and reconciliation works.
-   [ ] Refund, cancellation, no-show and dispute workflows are defined.
-   [ ] Privacy, retention, export and deletion workflows exist.
-   [ ] Security threat model and access-control tests pass.
-   [ ] AI answers are grounded, evaluated and bounded.
-   [ ] SOS and support claims match real staffing.
-   [ ] Maps, media and offline data have valid licences.
-   [ ] English/Nepali and future locale architecture is tested.
-   [ ] WCAG 2.2 AA target is evaluated.
-   [ ] Mobile/tablet/desktop UI states are tested.
-   [ ] Backups and restore drills are evidenced.
-   [ ] Monitoring, incident response and rollback are ready.
-   [ ] Legal/provider/accounting gates have documentary evidence.
-   [ ] Phase reports contain reproducible evidence.
-   [ ] No critical/high release blocker remains for the launch scope.

------------------------------------------------------------------------

## Appendix A --- Service-specific contract checklist

Every one of the 31 categories must have a separate service
specification containing:

1.  category owner and purpose;
2.  information-only or transactional classification;
3.  user types and permissions;
4.  partner types and verification requirements;
5.  listing fields and media rules;
6.  geography and availability rules;
7.  inventory/capacity model;
8.  quote and pricing components;
9.  tax/fee/currency policy;
10. booking mode and state transitions;
11. cancellation, no-show and refund policy;
12. payment and payout dependencies;
13. before/during/after information;
14. safety and incident considerations;
15. required official sources and freshness;
16. notifications and support ownership;
17. moderation/fraud/abuse risks;
18. analytics events;
19. UI screens and all states;
20. API and database entities;
21. test scenarios and acceptance evidence;
22. legal/provider/operational gates.

### Category-specific inventory starting points

-   Hotels/resorts/homestays: room/unit × date × occupancy × rate plan.
-   Adventures/experiences: session/departure × capacity × participant
    requirements.
-   Trekking/climbing: departure × group capacity ×
    guide/operator/permit readiness.
-   Guides/porters: person availability × date/time ×
    qualification/category.
-   Transport: route/trip × vehicle/seat × schedule.
-   Flights: provider itinerary/seat data; never claim inventory without
    provider confirmation.
-   Luggage: location × time slot × capacity × custody record.
-   Restaurants: table/party size × date/time slot; restaurant
    confirmation required.
-   Shopping: SKU/variant × quantity × fulfilment location.
-   eSIM: provider plan × region/device compatibility × activation
    entitlement.
-   Nearby services/weather/permit/route information: source freshness,
    not bookable inventory.
-   Digital passport/memories/reviews/rewards/community: user/content
    records with privacy, moderation and abuse controls.

## Appendix B --- Minimum required companion documents

The master blueprint is not a substitute for detailed engineering
artefacts. Produce and maintain: - Product Requirements Document and
acceptance matrix; - UI/UX design system and screen inventory; - system
context and deployment diagrams; - domain model and ERD; - data
dictionary and migration plan; - OpenAPI specification; - booking
state-machine specification; - payment/ledger accounting
specification; - category-specific service contracts (31); -
role-permission matrix; - threat model and security test plan; -
privacy/data inventory and retention schedule; - AI
RAG/evaluation/safety specification; - integration/provider contracts; -
observability/SLO and runbooks; - disaster recovery and business
continuity plan; - QA strategy and traceability matrix; - legal/provider
decision register; - launch readiness checklist.

**End of Master Blueprint.**
