# PheriNepal — Phase 00 Master Product Discovery & Governance Specification (`PH00_GOVERNANCE_FOUNDATION.md`)

**Document ID:** PNP-GOV-PH00-SPEC-001  
**Blueprint Reference:** Master Blueprint (`PNP-MASTER-ARCH-001` v1.0, Parts I–V)  
**Phase Scope:** `PH00` only (`PH00-F001` through `PH00-F012`)  
**Phase Status:** `PARTIAL` (All repository artefacts, governance registers, and verification scripts implemented; awaits explicit Product Owner / Founder sign-off per Rule #11).

---

## 1. Product Vision, Positioning & Measurable Outcomes (`PH00-F001`)

### 1.1 Vision & Positioning (Blueprint Section 1.1)
- **Vision Statement:** PheriNepal is a Nepal-focused travel platform that helps a traveler plan, discover, arrange, experience, and remember a trip through one coherent account and trip workspace.
- **Brand Line:** *Your Complete Nepal Travel Companion.* (`तपाईंको सम्पूर्ण नेपाल यात्रा साथी।` — Subject to Owner approval in `DEC-004`)
- **Lifecycle Line:** *Before You Go. While You Explore. After You Return. PheriNepal Is With You.*
- **Product Idea:** *One Account. One Trip. One Support System. Entire Nepal.*

### 1.2 Product Promise & Public Claim Boundaries (Blueprint Section 1.2)
PheriNepal aims to deliver six core outcomes:
1. Clear, current, source-attributed service and destination information.
2. Transparent, complete pricing before financial commitment (base price, mandatory fees, 13% VAT, cancellation terms, currency in integer minor units).
3. Partner identity and category-appropriate documentary verification with expiry tracking and two-person approval for high-risk categories.
4. Traceable booking, inventory hold, payment, refund, and support records.
5. Trip information usable before and during travel (including low-connectivity/offline contexts).
6. A useful post-trip record, actual-vs-estimated expenditure summary, digital travel passport, and booking-verified review loop.

> **Mandatory Claim Boundary:** These are product objectives, not claims that every category or partner is currently live. Public surfaces must reflect actual live coverage (`AVAILABLE`, `INFORMATION_ONLY`, `COMING_SOON`, `TEMPORARILY_UNAVAILABLE`, `RESTRICTED`).

### 1.3 Seven Trust Principles (Blueprint Section 1.3)
1. **Truthful availability:** Display accurate category and location gate status from one canonical registry.
2. **Verified supply:** Define verification evidence by service category, expiry timestamp, and re-check frequency.
3. **Financial integrity:** Quote, charge, refund, commission, and partner payout records must reconcile in an append-only double-entry ledger.
4. **Safety first:** Publish official publisher, UTC verification timestamp, coverage scope, and limitations for all safety/weather/emergency information.
5. **Privacy by design:** Collect minimum personal data, isolate optional consent from required terms, and enforce auto-expiring location sharing.
6. **Local inclusion:** Support Nepali-first (`नेपाली`) partner workflows, assisted onboarding, and low-connectivity resilience.
7. **Human accountability:** Identify a named operational owner role and backup owner for every workflow and category.

### 1.4 Measurable Outcomes & Privacy-Conscious Metric Definitions (Blueprint Section 29)
No vanity or fabricated scores are permitted. Platform outcomes are measured using these 12 privacy-redacted operational metrics:

| Outcome ID | Metric Name | Formula / Definition | Target Direction | Guardrail / Anti-Gaming Rule |
| :--- | :--- | :--- | :--- | :--- |
| `OUT-01` | **Category Status Truthfulness Rate** | `% of 31 categories whose UI/API actions strictly match their canonical state machine gate` | `100%` (Mandatory Invariant) | Zero checkout buttons or prices on `COMING_SOON`, `INFORMATION_ONLY`, or `RESTRICTED` categories. |
| `OUT-02` | **Pre-Commitment Price Transparency Coverage** | `% of quotes showing complete base + mandatory fees + VAT + policy snapshot prior to checkout` | `100%` (Mandatory Invariant) | Never hide fees or cancellation penalties to inflate conversion (Section 29). |
| `OUT-03` | **Partner Verification Turnaround & Expiry Compliance** | `Median hours from document submission to two-person decision; % of active listings with non-expired licences` | `100%` non-expired licences on active supply | Gate #7 automatically blocks quotes if `licenceExpiryUtc <= now`. |
| `OUT-04` | **Inventory Concurrency Integrity** | `Count of overbooking race incidents under simultaneous final-unit booking attempts` | `0` (Release Blocker) | Enforced by atomic server-side lock and idempotency keys. |
| `OUT-05` | **Financial Ledger Reconciliation Variance** | `Absolute difference (in paisa) between Total Debits and Total Credits across all journal entries` | `0 paisa` (Release Blocker) | Append-only double-entry ledger rejects unbalanced journals. |
| `OUT-06` | **Search-to-Detail & Detail-to-Quote Conversion** | `Ratio of discovery searches reaching verified listing details and server-calculated quotes` | Measured per pilot category | Must disclose availability freshness and data source. |
| `OUT-07` | **Approval-Booking Partner Response Rate** | `% of APPROVAL mode requests accepted/declined within the configured response window (e.g. 24h)` | `>= 90%` within SLA window | Expired requests automatically release inventory holds. |
| `OUT-08` | **Refund Execution Cycle Time** | `Time from approved cancellation/dispute resolution to refund journal entry and provider initiation` | Within published policy SLA | No negative or over-refund beyond captured amount. |
| `OUT-09` | **Support First-Response & Resolution SLA** | `% of tickets triaged within published operating hours (08:00–20:00 NPT)` | Within staffed SLA target | Never advertise 24/7 response unless 24/7 staffing is approved (`DEC-007`). |
| `OUT-10` | **Official Source Freshness Compliance** | `% of official permit, visa, weather, and emergency records reviewed on or before nextReviewDate` | `100%` current or flagged stale | Stale records cannot be presented as definitive safety advice. |
| `OUT-11` | **AI Grounding Citation Coverage** | `% of AI assistant responses citing at least one verified [SRC-*] record with UTC timestamp` | `100%` of domain answers | AI is strictly blocked from booking, money, verification, or emergency dispatch actions. |
| `OUT-12` | **Verified Review Authenticity Rate** | `% of published reviews cryptographically linked to a COMPLETED booking ID` | `100%` (Mandatory Invariant) | Unverified users cannot submit service rating reviews (`PH14-F004`). |

---

## 2. Traveler & Partner Persona Validation Framework (`PH00-F002` & Blueprint Section 3)

> **Rule (Section 3):** Personas are role and workflow descriptions, not assumptions about identity or ability. Every persona below distinguishes between its **Workflow Architecture Specification** (`DEFINED`) and its **Empirical User Interview & Usability Validation Status** (`VALIDATION_PENDING` until field research is recorded).

| # | Persona ID | Persona Role Name | Primary Workflow & Needs | Primary Dashboard(s) | Empirical Field Interview Status | Validation Protocol Required Before Transactional Launch |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `PRS-01` | **International Traveler** | Visa/permit clarity, verified high-altitude guides, transparent multi-currency/NPR pricing, offline vouchers, emergency directory. | `D01` Traveler Dashboard | `VALIDATION_PENDING` | 5+ usability interviews across pre-trip permit planning and checkout fee transparency. |
| 2 | `PRS-02` | **Nepali Domestic Traveler** | Weekend/festival stays, family transport seats, restaurant reservations, local NPR payment options, Nepali/English toggle. | `D01` Traveler Dashboard | `VALIDATION_PENDING` | 5+ domestic traveler sessions testing Nepali Unicode search and instant booking flow. |
| 3 | `PRS-03` | **Nepali Diaspora Traveler** | Multi-generational heritage/pilgrimage trip planning, verified green-plate private hire, transparent cancellation terms. | `D01` Traveler Dashboard | `VALIDATION_PENDING` | 3+ diaspora planning interviews testing multi-service `Trip ID` grouping. |
| 4 | `PRS-04` | **Hotel / Resort Operator** | Room/rate-plan inventory calendar, DoT/PAN document upload, instant vs approval booking rules, VAT-reconciled payout statements. | `D02` Partner Dashboard | `VALIDATION_PENDING` | Field onboarding test with 3+ Kathmandu/Pokhara properties (`PH06`). |
| 5 | `PRS-05` | **Homestay Host** | Nepali-first (`नेपाली`) simple availability calendar, community committee registration upload, assisted onboarding, meal-plan pricing. | `D02` Partner Dashboard | `VALIDATION_PENDING` | Field usability test with rural homestay committee hosts in low-bandwidth conditions (`ASM-004`). |
| 6 | `PRS-06` | **Guide / Porter** | NATHM/DoT licence & high-altitude insurance verification badge, assignment calendar, group capacity limits, incident escalation. | `D03` Guide & Operator Dashboard | `VALIDATION_PENDING` | Usability sessions with NATHM-licensed trekking guides and porters. |
| 7 | `PRS-07` | **Transport Operator / Driver** | Green-plate vehicle bluebook & commercial licence upload, route/seat capacity schedule, highway disruption notifications. | `D02` Partner / `D03` Guide & Operator | `VALIDATION_PENDING` | Field verification with tourist bus / EV Hiace operators. |
| 8 | `PRS-08` | **Adventure / Trekking / Climbing Operator** | Departure dates, TIMS/RAP/NMA permit checklists, two-person safety review submission, weather-disruption rescheduling. | `D02` Partner / `D03` Guide & Operator | `VALIDATION_PENDING` | Workflow review with TAAN/NMA registered agencies. |
| 9 | `PRS-09` | **Restaurant / Local Experience Partner** | Table/party-size approval bookings, allergen disclosures, cultural workshop session capacity. | `D02` Partner Dashboard | `VALIDATION_PENDING` | Onboarding walkthrough with local dining and cultural workshop hosts. |
| 10 | `PRS-10` | **Shopping Seller** | Authentic Nepali craft / GI origin declaration, SKU variant stock, export/return policies (`COMING_SOON` in PH10). | `D02` Partner Dashboard | `VALIDATION_PENDING` | Deferred until `shopping` (#14) phase readiness gate (`PH10`). |
| 11 | `PRS-11` | **Customer Support / Operations Staff** | Ticket triage within published operating hours (08:00–20:00 NPT), disruption coordination, lost-found moderation, escalation SOPs. | `D07` Support & Safety Dashboard | `VALIDATION_PENDING` | Internal tabletop exercise on route closure and booking dispute SOPs. |
| 12 | `PRS-12` | **Verification / Compliance Staff** | Document review queue, licence expiry monitoring, two-person Separation of Duties (SoD) approval, partner restriction/suspension. | `D05` Verification & Compliance Dashboard | `VALIDATION_PENDING` | Internal compliance drill testing two-person approval and SoD rejection. |
| 13 | `PRS-13` | **Finance Staff** | Double-entry ledger inspection, payment gateway settlement reconciliation, refund approvals, commission & partner payout sign-off. | `D06` Finance & Ledger Dashboard | `VALIDATION_PENDING` | Internal accounting walkthrough of integer minor unit (paisa) journal entries. |
| 14 | `PRS-14` | **Content / Editorial Staff** | Destination profiles, Official Source Registry (`SRC-*`) freshness verification, English/Nepali translation, review moderation, AI evaluation. | `D08` Content & Intelligence Dashboard | `VALIDATION_PENDING` | Editorial workflow test verifying citation timestamps and stale-source flags. |
| 15 | `PRS-15` | **Administrator / Owner** | Global Booking Kill Switch, 31-category status transitions, Owner Decisions Register (`DECISIONS.md`), MFA-protected audit log review. | `D04` Admin & Governance Dashboard | `VALIDATION_PENDING` | Owner walkthrough of MFA-protected category status transitions and kill switch. |

---

## 3. Before / During / After Travel Lifecycle Journey Maps (`PH00-F003` & Blueprint Section 7)

### 3.1 Stage 1: BEFORE Travel (`BEFORE`)
- **Objective:** Discover verified destinations and services, understand official permits/visas/seasons, obtain transparent immutable quotes, and complete status-gated bookings under one unified `Trip ID`.
- **Journey Steps & System Touchpoints:**
  1. **Discovery & Honest Catalogue Inspection:** Traveler browses destinations and all 31 categories. Categories in `COMING_SOON`, `INFORMATION_ONLY`, or `RESTRICTED` display their truthful state and block checkout (`PH04-F001`, `PH05-F001`).
  2. **Route, Season & Official Permit/Visa Check:** Traveler reviews official NTB/DoIM visa fees (`SRC-DOIM-01`), TIMS/National Park rules (`SRC-NTB-01`), and packing/document checklists (`PH04-F010`, `PH05-F015`, `PH05-F016`).
  3. **Partner Verification Badge Inspection:** Every bookable listing explains *what* documentary evidence was checked (e.g., DoT Licence, TAAN/NMA certificate, Green-Plate Bluebook, Insurance) and *when* (`Section 13`).
  4. **Server-Calculated Quote & Budget Breakdown:** Server computes base price, mandatory fees, 13% VAT, and platform commission in integer minor units (paisa), attaches a versioned cancellation policy snapshot, and sets a 15-minute quote expiry (`PH07-F003`, `Section 12.4`).
  5. **12-Point Mandatory Booking Gate & Atomic Hold:** On checkout request, server evaluates all 12 Mandatory Booking Gates (`Section 11.4`), atomically decrements available capacity into `HELD` state, and processes the permitted payment flow (`INSTANT` → `CONFIRMED` + double-entry ledger journal; `APPROVAL` → `PENDING_PARTNER` + `AUTHORIZED` payment hold).
  6. **Offline Preparation:** Traveler saves printable/cached vouchers, itinerary timeline, and the public Emergency Contact Directory (100 / 1144 / 102) prior to departure (`PH11-F006`, `PH11-F007`).

### 3.2 Stage 2: DURING Travel (`DURING`)
- **Objective:** Navigate active trip schedules, access offline vouchers and provider contacts, receive timestamped weather/route advisories, control location privacy, and escalate support issues safely.
- **Journey Steps & System Touchpoints:**
  1. **Live Trip Timeline & Vouchers:** Traveler accesses independent service vouchers (`PNP-VCH-*`) grouped under `Trip ID`, check-in/check-out windows, and verified partner contact numbers (`PH11-F001`, `PH11-F002`).
  2. **Opt-In, Purpose-Limited, Time-Limited Location Sharing:** GPS location sharing defaults to `OFF`. If the traveler explicitly opts in, sharing automatically expires after 4 hours and can be revoked immediately (`PH11-F003`, `Section 14 & 16`).
  3. **Timestamped Weather & Route Disruption Advisories:** Displays official DHM/CAAN bulletins (`SRC-DHM-01`) with UTC timestamps and explicit disclaimers that advisories are not real-time life-safety guarantees (`PH11-F011`, `PH11-F012`).
  4. **Language, Connectivity & Nearby Essential Services:** Bilingual Nepali phrase assistance (`PH11-F010`), official SIM KYC guide (`sim-info` #12), and nearby hospital/pharmacy/ATM discovery with last-verified timestamps (`nearby-services` #10).
  5. **Support Ticket, Incident Reporting & Emergency Boundary:** Traveler can log route disruptions, booking disputes, or lost-document cases (`PH13-F004`, `PH13-F012`) handled during staffed hours (`08:00–20:00 NPT`). Category `sos` (#21) clearly states it is `GATED` and directs life-safety emergencies immediately to Nepal Police (`100`), Tourist Police (`1144`), and Ambulance (`102`).

### 3.3 Stage 3: AFTER Travel (`AFTER`)
- **Objective:** Reconcile actual vs estimated trip expenditure, access receipts/refund records, submit booking-verified reviews, preserve private memories/passport stamps, and follow up on disputes.
- **Journey Steps & System Touchpoints:**
  1. **Trip Completion & Financial Summary:** Booking transitions to `COMPLETED`; traveler views actual vs estimated expenditure and downloadable tax/payment receipts (`PH14-F001`, `PH14-F002`, `PH14-F003`).
  2. **Booking-Verified Review Invitation & Moderation:** Only travelers with a `COMPLETED` booking record receive a review eligibility token (`PH14-F004`). Submitted reviews pass moderation (`PH14-F005`) and allow an audited partner reply (`PH14-F006`).
  3. **Complaint, Refund & Dispute Follow-Up:** Any partial fulfilment, weather cancellation, or service dispute is tracked through the Support & Finance dashboards with double-entry refund reversal journals (`PH08-F007`, `PH13-F011`).
  4. **Digital Travel Passport & Private Memories:** Completed stays/treks unlock verifiable destination stamps in the traveler's Digital Travel Passport (`passport` #23, `PH14-F007`), while user media albums (`memories` #24, `PH14-F008`) remain private by default with explicit sharing and deletion controls.
  5. **Gated Loyalty / Rewards Boundary:** Category `rewards` (#26) remains explicitly `RESTRICTED / GATED` until financial/tax accounting rules are approved (`DEC-026`).

---

## 4. 31-Category Taxonomy & Category Ownership Matrix (`PH00-F004` & Blueprint Section 5 & 21.1)

Every one of the 31 categories lives in the single canonical registry (`src/domain/catalogue.ts`) with a named **Operational Owner Role**, **Backup Owner Role**, **Owning Phase**, and **Initial Gate Status**:

| # | Category Key | Display Category (EN / NE) | Blueprint Initial Behaviour | Transactional Flag (`DEC-003`) | Canonical PH00 Gate Status | Owning Phase | Operational Owner Role | Backup Owner Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `hotels` | Hotels & Resorts (`होटल तथा रिसोर्टहरू`) | Status-gated transactional | `true` | `AVAILABLE` (Sandbox Pilot) | `PH07` | Stay Supply Lead | Verification Lead |
| 2 | `homestays` | Homestays (`होमस्टे (घरबास)`) | Status-gated transactional | `true` | `AVAILABLE` (Sandbox Pilot) | `PH07` | Community Stay Lead | Partner Support Lead |
| 3 | `adventures` | Adventures & Experiences (`साहसिक खेल तथा अनुभवहरू`) | Status-gated transactional | `true` | `AVAILABLE` (Sandbox Pilot) | `PH09` | Adventure Ops Lead | Safety & Compliance Lead |
| 4 | `trekking` | Trekking (`पदयात्रा (ट्रेकिङ)`) | Status-gated transactional | `true` | `AVAILABLE` (Sandbox Pilot) | `PH09` | Mountain & Trek Lead | Safety & Compliance Lead |
| 5 | `peak-climbing` | Peak Climbing (`हिमाल आरोहण`) | Restricted/status-gated | `true` | `RESTRICTED` | `PH09` | Expedition Safety Lead | Compliance Officer |
| 6 | `guides` | Guides & Porters (`गाइड तथा पोर्टरहरू`) | Status-gated transactional | `true` | `AVAILABLE` (Sandbox Pilot) | `PH09` | Guide Relations Lead | Verification Lead |
| 7 | `transport` | Transport (`यातायात सेवा`) | Status-gated transactional | `true` | `AVAILABLE` (Sandbox Pilot) | `PH09` | Fleet & Mobility Lead | Operations Lead |
| 8 | `flights` | Flights (`हवाई उडान`) | Provider-dependent; information or integration | `false` (Until GDS contract) | `INFORMATION_ONLY` | `PH09` | Aviation Integrations Lead | Commercial Lead |
| 9 | `luggage` | Luggage Services (`सामान भण्डारण तथा ढुवानी`) | Status-gated transactional | `true` | `COMING_SOON` | `PH09` | Logistics Ops Lead | Partner Support Lead |
| 10 | `nearby-services` | Nearby Services (`नजिकैका अत्यावश्यक सेवाहरू`) | Information/discovery | `false` | `INFORMATION_ONLY` | `PH11` | Geo & Directory Lead | Content Editor |
| 11 | `esim` | eSIM (`ई-सिम (eSIM)`) | Provider-dependent transactional | `true` | `COMING_SOON` | `PH11` | Connectivity Product Lead | Legal & Integrations Lead |
| 12 | `sim-info` | SIM Information (`सिम कार्ड जानकारी`) | Information only unless approved | `false` | `INFORMATION_ONLY` | `PH11` | Content & Editorial Lead | Connectivity Product Lead |
| 13 | `offline-maps` | Offline Maps (`अफलाइन नक्सा`) | Licence-gated | `false` | `RESTRICTED` (Licence-Gated) | `PH11` | GIS & Maps Lead | Legal Counsel |
| 14 | `shopping` | Shopping (`नेपाली हस्तकला तथा किनमेल`) | Status-gated marketplace | `true` | `COMING_SOON` | `PH10` | Marketplace Lead | Finance & Tax Lead |
| 15 | `restaurants` | Restaurants (`रेस्टुरेन्ट तथा भान्सा`) | Reservation/booking gated | `true` | `AVAILABLE` (Sandbox Pilot) | `PH10` | Dining & Local Lead | Partner Support Lead |
| 16 | `local-experiences` | Local Experiences (`स्थानीय संस्कृति तथा अनुभव`) | Status-gated transactional | `true` | `AVAILABLE` (Sandbox Pilot) | `PH10` | Cultural Experiences Lead | Community Stay Lead |
| 17 | `hidden-nepal` | Hidden Nepal (`लुकेको नेपाल (अन्वेषण)`) | Editorial/discovery | `false` | `INFORMATION_ONLY` | `PH15` | Chief Editorial Lead | Content Reviewer |
| 18 | `ai-guide` | AI Travel Guide (`एआई यात्रा सहायक`) | Assistive; safety-gated | `false` | `INFORMATION_ONLY` | `PH12` | AI Quality & RAG Lead | Safety & Compliance Lead |
| 19 | `trip-planning` | Trip Planning (`यात्रा योजना तथा तालिका`) | Planning tool | `false` | `INFORMATION_ONLY` | `PH05` | Core Product Lead | Engineering Lead |
| 20 | `weather-alerts` | Weather Alerts (`मौसम तथा सूचना`) | Official-source dependent | `false` | `INFORMATION_ONLY` | `PH11` | Safety Information Lead | Operations Lead |
| 21 | `sos` | SOS (`आपतकालीन सहायता (SOS)`) | GATED until staffed response | `false` | `RESTRICTED` (Hard-Gated) | `PH13` | Head of Safety & Incident Ops | Founder / Legal Counsel |
| 22 | `qr-scan` | QR Scan Nepal (`क्यूआर स्क्यान नेपाल`) | Information/discovery | `false` | `INFORMATION_ONLY` | `PH15` | Heritage Content Lead | GIS & Maps Lead |
| 23 | `passport` | Digital Travel Passport (`डिजिटल यात्रा राहदानी`) | Account feature | `false` | `INFORMATION_ONLY` | `PH14` | Traveler Experience Lead | Privacy Lead |
| 24 | `memories` | Travel Memories (`यात्रा सम्झनाहरू`) | User-controlled media | `false` | `INFORMATION_ONLY` | `PH14` | Privacy & Media Lead | Security Engineer |
| 25 | `reviews` | Reviews (`समीक्षा तथा मूल्याङ्कन`) | Moderated; booking-verified eligibility | `false` | `INFORMATION_ONLY` | `PH14` | Trust & Moderation Lead | Support Operations Lead |
| 26 | `rewards` | Rewards (`रिवार्ड तथा लॉयल्टी`) | Gated until financial/accounting rules approved | `false` | `RESTRICTED` (Hard-Gated) | `PH14` | Finance & Accounting Lead | CFO / Legal Counsel |
| 27 | `lost-found` | Lost & Found (`हराएको तथा फेला परेको`) | Moderated support workflow | `false` | `INFORMATION_ONLY` | `PH13` | Support Operations Lead | Trust & Moderation Lead |
| 28 | `companion-matching` | Travel Companion Matching (`सहयात्री मिलान`) | GATED pending safety/privacy controls | `false` | `RESTRICTED` (Hard-Gated) | `PH15` | Trust, Safety & Privacy Lead | Legal Counsel |
| 29 | `group-travel` | Group Travel & Community (`सामूहिक यात्रा तथा समुदाय`) | Staged release | `false` | `COMING_SOON` | `PH15` | Community Product Lead | Trust & Moderation Lead |
| 30 | `travel-wallet` | Travel Wallet (`ट्राभल वालेट`) | GATED pending legal/payment/accounting review | `true` (Gated) | `RESTRICTED` (Hard-Gated) | `PH08` | Head of Finance & Regulatory | Legal Counsel / Founder |
| 31 | `support` | Travel Support & Dispute Assistance (`यात्रा सहायता तथा विवाद समाधान`) | Service hours and staffing must be explicit | `false` | `INFORMATION_ONLY` | `PH13` | Support Operations Lead | Finance & Dispute Lead |

---

## 5. Standardized Product Requirement & Acceptance-Criteria Template (`PH00-F005` & Blueprint Section 23)

Every feature module (`PH00-F001` through `PH17-F006`) must use this standardized specification and 12-point Definition of Done (DoD) template before being eligible for `VERIFIED` status:

```markdown
### Feature Specification Template
- **Feature ID:** `PHxx-Fxxx`
- **Feature Title:** [Exact Blueprint Section 24 Title]
- **Owning Phase:** `PHxx`
- **Target Personas & Dashboards:** [`PRS-xx`, `Dxx`]
- **Category Keys Affected:** [`hotels`, ...]
- **Upstream Dependencies & Owner Decisions:** [`DEP-xxx`, `DEC-xxx`, `LEG-xxx`]
- **Functional Requirements:**
  1. [Server-side domain rule / state transition]
  2. [Validation, permission, and audit log requirement]
- **UI/UX & State Requirements:**
  - Loading, Empty, Error, Offline, Permission-Denied, Success, and Disabled/Gated states.
  - Responsive layout (Mobile / Tablet / 1440px Desktop) & Bilingual (`en` / `ne`).
- **Mandatory 12-Point Definition of Done (DoD) Acceptance Checklist (Section 23):**
  - [ ] 1. Requirement and acceptance criteria linked to unique Feature ID.
  - [ ] 2. UX flow, responsive designs, and all 7 UI states approved.
  - [ ] 3. Schema/migrations and data ownership documented.
  - [ ] 4. API contract (`/api/v1/...`) and object/action authorization implemented.
  - [ ] 5. Frontend and server-side backend behaviour complete.
  - [ ] 6. Unit, integration, E2E, concurrency, and negative tests pass with verbatim output.
  - [ ] 7. Accessibility (WCAG 2.2 AA) and English/Nepali localization checks pass.
  - [ ] 8. Security and privacy impact reviewed (PII redaction, SoD, MFA).
  - [ ] 9. Observability (correlation IDs) and immutable audit events (`auditEvents`) exist.
  - [ ] 10. Governance documentation and operational runbook updated.
  - [ ] 11. Deployment, kill-switch, and rollback plan tested where applicable.
  - [ ] 12. Reproducible evidence attached and Product Owner accepts the phase report.
```

---

## 6. Pilot-Region & Pilot-Category Selection Framework (`PH00-F011` & Blueprint Section 30)

> **Rule (Section 30.1 & `DEC-001`):** Final selection of the production pilot region and first live category is an explicit **Owner Decision (`DEC-001`, status: `PENDING`)**. This framework provides the structured 7-criteria evaluation matrix, records why deferred alternatives were rejected for Phase 1 pilot activation, and defines mandatory pilot gates and stop conditions.

### 6.1 Seven Mandatory Evaluation Criteria (Blueprint Section 30.1)
1. **Verified Supply Readiness:** Availability of licensed, tax-registered partners willing to complete document verification.
2. **Legal & Regulatory Readiness:** Clarity of DoT/local licensing without unresolved aviation, mountaineering royalty, or NRB e-money blockers.
3. **Operational Staffing Coverage:** Ability to support bookings and incidents within staffed hours (`08:00–20:00 NPT`).
4. **Demand Evidence:** Established year-round traveler corridor.
5. **Manageable Geography:** Reliable road/air access and telecommunications for partner onboarding and dispute handling.
6. **Partner Digital & Assisted Onboarding Quality:** Feasibility of 24-hour approval-booking turnaround.
7. **Support & Incident Capacity:** Low life-safety dispatch risk compared to extreme-altitude expeditions.

### 6.2 Candidate Evaluation & Rejection Rationale Matrix

| Candidate Option | Region(s) | Category Key(s) | Evaluation Across 7 Criteria | Recommendation / Rejection Rationale for Initial Pilot | Gate Status (`DEC-001`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Candidate A (Recommended Pilot Baseline)** | Kathmandu Valley (Kathmandu, Lalitpur/Patan, Bhaktapur) & Pokhara (Kaski) | `hotels` (#1), `homestays` (#2), `restaurants` (#15), `local-experiences` (#16), `transport` (#7 — Green-Plate Valley–Pokhara corridor) | High verified supply density; clear DoT/municipal registration; strong 4G/fiber connectivity for 15-min holds and 24h partner approvals; manageable geography within 08:00–20:00 NPT support capacity. | **Recommended for Owner Approval (`DEC-001`):** Lowest regulatory and life-safety friction while proving the full 12-point booking gate and double-entry ledger. | `PENDING_OWNER_APPROVAL` |
| **Candidate B (Staged High-Altitude Pilot)** | Khumbu (Solukhumbu) & Annapurna (Kaski/Manang) | `trekking` (#4), `guides` (#6), `adventures` (#3) | High traveler demand, but requires two-person safety/insurance verification, TIMS/National Park permit integration, and weather-closure rescheduling SOPs (`SRC-DHM-01`). | **Recommended as Secondary Pilot Wave (Approval-Booking Only):** Deferred from instant-booking wave until two-person compliance staffing and Lukla/trail disruption SOPs pass live drills. | `PENDING_OWNER_APPROVAL` |
| **Candidate C (Rejected for Initial Pilot)** | High-Himalaya 6,000m–8,000m Expedition Peaks | `peak-climbing` (#5) | Requires NMA/DoT climbing permits, liaison officer clearance, USD garbage deposits, and mandatory helicopter rescue insurance verification. | **Rejected for Initial Pilot:** High life-safety and regulatory complexity. Kept in `RESTRICTED` status until `LEG-003` and two-person safety operations mature. | `RESTRICTED` |
| **Candidate D (Rejected for Initial Pilot)** | Domestic & International Aviation | `flights` (#8) | Requires CAAN intermediary clearance, live GDS/airline inventory contract (`DEP-005`), and automated schedule-change ticketing. | **Rejected for Initial Pilot:** Never claim flight seat inventory without a live airline/GDS contract. Kept in `INFORMATION_ONLY`. | `INFORMATION_ONLY` |
| **Candidate E (Rejected for Initial Pilot)** | Financial Wallet, Loyalty & Social Matching | `travel-wallet` (#30), `rewards` (#26), `companion-matching` (#28), `sos` (#21) | Blocked by NRB e-money regulations (`LEG-008`), deferred-revenue tax rules (`LEG-009`), identity/harassment safety audits (`LEG-005`), and 24/7 emergency dispatch staffing (`Rule #7`). | **Rejected for Initial Pilot:** Hard-locked to `RESTRICTED / GATED` server-side. | `GATED` |

### 6.3 Nine Mandatory Pilot Launch Gates (Blueprint Section 30.2)
No pilot category may transition to production live-money `AVAILABLE` until all 9 gates are evidenced:
1. Legal and payment-provider approvals documented (`LEG-001`..`LEG-015`, `DEC-008`).
2. Partner verification complete with non-expired licences and two-person approval where required.
3. Listing and inventory capacity accuracy tested under concurrency load.
4. Payment, refund, and double-entry ledger reconciliation tested in provider sandbox and approved production path.
5. Support and incident operations staffed for published hours (`08:00–20:00 NPT`).
6. User Terms of Service, Privacy Notice, and versioned Cancellation Policy approved by counsel (`LEG-015`).
7. Security (RBAC, MFA, SoD, IDOR) and Accessibility (WCAG 2.2 AA) checks passed.
8. Monitoring, encrypted database backups, and tested rollback ready (`DEP-001`).
9. Pilot success metrics (`OUT-01`..`OUT-12`) and emergency stop conditions agreed by Owner.

### 6.4 Controlled Rollout & Emergency Stop Conditions (Blueprint Section 30.3)
- **Rollout Sequence:** Internal Sandbox Testing → Invited Closed Pilot → Limited Public Pilot (Single Region/Category) → Gradual Expansion.
- **Immediate Kill-Switch Stop Conditions:** Any unreconciled ledger variance (`!= 0 paisa`), any overbooking race condition, any critical security/cross-tenant vulnerability, or any regulatory directive triggers the **Global Booking Switch (`POST /api/v1/admin/global-switch`)** or **Category Emergency Disable (`PATCH /api/v1/admin/categories/:key/status`)**, halting new transactions immediately while preserving existing bookings, vouchers, and support access.
