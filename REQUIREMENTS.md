# PheriNepal — Master Feature Register & Traceability Matrix (`REQUIREMENTS.md`)

**Document ID:** PNP-GOV-REQ-001  
**Blueprint Reference:** Section 23 (12-Point Definition of Done) & Section 24 (240 Feature Modules across 18 Phases, `PH00`–`PH17`)  
**Current Active Phase Scope:** `PH00` ONLY (`PH00-F001` through `PH00-F012`)  
**Phase Status Integrity Rule (Section 8 of Directive):**
- `PH00` is marked **`PARTIAL`** (All 12 repository governance artefacts, canonical registries, and automated verification checks are implemented and tested; awaits explicit Product Owner / Founder sign-off and empirical interview/counsel completions per Rule #11).
- `PH01` through `PH17` are marked **`NOT_STARTED`** (Future phase scope; any sandbox demonstration code present in the repository is classified strictly as non-certified prototype baseline and must not be marked `VERIFIED` or `STARTED` prior to `PH00` exit approval).

---

## 1. Canonical Counting Units (Blueprint Section 24)
- **Canonical Service Categories:** `31` (`#1` to `#31`)
- **Role-Mapped Dashboards:** `8` (`D01` to `D08`)
- **Travel Lifecycle Stages:** `3` (`BEFORE`, `DURING`, `AFTER`)
- **Delivery Phases:** `18` (`PH00` to `PH17`)
- **Master Feature Modules:** `240` (`PH00-F001` to `PH17-F006`)

---

## 2. Phase Summary & Gate Status Table

| Phase ID | Phase Title | Module Count | ID Range | Official Phase Status | Gate & Evidence Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PH00** | Product discovery, governance and technical foundation | `12` | `PH00-F001` – `PH00-F012` | `PARTIAL` | All 12 PH00 artefacts implemented & verified by `scripts/verify-ph00.ts`; awaits Owner approval of `DEC-001`..`DEC-026` & phase report. |
| **PH01** | Premium brand, UI/UX and design system | `16` | `PH01-F001` – `PH01-F016` | `NOT_STARTED` | Blocked on PH00 exit sign-off & `DEC-004`. |
| **PH02** | Platform foundation, database and developer experience | `14` | `PH02-F001` – `PH02-F014` | `NOT_STARTED` | Blocked on PH00 exit sign-off & PostgreSQL host provisioning (`DEP-001`, `DEC-013`). |
| **PH03** | Identity, accounts, roles and consent | `12` | `PH03-F001` – `PH03-F012` | `NOT_STARTED` | Blocked on PH00–PH02 exit & `DEC-016`. |
| **PH04** | Catalogue, destination content and information intelligence | `16` | `PH04-F001` – `PH04-F016` | `NOT_STARTED` | Blocked on PH00–PH03 exit & `DEC-003`. |
| **PH05** | Search, maps, discovery and trip planning | `16` | `PH05-F001` – `PH05-F016` | `NOT_STARTED` | Blocked on PH00–PH04 exit & map licence (`DEC-017`). |
| **PH06** | Partner onboarding, verification and supply | `14` | `PH06-F001` – `PH06-F014` | `NOT_STARTED` | Blocked on PH00–PH05 exit & `DEC-024`. |
| **PH07** | Stay inventory and booking engine | `16` | `PH07-F001` – `PH07-F016` | `NOT_STARTED` | Blocked on PH00–PH06 exit & `DEC-010`, `DEC-011`. |
| **PH08** | Payments, ledger, refunds and financial operations | `14` | `PH08-F001` – `PH08-F014` | `NOT_STARTED` | Gated on `DEC-008`, `DEC-009`, `DEC-012`, `LEG-008`, `LEG-009`. |
| **PH09** | Adventure, trekking, guides and transport | `16` | `PH09-F001` – `PH09-F016` | `NOT_STARTED` | Gated on `LEG-003`, `LEG-004` & category readiness. |
| **PH10** | Restaurants, local experiences, shopping and luggage | `14` | `PH10-F001` – `PH10-F014` | `NOT_STARTED` | Gated on `LEG-006` & category readiness. |
| **PH11** | During-trip tools, connectivity, offline and translation | `14` | `PH11-F001` – `PH11-F014` | `NOT_STARTED` | Gated on offline map/eSIM provider contracts (`DEP-006`, `DEP-007`). |
| **PH12** | AI travel intelligence and personalization | `12` | `PH12-F001` – `PH12-F012` | `NOT_STARTED` | Gated on `DEC-018` & grounded evaluation dataset. |
| **PH13** | Safety, emergency, incidents and support | `14` | `PH13-F001` – `PH13-F014` | `NOT_STARTED` | Gated on `DEC-007`, `DEC-023` (SOS hard-gated until 24/7 staffed drills). |
| **PH14** | After-trip, reviews, memories, passport and rewards | `12` | `PH14-F001` – `PH14-F012` | `NOT_STARTED` | Gated on `DEC-019`, `DEC-026` (Rewards gated on tax/accounting sign-off). |
| **PH15** | Group travel, community and advanced features | `12` | `PH15-F001` – `PH15-F012` | `NOT_STARTED` | Gated on `DEC-022` (Companion matching gated on safety audit). |
| **PH16** | Mobile apps, integrations, analytics and expansion | `10` | `PH16-F001` – `PH16-F010` | `NOT_STARTED` | Gated on `DEC-021` & stable `/api/v1` governance. |
| **PH17** | Production hardening, launch and continuous operations | `6` | `PH17-F001` – `PH17-F006` | `NOT_STARTED` | Gated on all upstream phases, penetration tests, and DR drills. |
| **TOTAL** | **18 Delivery Phases (`PH00`–`PH17`)** | **`240`** | `PH00-F001` – `PH17-F006` | **`PH00` Active (`PARTIAL`)** | **Zero phases marked `VERIFIED` prematurely.** |

---

## 3. Complete 240-Module Feature Register (`PH00-F006` & Blueprint Section 24)

### Phase 00 — Product discovery, governance and technical foundation (12 Modules)

| Feature ID | Exact Blueprint Title | Phase | Status | Acceptance Criteria & Repository Evidence |
| :--- | :--- | :--- | :--- | :--- |
| `PH00-F001` | Product vision, positioning and measurable outcomes | `PH00` | `PARTIAL` | Documented in `PH00_GOVERNANCE_FOUNDATION.md` (§1) & `src/domain/ph00Governance.ts` (`OUT-01`..`OUT-12`). Awaits Owner sign-off (`DEC-004`). |
| `PH00-F002` | Traveler and partner persona validation | `PH00` | `PARTIAL` | All 15 personas (`PRS-01`..`PRS-15`) catalogued in `PH00_GOVERNANCE_FOUNDATION.md` (§2) & `src/domain/ph00Governance.ts` with explicit `VALIDATION_PENDING` field interview boundary. |
| `PH00-F003` | Before/during/after journey maps | `PH00` | `PARTIAL` | Complete `BEFORE`, `DURING`, `AFTER` journey maps in `PH00_GOVERNANCE_FOUNDATION.md` (§3) & `src/domain/ph00Governance.ts`. Awaits Owner sign-off. |
| `PH00-F004` | 31-category taxonomy and category ownership | `PH00` | `PARTIAL` | Single canonical registry of 31 categories in `src/domain/catalogue.ts` & `PH00_GOVERNANCE_FOUNDATION.md` (§4) with operational & backup owner roles. Final transactional policy gated on `DEC-003`. |
| `PH00-F005` | Product requirement and acceptance-criteria template | `PH00` | `PARTIAL` | Standardized PRD & 12-point Definition of Done template established in `PH00_GOVERNANCE_FOUNDATION.md` (§5) and Section 4 of this file. |
| `PH00-F006` | Feature register with unique IDs and phase ownership | `PH00` | `PARTIAL` | All 240 feature modules enumerated verbatim in `REQUIREMENTS.md` (§3) and `src/domain/catalogue.ts`, validated by `scripts/verify-ph00.ts`. |
| `PH00-F007` | Decision log and unresolved-decision workflow | `PH00` | `PARTIAL` | All 26 Section 32 Owner Decisions (`DEC-001`..`DEC-026`) documented in `DECISIONS.md` as `PENDING` or `GATED` with 4-dimension impact and safe-continuation rules. |
| `PH00-F008` | Risk, dependency and assumption register | `PH00` | `PARTIAL` | Separately identifiable Risk (`RSK-001`..`012`), Dependency (`DEP-001`..`010`), and Assumption (`ASM-001`..`010`) registers in `RISK_REGISTER.md` (§1–§3). |
| `PH00-F009` | Content source and verification policy | `PH00` | `PARTIAL` | Official Source Registry (`SRC-*`), freshness rules, and quarantine of unverified 2026 arrival/competitor research leads in `RISK_REGISTER.md` (§4). |
| `PH00-F010` | Legal, licensing, insurance and tax question register | `PH00` | `GATED` | All 15 Section 22 regulatory domains (`LEG-001`..`LEG-015`) tracked in `RISK_REGISTER.md` (§5) with `PENDING_COUNSEL_OPINION`. |
| `PH00-F011` | Pilot-region and pilot-category selection framework | `PH00` | `PENDING` | 7-criteria evaluation matrix, rejection rationale for deferred candidates, 9 pilot gates, and kill-switch rules in `PH00_GOVERNANCE_FOUNDATION.md` (§6). Final choice gated on `DEC-001`. |
| `PH00-F012` | AI coding-agent operating contract and evidence-report format | `PH00` | `PARTIAL` | Standalone `/AI_AGENT_CONTRACT.md` enforcing Section 33 (14 steps), Section 33.1 (safety), and Section 33.2 (23-field report). |

### Phase 01 — Premium brand, UI/UX and design system (16 Modules — Status: `NOT_STARTED`)
- `PH01-F001` — Brand strategy, positioning and voice (`NOT_STARTED`)
- `PH01-F002` — Logo system and asset rules (`NOT_STARTED`)
- `PH01-F003` — Semantic colour tokens and contrast (`NOT_STARTED`)
- `PH01-F004` — Typography with Nepali/Latin font testing (`NOT_STARTED`)
- `PH01-F005` — Spacing, grid, sizing, elevation and radius tokens (`NOT_STARTED`)
- `PH01-F006` — Iconography and illustration direction (`NOT_STARTED`)
- `PH01-F007` — Photography and media art direction (`NOT_STARTED`)
- `PH01-F008` — Reusable component library (`NOT_STARTED`)
- `PH01-F009` — Navigation, header, footer and responsive menu (`NOT_STARTED`)
- `PH01-F010` — Mobile/tablet/desktop layout system (`NOT_STARTED`)
- `PH01-F011` — Light/dark themes and contrast (`NOT_STARTED`)
- `PH01-F012` — Forms, validation, feedback and notification patterns (`NOT_STARTED`)
- `PH01-F013` — Tables, filters, search, cards and map patterns (`NOT_STARTED`)
- `PH01-F014` — Design tokens and developer handoff (`NOT_STARTED`)
- `PH01-F015` — Interaction, motion and micro-interaction guidelines (`NOT_STARTED`)
- `PH01-F016` — Accessibility-first design patterns, WCAG 2.2 AA target (`NOT_STARTED`)

### Phase 02 — Platform foundation, database and developer experience (14 Modules — Status: `NOT_STARTED`)
- `PH02-F001` — Repository structure and package boundaries (`NOT_STARTED`)
- `PH02-F002` — Environment configuration and validation (`NOT_STARTED`)
- `PH02-F003` — Reproducible local development (`NOT_STARTED`)
- `PH02-F004` — PostgreSQL schema and migration framework (`NOT_STARTED`)
- `PH02-F005` — Constraints, indexes and transaction policy (`NOT_STARTED`)
- `PH02-F006` — Domain layer and service boundaries (`NOT_STARTED`)
- `PH02-F007` — API framework and versioning (`NOT_STARTED`)
- `PH02-F008` — Typed validation and shared schemas (`NOT_STARTED`)
- `PH02-F009` — Error model and correlation IDs (`NOT_STARTED`)
- `PH02-F010` — Logging, metrics and tracing baseline (`NOT_STARTED`)
- `PH02-F011` — File/object storage abstraction (`NOT_STARTED`)
- `PH02-F012` — Background job/event-processing foundation (`NOT_STARTED`)
- `PH02-F013` — CI, code quality and dependency scanning (`NOT_STARTED`)
- `PH02-F014` — Seed data, fixtures and test infrastructure (`NOT_STARTED`)

### Phase 03 — Identity, accounts, roles and consent (12 Modules — Status: `NOT_STARTED`)
- `PH03-F001` — Traveler registration and account creation (`NOT_STARTED`)
- `PH03-F002` — Email/phone verification and OTP lifecycle (`NOT_STARTED`)
- `PH03-F003` — Secure login, logout and sessions (`NOT_STARTED`)
- `PH03-F004` — Password management and recovery (`NOT_STARTED`)
- `PH03-F005` — MFA for privileged accounts (`NOT_STARTED`)
- `PH03-F006` — Role-based access control (`NOT_STARTED`)
- `PH03-F007` — Organization and partner membership (`NOT_STARTED`)
- `PH03-F008` — Tenant and record-level isolation (`NOT_STARTED`)
- `PH03-F009` — Profile and traveler preferences (`NOT_STARTED`)
- `PH03-F010` — Consent, privacy and notification preferences (`NOT_STARTED`)
- `PH03-F011` — Export, correction, deletion and retention workflow (`NOT_STARTED`)
- `PH03-F012` — Session/device management and suspicious-login controls (`NOT_STARTED`)

### Phase 04 — Catalogue, destination content and information intelligence (16 Modules — Status: `NOT_STARTED`)
- `PH04-F001` — 31-category catalogue and metadata (`NOT_STARTED`)
- `PH04-F002` — Category/location availability status (`NOT_STARTED`)
- `PH04-F003` — Status history and audit trail (`NOT_STARTED`)
- `PH04-F004` — Category-specific information templates (`NOT_STARTED`)
- `PH04-F005` — Destination profiles and editorial pages (`NOT_STARTED`)
- `PH04-F006` — Province/district/municipality/locality taxonomy (`NOT_STARTED`)
- `PH04-F007` — Attraction and point-of-interest records (`NOT_STARTED`)
- `PH04-F008` — History, culture and local etiquette (`NOT_STARTED`)
- `PH04-F009` — Best-season and climate information (`NOT_STARTED`)
- `PH04-F010` — Permit, visa and entry information library (`NOT_STARTED`)
- `PH04-F011` — Official contact and public-service directory (`NOT_STARTED`)
- `PH04-F012` — Source registry, citations and verification workflow (`NOT_STARTED`)
- `PH04-F013` — Content freshness, expiry and review scheduling (`NOT_STARTED`)
- `PH04-F014` — English/Nepali editorial workflow (`NOT_STARTED`)
- `PH04-F015` — Media rights and moderation (`NOT_STARTED`)
- `PH04-F016` — SEO metadata, canonical URLs and structured data (`NOT_STARTED`)

### Phase 05 — Search, maps, discovery and trip planning (16 Modules — Status: `NOT_STARTED`)
- `PH05-F001` — Global category/destination search (`NOT_STARTED`)
- `PH05-F002` — Suggestions and typo tolerance (`NOT_STARTED`)
- `PH05-F003` — Filters and sorting (`NOT_STARTED`)
- `PH05-F004` — Map-based discovery (`NOT_STARTED`)
- `PH05-F005` — Distance and geospatial search (`NOT_STARTED`)
- `PH05-F006` — Nearby services discovery (`NOT_STARTED`)
- `PH05-F007` — Destination comparison (`NOT_STARTED`)
- `PH05-F008` — Attraction/activity discovery (`NOT_STARTED`)
- `PH05-F009` — Date/guest/requirement-aware search (`NOT_STARTED`)
- `PH05-F010` — Saved places and wishlists (`NOT_STARTED`)
- `PH05-F011` — Trip itinerary builder (`NOT_STARTED`)
- `PH05-F012` — Day-by-day schedule and timeline (`NOT_STARTED`)
- `PH05-F013` — Travel time, distance and route planning (`NOT_STARTED`)
- `PH05-F014` — Budget calculator and cost breakdown (`NOT_STARTED`)
- `PH05-F015` — Packing/preparation checklists (`NOT_STARTED`)
- `PH05-F016` — Permit/document planning checklist (`NOT_STARTED`)

### Phase 06 — Partner onboarding, verification and supply (14 Modules — Status: `NOT_STARTED`)
- `PH06-F001` — Partner application and business profile (`NOT_STARTED`)
- `PH06-F002` — Identity and registration evidence (`NOT_STARTED`)
- `PH06-F003` — Licence, permit and insurance evidence (`NOT_STARTED`)
- `PH06-F004` — Document review and verification queue (`NOT_STARTED`)
- `PH06-F005` — Two-person approval and separation of duties (`NOT_STARTED`)
- `PH06-F006` — Category-specific partner readiness checklist (`NOT_STARTED`)
- `PH06-F007` — Partner agreement and terms acceptance (`NOT_STARTED`)
- `PH06-F008` — Listing creation and editing (`NOT_STARTED`)
- `PH06-F009` — Listing photos, media and ownership declaration (`NOT_STARTED`)
- `PH06-F010` — Staff invitations and roles (`NOT_STARTED`)
- `PH06-F011` — Partner availability and operating schedule (`NOT_STARTED`)
- `PH06-F012` — Suspension, restriction and reinstatement (`NOT_STARTED`)
- `PH06-F013` — Partner performance and compliance history (`NOT_STARTED`)
- `PH06-F014` — Assisted onboarding and audit history (`NOT_STARTED`)

### Phase 07 — Stay inventory and booking engine (16 Modules — Status: `NOT_STARTED`)
- `PH07-F001` — Property/accommodation listing model (`NOT_STARTED`)
- `PH07-F002` — Room/unit and occupancy model (`NOT_STARTED`)
- `PH07-F003` — Rate plans, taxes, fees and price breakdown (`NOT_STARTED`)
- `PH07-F004` — Availability calendar and inventory rules (`NOT_STARTED`)
- `PH07-F005` — Minimum/maximum stay and booking windows (`NOT_STARTED`)
- `PH07-F006` — Search-to-listing availability validation (`NOT_STARTED`)
- `PH07-F007` — Expiring temporary inventory holds (`NOT_STARTED`)
- `PH07-F008` — Instant Booking workflow (`NOT_STARTED`)
- `PH07-F009` — Approval Booking workflow (`NOT_STARTED`)
- `PH07-F010` — Booking state machine and transition policy (`NOT_STARTED`)
- `PH07-F011` — Confirmation and traveler notifications (`NOT_STARTED`)
- `PH07-F012` — Check-in/check-out and service completion (`NOT_STARTED`)
- `PH07-F013` — Modification and rescheduling (`NOT_STARTED`)
- `PH07-F014` — Cancellation, no-show and partial fulfilment (`NOT_STARTED`)
- `PH07-F015` — Multi-service Trip ID with independent booking records (`NOT_STARTED`)
- `PH07-F016` — Booking history, vouchers and receipts (`NOT_STARTED`)

### Phase 08 — Payments, ledger, refunds and financial operations (14 Modules — Status: `NOT_STARTED`)
- `PH08-F001` — Payment provider adapter framework (`NOT_STARTED`)
- `PH08-F002` — Payment intent and checkout session (`NOT_STARTED`)
- `PH08-F003` — Payment status state machine (`NOT_STARTED`)
- `PH08-F004` — Signed, idempotent webhook processing (`NOT_STARTED`)
- `PH08-F005` — Double-entry financial ledger (`NOT_STARTED`)
- `PH08-F006` — Booking-to-payment allocation (`NOT_STARTED`)
- `PH08-F007` — Refund calculation and execution (`NOT_STARTED`)
- `PH08-F008` — Partial refund and cancellation fee rules (`NOT_STARTED`)
- `PH08-F009` — Commission calculation and disclosure (`NOT_STARTED`)
- `PH08-F010` — Partner payout and approval (`NOT_STARTED`)
- `PH08-F011` — Reconciliation and settlement reporting (`NOT_STARTED`)
- `PH08-F012` — Dispute/chargeback evidence workflow (`NOT_STARTED`)
- `PH08-F013` — Tax, invoice and receipt records (`NOT_STARTED`)
- `PH08-F014` — Finance dashboard and financial audit log (`NOT_STARTED`)

### Phase 09 — Adventure, trekking, guides and transport (16 Modules — Status: `NOT_STARTED`)
- `PH09-F001` — Adventure activity catalogue/detail (`NOT_STARTED`)
- `PH09-F002` — Trek route and itinerary catalogue (`NOT_STARTED`)
- `PH09-F003` — Trek package and departure dates (`NOT_STARTED`)
- `PH09-F004` — Peak-climbing product and expedition details (`NOT_STARTED`)
- `PH09-F005` — Guide/porter profile and qualifications (`NOT_STARTED`)
- `PH09-F006` — Guide availability and assignment (`NOT_STARTED`)
- `PH09-F007` — Operator/agency profile (`NOT_STARTED`)
- `PH09-F008` — Group size and capacity (`NOT_STARTED`)
- `PH09-F009` — Equipment and inclusion/exclusion details (`NOT_STARTED`)
- `PH09-F010` — Permit/restricted-area checklist integration (`NOT_STARTED`)
- `PH09-F011` — Safety briefing and risk acknowledgement (`NOT_STARTED`)
- `PH09-F012` — Vehicle, fleet and driver profiles (`NOT_STARTED`)
- `PH09-F013` — Transport routes, schedules and seat capacity (`NOT_STARTED`)
- `PH09-F014` — Airport transfer and private hire booking (`NOT_STARTED`)
- `PH09-F015` — Flight search/information provider integration (`NOT_STARTED`)
- `PH09-F016` — Luggage storage, transfer and tracking workflow (`NOT_STARTED`)

### Phase 10 — Restaurants, local experiences, shopping and luggage (14 Modules — Status: `NOT_STARTED`)
- `PH10-F001` — Restaurant profiles and menus (`NOT_STARTED`)
- `PH10-F002` — Table reservation and party-size rules (`NOT_STARTED`)
- `PH10-F003` — Reservation confirmation and cancellation (`NOT_STARTED`)
- `PH10-F004` — Food preferences and allergen disclosure (`NOT_STARTED`)
- `PH10-F005` — Local experience catalogue (`NOT_STARTED`)
- `PH10-F006` — Community tourism and host experiences (`NOT_STARTED`)
- `PH10-F007` — Event, workshop and festival listings (`NOT_STARTED`)
- `PH10-F008` — Experience schedule, capacity and booking (`NOT_STARTED`)
- `PH10-F009` — Shopping seller onboarding (`NOT_STARTED`)
- `PH10-F010` — Product catalogue, variants and inventory (`NOT_STARTED`)
- `PH10-F011` — Shopping cart and checkout (`NOT_STARTED`)
- `PH10-F012` — Order fulfilment, delivery and tracking (`NOT_STARTED`)
- `PH10-F013` — Returns, refunds and seller disputes (`NOT_STARTED`)
- `PH10-F014` — Local partner settlement and payout reporting (`NOT_STARTED`)

### Phase 11 — During-trip tools, connectivity, offline and translation (14 Modules — Status: `NOT_STARTED`)
- `PH11-F001` — My Trip live trip dashboard (`NOT_STARTED`)
- `PH11-F002` — Trip timeline and itinerary updates (`NOT_STARTED`)
- `PH11-F003` — GPS sharing with explicit consent (`NOT_STARTED`)
- `PH11-F004` — Route navigation and saved routes (`NOT_STARTED`)
- `PH11-F005` — Licensed offline map downloads (`NOT_STARTED`)
- `PH11-F006` — Offline itinerary and vouchers (`NOT_STARTED`)
- `PH11-F007` — Offline emergency information pack (`NOT_STARTED`)
- `PH11-F008` — Connectivity and SIM information (`NOT_STARTED`)
- `PH11-F009` — eSIM catalogue and purchase flow (`NOT_STARTED`)
- `PH11-F010` — Translation and phrase assistance (`NOT_STARTED`)
- `PH11-F011` — Weather and official alert feed (`NOT_STARTED`)
- `PH11-F012` — Travel disruption and route closure alerts (`NOT_STARTED`)
- `PH11-F013` — Nearby hospital/pharmacy/ATM/bank/fuel discovery (`NOT_STARTED`)
- `PH11-F014` — Sync queue and conflict-safe offline synchronization (`NOT_STARTED`)

### Phase 12 — AI travel intelligence and personalization (12 Modules — Status: `NOT_STARTED`)
- `PH12-F001` — AI travel assistant (`NOT_STARTED`)
- `PH12-F002` — Grounded destination Q&A (`NOT_STARTED`)
- `PH12-F003` — Personalized itinerary generation (`NOT_STARTED`)
- `PH12-F004` — Trip plan refinement and constraint checks (`NOT_STARTED`)
- `PH12-F005` — Budget-aware recommendations (`NOT_STARTED`)
- `PH12-F006` — Weather/context-aware trusted-source suggestions (`NOT_STARTED`)
- `PH12-F007` — Multilingual conversational assistance (`NOT_STARTED`)
- `PH12-F008` — AI-assisted content drafting for human review (`NOT_STARTED`)
- `PH12-F009` — Recommendation ranking and explanation (`NOT_STARTED`)
- `PH12-F010` — Preference and personalization controls (`NOT_STARTED`)
- `PH12-F011` — AI evaluation, feedback and quality dashboard (`NOT_STARTED`)
- `PH12-F012` — AI safety, abuse, cost and provider fallback controls (`NOT_STARTED`)

### Phase 13 — Safety, emergency, incidents and support (14 Modules — Status: `NOT_STARTED`)
- `PH13-F001` — Safety information hub (`NOT_STARTED`)
- `PH13-F002` — Verified emergency contact directory (`NOT_STARTED`)
- `PH13-F003` — SOS interface and activation policy (`NOT_STARTED`)
- `PH13-F004` — Incident reporting and case creation (`NOT_STARTED`)
- `PH13-F005` — Severity classification and triage (`NOT_STARTED`)
- `PH13-F006` — Escalation and responder assignment (`NOT_STARTED`)
- `PH13-F007` — Emergency contact notification with consent (`NOT_STARTED`)
- `PH13-F008` — Incident timeline and status updates (`NOT_STARTED`)
- `PH13-F009` — Traveler support center and help articles (`NOT_STARTED`)
- `PH13-F010` — Support ticket/live chat where staffed (`NOT_STARTED`)
- `PH13-F011` — Complaint and dispute intake (`NOT_STARTED`)
- `PH13-F012` — Lost-document/property assistance (`NOT_STARTED`)
- `PH13-F013` — Fraud/scam reporting and abuse controls (`NOT_STARTED`)
- `PH13-F014` — Post-incident follow-up and audit (`NOT_STARTED`)

### Phase 14 — After-trip, reviews, memories, passport and rewards (12 Modules — Status: `NOT_STARTED`)
- `PH14-F001` — Trip completion and post-trip summary (`NOT_STARTED`)
- `PH14-F002` — Actual versus estimated expenditure (`NOT_STARTED`)
- `PH14-F003` — Booking/payment/receipt/refund history (`NOT_STARTED`)
- `PH14-F004` — Verified review invitation and submission (`NOT_STARTED`)
- `PH14-F005` — Review moderation and appeal (`NOT_STARTED`)
- `PH14-F006` — Partner reply and service recovery (`NOT_STARTED`)
- `PH14-F007` — Digital travel passport and stamps (`NOT_STARTED`)
- `PH14-F008` — Private travel memories/media album (`NOT_STARTED`)
- `PH14-F009` — Shareable trip story with privacy controls (`NOT_STARTED`)
- `PH14-F010` — Rewards and loyalty rules (`NOT_STARTED`)
- `PH14-F011` — Separate rewards ledger and redemption (`NOT_STARTED`)
- `PH14-F012` — Personalized repeat-trip recommendations (`NOT_STARTED`)

### Phase 15 — Group travel, community and advanced features (12 Modules — Status: `NOT_STARTED`)
- `PH15-F001` — Group trip creation and invitations (`NOT_STARTED`)
- `PH15-F002` — Shared itinerary and collaborative editing (`NOT_STARTED`)
- `PH15-F003` — Group member roles and permissions (`NOT_STARTED`)
- `PH15-F004` — Group expense splitting and settlement records (`NOT_STARTED`)
- `PH15-F005` — Travel community posts and questions (`NOT_STARTED`)
- `PH15-F006` — Community moderation and reporting (`NOT_STARTED`)
- `PH15-F007` — QR Scan Nepal information experience (`NOT_STARTED`)
- `PH15-F008` — Hidden Nepal editorial discovery (`NOT_STARTED`)
- `PH15-F009` — Companion discovery and matching (`NOT_STARTED`)
- `PH15-F010` — Companion safety checks, blocking and reporting (`NOT_STARTED`)
- `PH15-F011` — Sustainable/responsible travel guidance (`NOT_STARTED`)
- `PH15-F012` — Accessibility and inclusive-travel preference discovery (`NOT_STARTED`)

### Phase 16 — Mobile apps, integrations, analytics and expansion (10 Modules — Status: `NOT_STARTED`)
- `PH16-F001` — Android application using stable API (`NOT_STARTED`)
- `PH16-F002` — iOS application using stable API (`NOT_STARTED`)
- `PH16-F003` — Push notification integration (`NOT_STARTED`)
- `PH16-F004` — Deep links and universal links (`NOT_STARTED`)
- `PH16-F005` — Partner/provider integration hub (`NOT_STARTED`)
- `PH16-F006` — Public/partner API governance and webhooks (`NOT_STARTED`)
- `PH16-F007` — Business intelligence and operations dashboards (`NOT_STARTED`)
- `PH16-F008` — Multi-currency display and exchange-rate source (`NOT_STARTED`)
- `PH16-F009` — Corporate/group travel account support (`NOT_STARTED`)
- `PH16-F010` — New destination and international-market configuration (`NOT_STARTED`)

### Phase 17 — Production hardening, launch and continuous operations (6 Modules — Status: `NOT_STARTED`)
- `PH17-F001` — Production deployment and environment promotion (`NOT_STARTED`)
- `PH17-F002` — Security assessment and penetration testing (`NOT_STARTED`)
- `PH17-F003` — Performance, load, stress and soak testing (`NOT_STARTED`)
- `PH17-F004` — Backup, disaster recovery and restore drills (`NOT_STARTED`)
- `PH17-F005` — Monitoring, alerting, SLOs and incident response (`NOT_STARTED`)
- `PH17-F006` — Controlled launch, rollback and continuous improvement (`NOT_STARTED`)
