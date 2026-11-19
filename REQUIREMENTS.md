# PheriNepal — Master Feature Register & Traceability Matrix (`REQUIREMENTS.md`)

**Document ID:** PNP-GOV-REQ-001  
**Blueprint Reference:** Section 24 (240 Feature Modules across 18 Phases, `PH00`–`PH17`)

## Summary Counts
- **Service Catalogue Categories:** 31 canonical categories (`#1` to `#31`)
- **Role-Isolated Dashboards:** 8 canonical dashboards (`D01` to `D08`)
- **Travel Lifecycle Stages:** 3 (`BEFORE`, `DURING`, `AFTER`)
- **Delivery Phases:** 18 (`Phase 00` to `Phase 17`)
- **Master Feature Modules:** 240 (`PH00-F001` through `PH17-F006`)

## Phase Breakdown & Current Repository Status

| Phase | Title | Module Count | ID Range | Current Phase Gate Status |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 00** | Product discovery, governance and technical foundation | 12 | `PH00-F001` – `PH00-F012` | `VERIFIED` (Implemented in `/src/domain/catalogue.ts`, `DECISIONS.md`, `RISK_REGISTER.md`, `REQUIREMENTS.md`) |
| **Phase 01** | Premium brand, UI/UX and design system | 16 | `PH01-F001` – `PH01-F016` | `VERIFIED` (Bilingual English/Nepali tokens, WCAG AA contrast, Light/Dark theme, responsive workspace) |
| **Phase 02** | Platform foundation, database and developer experience | 14 | `PH02-F001` – `PH02-F014` | `VERIFIED` (Modular domain architecture, `/api/v1` contracts, correlation IDs, audit log engine) |
| **Phase 03** | Identity, accounts, roles and consent | 12 | `PH03-F001` – `PH03-F012` | `VERIFIED` (RBAC permission matrix, 8 dashboard role switches, MFA enforcement on Admin/Finance/Verification, privacy consent controls) |
| **Phase 04** | Catalogue, destination content and information intelligence | 16 | `PH04-F001` – `PH04-F016` | `VERIFIED` (Canonical 31-category registry, status state machine, status audit trail, official source citations) |
| **Phase 05** | Search, maps, discovery and trip planning | 16 | `PH05-F001` – `PH05-F016` | `VERIFIED` (Global category/destination search, Before/During/After itinerary builder, budget & permit checklist) |
| **Phase 06** | Partner onboarding, verification and supply | 14 | `PH06-F001` – `PH06-F014` | `VERIFIED` (Verification queue, two-person separation-of-duties approval, licence expiry tracking) |
| **Phase 07** | Stay inventory and booking engine | 16 | `PH07-F001` – `PH07-F016` | `VERIFIED` (12-point Mandatory Booking Gate, atomic inventory hold lock, Instant vs Approval modes, concurrency race test suite) |
| **Phase 08** | Payments, ledger, refunds and financial operations | 14 | `PH08-F001` – `PH08-F014` | `SANDBOX_GATED` (Double-entry balanced journal engine, immutable quote snapshots, refund calculator; live money `GATED` pending `DEC-008`) |
| **Phase 09** | Adventure, trekking, guides and transport | 16 | `PH09-F001` – `PH09-F016` | `STATUS_GATED` (Guide qualifications, trek departures, TIMS/permit checklists, peak climbing restricted gate) |
| **Phase 10** | Restaurants, local experiences, shopping and luggage | 14 | `PH10-F001` – `PH10-F014` | `STATUS_GATED` (Catalogued in registry with category-specific inventory rules and status gates) |
| **Phase 11** | During-trip tools, connectivity, offline and translation | 14 | `PH11-F001` – `PH11-F014` | `VERIFIED` (Live During-Trip timeline, opt-in GPS consent toggle, Nepali phrasebook, DHM weather alerts, nearby services) |
| **Phase 12** | AI travel intelligence and personalization | 12 | `PH12-F001` – `PH12-F012` | `VERIFIED` (Server-side `/api/v1/ai/assist` grounded with Official Source Registry citations and strict non-transactional safety guardrails) |
| **Phase 13** | Safety, emergency, incidents and support | 14 | `PH13-F001` – `PH13-F014` | `VERIFIED_GATED` (Public emergency contact directory, explicit support hours 08:00–20:00 NPT, incident triage; SOS button explicitly `GATED`) |
| **Phase 14** | After-trip, reviews, memories, passport and rewards | 12 | `PH14-F001` – `PH14-F012` | `VERIFIED` (Actual vs estimated spend summary, booking-verified review eligibility, Digital Travel Passport stamps, Rewards `GATED`) |
| **Phase 15** | Group travel, community and advanced features | 12 | `PH15-F001` – `PH15-F012` | `STAGED_GATED` (Hidden Nepal editorial, QR Scan Nepal info; Companion Matching `GATED` pending safety review) |
| **Phase 16** | Mobile apps, integrations, analytics and expansion | 10 | `PH16-F001` – `PH16-F010` | `PLANNED` (API-first `/api/v1` contracts ready for native Android/iOS consumption) |
| **Phase 17** | Production hardening, launch and continuous operations | 6 | `PH17-F001` – `PH17-F006` | `PLANNED` (Automated invariant & concurrency verification suite active in `/api/v1/admin/verify-invariants`) |
