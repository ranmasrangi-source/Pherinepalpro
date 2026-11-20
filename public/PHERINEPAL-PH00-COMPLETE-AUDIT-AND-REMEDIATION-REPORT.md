# PHERINEPAL — COMPLETE PH00 BASELINE AUDIT & DEFECT REMEDIATION REPORT

**Document ID:** `PNP-PH00-COMPLETE-AUDIT-REMEDIATION-001`
**Master Blueprint Reference:** `PHERINEPAL-COMPLETE-MASTER-BLUEPRINT-v1.0.md` (`PNP-MASTER-ARCH-001`, Version 1.0)
**Repository Audited:** `https://github.com/ranmasrangi-source/Pherinepalpro`
**External Baseline Commit Reference:** `3b55182f468a894694ef6917aaf17175bcd9c2d5`
**Local Workspace Commit Inspected:** `8871462327fd98957c8e5fff5ef72e9d78c07a39` (branch `main`, clean working tree)
**Audit & Specification Timestamp (UTC):** `2026-11-19T16:46:33Z`
**Active Phase Scope:** `PH00` (`PH00-F001` through `PH00-F012` ONLY)
**Current Phase Status:** `PARTIAL / NOT VERIFIED` (Awaiting Remediation Execution & Explicit Founder Acceptance)
**Future Phases (`PH01`–`PH17`):** `NOT_STARTED`
**Repository File Modification Status:** `0 SOURCE FILES MODIFIED` (Strict compliance with Pre-Implementation Mandate)

---

## SECTION 1 — DOCUMENT CONTROL, STATUS VOCABULARY & NON-NEGOTIABLE RULES

### 1.1 Mandatory Status Vocabulary

Throughout this report and all verification matrices, status classifications strictly follow the authoritative definitions below:

- **`VERIFIED`**: Supported by reproducible runtime execution, code inspection, database proof, or dated primary documentary evidence currently present in the repository. A statement in prose, comments, mock data, or self-declared reports is never proof of `VERIFIED` status.
- **`NOT VERIFIED`**: Implementation is missing, defective, bypassed, or fails one or more Blueprint requirements or negative security tests.
- **`PENDING`**: Requires an explicit Product Owner / Founder decision (`DEC-001`..`DEC-026`), empirical user/partner interview validation, or external legal/tax counsel written opinion (`LEG-001`..`LEG-015`).
- **`GATED`**: Intentionally disabled in code and configuration until named legal, regulatory, licensing, insurance, or 24/7 operational staffing preconditions are evidenced.
- **`BLOCKED`**: Cannot be executed in the current runtime environment due to an unprovisioned external dependency or credential (`DEP-001`..`DEP-010`).

### 1.2 Audit Methodology & Runtime Environment Evidence

Every finding in this report was established by directly reading the repository source files and executing live reproduction commands against the running Node.js + Express + Vite server (`http://localhost:3000`) in `/app/applet`:

| Environment Dimension | Inspected Value & Verification Evidence | Status |
| :--- | :--- | :---: |
| **Runtime & Frameworks** | Linux container (`/app/applet`), Node.js `v22.23.2`, `express v4.21.2`, `react v19.0.1`, `vite v8.3.0`, `typescript v7.0.2`, `tsx v4.21.0` | `VERIFIED` |
| **Local Transactional SQL Engine** | Node `v22.23.2` built-in `node:sqlite` (`DatabaseSync`, `StatementSync`) available in runtime; supports disk persistence, `WAL`, `FOREIGN KEYS`, `CHECK` constraints, triggers, and `BEGIN IMMEDIATE ... COMMIT/ROLLBACK` transactions | `VERIFIED` (Available for remediation; currently unused by `src/domain/store.ts`) |
| **Cryptographic Primitives** | Node `v22.23.2` built-in `node:crypto` (`scryptSync`, `createHmac`, `timingSafeEqual`, `randomBytes`, `createHash`) available in runtime | `VERIFIED` (Available for remediation; currently unused) |
| **Managed Cloud SQL (PostgreSQL)** | `cloudsql.CheckFeatureEligibility` returned `{"reason":"NO_VALID_PROJECT"}` | `BLOCKED` (`DEP-001`) |
| **Firebase Auth / Firestore** | Declined during environment setup; explicitly excluded per Founder directive | `GATED` |
| **Operational Persistence in Current Code** | `PheriNepalDomainStore` (`/src/domain/store.ts:230–1020`) uses volatile in-memory JavaScript arrays and `Map`s | `NOT VERIFIED` (`FND-008`) |

---

## SECTION 2 — GOOGLE AI BASELINE REPORT VS. INDEPENDENT REPOSITORY AUDIT COMPARISON

### 2.1 Comparison of Baseline Claims vs. Independent Source-Code Inspection

1. **Evaluation of Pre-Existing Repository Self-Audit (`/PH00_AUDIT_REPORT.md` & `/RISK_REGISTER.md`):**
   - **Repository Self-Claim:** `/RISK_REGISTER.md` lines `13–22` and `/src/domain/ph00Governance.ts` lines `25–133` mark `RSK-001`, `RSK-002`, `RSK-005`, `RSK-006`, `RSK-007`, and `RSK-010` as `MITIGATED_IN_SANDBOX`.
   - **Independent Audit Verdict:** **`NOT VERIFIED` (Refuted by Reproducible Code Defects).** The sandbox does not mitigate privilege escalation (`RSK-010`), data privacy (`RSK-007`), partner compliance (`RSK-005`), concurrency (`RSK-002`), or payment/booking desynchronization (`RSK-001`) because endpoints lack authentication, trust client booleans (`mfaVerified`, `simulatePaymentSuccess`), compare spoofable email strings in request bodies, share a single global privacy consent object across all users, and run invariant checks directly on live in-memory state.
2. **Evaluation of the 12 Core Baseline Audit Findings (`FND-001` through `FND-012`):**
   - All 12 core findings (`FND-001` through `FND-012`) are **CONFIRMED** in the actual source files.
   - **Exact Line & Count Corrections Established by Independent Inspection:**
     - **Prematurely `AVAILABLE` Categories Count (`FND-012`):** In `/src/domain/catalogue.ts` (lines `87–690`), there are **8** categories marked `status: 'AVAILABLE'`:
       1. `#1 hotels` (`/src/domain/catalogue.ts:95`)
       2. `#2 homestays` (`/src/domain/catalogue.ts:114`)
       3. `#3 adventures` (`/src/domain/catalogue.ts:133`)
       4. `#4 trekking` (`/src/domain/catalogue.ts:152`)
       5. `#6 guides` (`/src/domain/catalogue.ts:191`)
       6. `#7 transport` (`/src/domain/catalogue.ts:210`)
       7. `#15 restaurants` (`/src/domain/catalogue.ts:364`)
       8. `#16 local-experiences` (`/src/domain/catalogue.ts:382`)
       Meanwhile, `/src/App.tsx:742` hardcodes `"31 / 31 Registered (7 AVAILABLE · 12 INFO_ONLY · 6 RESTRICTED/GATED · 6 COMING_SOON)"` and `/PH00_AUDIT_REPORT.md:40` claims `"7 were set to AVAILABLE"`, contradicting the actual array in `/src/domain/catalogue.ts` (`8 AVAILABLE, 5 COMING_SOON, 12 INFORMATION_ONLY, 6 RESTRICTED`).
     - **Additional Defects Uncovered Beyond the 12 Baseline Findings:** Independent line-by-line inspection uncovered **16 additional defects (`FND-013` through `FND-028`)** in `/server.ts`, `/src/domain/store.ts`, `/src/domain/catalogue.ts`, `/src/domain/ph00Governance.ts`, `/src/App.tsx`, and `/scripts/verify-ph00.ts`.

### 2.2 Summary Classification of Findings

| Audit Disposition | Finding IDs | Count |
| :--- | :--- | :---: |
| **CONFIRMED (Baseline Findings Verified in Code)** | `FND-001`, `FND-002`, `FND-003`, `FND-004`, `FND-005`, `FND-006`, `FND-007`, `FND-008`, `FND-009`, `FND-010`, `FND-011` | 11 |
| **CONFIRMED WITH EXACT COUNT & LINE CORRECTION** | `FND-012` (8 prematurely `AVAILABLE` categories in `catalogue.ts` vs. hardcoded `"7 AVAILABLE"` in `App.tsx:742`) | 1 |
| **ADDITIONAL DEFECTS DISCOVERED BY INDEPENDENT AUDIT** | `FND-013`, `FND-014`, `FND-015`, `FND-016`, `FND-017`, `FND-018`, `FND-019`, `FND-020`, `FND-021`, `FND-022`, `FND-023`, `FND-024`, `FND-025`, `FND-026`, `FND-027`, `FND-028` | 16 |
| **UNCONFIRMED** | *None* | 0 |
| **TOTAL CONFIRMED DEFECTS REQUIRING REMEDIATION** | **`FND-001` through `FND-028`** | **28** |

---

## SECTION 3 — COMPLETE FINDINGS REGISTER (`FND-001` THROUGH `FND-028`)

Every finding below documents its severity, domain, exact file and line locations, Blueprint requirement, current implementation, reproducible defect evidence, root cause, recommended technical fix, measurable acceptance criteria, and required verification test ID.

---

### `FND-001` — No Server-Side Authentication, Session Management, or RBAC Middleware; Endpoints Trust Client-Supplied `actor`, `reviewerEmail`, and `partnerActor`

- **Severity:** `CRITICAL`
- **Google AI Baseline Reference:** `GAP-01` / `SEC-01`
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:79–149` (`PATCH /api/v1/admin/categories/:key/status` reads `actor` from `req.body`)
  - `/server.ts:152–179` (`POST /api/v1/admin/global-switch` reads `actor` from `req.body`)
  - `/server.ts:182–206` (`POST /api/v1/quotes` reads `actor` from `req.body`)
  - `/server.ts:209–231` (`POST /api/v1/bookings` reads `travelerName` from `req.body` with no authenticated user)
  - `/server.ts:234–300` (`POST /api/v1/bookings/:bookingId/partner-decision` reads `partnerActor` from `req.body`)
  - `/server.ts:303–356` (`POST /api/v1/verification/:partnerId/approve` reads `reviewerEmail` from `req.body`)
  - `/server.ts:359–387` (`POST /api/v1/incidents` reads `reporterName` from `req.body`)
  - `/server.ts:390–415` (`POST /api/v1/privacy/consent` has no authentication)
  - `/server.ts:418–529` (`POST /api/v1/admin/verify-invariants` has no authentication)
- **Blueprint Requirement:**
  - Sections 6, 10.1, 13, and 15.1: All non-public endpoints must authenticate the caller via secure server-managed sessions, enforce Role-Based and Permission-Based Access Control (RBAC/ABAC) server-side, and derive the audit actor exclusively from the authenticated session principal.
- **Current Implementation:**
  - No user table, password verification, session store, cookie parser, or authorization middleware exists anywhere in `/server.ts` or `/src/domain/store.ts`. Every endpoint is callable anonymously, and audit logs record whatever `actor` string the client supplies in `req.body`.
- **Reproducible Defect Evidence:**
  ```bash
  curl -i -X PATCH http://localhost:3000/api/v1/admin/categories/hotels/status \
    -H "Content-Type: application/json" \
    -d '{"newStatus":"TEMPORARILY_UNAVAILABLE","reason":"Anonymous takeover","actor":"spoofed.admin@evil.test","mfaVerified":true}'
  ```
  Returns `HTTP/1.1 200 OK`, mutates `hotels` to `TEMPORARILY_UNAVAILABLE`, and writes an official `PLATFORM_ADMIN` audit event under `actor: "spoofed.admin@evil.test"`.
- **Root Cause:**
  Complete absence of an identity, authentication, session, and RBAC layer.
- **Recommended Technical Fix:**
  1. Create `users` and `sessions` tables in `/src/db/database.ts` with `crypto.scryptSync` password hashes and HMAC-SHA256 signed session tokens (`HttpOnly; SameSite=Strict; Path=/`).
  2. Implement `authenticateSession`, `requireAuth`, and `requireRole(...roles)` in `/src/middleware/security.ts`.
  3. Reject any request body containing `actor`, `actorRole`, `reviewerEmail`, or `partnerActor` with `HTTP 400 FORBIDDEN_CLIENT_SECURITY_FIELD`. Derive actor identity strictly from `req.session`.
- **Measurable Acceptance Criteria:**
  - 100% of protected routes return `HTTP 401 UNAUTHORIZED` when called without a valid session token.
  - 100% of role-restricted routes return `HTTP 403 FORBIDDEN_ROLE` when called by an authenticated user lacking the required role.
  - 100% of mutation routes return `HTTP 400 FORBIDDEN_CLIENT_SECURITY_FIELD` if client-supplied identity fields are present in `req.body`.
- **Verification Test ID:** `TEST-AUTH-01` (`SUITE-07`)

---

### `FND-002` — Fake Client-Supplied `mfaVerified` Boolean and React UI Toggle Used as Multi-Factor Authentication

- **Severity:** `CRITICAL`
- **Google AI Baseline Reference:** `GAP-02` / `SEC-02`
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:81–94` (`const { newStatus, reason, actor, mfaVerified } = req.body; if (!mfaVerified) return res.status(403)...`)
  - `/server.ts:153–160` (`const { enabled, reason, actor, mfaVerified } = req.body; if (!mfaVerified) return res.status(403)...`)
  - `/server.ts:305–317` (`const { reviewerEmail, mfaVerified, notes } = req.body; if (!mfaVerified) return res.status(403)...`)
  - `/src/App.tsx:135` (`const [mfaVerifiedSession, setMfaVerifiedSession] = useState<boolean>(true);`)
  - `/src/App.tsx:330, 359, 387` (passes `mfaVerified: mfaVerifiedSession` in JSON request bodies)
  - `/src/App.tsx:637–643` (UI button toggling `MFA Session: VERIFIED / UNVERIFIED` in React state)
- **Blueprint Requirement:**
  - Sections 6, 15.1 & Directive Rules 7 & 8: Privileged staff roles (`PLATFORM_ADMIN`, `COMPLIANCE_OFFICER`, `FINANCE_OFFICER`) must verify genuine server-side Multi-Factor Authentication before executing sensitive operations. Client-supplied MFA flags must never be trusted.
- **Current Implementation:**
  - The server checks `if (!req.body.mfaVerified)` and the frontend provides a client-side boolean toggle button initialized to `true`.
- **Reproducible Defect Evidence:**
  Passing `"mfaVerified": true` in any `curl` JSON body satisfies `/server.ts:88`, `/server.ts:154`, and `/server.ts:311`.
- **Root Cause:**
  Trusting an unauthenticated JSON request body boolean as MFA proof.
- **Recommended Technical Fix:**
  1. Remove `mfaVerified` from all request payloads and remove the fake MFA toggle button from `/src/App.tsx`.
  2. Implement RFC 6238 TOTP (`HMAC-SHA1`, 30-second step, 6-digit code) in `/src/db/database.ts`.
  3. Add `POST /api/v1/auth/mfa/verify` which verifies a 6-digit TOTP code against the authenticated user's server-side `totp_secret` and sets `sessions.mfa_verified = 1` in SQLite.
  4. Enforce `requireMfa` strictly by checking `req.session.mfaVerified === true` from the server-side session record.
- **Measurable Acceptance Criteria:**
  - Privileged mutations with an authenticated session where `mfa_verified === 0` fail with `HTTP 403 MFA_REQUIRED`.
  - Submitting `"mfaVerified": true` in `req.body` fails with `HTTP 400 FORBIDDEN_CLIENT_SECURITY_FIELD`.
  - Submitting an invalid 6-digit TOTP code to `POST /api/v1/auth/mfa/verify` fails with `HTTP 401 INVALID_TOTP_CODE`.
  - Submitting a valid RFC 6238 TOTP code upgrades `sessions.mfa_verified = 1` and enables privileged actions.
- **Verification Test ID:** `TEST-MFA-01` (`SUITE-08`)

---

### `FND-003` — Two-Person Partner Approval Bypassable via Spoofed `reviewerEmail` Strings

- **Severity:** `CRITICAL`
- **Google AI Baseline Reference:** `GAP-03` / `SEC-03`
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:303–356` (`POST /api/v1/verification/:partnerId/approve` reads `reviewerEmail` from `req.body` and checks `partner.primaryReviewer.toLowerCase() === reviewerEmail.toLowerCase()`)
  - `/src/domain/store.ts:670–676` (`evaluateMandatoryBookingGate` Step 12 compares string fields `partner.primaryReviewer !== partner.secondaryApprover`)
  - `/src/App.tsx:155, 322–346` (`secondaryReviewerEmail` state sent in request body)
- **Blueprint Requirement:**
  - Sections 6, 11.4 (Gate #12), 13 (Rule #8), and 15.2: High-risk partner verification requires two-person Separation of Duties (SoD) performed by two distinct, authenticated, MFA-verified compliance/safety officers.
- **Current Implementation:**
  - Identity is checked solely by comparing the client-supplied `req.body.reviewerEmail` string against `partner.primaryReviewer`. A single person can type any two email addresses in consecutive requests.
- **Reproducible Defect Evidence:**
  ```bash
  curl -i -X POST http://localhost:3000/api/v1/verification/PRT-EXP-005/approve \
    -H "Content-Type: application/json" \
    -d '{"reviewerEmail":"anyone@pherinepal.np","mfaVerified":true,"notes":"Spoofed second person"}'
  ```
  Returns `HTTP/1.1 200 OK` and transitions `PRT-EXP-005` (`High-Altitude Peak Expeditions Nepal`, `peak-climbing`) to `status: "VERIFIED"`.
- **Root Cause:**
  Email-string comparison from `req.body` instead of authenticated `req.session.userId` comparison backed by database foreign keys and `CHECK` constraints.
- **Recommended Technical Fix:**
  1. Store `primary_reviewer_user_id` and `secondary_approver_user_id` as foreign keys referencing `users(user_id)` on the `partners` SQL table.
  2. Enforce `CHECK (primary_reviewer_user_id IS NULL OR secondary_approver_user_id IS NULL OR primary_reviewer_user_id <> secondary_approver_user_id)` in SQLite DDL.
  3. Derive the reviewer's user ID and email exclusively from `req.session` (requiring `COMPLIANCE_OFFICER` or `PLATFORM_ADMIN` role + verified MFA).
- **Measurable Acceptance Criteria:**
  - If the same authenticated officer who performed Primary Review attempts Secondary Approval, the server rejects with `HTTP 422 SEPARATION_OF_DUTIES_VIOLATION` and the SQL `CHECK` constraint forbids identical user IDs.
  - Only a second distinct authenticated officer with verified MFA can complete Stage 2 approval.
- **Verification Test ID:** `TEST-SOD-01` (`SUITE-09`)

---

### `FND-004` — Unrestricted Public `GET /api/v1/bootstrap` Leaks Bookings, Financial Ledger Journals, Audit Events, Incidents, Staff Emails, and Privacy Consent

- **Severity:** `CRITICAL`
- **Google AI Baseline Reference:** `GAP-04` / `SEC-04`
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:44–76` (`app.get('/api/v1/bootstrap', ...)` returns `domainStore.bookings`, `domainStore.ledgerEntries`, `domainStore.incidents`, `domainStore.auditEvents.slice(0, 50)`, `domainStore.travelerPrivacyConsent`, and unredacted `domainStore.partners`)
- **Blueprint Requirement:**
  - Sections 6, 15.1, 16 & Directive Rule 9: *"Do not expose bookings, financial records, audit events or private consent through an unrestricted public bootstrap API."*
- **Current Implementation:**
  - `GET /api/v1/bootstrap` returns all bookings, all financial ledger entries, the last 50 audit events, all incidents, internal partner reviewer email addresses (`primaryReviewer`, `secondaryApprover`), and traveler privacy consent to any anonymous caller.
- **Reproducible Defect Evidence:**
  ```bash
  curl -s http://localhost:3000/api/v1/bootstrap | jq '{bookings: (.bookings|length), ledgerEntries: (.ledgerEntries|length), auditEvents: (.auditEvents|length), reviewerEmails: [.partners[].primaryReviewer], consent: .travelerPrivacyConsent}'
  ```
  Anonymous response exposes `1` booking (`BKG-SEED-COMPLETED-01`), `1` 4-line financial journal (`JRN-...`), `1` audit event, `1` incident (`INC-2026-001`), staff reviewer emails (`"compliance.anita@pherinepal.np"`, `"audit.rajesh@pherinepal.np"`, `"safety.pemba@pherinepal.np"`), and `travelerPrivacyConsent` (`TRV-001`).
- **Root Cause:**
  Lack of session-aware role filtering on `/api/v1/bootstrap`.
- **Recommended Technical Fix:**
  Filter `/api/v1/bootstrap` strictly by `req.session`:
  - **Unauthenticated (`PUBLIC`):** `bookings: []`, `ledgerEntries: []`, `auditEvents: []`, `incidents: []`, `travelerPrivacyConsent: null`, and partner records sanitized of `primaryReviewer` / `secondaryApprover` emails.
  - **`TRAVELER`:** Only bookings where `booking.travelerUserId === req.session.userId`, incidents where `incident.reporterUserId === req.session.userId`, and the caller's own `user_privacy_consents` row (`ledgerEntries: []`, `auditEvents: []`).
  - **`PARTNER_OPERATOR`:** Only bookings and listings where `partnerId === req.session.partnerId` (`ledgerEntries: []`, `auditEvents: []`).
  - **`FINANCE_OFFICER` (MFA verified):** `ledgerEntries` and financial summaries.
  - **`COMPLIANCE_OFFICER` / `PLATFORM_ADMIN` (MFA verified):** Full compliance partner reviewer metadata and `auditEvents`.
- **Measurable Acceptance Criteria:**
  - Anonymous `GET /api/v1/bootstrap` returns `0` bookings, `0` ledger entries, `0` audit events, `0` incidents, `null` privacy consent, and `0` staff email addresses in `partners`.
  - Authenticated Traveler A never receives Traveler B's bookings, incidents, or privacy consent.
- **Verification Test ID:** `TEST-BOOT-01` (`SUITE-10`)

---

### `FND-005` — Client-Controlled `simulatePaymentSuccess` Boolean Immediately Marks Bookings `CAPTURED` and Writes Financial Ledger Entries

- **Severity:** `CRITICAL`
- **Google AI Baseline Reference:** `GAP-05` / `FIN-01`
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:211–219` (`const { ..., simulatePaymentSuccess } = req.body; ... simulatePaymentSuccess: simulatePaymentSuccess !== false`)
  - `/src/domain/store.ts:889, 949–965` (`if (!params.simulatePaymentSuccess) ... else if (listing.bookingMode === 'INSTANT') { paymentState = 'CAPTURED'; ... this.recordDoubleEntryCapture(...); } else { paymentState = 'AUTHORIZED'; ... }`)
  - `/src/App.tsx:152, 281` (`simulatePaymentSuccess` state sent in `POST /api/v1/bookings`)
- **Blueprint Requirement:**
  - Sections 11.1 (Rule #5), 12.1, 12.2 & Directive Rule 11: Booking creation must never mark a payment `CAPTURED` or `AUTHORIZED` based on a client request flag. Bookings must start with `paymentState = 'CREATED'` and advance only upon verified payment-provider webhook confirmation.
- **Current Implementation:**
  - `POST /api/v1/bookings` defaults `simulatePaymentSuccess` to `true` (`simulatePaymentSuccess !== false`), immediately marking `INSTANT` bookings `CONFIRMED` + `CAPTURED` and writing a `PAYMENT_CAPTURE_ALLOCATION` ledger entry without any payment gateway verification.
- **Reproducible Defect Evidence:**
  Inspection of `/server.ts:217` and `/src/domain/store.ts:956–964` confirms that every `POST /api/v1/bookings` call without `"simulatePaymentSuccess": false` fabricates an instant payment capture and ledger journal.
- **Root Cause:**
  Demo shortcut `simulatePaymentSuccess` embedded in the booking creation pipeline.
- **Recommended Technical Fix:**
  1. Remove `simulatePaymentSuccess` from `executeAtomicBooking()` and reject any request body containing `simulatePaymentSuccess` with `HTTP 400 FORBIDDEN_CLIENT_SECURITY_FIELD`.
  2. `POST /api/v1/bookings` must always create the booking with `bookingState = 'REQUESTED'`, `inventoryHoldState = 'HELD'`, `paymentState = 'CREATED'`, `payoutState = 'NOT_ELIGIBLE'`, and insert a `payment_intents` row with `status = 'CREATED'`, writing **zero** ledger entries at booking creation time.
- **Measurable Acceptance Criteria:**
  - `POST /api/v1/bookings` always produces `paymentState === 'CREATED'`, `inventoryHoldState === 'HELD'`, and `0` capture ledger journals.
  - Sending `simulatePaymentSuccess` in `POST /api/v1/bookings` returns `HTTP 400 FORBIDDEN_CLIENT_SECURITY_FIELD`.
- **Verification Test ID:** `TEST-PAY-01` (`SUITE-11`)

---

### `FND-006` — Partner Approval (`POST /api/v1/bookings/:bookingId/partner-decision`) Directly Declares Payment `CAPTURED` and Posts Ledger Journals Without Payment Verification

- **Severity:** `CRITICAL`
- **Google AI Baseline Reference:** `GAP-06` / `FIN-02`
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:260–275`:
    ```ts
    if (decision === 'APPROVE') {
      booking.bookingState = 'CONFIRMED';
      booking.inventoryHoldState = 'CONFIRMED';
      booking.paymentState = 'CAPTURED';
      booking.payoutState = 'PENDING_REVIEW';
      ...
      domainStore.recordDoubleEntryCapture(booking.bookingId, `PI-${booking.bookingId}`, booking.quoteSnapshot, partnerActor || booking.partnerName);
    }
    ```
- **Blueprint Requirement:**
  - Sections 11.1 (Rule #5) & 12.1: Partner approval (`BookingState`) and payment capture (`PaymentState`) are separate state machines. A partner approving a booking request cannot declare funds captured or generate financial capture ledger journals without verified payment-provider capture evidence.
- **Current Implementation:**
  - Clicking "Approve" on an `APPROVAL`-mode booking directly sets `booking.paymentState = 'CAPTURED'` and writes a `PAYMENT_CAPTURE_ALLOCATION` ledger entry even if the traveler never paid.
- **Reproducible Defect Evidence:**
  Lines `263` and `269–274` of `/server.ts` unconditionally mutate `booking.paymentState = 'CAPTURED'` and call `domainStore.recordDoubleEntryCapture(...)` inside the partner decision route handler.
- **Root Cause:**
  Conflating partner service approval with payment gateway capture inside `/server.ts:260–275`.
- **Recommended Technical Fix:**
  1. Remove `booking.paymentState = 'CAPTURED'` and `recordDoubleEntryCapture()` from `/api/v1/bookings/:bookingId/partner-decision`.
  2. Require that `booking.paymentState === 'CAPTURED'` (already established by a verified HMAC-SHA256 payment webhook and backed by a `PAYMENT_CAPTURE_ALLOCATION` journal in `ledger_journals`) before a partner `APPROVE` decision can transition `bookingState` to `'CONFIRMED'`. If payment is not yet captured, reject `APPROVE` with `HTTP 409 PAYMENT_CAPTURE_REQUIRED_BEFORE_CONFIRMATION`.
- **Measurable Acceptance Criteria:**
  - Calling `POST /api/v1/bookings/:bookingId/partner-decision` with `decision: 'APPROVE'` when `paymentState !== 'CAPTURED'` fails with `HTTP 409 PAYMENT_CAPTURE_REQUIRED_BEFORE_CONFIRMATION` and writes `0` ledger entries.
- **Verification Test ID:** `TEST-PAY-02` (`SUITE-11`)

---

### `FND-007` — Unisolated Synthetic Seed Booking (`BKG-SEED-COMPLETED-01`) and Fake Financial Ledger Entries Loaded on Startup

- **Severity:** `HIGH`
- **Google AI Baseline Reference:** `GAP-07` / `DATA-01`
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/src/domain/store.ts:594–634` (`constructor()` creates `seedQuote`, pushes `BKG-SEED-COMPLETED-01` with `bookingState: 'COMPLETED'`, `paymentState: 'CAPTURED'`, and calls `this.recordDoubleEntryCapture(seedBookingId, 'PI-SEED-001', seedQuote, 'system-seed')`)
  - `/src/domain/store.ts:537–568` (seeds `INC-2026-001` and `REV-2026-901` referencing `BKG-SEED-COMPLETED-01`)
- **Blueprint Requirement:**
  - Directive Section 3B & 3I: Operational state must not contain fabricated paid bookings or synthetic financial ledger journals disguised as real completed transactions.
- **Current Implementation:**
  - Every server boot initializes `domainStore.bookings` with `BKG-SEED-COMPLETED-01` and `domainStore.ledgerEntries` with `NPR 20,170.50` (`2,017,050` paisa) of fake captured revenue.
- **Reproducible Defect Evidence:**
  Fresh server boot shows `ledgerEntries[0].totalDebitMinor === 2017050` for `BKG-SEED-COMPLETED-01` (`actor: "system-seed"`).
- **Root Cause:**
  Constructor in `/src/domain/store.ts:594–634` seeds synthetic financial and booking data into the primary operational tables.
- **Recommended Technical Fix:**
  1. Remove synthetic booking, quote, ledger, incident, and review seeding from default startup initialization so the operational database starts with `0` bookings, `0` quotes, `0` ledger journals, and `0` incidents.
  2. Stamp any interactive non-PH00 sandbox records created during prototype testing with `environment_scope = 'PROTOTYPE_SANDBOX'` and `prototypeNotice = 'PROTOTYPE_UNACCEPTED_NON_PRODUCTION'`.
- **Measurable Acceptance Criteria:**
  - On fresh database initialization, `SELECT COUNT(*) FROM bookings` is `0` and `SELECT COUNT(*) FROM ledger_journals` is `0`.
- **Verification Test ID:** `TEST-SEED-01` (`SUITE-10`)

---

### `FND-008` — Ephemeral In-Memory JavaScript Arrays & `Map`s Instead of Persistent Transactional SQL Storage

- **Severity:** `HIGH`
- **Google AI Baseline Reference:** `GAP-08` / `DATA-02`
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/src/domain/store.ts:230–236` (`categories`, `processedIdempotencyKeys`, `partners`, `listings`)
  - `/src/domain/store.ts:470–474` (`quotes = new Map()`, `bookings = []`, `ledgerEntries = []`, `auditEvents = []`, `officialSources = []`, `incidents = []`, `reviews = []`, `decisions = []`, `travelerPrivacyConsent = {...}`)
- **Blueprint Requirement:**
  - Sections 9.1, 9.2, 11.2, 12.2 & Directive Section 3C: Persistent relational storage with ACID transactions, foreign keys, uniqueness constraints, check constraints, migrations, and restart durability.
- **Current Implementation:**
  - 100% of platform state is held in volatile RAM inside the `domainStore` singleton instance and vanishes on process restart.
- **Reproducible Defect Evidence:**
  Any state change (category status transition, quote, booking, or audit event) disappears when `tsx server.ts` restarts.
- **Root Cause:**
  No SQL persistence engine wired to `PheriNepalDomainStore`.
- **Recommended Technical Fix:**
  1. Implement `/src/db/database.ts` using Node 22 built-in `node:sqlite` (`DatabaseSync`) storing persistent relational tables in `/data/pherinepal.sqlite` with `PRAGMA journal_mode = WAL` and `PRAGMA foreign_keys = ON`.
  2. Implement versioned DDL migrations (`schema_migrations`), `BEGIN IMMEDIATE ... COMMIT/ROLLBACK` transactional wrappers, and SQL `CHECK` / `UNIQUE` / `FOREIGN KEY` constraints and triggers.
  3. Disclose honestly that while local transactional SQL persistence is verified via `node:sqlite`, external managed Cloud SQL for PostgreSQL remains `BLOCKED` / `GATED` on `DEP-001` (`NO_VALID_PROJECT`).
- **Measurable Acceptance Criteria:**
  - Data written to `/data/pherinepal.sqlite` survives closing and reopening the database connection and restarting the server process.
  - Database-level `CHECK`, `UNIQUE`, `FOREIGN KEY`, and immutable audit triggers actively reject invalid writes and roll back transactions atomically.
- **Verification Test ID:** `TEST-DB-01` (`SUITE-12`)

---

### `FND-009` — Verification Endpoint (`POST /api/v1/admin/verify-invariants`) Mutates Live Operational State in a Sequential Loop

- **Severity:** `HIGH`
- **Google AI Baseline Reference:** `GAP-09` / `TEST-01`
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:418–529`:
    ```ts
    const testListing = domainStore.listings.find((l) => l.listingId === 'LST-HMS-102')!;
    const savedUnits = testListing.availableUnits;
    testListing.availableUnits = 1; // Set to 1 final unit
    const q1 = domainStore.createImmutableQuote(testListing.listingId, 1, 'RaceUser-A');
    const q2 = domainStore.createImmutableQuote(testListing.listingId, 1, 'RaceUser-B');
    ...
    domainStore.executeAtomicBooking({ quoteId: q1.quoteId, travelerName: 'RaceUser-A', ... });
    domainStore.executeAtomicBooking({ quoteId: q2.quoteId, travelerName: 'RaceUser-B', ... });
    testListing.availableUnits = Math.max(1, savedUnits);
    ```
- **Blueprint Requirement:**
  - Directive Rule 12 & Section 3H: *"Do not describe sequential booking attempts as a concurrent database test... Testing endpoints must NEVER mutate real operational state."*
- **Current Implementation:**
  - Calling `POST /api/v1/admin/verify-invariants` directly mutates `LST-HMS-102` in the live `domainStore`, permanently inserts `RaceUser-A` bookings, quotes, double-entry ledger entries, and audit events into the live store, and runs two synchronous sequential calls (`try { executeAtomicBooking(q1) } ... try { executeAtomicBooking(q2) }`) instead of concurrent transactions.
- **Reproducible Defect Evidence:**
  Calling `POST /api/v1/admin/verify-invariants` three times adds 3 permanent `RaceUser-A` bookings and 3 permanent ledger journals to `GET /api/v1/bootstrap`.
- **Root Cause:**
  Executing verification tests against the live singleton `domainStore` rather than an isolated temporary SQLite database file.
- **Recommended Technical Fix:**
  1. Require `PLATFORM_ADMIN` or `COMPLIANCE_OFFICER` authentication + verified MFA on `POST /api/v1/admin/verify-invariants`.
  2. Execute all invariant and concurrency tests against a disposable isolated SQLite database file (`/tmp/pherinepal-verify-<uuid>.sqlite`) created by `createIsolatedTestDatabase()` and deleted in a `finally` block.
  3. Test concurrency using multiple parallel worker transactions (`Promise.all` across independent database connections/transactions contesting a 1-unit listing with `BEGIN IMMEDIATE` locking) and assert that operational database row counts before and after the endpoint call are 100% identical.
- **Measurable Acceptance Criteria:**
  - Pre-test and post-test row counts across all tables in `/data/pherinepal.sqlite` are 100% identical (`delta === 0`).
  - Parallel reservation contention on a 1-unit listing commits at most 1 booking and rejects all competing transactions with `available_units === 0`.
- **Verification Test ID:** `TEST-CONC-01` (`SUITE-12`)

---

### `FND-010` — Global Singleton `travelerPrivacyConsent` Shared Across All Users Instead of Traveler-Isolated Records

- **Severity:** `HIGH`
- **Google AI Baseline Reference:** `GAP-10` / `PRIV-01`
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/src/domain/store.ts:584–592` (`public travelerPrivacyConsent = { travelerId: 'TRV-001', ... }`)
  - `/server.ts:390–415` (`POST /api/v1/privacy/consent` mutates `domainStore.travelerPrivacyConsent` globally and logs `actor: 'Aarav Sharma (TRV-001)'`)
- **Blueprint Requirement:**
  - Sections 14, 16 & Directive Section 3F: Separate consent records by authenticated traveler, recording consent version, timestamp, purpose, auto-expiry, and immediate consent withdrawal.
- **Current Implementation:**
  - A single global JavaScript object is mutated by every visitor; there is no per-user isolation and no dedicated consent withdrawal endpoint.
- **Reproducible Defect Evidence:**
  Any anonymous `POST /api/v1/privacy/consent` request overwrites `domainStore.travelerPrivacyConsent` for all users on the platform.
- **Root Cause:**
  Singleton object used instead of a `user_id`-scoped relational table.
- **Recommended Technical Fix:**
  1. Create the `user_privacy_consents` SQL table keyed by `user_id` storing `consent_version`, `purpose`, `during_trip_gps_sharing_opt_in`, `gps_sharing_granted_at_utc`, `gps_sharing_expires_at_utc`, `gps_sharing_revoked_at_utc`, `ai_prompt_pii_redaction_enabled`, `marketing_notifications_opt_in`, `retention_policy_version`, and `updated_at_utc`.
  2. Require `requireAuth` on `GET /api/v1/privacy/consent`, `POST /api/v1/privacy/consent`, and `POST /api/v1/privacy/consent/revoke`.
- **Measurable Acceptance Criteria:**
  - Traveler A updating or revoking consent modifies only Traveler A's row in `user_privacy_consents` and has zero effect on Traveler B's consent state.
- **Verification Test ID:** `TEST-PRIV-01` (`SUITE-13`)

---

### `FND-011` — Missing Rate Limiting, Brute-Force Protection, CORS Policy, and Strict Input Validation

- **Severity:** `HIGH`
- **Google AI Baseline Reference:** `GAP-11` / `SEC-05`
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:28–41` (mounts `express.json({ limit: '1mb' })` with no rate limiter, no auth brute-force limiter, no CORS policy, and no request schema validation middleware)
- **Blueprint Requirement:**
  - Sections 10.1, 15.1 & Directive Section 3A & 3G: Rate limiting, brute-force login protection, strict input schema validation, security headers, and CORS enforcement.
- **Current Implementation:**
  - Unlimited request rates are accepted on all endpoints; malformed JSON types or missing fields are coerced with `||` fallback defaults instead of returning `HTTP 400`.
- **Reproducible Defect Evidence:**
  Sending 100 rapid POST requests to `/api/v1/quotes` or `/api/v1/admin/global-switch` never returns `HTTP 429`.
- **Root Cause:**
  Absence of rate-limiting and schema-validation middleware in `/server.ts`.
- **Recommended Technical Fix:**
  1. Implement sliding-window rate-limiting middleware in `/src/middleware/security.ts` (e.g., 10 requests / minute on `/api/v1/auth/login` and `/api/v1/auth/mfa/verify`, 60 requests / minute on mutation routes) returning `HTTP 429 TOO_MANY_REQUESTS` with `Retry-After` header.
  2. Implement declarative schema validation middleware rejecting invalid types, negative numbers, unknown fields, and forbidden security fields with `HTTP 400 VALIDATION_ERROR`.
  3. Add explicit CORS and security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Cache-Control: no-store` on `/api/*`).
- **Measurable Acceptance Criteria:**
  - Exceeding the rate limit window returns `HTTP 429` with `Retry-After`.
  - Malformed input payloads return `HTTP 400` before reaching domain logic.
- **Verification Test ID:** `TEST-RATE-01` (`SUITE-14`)

---

### `FND-012` — 8 Prematurely `AVAILABLE` Categories in `catalogue.ts` (vs. Hardcoded `"7 AVAILABLE"` in `App.tsx`), Incomplete 22-Point Appendix A Service Contracts, and Overstated `MITIGATED_IN_SANDBOX` Risk Statuses

- **Severity:** `HIGH`
- **Google AI Baseline Reference:** `GAP-12` / `GOV-01`
- **Audit Status:** `CONFIRMED WITH EXACT COUNT & LINE CORRECTION` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/src/domain/catalogue.ts:95, 114, 133, 152, 191, 210, 364, 382` (8 categories set to `status: 'AVAILABLE'`: `hotels`, `homestays`, `adventures`, `trekking`, `guides`, `transport`, `restaurants`, `local-experiences`)
  - `/src/App.tsx:742` (hardcodes `"31 / 31 Registered (7 AVAILABLE · 12 INFO_ONLY · 6 RESTRICTED/GATED · 6 COMING_SOON)"`)
  - `/src/domain/catalogue.ts:65–85` (`ServiceCategory` interface models only 11 domain properties instead of all 22 Appendix A Service Contract Checklist requirements)
  - `/RISK_REGISTER.md:13–22` & `/src/domain/ph00Governance.ts:25–133` (marks `RSK-001`, `RSK-002`, `RSK-005`, `RSK-006`, `RSK-007`, `RSK-010` as `MITIGATED_IN_SANDBOX`)
- **Blueprint Requirement:**
  - Sections 5, 5.1, 21.1 (`PH00-F004`, `PH00-F008`), 32 (`DEC-001`, `DEC-003`), and Appendix A (lines `1593–1643`):
    1. No category may be enabled as production `AVAILABLE` before Owner decision `DEC-001` (pilot region & first live category) and `DEC-003` (transactional classification) are approved and owning implementation phases (`PH07`–`PH10`) are completed.
    2. Every one of the 31 categories must define all 22 Appendix A Service Contract items.
    3. Risk registers must report truthful mitigation status without overstating sandbox work.
- **Current Implementation:**
  - 8 categories are marked `AVAILABLE` in `catalogue.ts`, `App.tsx:742` miscounts them as `"7 AVAILABLE"`, 14 of the 22 Appendix A contract items are missing or partial on `ServiceCategory`, and `RISK_REGISTER.md` claims `MITIGATED_IN_SANDBOX`.
- **Reproducible Defect Evidence:**
  `CANONICAL_CATEGORIES.filter(c => c.status === 'AVAILABLE').length` evaluates to `8`, contradicting `/src/App.tsx:742` (`"7 AVAILABLE"`) and violating the `DEC-001: PENDING` gate.
- **Root Cause:**
  Premature assignment of `AVAILABLE` status in `catalogue.ts`, hardcoded summary text in `App.tsx`, abbreviated `ServiceCategory` interface, and optimistic risk statuses in `RISK_REGISTER.md`.
- **Recommended Technical Fix:**
  1. Set default PH00 governance status for all 8 prematurely `AVAILABLE` categories to `COMING_SOON` (yielding **`0 AVAILABLE, 13 COMING_SOON, 12 INFORMATION_ONLY, 6 RESTRICTED`** in default PH00 governance mode, while preserving `targetPilotStatus: 'AVAILABLE'` gated on `DEC-001` and an explicit isolated `PROTOTYPE_SANDBOX` test helper for invariant testing).
  2. Compute category status counts dynamically in `/src/App.tsx`.
  3. Add the complete 22-field `appendixAContract: AppendixAServiceContract` (`item01` through `item22`) to all 31 categories (`31 × 22 = 682` contract fields).
  4. Update `/RISK_REGISTER.md` and `/src/domain/ph00Governance.ts` risk statuses to truthful PH00 classifications.
- **Measurable Acceptance Criteria:**
  - In default PH00 governance state, `AVAILABLE` count is `0` (`13 COMING_SOON, 12 INFORMATION_ONLY, 6 RESTRICTED`).
  - All `31 × 22 = 682` Appendix A contract fields are non-empty and validated by `SUITE-04`.
- **Verification Test ID:** `TEST-GOV-04` (`SUITE-04`, `SUITE-06`)

---

### `FND-013` — Unauthenticated Global Booking Kill-Switch (`POST /api/v1/admin/global-switch`)

- **Severity:** `CRITICAL`
- **Google AI Baseline Reference:** *Additional Defect Discovered by Independent Audit*
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:152–179` (`app.post('/api/v1/admin/global-switch', ...)` reads `enabled, reason, actor, mfaVerified` from `req.body` with zero session authentication or RBAC)
- **Blueprint Requirement:**
  - Sections 6, 11.4 (Gate #1), and 15.1: Toggling the platform-wide emergency global booking switch requires an authenticated `PLATFORM_ADMIN` session with verified server-side MFA.
- **Current Implementation:**
  - Any anonymous client sending `{"enabled": false, "mfaVerified": true}` disables all booking activity across the platform.
- **Reproducible Defect Evidence:**
  ```bash
  curl -i -X POST http://localhost:3000/api/v1/admin/global-switch \
    -H "Content-Type: application/json" \
    -d '{"enabled":false,"reason":"Anonymous shutdown","actor":"attacker@evil.test","mfaVerified":true}'
  ```
  Returns `HTTP/1.1 200 OK` with `{"globalBookingSwitch":false}`.
- **Root Cause:**
  Missing `requireAuth`, `requireRole('PLATFORM_ADMIN')`, and server-side `requireMfa` on `/api/v1/admin/global-switch`.
- **Recommended Technical Fix:**
  Protect `POST /api/v1/admin/global-switch` with `requireAuth`, `requireRole('PLATFORM_ADMIN')`, and `requireMfa`, persist `global_booking_switch` in the `platform_config` SQL table, and require a non-empty `reason` string (`>= 10` chars).
- **Measurable Acceptance Criteria:**
  - Anonymous or non-admin calls to `POST /api/v1/admin/global-switch` return `HTTP 401` or `HTTP 403`.
  - Authenticated `PLATFORM_ADMIN` without verified TOTP MFA returns `HTTP 403 MFA_REQUIRED`.
- **Verification Test ID:** `TEST-GOV-05` (`SUITE-07`)

---

### `FND-014` — Single-Stage Partner Verification Bypass & Missing Runtime State Machine Validation on `POST /api/v1/verification/:partnerId/approve`

- **Severity:** `CRITICAL`
- **Google AI Baseline Reference:** *Additional Defect Discovered by Independent Audit*
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:303–356` (`POST /api/v1/verification/:partnerId/approve` checks `if (partner.primaryReviewer && partner.primaryReviewer.toLowerCase() === reviewerEmail.toLowerCase())` and then unconditionally sets `partner.status = 'VERIFIED'`)
- **Blueprint Requirement:**
  - Sections 13 (Rule #8) & 15.2: Partner verification must enforce a strict two-stage state machine:
    1. `PENDING_PRIMARY_REVIEW` → Stage 1 Primary Review by Compliance Officer A → `PENDING_SECOND_APPROVAL`
    2. `PENDING_SECOND_APPROVAL` → Stage 2 Secondary Approval by distinct Compliance Officer B → `VERIFIED`
- **Current Implementation:**
  - `/server.ts:329–340` never checks `partner.status === 'PENDING_SECOND_APPROVAL'` and never requires `partner.primaryReviewer` to be non-null! If a partner has no `primaryReviewer` (or is in `SUSPENDED` / `RESTRICTED` status), calling `/api/v1/verification/:partnerId/approve` skips Primary Review entirely and sets `partner.status = 'VERIFIED'` with only a single reviewer.
- **Reproducible Defect Evidence:**
  In `/server.ts:329`, `if (partner.primaryReviewer && ...)` evaluates to `false` when `partner.primaryReviewer` is `undefined`, proceeding directly to line `340`: `partner.status = 'VERIFIED'`.
- **Root Cause:**
  Missing Stage 1 (`review-primary`) endpoint, missing runtime state precondition check (`partner.status === 'PENDING_SECOND_APPROVAL'`), and missing SQL `CHECK` constraint requiring both `primary_reviewer_user_id IS NOT NULL` and `secondary_approver_user_id IS NOT NULL` when `status = 'VERIFIED'`.
- **Recommended Technical Fix:**
  1. Add `POST /api/v1/verification/:partnerId/review-primary` (requires `COMPLIANCE_OFFICER` + MFA) to transition `PENDING_PRIMARY_REVIEW` → `PENDING_SECOND_APPROVAL` and record `primary_reviewer_user_id`.
  2. Enforce in `POST /api/v1/verification/:partnerId/approve` that `partner.status === 'PENDING_SECOND_APPROVAL'` and `partner.primary_reviewer_user_id IS NOT NULL`, otherwise return `HTTP 422 INVALID_PARTNER_VERIFICATION_STATE`.
  3. Enforce `CHECK (status <> 'VERIFIED' OR (primary_reviewer_user_id IS NOT NULL AND secondary_approver_user_id IS NOT NULL AND primary_reviewer_user_id <> secondary_approver_user_id))` in SQLite.
- **Measurable Acceptance Criteria:**
  - Calling `/approve` on a partner in `PENDING_PRIMARY_REVIEW`, `SUSPENDED`, or `VERIFIED` state returns `HTTP 422 INVALID_PARTNER_VERIFICATION_STATE`.
- **Verification Test ID:** `TEST-SOD-02` (`SUITE-09`)

---

### `FND-015` — Missing Partner Ownership Verification on `POST /api/v1/bookings/:bookingId/partner-decision`

- **Severity:** `HIGH`
- **Google AI Baseline Reference:** *Additional Defect Discovered by Independent Audit*
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:234–300` (`POST /api/v1/bookings/:bookingId/partner-decision` looks up `booking` by `bookingId` and applies `decision` without verifying that the authenticated caller owns `booking.partnerId`)
- **Blueprint Requirement:**
  - Sections 6, 15.1 & Directive Section 3A (*"Partner ownership verification"*): A partner operator may only view, approve, or decline bookings belonging to their own verified partner organization (`req.session.partnerId === booking.partnerId`).
- **Current Implementation:**
  - Any caller can approve or decline any partner's booking by passing `bookingId` in the URL path.
- **Reproducible Defect Evidence:**
  `/server.ts:234–257` performs zero check comparing the caller's partner organization to `booking.partnerId`.
- **Root Cause:**
  Missing tenant/partner record-level ownership check (`ABAC`).
- **Recommended Technical Fix:**
  In `POST /api/v1/bookings/:bookingId/partner-decision`, require `requireAuth` and verify that either:
  - `req.session.role === 'PARTNER_OPERATOR'` AND `req.session.partnerId === booking.partnerId`, OR
  - `req.session.role === 'PLATFORM_ADMIN'` AND `req.session.mfaVerified === true`.
  Otherwise return `HTTP 403 PARTNER_OWNERSHIP_MISMATCH`.
- **Measurable Acceptance Criteria:**
  - Partner Operator A attempting to approve or decline Partner Operator B's booking receives `HTTP 403 PARTNER_OWNERSHIP_MISMATCH`.
- **Verification Test ID:** `TEST-AUTH-02` (`SUITE-07`)

---

### `FND-016` — Duplicate Ledger Entry Vulnerability, Missing Refund/Reversal Ledger Logic, and Service Fee Misallocation in `recordDoubleEntryCapture`

- **Severity:** `HIGH`
- **Google AI Baseline Reference:** *Additional Defect Discovered by Independent Audit*
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/src/domain/store.ts:785–786`:
    ```ts
    const platformCommissionMinor = Math.round((baseAmountMinor * commissionBps) / 10000);
    const partnerReceivableMinor = baseAmountMinor + mandatoryFeeMinor - platformCommissionMinor;
    ```
  - `/src/domain/store.ts:819–879` (`recordDoubleEntryCapture` has no deduplication check and no `PLATFORM_SERVICE_FEE_REVENUE` line)
  - `/server.ts:276–286` (when partner declines a booking, sets `booking.paymentState = 'REVERSED'` without creating any reversal/refund ledger journal)
- **Blueprint Requirement:**
  - Sections 12.2, 12.3, 12.4 & Directive Section 3B:
    1. Prevent duplicate ledger entries for the same booking event.
    2. Separate platform commission revenue, platform mandatory service fee revenue, partner payable liability, and VAT payable accurately.
    3. Record balanced double-entry reversal/refund journals whenever a captured payment is refunded.
- **Current Implementation:**
  - `recordDoubleEntryCapture` appends a new `LedgerJournalEntry` every time it is called with no uniqueness constraint on `(bookingId, eventType)`.
  - `mandatoryFeeMinor` (`mandatoryServiceFeeMinorNpr * quantity`) is added to `partnerReceivableMinor` instead of being accounted for in a dedicated `PLATFORM_SERVICE_FEE_REVENUE` credit line (or explicitly itemized).
  - No `recordDoubleEntryRefund` method or `POST /api/v1/bookings/:bookingId/refund` / `cancel` endpoint exists.
- **Reproducible Defect Evidence:**
  Inspecting `/src/domain/store.ts:819–879` confirms `this.ledgerEntries.unshift(journal)` runs unconditionally without checking if a `PAYMENT_CAPTURE_ALLOCATION` journal already exists for `bookingId`.
- **Root Cause:**
  Missing database uniqueness constraint `UNIQUE(booking_id, event_type)` on `ledger_journals`, missing `PLATFORM_SERVICE_FEE_REVENUE` ledger account, and missing refund journal generator.
- **Recommended Technical Fix:**
  1. Add `UNIQUE(booking_id, event_type)` on the `ledger_journals` SQLite table.
  2. Separate `platformFeeRevenueMinor = mandatoryFeeMinor` and `partnerReceivableMinor = baseAmountMinor - platformCommissionMinor` in `ImmutableQuoteSnapshot`, and write 5 balanced lines in `PAYMENT_CAPTURE_ALLOCATION`:
     - `DEBIT PLATFORM_COLLECTION_CLEARING` = `totalPayableMinor`
     - `CREDIT PARTNER_PAYABLE_LIABILITY` = `partnerReceivableMinor`
     - `CREDIT PLATFORM_COMMISSION_REVENUE` = `platformCommissionMinor`
     - `CREDIT PLATFORM_SERVICE_FEE_REVENUE` = `mandatoryFeeMinor`
     - `CREDIT TAX_VAT_PAYABLE` = `taxAmountMinor`
  3. Implement `recordDoubleEntryRefund()` and `POST /api/v1/bookings/:bookingId/refund` (requiring `FINANCE_OFFICER` or `PLATFORM_ADMIN` + verified MFA) and `POST /api/v1/bookings/:bookingId/cancel`, posting an exact balanced `REFUND_REVERSAL` journal.
- **Measurable Acceptance Criteria:**
  - Every journal in `ledger_journals` satisfies `total_debit_minor === total_credit_minor`.
  - Attempting to insert a second `PAYMENT_CAPTURE_ALLOCATION` or second `REFUND_REVERSAL` journal for the same `booking_id` is rejected by SQLite `UNIQUE(booking_id, event_type)`.
- **Verification Test ID:** `TEST-FIN-03` (`SUITE-11`)

---

### `FND-017` — Missing Signed Payment-Provider Webhook Endpoint (`POST /api/v1/payments/webhooks/provider`) and Payment Intent State Machine

- **Severity:** `HIGH`
- **Google AI Baseline Reference:** *Additional Defect Discovered by Independent Audit*
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:1–641` (no `/api/v1/payments/*` routes exist anywhere in `/server.ts`)
  - `/src/domain/store.ts:133–145` (`paymentIntentId` is a fabricated string `'PI-' + bookingId` with no `payment_intents` or `payment_webhook_events` table)
- **Blueprint Requirement:**
  - Sections 12.1, 12.2 (`PH08-F001`..`PH08-F004`) & Directive Section 3B: Implement payment-provider verification architecture with HMAC-signed webhooks, idempotent event deduplication, and strict separation of authorization, capture, refund, and settlement.
- **Current Implementation:**
  - No webhook route, no signature verification, and no webhook event deduplication table exist.
- **Reproducible Defect Evidence:**
  `grep -rn "webhooks" server.ts src/` returns `0` matches.
- **Root Cause:**
  Payment verification architecture was bypassed in favor of `simulatePaymentSuccess`.
- **Recommended Technical Fix:**
  1. Create `payment_intents` and `payment_webhook_events` (`UNIQUE(provider_event_id)`) tables in `/src/db/database.ts`.
  2. Implement `POST /api/v1/payments/webhooks/provider` in `/server.ts`, verifying the `X-Payment-Signature` HMAC-SHA256 header computed over the raw JSON payload using `PAYMENT_WEBHOOK_SECRET` via `crypto.timingSafeEqual`.
  3. Process `payment.authorized`, `payment.captured`, `payment.failed`, and `payment.refunded` atomically inside `BEGIN IMMEDIATE` transactions, while keeping live external PSP credentials (`eSewa`, `Khalti`, `Fonepay`, `Stripe`) honestly marked `GATED` on `DEP-003` / `DEC-008`.
- **Measurable Acceptance Criteria:**
  - Unsigned or tampered webhook requests fail with `HTTP 401 INVALID_WEBHOOK_SIGNATURE`.
  - Valid signed `payment.captured` webhook transitions `payment_state` from `CREATED`/`AUTHORIZED` to `CAPTURED` and writes the balanced double-entry journal.
  - Replaying the same `providerEventId` returns `HTTP 200 { idempotentReplay: true }` with zero duplicate state mutations or ledger entries.
- **Verification Test ID:** `TEST-PAY-03` (`SUITE-11`)

---

### `FND-018` — Unbound Global Idempotency Keys Allow Cross-Traveler Booking Disclosure (IDOR) and Payload Substitution

- **Severity:** `HIGH`
- **Google AI Baseline Reference:** *Additional Defect Discovered by Independent Audit*
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/src/domain/store.ts:234` (`public processedIdempotencyKeys = new Map<string, string>(); // key -> bookingId`)
  - `/src/domain/store.ts:897–905`:
    ```ts
    const existingBookingId = this.processedIdempotencyKeys.get(params.idempotencyKey);
    if (existingBookingId) {
      const existing = this.bookings.find((b) => b.bookingId === existingBookingId)!;
      return { booking: existing, idempotentReplay: true, ... };
    }
    ```
  - `/server.ts:216` (`idempotencyKey: idempotencyKey || 'IDEMP-' + Date.now()`)
- **Blueprint Requirement:**
  - Section 10.1, 11.3 & Directive Section 3D: *"Bind idempotency keys to authenticated users and request payloads."*
- **Current Implementation:**
  - `processedIdempotencyKeys` is a global map keyed only by the `idempotencyKey` string.
  - If Traveler B sends `idempotencyKey: "IDEMP-SEED-001"` (or any key previously used by Traveler A), the server returns Traveler A's booking record to Traveler B!
  - If a client resends the same `idempotencyKey` with a different `quoteId` or `serviceDate`, the server silently returns the old booking instead of rejecting the mismatched payload.
  - If the client omits `idempotencyKey`, `/server.ts:216` auto-generates `IDEMP-${Date.now()}`, defeating idempotency protection.
- **Reproducible Defect Evidence:**
  Inspecting `/src/domain/store.ts:897–905` confirms zero check on `travelerId` or request payload hash during idempotency lookup.
- **Root Cause:**
  Idempotency key not scoped to `(traveler_user_id, idempotency_key)` and not paired with a SHA-256 `request_payload_hash`.
- **Recommended Technical Fix:**
  1. Require a non-empty `idempotencyKey` (`8–128` chars) in `POST /api/v1/bookings` (return `HTTP 400` if missing).
  2. Scope idempotency lookup in SQLite `bookings` to `UNIQUE(traveler_user_id, idempotency_key)` and store `request_payload_hash = sha256(JSON.stringify({ quoteId, serviceDate }))`.
  3. On replay by the same user with the same key: if `request_payload_hash` matches, return the existing booking with `idempotentReplay: true`; if `request_payload_hash` differs, reject with `HTTP 409 IDEMPOTENCY_PAYLOAD_MISMATCH`.
- **Measurable Acceptance Criteria:**
  - Replaying an `idempotencyKey` with a different `quoteId` or `serviceDate` returns `HTTP 409 IDEMPOTENCY_PAYLOAD_MISMATCH`.
  - Two different authenticated users using the same `idempotencyKey` string never see each other's bookings.
- **Verification Test ID:** `TEST-IDEMP-01` (`SUITE-11`)

---

### `FND-019` — Missing Quote Ownership Validation, Infinite Quote Reuse Bug, Coerced Negative Quantities, and Unvalidated `serviceDate`

- **Severity:** `HIGH`
- **Google AI Baseline Reference:** *Additional Defect Discovered by Independent Audit*
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:188` (`const qty = Math.max(1, Number(quantity) || 1);` — silently turns `-10` or `0` into `1`)
  - `/server.ts:215` (`serviceDate: serviceDate || '2026-12-05'` — accepts past dates or arbitrary strings like `"not-a-date"`)
  - `/src/domain/store.ts:79–97, 774–814` (`ImmutableQuoteSnapshot` does not store `travelerUserId` or `consumedByBookingId`)
  - `/src/domain/store.ts:907–910` (`executeAtomicBooking` never marks the quote as consumed)
- **Blueprint Requirement:**
  - Sections 11.2, 12.4 & Directive Section 3D: *"Validate service dates and quantities. Enforce listing availability. Validate quote ownership and expiry."*
- **Current Implementation:**
  - Quotes are not bound to the user who created them, are never marked consumed when booked (allowing a single quote to be booked multiple times with different idempotency keys), negative quantities are silently coerced to `1`, and past/invalid service dates are accepted.
- **Reproducible Defect Evidence:**
  In `/src/domain/store.ts:907–1000`, `this.quotes.get(params.quoteId)` is read but never deleted or marked consumed, so calling `POST /api/v1/bookings` twice with the same `quoteId` and two different `idempotencyKey` values creates two separate bookings from a single quote.
- **Root Cause:**
  Missing `traveler_user_id` and `consumed_by_booking_id` columns on `quotes`, and permissive fallback defaults in `/server.ts:188, 215`.
- **Recommended Technical Fix:**
  1. Reject `quantity <= 0`, non-integer `quantity`, or `quantity > listing.totalCapacity` in `POST /api/v1/quotes` with `HTTP 400 INVALID_QUANTITY`.
  2. Require `requireAuth` on `POST /api/v1/quotes` and bind `quote.traveler_user_id = req.session.userId`.
  3. In `POST /api/v1/bookings`, validate that `serviceDate` matches `/^\d{4}-\d{2}-\d{2}$/` and is not in the past (`HTTP 400 INVALID_SERVICE_DATE`), verify `quote.traveler_user_id === req.session.userId` (`HTTP 403 QUOTE_OWNERSHIP_MISMATCH`), verify `new Date(quote.expiresAtUtc) > now` (`HTTP 422 QUOTE_EXPIRED`), and verify `quote.consumed_by_booking_id === null` (`HTTP 409 QUOTE_ALREADY_CONSUMED`).
- **Measurable Acceptance Criteria:**
  - `POST /api/v1/quotes` with `quantity: 0` or `quantity: -3` returns `HTTP 400`.
  - `POST /api/v1/bookings` with a past `serviceDate` (`"2020-01-01"`) returns `HTTP 400`.
  - Attempting to book using another traveler's `quoteId` returns `HTTP 403`.
  - Attempting to create a second booking with an already-consumed `quoteId` returns `HTTP 409 QUOTE_ALREADY_CONSUMED`.
- **Verification Test ID:** `TEST-BOOK-01` (`SUITE-11`, `SUITE-14`)

---

### `FND-020` — Expiring Temporary Inventory Holds (`holdExpiresAtUtc`) Are Never Released

- **Severity:** `HIGH`
- **Google AI Baseline Reference:** *Additional Defect Discovered by Independent Audit*
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/src/domain/store.ts:934–938`:
    ```ts
    listing.availableUnits -= quote.quantity;
    listing.activeHoldsCount += quote.quantity;
    const holdExpiresIso = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    ```
- **Blueprint Requirement:**
  - Section 11.2 (`PH07-F007`) & Directive Section 3D: *"Implement atomic inventory reservations. Implement reservation expiry and automatic release."*
- **Current Implementation:**
  - `holdExpiresAtUtc` is stored on the booking record, but no function in the codebase ever checks for expired holds or releases held inventory back to `listing.availableUnits`. Unpaid or unconfirmed holds permanently lock inventory forever.
- **Reproducible Defect Evidence:**
  `grep -rn "holdExpiresAtUtc" src/ server.ts` shows the property is assigned at `/src/domain/store.ts:619` and `:994`, and never read anywhere in the repository.
- **Root Cause:**
  Missing hold-expiration sweep and release transaction.
- **Recommended Technical Fix:**
  Implement `releaseExpiredInventoryHolds(nowUtc?: string)` in `/src/domain/store.ts` inside a `BEGIN IMMEDIATE` transaction that finds all bookings where `inventory_hold_state = 'HELD'` and `hold_expires_at_utc <= nowUtc` and `payment_state IN ('CREATED', 'FAILED')`, transitions them to `inventory_hold_state = 'EXPIRED'` and `booking_state = 'EXPIRED'`, restores `listing.available_units += booking.quantity`, decrements `listing.active_holds_count -= booking.quantity`, and logs an audit event. Invoke `releaseExpiredInventoryHolds()` automatically before every quote, booking, webhook, and bootstrap query.
- **Measurable Acceptance Criteria:**
  - When a booking hold expires (`hold_expires_at_utc <= nowUtc`) without payment capture, `releaseExpiredInventoryHolds()` transitions `bookingState` and `inventoryHoldState` to `'EXPIRED'`, restores `available_units`, and blocks any late payment webhook capture on that expired hold.
- **Verification Test ID:** `TEST-HOLD-01` (`SUITE-12`)

---

### `FND-021` — Hardcoded Traveler Identity (`TRV-001` / `'Aarav Sharma'`) & Trip ID (`'TRP-NEPAL-2026-01'`), Missing Incident Ownership Validation, and Incomplete Privacy Consent Metadata

- **Severity:** `HIGH`
- **Google AI Baseline Reference:** *Additional Defect Discovered by Independent Audit*
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/src/domain/store.ts:975, 982` (`tripId: 'TRP-NEPAL-2026-01'`, `travelerId: 'TRV-001'` hardcoded on every new booking)
  - `/server.ts:359–387` (`POST /api/v1/incidents` hardcodes `tripId: 'TRP-NEPAL-2026-01'` and `reporterName: reporterName || 'Aarav Sharma'` with no trip/booking ownership check)
  - `/server.ts:390–415` (`POST /api/v1/privacy/consent` hardcodes `actor: 'Aarav Sharma (TRV-001)'`, `targetId: 'TRV-001'`, and lacks `consentVersion`, `purpose`, and a revocation endpoint)
- **Blueprint Requirement:**
  - Sections 14, 16 & Directive Section 3F:
    - *"Separate consent records by traveler. Record consent version, timestamp, and purpose. Enforce consent withdrawal. Validate trip ownership before incident access. Protect location and sensitive traveler information. Remove hardcoded identities and trip IDs."*
- **Current Implementation:**
  - Every booking, incident, and consent update is hardcoded to `TRV-001` / `TRP-NEPAL-2026-01`. No trip or booking ownership validation is performed when creating or reading incidents.
- **Reproducible Defect Evidence:**
  Lines `975` and `982` of `/src/domain/store.ts` hardcode `tripId: 'TRP-NEPAL-2026-01'` and `travelerId: 'TRV-001'` regardless of who creates a booking.
- **Root Cause:**
  Prototype hardcoded constants left in domain store and route handlers.
- **Recommended Technical Fix:**
  1. Remove all hardcoded `'TRV-001'`, `'Aarav Sharma'`, and `'TRP-NEPAL-2026-01'` strings from `/server.ts` and `/src/domain/store.ts`.
  2. Derive `travelerUserId` and `travelerName` from `req.session` on booking, quote, incident, and consent routes, and generate or validate a user-owned `tripId` (`TRP-${userId}-${date}`).
  3. On `POST /api/v1/incidents` and `GET /api/v1/incidents`, require `requireAuth` and verify that if a `bookingId` or `tripId` is supplied, that booking/trip belongs to `req.session.userId` (or the caller is `SUPPORT_SAFETY_STAFF` / `PLATFORM_ADMIN`), returning `HTTP 403 TRIP_OWNERSHIP_MISMATCH` otherwise.
  4. Store `consent_version` (`'PNP-PRIVACY-2026-V1'`), `purpose` (`'DURING_TRIP_SAFETY_AND_NAVIGATION_4H_TTL'`), `gps_sharing_granted_at_utc`, `gps_sharing_expires_at_utc`, `gps_sharing_revoked_at_utc`, and `retention_policy_version` (`'RET-2026-V1-EPHEMERAL-4H-GPS'`) in `user_privacy_consents`.
- **Measurable Acceptance Criteria:**
  - Zero occurrences of hardcoded `'TRV-001'` or `'TRP-NEPAL-2026-01'` in runtime booking, incident, or consent handlers.
  - Traveler B attempting to file or read an incident for Traveler A's booking/trip receives `HTTP 403 TRIP_OWNERSHIP_MISMATCH`.
- **Verification Test ID:** `TEST-PRIV-02` (`SUITE-13`)

---

### `FND-022` — Missing Runtime Enum Validation and Incomplete High-Risk Category Restriction Checks on `PATCH /api/v1/admin/categories/:key/status`

- **Severity:** `HIGH`
- **Google AI Baseline Reference:** *Additional Defect Discovered by Independent Audit*
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:79–149`:
    ```ts
    const { newStatus, reason, actor, mfaVerified } = req.body;
    ...
    if (
      newStatus === 'AVAILABLE' &&
      ['sos', 'travel-wallet', 'rewards', 'companion-matching', 'offline-maps'].includes(cat.key)
    ) { return res.status(422)... }
    ...
    cat.status = newStatus;
    ```
- **Blueprint Requirement:**
  - Sections 5, 5.1, 13 & Directive Section 3E: *"Enforce high-risk category restrictions. Validate every admin action... Validate all status transitions at runtime."*
- **Current Implementation:**
  1. `newStatus` is never validated at runtime against the allowed `CategoryStatus` enum values (`PLANNED`, `COMING_SOON`, `INFORMATION_ONLY`, `AVAILABLE`, `TEMPORARILY_UNAVAILABLE`, `RESTRICTED`, `RETIRED`). Sending `"newStatus": "INVALID_STATE"` corrupts `cat.status`!
  2. Line `108` checks only 5 restricted categories (`sos`, `travel-wallet`, `rewards`, `companion-matching`, `offline-maps`) and **omits `peak-climbing` (#5)**, allowing an admin call to flip `peak-climbing` to `AVAILABLE` even while its partner (`PRT-EXP-005`) is unverified (`PENDING_SECOND_APPROVAL`) and `LEG-003` is `GATED`!
  3. Line `128` allows transitioning categories to production `AVAILABLE` in `PH00` even while Owner decisions `DEC-001` (pilot scope) and `DEC-003` (transactional classification) are `PENDING`.
- **Reproducible Defect Evidence:**
  Inspection of `/server.ts:108` confirms `'peak-climbing'` is missing from the restriction array and no runtime enum check exists on `newStatus`.
- **Root Cause:**
  Missing runtime enum validation and incomplete hard-gate check in `/server.ts:79–149`.
- **Recommended Technical Fix:**
  1. Validate `newStatus` at runtime against `VALID_CATEGORY_STATUSES`; return `HTTP 400 INVALID_CATEGORY_STATUS` if invalid.
  2. Require a non-empty `reason` (`>= 10` characters).
  3. Block transitioning any of the 6 restricted categories (`peak-climbing`, `offline-maps`, `sos`, `rewards`, `companion-matching`, `travel-wallet`) to `AVAILABLE` (`HTTP 422 HARD_GATE_BLOCKED`).
  4. In `PH00`, while `DEC-001` and `DEC-003` are `PENDING`, block transitioning any category to production `AVAILABLE` with `HTTP 422 OWNER_DECISION_PENDING_BLOCK` (`DEC-001` / `DEC-003`).
- **Measurable Acceptance Criteria:**
  - Passing an invalid `newStatus` string returns `HTTP 400 INVALID_CATEGORY_STATUS`.
  - Attempting to set `peak-climbing`, `sos`, `travel-wallet`, `rewards`, `companion-matching`, or `offline-maps` to `AVAILABLE` returns `HTTP 422 HARD_GATE_BLOCKED`.
- **Verification Test ID:** `TEST-GOV-06` (`SUITE-04`, `SUITE-08`)

---

### `FND-023` — Unsanitized Client-Supplied `X-Correlation-Id` Header Injection

- **Severity:** `MEDIUM`
- **Google AI Baseline Reference:** *Additional Defect Discovered by Independent Audit*
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:32–41`:
    ```ts
    const corrId =
      (req.headers['x-correlation-id'] as string) ||
      `CORR-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    req.correlationId = corrId;
    res.setHeader('X-Correlation-Id', corrId);
    ```
- **Blueprint Requirement:**
  - Section 10.1 & Directive Section 3G: *"Implement correlation IDs safely."*
- **Current Implementation:**
  - Any arbitrary client string in `X-Correlation-Id` (including megabyte-long strings, control characters, or log-spoofing payloads) is accepted without validation, reflected in response headers, and stored in `auditEvents`.
- **Reproducible Defect Evidence:**
  Sending `X-Correlation-Id: <script>evil</script>   FAKE_AUDIT_ENTRY` reflects verbatim in `res.headers['x-correlation-id']` and `auditEvents[0].correlationId`.
- **Root Cause:**
  Missing regex format and length validation on `req.headers['x-correlation-id']`.
- **Recommended Technical Fix:**
  Validate incoming `x-correlation-id` against `/^[A-Za-z0-9._-]{8,64}$/`. If missing or non-matching, generate a fresh server-side cryptographic correlation ID (`CORR-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`).
- **Measurable Acceptance Criteria:**
  - Malformed or oversized `X-Correlation-Id` headers are ignored and replaced with a clean server-generated `CORR-...` identifier.
- **Verification Test ID:** `TEST-API-01` (`SUITE-14`)

---

### `FND-024` — Accidental SPA HTML Fallback (`200 OK`) for Unmatched `/api/*` Endpoints and Wrong HTTP Methods

- **Severity:** `MEDIUM`
- **Google AI Baseline Reference:** *Additional Defect Discovered by Independent Audit*
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:620–633` (mounts `vite.middlewares` in dev and `app.get('*all', ...)` in prod immediately after API routes without an `/api/*` 404 handler)
- **Blueprint Requirement:**
  - Section 10.1 & Directive Section 3G: *"Validate HTTP methods and status codes... Prevent accidental SPA fallback for API errors."*
- **Current Implementation:**
  - Any request to an unknown `/api/v1/*` path (or using an unsupported HTTP method like `DELETE /api/v1/bookings`) falls through to Vite's SPA fallback and returns `HTTP 200 OK` with `text/html` (`index.html`) instead of `HTTP 404` or `HTTP 405` JSON.
- **Reproducible Defect Evidence:**
  ```bash
  curl -i http://localhost:3000/api/v1/nonexistent-endpoint
  ```
  Returns `HTTP/1.1 200 OK` with `Content-Type: text/html` (`<!doctype html>...`).
- **Root Cause:**
  No terminal `/api` router catch-all mounted before Vite/static SPA middleware.
- **Recommended Technical Fix:**
  Mount a dedicated catch-all handler before Vite/static middleware:
  ```ts
  app.use('/api', (req: ApiRequest, res: Response) => {
    res.status(404).json({
      code: 'API_ENDPOINT_NOT_FOUND',
      message: `No API route matches ${req.method} ${req.originalUrl}`,
      correlationId: req.correlationId
    });
  });
  ```
  Plus a centralized JSON error-handling middleware `(err, req, res, next)` that catches malformed JSON (`SyntaxError` -> `HTTP 400 MALFORMED_JSON_BODY`) and unexpected exceptions (`HTTP 500 INTERNAL_SERVER_ERROR`).
- **Measurable Acceptance Criteria:**
  - `GET /api/v1/nonexistent-endpoint` returns `HTTP 404` with `Content-Type: application/json` and `code: "API_ENDPOINT_NOT_FOUND"`.
  - Malformed JSON request bodies return `HTTP 400` with `code: "MALFORMED_JSON_BODY"`.
- **Verification Test ID:** `TEST-API-02` (`SUITE-14`)

---

### `FND-025` — AI Assistant Endpoint (`POST /api/v1/ai/assist`) Ignores Traveler PII Redaction Flag and Lacks Request Timeout & Rate Limiting

- **Severity:** `MEDIUM`
- **Google AI Baseline Reference:** *Additional Defect Discovered by Independent Audit*
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/server.ts:532–618` (`POST /api/v1/ai/assist` trims `question` to 500 chars and passes `cleanQuestion` directly to `ai.models.generateContent` without scrubbing PII)
- **Blueprint Requirement:**
  - Sections 16, 19 & `DEC-018`: PII (email addresses, phone numbers, passport numbers, payment card digits) must be redacted from user prompts before any external model call, and AI requests must enforce rate limits and timeouts with deterministic official-source fallback.
- **Current Implementation:**
  - `travelerPrivacyConsent.aiPromptPiiRedactionEnabled` is stored as a boolean flag (`/src/domain/store.ts:589`), but `/server.ts:532–584` never reads it and never redacts PII from `cleanQuestion`!
- **Reproducible Defect Evidence:**
  Inspection of `/server.ts:534–572` shows `cleanQuestion` is interpolated directly into `contents` with zero regex or token scrubbing.
- **Root Cause:**
  PII redaction function was never implemented in `/server.ts`.
- **Recommended Technical Fix:**
  Implement `redactPiiFromText(input: string): { sanitizedText: string; redactionsApplied: string[] }` scrubbing email addresses (`[REDACTED_EMAIL]`), phone numbers (`[REDACTED_PHONE]`), passport/ID sequences (`[REDACTED_DOC_ID]`), and card numbers (`[REDACTED_PAN]`) before prompt processing, enforce an 8-second timeout on external LLM calls, and return `redactionsApplied` in the response metadata.
- **Measurable Acceptance Criteria:**
  - Submitting a question containing an email address or phone number to `POST /api/v1/ai/assist` redacts the PII before processing and reports the redaction count in the response.
- **Verification Test ID:** `TEST-AI-01` (`SUITE-13`)

---

### `FND-026` — Lifecycle Journey Maps (`PH00-F003`) Hardcode `categoryKeysInvolved` and Omit `luggage` (#9) in `BEFORE` Stage

- **Severity:** `HIGH`
- **Google AI Baseline Reference:** *Additional Defect Discovered by Independent Audit*
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/src/domain/catalogue.ts:253` (`luggage` #9 has `lifecycleStages: ['BEFORE', 'DURING']`)
  - `/src/domain/ph00Governance.ts:427–448` (`PH00_LIFECYCLE_JOURNEY_MAPS[0]` for stage `'BEFORE'` lists 20 category keys and omits `'luggage'`)
- **Blueprint Requirement:**
  - Sections 5, 7.1–7.3, and 21.1 (`PH00-F003`): Single canonical source of truth across the 31 categories and 3 lifecycle journey maps (`BEFORE`, `DURING`, `AFTER`).
- **Current Implementation:**
  - In `CANONICAL_CATEGORIES` (`/src/domain/catalogue.ts`), 21 categories include `'BEFORE'` in `lifecycleStages`, 29 include `'DURING'`, and 10 include `'AFTER'`.
  - In `PH00_LIFECYCLE_JOURNEY_MAPS` (`/src/domain/ph00Governance.ts:427–448`), `BEFORE.categoryKeysInvolved` hardcodes 20 keys and omits `'luggage'` (#9).
- **Reproducible Defect Evidence:**
  `CANONICAL_CATEGORIES.filter(c => c.lifecycleStages.includes('BEFORE')).map(c => c.key)` has length `21` (includes `'luggage'`), whereas `PH00_LIFECYCLE_JOURNEY_MAPS[0].categoryKeysInvolved` has length `20` (missing `'luggage'`).
- **Root Cause:**
  Duplicated hardcoded array in `/src/domain/ph00Governance.ts:427–448` violating Blueprint Rule #1 (single canonical registry).
- **Recommended Technical Fix:**
  Derive `categoryKeysInvolved` in `PH00_LIFECYCLE_JOURNEY_MAPS` dynamically from `CANONICAL_CATEGORIES.filter(c => c.lifecycleStages.includes(stage)).map(c => c.key)` and assert 100% bidirectional set equality in `/scripts/verify-ph00.ts`.
- **Measurable Acceptance Criteria:**
  - Set difference between `CANONICAL_CATEGORIES` lifecycle stages and `PH00_LIFECYCLE_JOURNEY_MAPS[stage].categoryKeysInvolved` is `0` across all 3 stages (`BEFORE = 21`, `DURING = 29`, `AFTER = 10`).
- **Verification Test ID:** `TEST-GOV-03` (`SUITE-03`)

---

### `FND-027` — Incomplete Typed Governance Structures for `PH00-F001` (12 Outcomes) and `PH00-F002` (15 Persona Dashboard/Lifecycle/Category Mappings)

- **Severity:** `MEDIUM`
- **Google AI Baseline Reference:** *Additional Defect Discovered by Independent Audit*
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/src/domain/ph00Governance.ts:20–29, 260–411` (`PersonaRecord` only has `primaryDashboardId: string` and `workflowScope: string`, lacking `allowedDashboardIds`, `lifecycleStages`, and `primaryCategoryKeys`)
  - `/src/domain/ph00Governance.ts` (lacks exported `PH00_VISION_AND_OUTCOMES` array for `OUT-01`..`OUT-12`)
- **Blueprint Requirement:**
  - Sections 1, 3, 6, 21.1 (`PH00-F001`, `PH00-F002`), and 29: Programmatically verifiable 12 measurable outcome KPIs (`OUT-01`..`OUT-12`) and complete 15-persona access mapping across the 8 dashboards, 3 lifecycle stages, and 31 categories.
- **Current Implementation:**
  - `OUT-01`..`OUT-12` exist only in markdown text (`PH00_GOVERNANCE_FOUNDATION.md`), and `PH00_PERSONAS` lacks typed arrays for `allowedDashboardIds`, `lifecycleStages`, and `primaryCategoryKeys`.
- **Reproducible Defect Evidence:**
  `/scripts/verify-ph00.ts:65–68` only runs `foundationContent.includes('OUT-01')` on markdown text rather than validating typed outcome definitions.
- **Root Cause:**
  Missing structured TypeScript governance exports in `/src/domain/ph00Governance.ts`.
- **Recommended Technical Fix:**
  Export `PH00_VISION_AND_OUTCOMES` (`OUT-01`..`OUT-12`) and enrich `PersonaRecord` in `/src/domain/ph00Governance.ts` with `allowedDashboardIds: DashboardId[]`, `lifecycleStages: LifecycleStage[]`, `primaryCategoryKeys: string[]`, and `serverRole: UserRole`.
- **Measurable Acceptance Criteria:**
  - All 12 measurable outcomes (`OUT-01`..`OUT-12`) and all 15 personas (`PRS-01`..`PRS-15`) pass structural and referential integrity checks in `SUITE-01` and `SUITE-02`.
- **Verification Test ID:** `TEST-GOV-01`, `TEST-GOV-02` (`SUITE-01`, `SUITE-02`)

---

### `FND-028` — Verification Script (`scripts/verify-ph00.ts`) Uses Binary Pass/Fail Instead of 5-State Vocabulary (`PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`/`GATED`) and Lacks Executable Governance & Security Suites

- **Severity:** `HIGH`
- **Google AI Baseline Reference:** *Additional Defect Discovered by Independent Audit*
- **Audit Status:** `CONFIRMED` (`NOT VERIFIED` in current code)
- **Affected Files & Exact Code Locations:**
  - `/scripts/verify-ph00.ts:27–39` (`interface CheckResult { id: string; featureId: string; description: string; passed: boolean; evidence: string; }`)
  - `/scripts/verify-ph00.ts:43–290` (only runs 13 static file/length checks `CHK-01`..`CHK-13`; runs zero HTTP authentication, MFA, RBAC, webhook, concurrency, SQL transaction, or privacy isolation tests)
- **Blueprint Requirement:**
  - Sections 23, 27.2, 33 & Directive Section 3H & 3I: Verification harness must test actual runtime requirements (including negative security tests, concurrent reservations, webhook replay, SQL transactions, and privacy isolation) and distinguish `PASS`, `FAIL`, `NOT_RUN`, `BLOCKED`, and `GATED`.
- **Current Implementation:**
  - `scripts/verify-ph00.ts` checks only static array lengths and markdown string inclusions (`CHK-01`..`CHK-13`) and reports `13 / 13 PH00 Verification Checks Passed` even while all 28 defects (`FND-001`..`FND-028`) exist in the codebase.
- **Reproducible Defect Evidence:**
  Running `npx tsx scripts/verify-ph00.ts` currently outputs `13 / 13 PH00 Verification Checks Passed` despite zero authentication and zero SQL persistence.
- **Root Cause:**
  Verification script tested static file presence instead of runtime security, persistence, and governance invariants.
- **Recommended Technical Fix:**
  Upgrade `/scripts/verify-ph00.ts` to use the 5-state verification outcome vocabulary (`PASS` | `FAIL` | `NOT_RUN` | `BLOCKED` | `GATED`), implement executable evaluators (`validateFeatureAgainstPrdTemplate`, `evaluateSourceVerificationPolicy`, `evaluatePilotReadinessGates`, `validateAiAgentContract`), and execute all **14 Verification Suites (`SUITE-01` through `SUITE-14`)** including live adversarial security, SQL transaction, webhook, and concurrency tests on an isolated temporary database.
- **Measurable Acceptance Criteria:**
  - `scripts/verify-ph00.ts` executes all 14 suites (`SUITE-01`..`SUITE-14`) and explicitly reports external dependencies (`DEP-001`..`DEP-010`) and Owner decisions (`DEC-001`..`DEC-026`) as `BLOCKED` or `GATED` rather than falsely marking them `PASS`.
- **Verification Test ID:** `SUITE-01` through `SUITE-14`

---

## SECTION 4 — AUDIT OF ALL 12 PH00 FEATURE MODULES (`PH00-F001` THROUGH `PH00-F012`)

| Feature ID | Blueprint Feature Title (Section 24) | Current Repository State | Independent Audit Status | Blocking Defects / Missing Evidence | Target Post-Remediation Status (Awaiting Founder Sign-Off) |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **`PH00-F001`** | Product vision, positioning and measurable outcomes | Documented in `PH00_GOVERNANCE_FOUNDATION.md` (§1); missing typed `PH00_VISION_AND_OUTCOMES` registry in `src/domain/ph00Governance.ts` | `NOT VERIFIED` | `FND-027`; awaits Owner `DEC-004` | `PARTIAL` (Technical artifact verified; gated on `DEC-004`) |
| **`PH00-F002`** | Traveler and partner persona validation | 15 personas (`PRS-01`..`PRS-15`) listed with `VALIDATION_PENDING`; missing typed RBAC/lifecycle/category arrays and server-side RBAC enforcement | `NOT VERIFIED` | `FND-001`, `FND-027`; empirical user interviews remain `PENDING` | `PARTIAL` (RBAC enforced; field interviews `PENDING`) |
| **`PH00-F003`** | Before/during/after journey maps | 3 journey maps in `ph00Governance.ts`, but `BEFORE.categoryKeysInvolved` omits `luggage` (#9) | `NOT VERIFIED` | `FND-026` | `PARTIAL` (Bidirectional set equality verified; awaits Owner acceptance) |
| **`PH00-F004`** | 31-category taxonomy and category ownership | 31 categories exist, but 8 are prematurely marked `AVAILABLE`, `App.tsx:742` hardcodes `"7 AVAILABLE"`, and 14 of 22 Appendix A contract items are missing | `NOT VERIFIED` | `FND-012`, `FND-022`; transactional classification gated on `DEC-001` & `DEC-003` | `PARTIAL` (All `31 × 22 = 682` contract items verified; `0 AVAILABLE` in PH00; gated on `DEC-001`/`DEC-003`) |
| **`PH00-F005`** | Product requirement and acceptance-criteria template | Markdown template exists in `PH00_GOVERNANCE_FOUNDATION.md` (§5); no executable 12-point DoD gate validator function in code | `NOT VERIFIED` | `FND-028` | `PARTIAL` (Executable PRD validator verified; awaits Owner acceptance) |
| **`PH00-F006`** | Feature register with unique IDs and phase ownership | All 240 feature IDs enumerated across 18 phases (`PH00 = PARTIAL`, `PH01..PH17 = NOT_STARTED`), but prototype surfaces lack explicit `PROTOTYPE_UNACCEPTED_NON_PRODUCTION` isolation | `NOT VERIFIED` | `FND-007`, `FND-012` | `PARTIAL` (240-module register & prototype isolation verified) |
| **`PH00-F007`** | Decision log and unresolved-decision workflow | All 26 Section 32 decisions (`DEC-001`..`DEC-026`) recorded as `PENDING`/`GATED`, but category transition handler does not enforce `DEC-001` pending block | `NOT VERIFIED` | `FND-022`; all 26 decisions remain `PENDING`/`GATED` for Founder | `PENDING` / `GATED` (Programmatic gate enforced; awaits Founder decisions) |
| **`PH00-F008`** | Risk, dependency and assumption register | Separated into `RSK-001..012`, `DEP-001..010`, `ASM-001..010`, but `RSK-001, 002, 005, 006, 007, 010` falsely claim `MITIGATED_IN_SANDBOX` | `NOT VERIFIED` | `FND-001`..`FND-012` | `PARTIAL` (Code defects fixed & risk statuses updated truthfully) |
| **`PH00-F009`** | Content source and verification policy | 4 official sources (`SRC-*`) + 2 quarantined research leads (`SRC-LEAD-*`), but lacks programmatic freshness & quarantine evaluator function | `NOT VERIFIED` | `FND-028`; primary NTB 2026 statistical dataset verification remains `PENDING` | `PARTIAL` (Policy evaluator verified; NTB dataset `PENDING`) |
| **`PH00-F010`** | Legal, licensing, insurance and tax question register | All 15 Section 22 domains (`LEG-001`..`LEG-015`) tracked with `PENDING_COUNSEL_OPINION`, but not cross-linked to Appendix A Item 22 on `CANONICAL_CATEGORIES` | `NOT VERIFIED` | `FND-012`; written legal opinions remain `PENDING` | `GATED` (Linked to Appendix A Item 22; counsel opinions `PENDING`) |
| **`PH00-F011`** | Pilot-region and pilot-category selection framework | 5 candidate evaluations across 7 criteria + 9 pilot launch gates documented, but lacks executable 9-gate readiness evaluator returning 5-state outcomes | `NOT VERIFIED` | `FND-028`; final selection gated on `DEC-001` | `GATED` (Evaluator returns `overallPilotLaunchAllowed: false` pending `DEC-001`) |
| **`PH00-F012`** | AI coding-agent operating contract and evidence-report format | `/AI_AGENT_CONTRACT.md` exists, but `/scripts/verify-ph00.ts` does not test security, persistence, or 5-state outcomes | `NOT VERIFIED` | `FND-009`, `FND-028` | `PARTIAL` (14-suite verification harness verified; awaits Founder sign-off) |

---

## SECTION 5 — COMPLETE PH00 REMEDIATION PLAN (DOMAINS 3A THROUGH 3I)

### 5.1 Domain 3A: Authentication, Sessions, TOTP MFA & RBAC (`/src/middleware/security.ts` & `/src/db/database.ts`)
1. **User Account & Role Seed (`users` table):** Seed distinct authenticated test accounts with `crypto.scryptSync` password hashes and unique RFC 6238 TOTP secrets:
   - `traveler.aarav@pherinepal.np` (`TRAVELER`, `PRS-01`, ID `USR-TRV-001`)
   - `traveler.elena@pherinepal.np` (`TRAVELER`, `PRS-02`, ID `USR-TRV-002`)
   - `partner.patan@pherinepal.np` (`PARTNER_OPERATOR`, `PRS-04`, partner `PRT-KTM-001`)
   - `partner.khumbu@pherinepal.np` (`PARTNER_OPERATOR`, `PRS-08`, partner `PRT-KHB-002`)
   - `compliance.anita@pherinepal.np` (`COMPLIANCE_OFFICER`, `PRS-12`, ID `USR-CMP-001` — Primary Reviewer)
   - `safety.pemba@pherinepal.np` (`COMPLIANCE_OFFICER`, `PRS-12`, ID `USR-CMP-002` — Distinct Secondary Approver)
   - `finance.bikash@pherinepal.np` (`FINANCE_OFFICER`, `PRS-13`, ID `USR-FIN-001`)
   - `support.sita@pherinepal.np` (`SUPPORT_SAFETY_STAFF`, `PRS-11`, ID `USR-SUP-001`)
   - `admin.owner@pherinepal.np` (`PLATFORM_ADMIN`, `PRS-15`, ID `USR-ADM-001`)
2. **Session Lifecycle (`sessions` table):**
   - `POST /api/v1/auth/login`: Verifies email + password (`timingSafeEqual`), enforces brute-force rate limit, creates a session row (`mfa_verified = 0`, 8-hour `expires_at_utc`), and sets `HttpOnly; SameSite=Strict` cookie `pnp_session` (also usable via `Authorization: Bearer <token>`).
   - `POST /api/v1/auth/mfa/verify`: Verifies 6-digit RFC 6238 TOTP code against the user's server-side `totp_secret` and sets `sessions.mfa_verified = 1`.
   - `POST /api/v1/auth/logout`: Sets `sessions.revoked_at_utc = nowUtc` and clears cookie.
   - `GET /api/v1/auth/me`: Returns current authenticated principal or `{ authenticated: false }`.
3. **Zero Trust in Client Identity/MFA Fields:**
   - Middleware `rejectForbiddenClientSecurityFields` rejects any request body containing `mfaVerified`, `simulatePaymentSuccess`, `actor`, `actorRole`, `reviewerEmail`, or `partnerActor` with `HTTP 400 FORBIDDEN_CLIENT_SECURITY_FIELD`.

### 5.2 Domain 3B: Payment Verification, Signed Webhooks & Double-Entry Accounting (`/src/domain/store.ts` & `/server.ts`)
1. **No Client Payment Capture:** `POST /api/v1/bookings` sets `payment_state = 'CREATED'` and creates a `payment_intents` record with `status = 'CREATED'`.
2. **Signed Idempotent Webhook (`POST /api/v1/payments/webhooks/provider`):**
   - Validates `X-Payment-Signature` (HMAC-SHA256 over raw request buffer using `PAYMENT_WEBHOOK_SECRET`).
   - Enforces replay protection via `UNIQUE(provider_event_id)` in `payment_webhook_events`.
   - On `payment.captured`: atomically updates `payment_intents.status = 'CAPTURED'` and `bookings.payment_state = 'CAPTURED'`, writes the 5-line balanced `PAYMENT_CAPTURE_ALLOCATION` journal (`PLATFORM_COLLECTION_CLEARING` debit == `PARTNER_PAYABLE_LIABILITY` + `PLATFORM_COMMISSION_REVENUE` + `PLATFORM_SERVICE_FEE_REVENUE` + `TAX_VAT_PAYABLE` credits), confirms `INSTANT` bookings, and moves `APPROVAL` bookings to `PENDING_PARTNER`.
3. **Partner Decision & Refund Separation:**
   - `POST /api/v1/bookings/:bookingId/partner-decision` requires `booking.payment_state === 'CAPTURED'` before allowing `APPROVE`.
   - `POST /api/v1/bookings/:bookingId/refund` (requires `FINANCE_OFFICER` or `PLATFORM_ADMIN` + MFA) and `DECLINE` post a balanced `REFUND_REVERSAL` double-entry journal and restore inventory units.

### 5.3 Domain 3C: Persistent Relational SQLite Database, Constraints & Migrations (`/src/db/database.ts`)
1. **Persistent Database:** `/data/pherinepal.sqlite` via Node 22 `node:sqlite` (`DatabaseSync`) with `WAL` mode, `FOREIGN KEYS = ON`, `CHECK` constraints, `UNIQUE` constraints, and `BEFORE UPDATE/DELETE` triggers preventing mutation of `audit_events` and `ledger_lines`.
2. **Migration & Rollback Framework:** `schema_migrations` table tracks applied migrations; `withImmediateTransaction(db, fn)` wraps all multi-step writes in `BEGIN IMMEDIATE ... COMMIT / ROLLBACK`.
3. **Isolated Test Database Factory:** `createIsolatedTestDatabase()` creates disposable `/tmp/pherinepal-test-<uuid>.sqlite` instances for `/api/v1/admin/verify-invariants` and `/scripts/verify-ph00.ts`.

### 5.4 Domain 3D: Atomic Booking, User-Bound Quotes, Idempotency & Hold Expiry (`/src/domain/store.ts`)
1. **User-Bound Single-Use Quotes:** Quotes bind `traveler_user_id`, validate `quantity > 0`, expire after 15 minutes (`expires_at_utc`), and record `consumed_by_booking_id` (`UNIQUE`) upon booking creation.
2. **User & Payload-Bound Idempotency:** Scoped to `UNIQUE(traveler_user_id, idempotency_key)` with `request_payload_hash` verification (`HTTP 409 IDEMPOTENCY_PAYLOAD_MISMATCH` on altered payload).
3. **Automatic Hold Expiry Sweep:** `releaseExpiredInventoryHolds()` atomically expires unpaid holds past `hold_expires_at_utc` and restores `available_units`.

### 5.5 Domain 3E: Two-Person Partner Verification & Admin Governance (`/server.ts` & `/src/domain/store.ts`)
1. **Two-Stage Partner Verification:**
   - Stage 1: `POST /api/v1/verification/:partnerId/review-primary` (Officer A + MFA -> `PENDING_SECOND_APPROVAL`).
   - Stage 2: `POST /api/v1/verification/:partnerId/approve` (Officer B + MFA -> `VERIFIED`, enforced by `primary_reviewer_user_id <> secondary_approver_user_id` in code and SQLite `CHECK`).
2. **Runtime Category State Machine & Emergency Switches:**
   - Runtime enum validation on `newStatus`, hard-gate block on all 6 restricted categories (`peak-climbing`, `offline-maps`, `sos`, `rewards`, `companion-matching`, `travel-wallet`), and `DEC-001`/`DEC-003` pending block on production `AVAILABLE` transitions in `PH00`.

### 5.6 Domain 3F: Traveler-Scoped Privacy Consent, Incident Ownership & AI PII Redaction
1. **Per-Traveler Privacy Consent (`user_privacy_consents`):** Stores `user_id`, `consent_version`, `purpose`, `during_trip_gps_sharing_opt_in`, 4-hour `gps_sharing_expires_at_utc`, `gps_sharing_revoked_at_utc`, and `retention_policy_version`, plus `POST /api/v1/privacy/consent/revoke`.
2. **Incident Ownership Validation:** `POST /api/v1/incidents` validates that the authenticated traveler owns the referenced `bookingId` / `tripId`.
3. **AI Prompt PII Redaction:** `redactPiiFromText()` scrubs emails, phone numbers, passport IDs, and card numbers before external LLM calls.

### 5.7 Domain 3G: API Hardening, Role-Filtered Bootstrap, Correlation IDs & `/api/*` 404 Handler
1. **Role-Filtered `/api/v1/bootstrap`:** Redacts private bookings, ledger entries, audit events, incidents, staff emails, and consent based on `req.session`.
2. **Safe Correlation IDs & `/api/*` 404 Catch-All:** Sanitizes `X-Correlation-Id` (`/^[A-Za-z0-9._-]{8,64}$/`) and returns `HTTP 404` JSON (`API_ENDPOINT_NOT_FOUND`) for all unmatched `/api/*` requests prior to Vite/SPA fallback.

### 5.8 Domain 3H & 3I: 14-Suite Verification Harness & Complete Blueprint Compliance
1. **All 22 Appendix A Service Contract Items:** Model and validate all `31 × 22 = 682` contract fields in `/src/domain/catalogue.ts`.
2. **14 Automated Verification Suites (`SUITE-01`..`SUITE-14`):** Executed in `/scripts/verify-ph00.ts` using the 5-state outcome vocabulary (`PASS`, `FAIL`, `NOT_RUN`, `BLOCKED`, `GATED`).

---

## SECTION 6 — UNRESOLVED OWNER DECISIONS (`DEC-001`..`DEC-026`), LEGAL GATES (`LEG-001`..`LEG-015`) & EXTERNAL DEPENDENCIES (`DEP-001`..`DEP-010`)

Per Non-Negotiable Rules #3, #8, #9, and #10, none of the following items are fabricated or marked `VERIFIED`:

### 6.1 All 26 Owner Decisions (`DEC-001` through `DEC-026` — Blueprint Section 32)

| Decision ID | Decision Topic | Current Status | Approver | Blocking Scope |
| :---: | :--- | :---: | :--- | :--- |
| `DEC-001` | Pilot Region & First Live Category | `PENDING` | Founder / Product Owner | Blocks enabling any category as production `AVAILABLE` |
| `DEC-002` | Final Eight Dashboard Labels & Ownership | `PENDING` | Product Owner | Governs final RBAC role labels |
| `DEC-003` | Category-Level Transactional Classification | `PENDING` | Product Owner | Governs which categories permit checkout |
| `DEC-004` | Final Tagline & Visual Identity | `PENDING` | Product Owner | Governs final brand lock (`PH01`) |
| `DEC-005` | Company Structure & Permitted Business Activities | `GATED` | Founder | Blocks live commercial operations (`LEG-001`, `LEG-002`) |
| `DEC-006` | Commission Basis, Rates & Fee Disclosures | `PENDING` | Founder | Governs production commission & fee schedules |
| `DEC-007` | Support Hours, Languages & Staffing Model | `GATED` | Product Owner | Locks support notice to `08:00–20:00 NPT` (no 24/7 claim) |
| `DEC-008` | Payment Provider(s), Merchant Eligibility & Settlement Flow | `GATED` | Founder | Blocks live PSP merchant gateway activation (`DEP-003`) |
| `DEC-009` | Lawful Handling of Collected Funds (No False Escrow Claims) | `GATED` | Founder | Forbids all escrow claims across UI/API (`LEG-008`) |
| `DEC-010` | Booking Approval Response Windows & Hold Duration | `PENDING` | Product Owner | Governs production hold/approval TTLs |
| `DEC-011` | Refund, Cancellation & No-Show Policy by Category | `PENDING` | Product Owner | Governs production cancellation penalty tiers |
| `DEC-012` | Tax, VAT, Invoices & Accounting Treatment | `GATED` | Founder | Blocks live tax invoice issuance (`LEG-009`) |
| `DEC-013` | Hosting, Database, Queue, Storage & Monitoring Providers | `PENDING` | Founder / CTO | Blocks production cloud provisioning (`DEP-001`) |
| `DEC-014` | Exact Runtime, Framework & PostgreSQL Versions | `PENDING` | Product Owner | Governs modular monolith vs. framework migration ADR |
| `DEC-015` | API Architecture — Route Handlers vs Separate Service | `PENDING` | Product Owner | Governs `/api/v1` deployment topology |
| `DEC-016` | Authentication Provider & Session Strategy | `PENDING` | CTO / Product Owner | Governs self-managed sessions vs. external IdP |
| `DEC-017` | Map, Geocoding, Routing & Offline Map Licences | `GATED` | Founder | Hard-locks `offline-maps` (#13) to `RESTRICTED` (`LEG-013`) |
| `DEC-018` | AI Provider, Model, Budget & Data-Processing Terms | `PENDING` | Product Owner | Governs live LLM DPA and token budget (`DEP-010`) |
| `DEC-019` | Data Retention, Deletion & Cross-Border Transfer Policy | `GATED` | Product Owner | Governs production PII retention schedule (`LEG-010`) |
| `DEC-020` | Reliability Targets — SLO, RPO & RTO | `PENDING` | CTO / Founder | Blocks publishing public SLA commitments |
| `DEC-021` | Native Mobile App Timing (Android & iOS) | `PENDING` | Product Owner | Defers `PH16` until `/api/v1` and web pilot pass |
| `DEC-022` | Travel Companion Matching Activation Gate | `GATED` | Founder / Product Owner | Hard-locks `companion-matching` (#28) to `RESTRICTED` |
| `DEC-023` | SOS Emergency Feature Activation Gate | `GATED` | Founder | Hard-locks `sos` (#21) to `RESTRICTED` (Rule #7) |
| `DEC-024` | Flight Category Scope — Information/Referral vs Integrated | `GATED` | Founder | Locks `flights` (#8) to `INFORMATION_ONLY` (`DEP-005`) |
| `DEC-025` | Travel Wallet Legal & Accounting Gate | `GATED` | Founder | Hard-locks `travel-wallet` (#30) to `RESTRICTED` (`LEG-008`) |
| `DEC-026` | Rewards & Loyalty Accounting Policy | `GATED` | Founder / CFO | Hard-locks `rewards` (#26) to `RESTRICTED` |

### 6.2 All 15 Legal, Licensing, Insurance & Tax Questions (`LEG-001` through `LEG-015` — Blueprint Section 22)

All 15 legal domains (`LEG-001` Company Registration, `LEG-002` DoT Travel Agency Rules, `LEG-003` Trekking/Mountaineering/Guide Rules, `LEG-004` DoTM Green-Plate & CAAN Aviation Rules, `LEG-005` Hotel/Homestay Registration, `LEG-006` Food/Marketplace Rules, `LEG-007` Consumer Protection Price Disclosure, `LEG-008` NRB Payment/Settlement/Wallet Rules, `LEG-009` IRD VAT/TDS/Invoicing Rules, `LEG-010` Individual Privacy Act & Data Transfers, `LEG-011` Insurance & Platform Liability, `LEG-012` Nepal Labour Act Contractor Rules, `LEG-013` Map/Media IP Licences, `LEG-014` Emergency/SOS Duty of Care, `LEG-015` Bilingual Terms of Service & Dispute Policies) carry `writtenResponse: "PENDING_COUNSEL_OPINION"` and remain `PENDING` or `GATED`.

### 6.3 All 10 External Dependencies (`DEP-001` through `DEP-010`)

| Dependency ID | External Provider / Infrastructure | Current Status | Verification Reality |
| :---: | :--- | :---: | :--- |
| `DEP-001` | Managed Cloud SQL for PostgreSQL instance | `BLOCKED` / `GATED` | `cloudsql.CheckFeatureEligibility` returned `NO_VALID_PROJECT`. Local SQL persistence will use Node 22 `node:sqlite`, while Cloud SQL remains `BLOCKED`. |
| `DEP-002` | Written Nepal Corporate & Tourism Legal Counsel Opinion | `PENDING` | Awaiting external counsel engagement (`LEG-001`..`LEG-015`). |
| `DEP-003` | Live PSP Merchant Credentials (`eSewa`, `Khalti`, `Fonepay`, `Stripe`) | `GATED` | Gated on `DEC-008` & `LEG-008`. Local HMAC-SHA256 webhook verification tested with sandbox secret. |
| `DEP-004` | Official DoT / TAAN / NMA / NATHM Licence Verification Feeds | `GATED` | Gated on `LEG-003`; enforced via two-person manual document verification. |
| `DEP-005` | Airline GDS / Aggregator Contract for `flights` (#8) | `GATED` | Gated on `DEC-024` & `LEG-004`; `flights` locked to `INFORMATION_ONLY`. |
| `DEP-006` | Map Provider Offline Vector Tile Redistribution Licence (`#13`) | `GATED` | Gated on `DEC-017` & `LEG-013`; `offline-maps` locked to `RESTRICTED`. |
| `DEP-007` | NTA Authorised Telecom Reseller Agreement for `esim` (#11) | `GATED` | `esim` locked to `COMING_SOON`; `sim-info` (#12) is `INFORMATION_ONLY`. |
| `DEP-008` | Official DHM / MFD TIA / CAAN Weather Feed Agreement (`#20`) | `PENDING` | Displays timestamped bulletins with explicit non-real-time disclaimers. |
| `DEP-009` | 24/7 Staffed Emergency Response Center & Live Responder Drills (`#21`) | `GATED` | Gated on `DEC-007` & `DEC-023`; `sos` (#21) hard-locked to `RESTRICTED`. |
| `DEP-010` | Production LLM API Key, Token Cost Cap & Zero-Data-Retention DPA (`#18`) | `PENDING` | Gated on `DEC-018`; deterministic official-source citation engine provides fallback. |

---

## SECTION 7 — ITEMS REQUIRING EXPLICIT FOUNDER APPROVAL BEFORE IMPLEMENTATION

In strict compliance with your directive (*"Do not modify any repository files. Do not start implementing fixes. Do not begin PH01 or later phases. Include a final section listing what requires Founder approval before implementation"*), **no repository source code files have been modified**.

Before engineering begins executing the PH00 code remediation, **explicit Founder approval is requested for the following 7 items**:

1. **Authorization to Execute the 28-Finding PH00 Code Remediation Plan (`FND-001` through `FND-028`):**
   - Authorize creating `/src/db/database.ts` and `/src/middleware/security.ts` and updating `/src/domain/catalogue.ts`, `/src/domain/ph00Governance.ts`, `/src/domain/store.ts`, `/server.ts`, `/src/App.tsx`, `/scripts/verify-ph00.ts`, `/RISK_REGISTER.md`, `/PH00_GOVERNANCE_FOUNDATION.md`, `/PH00_AUDIT_REPORT.md`, `/.env.example`, and `/.gitignore`.
2. **Approval of Local Transactional SQLite (`node:sqlite`) as the PH00 Persistent SQL Store While `DEP-001` (Cloud SQL PostgreSQL) Remains `BLOCKED`:**
   - Confirm that using Node 22's built-in transactional `node:sqlite` (`DatabaseSync` at `/data/pherinepal.sqlite` with `WAL`, `FOREIGN KEYS`, `CHECK` constraints, and `BEGIN IMMEDIATE` transactions) is approved for local SQL persistence in `PH00`, while keeping managed Cloud SQL PostgreSQL (`DEP-001`) truthfully reported as `BLOCKED` / `GATED` pending `DEC-013`.
3. **Approval of PH00 Default Category Status Reset (`0 AVAILABLE` in Default PH00 Governance Mode):**
   - Confirm that the 8 categories currently marked `AVAILABLE` in `/src/domain/catalogue.ts` (`hotels`, `homestays`, `adventures`, `trekking`, `guides`, `transport`, `restaurants`, `local-experiences`) must default to `COMING_SOON` in authoritative `PH00` governance mode until `DEC-001` and `DEC-003` are decided (resulting in `0 AVAILABLE, 13 COMING_SOON, 12 INFORMATION_ONLY, 6 RESTRICTED`), while isolating any booking/webhook tests inside an explicit `PROTOTYPE_SANDBOX` scope labeled `PROTOTYPE · UNACCEPTED · NON-PRODUCTION`.
4. **Approval of Server-Managed Session Authentication & RFC 6238 TOTP MFA Baseline:**
   - Confirm that implementing server-managed `HttpOnly` HMAC-signed sessions (`scryptSync` password verification) and RFC 6238 6-digit TOTP MFA verification for privileged roles (`PLATFORM_ADMIN`, `COMPLIANCE_OFFICER`, `FINANCE_OFFICER`) is approved as the PH00 security baseline while `DEC-016` remains `PENDING`.
5. **Approval of Provider-Neutral HMAC-SHA256 Signed Payment Webhook Architecture:**
   - Confirm that removing `simulatePaymentSuccess` and requiring signed, idempotent `POST /api/v1/payments/webhooks/provider` events (`X-Payment-Signature` HMAC-SHA256) before transitioning bookings to `CAPTURED` or recording double-entry capture ledger journals is approved while live PSP credentials (`DEP-003` / `DEC-008`) remain `GATED`.
6. **Approval of Isolated Temporary Database Execution for `/api/v1/admin/verify-invariants` and `/scripts/verify-ph00.ts`:**
   - Confirm that all invariant, negative-security, and concurrent-reservation tests must execute exclusively on isolated temporary SQLite databases (`/tmp/pherinepal-test-<uuid>.sqlite`) with zero mutation of operational database state.
7. **Guidance on Any Owner Decisions (`DEC-001` through `DEC-026`) You Wish to Decide Now vs. Keep `PENDING` / `GATED`:**
   - Confirm whether all 26 Owner decisions (`DEC-001`..`DEC-026`) should remain `PENDING` / `GATED` in `/DECISIONS.md` during this PH00 remediation, or if you wish to issue a formal Founder decision on any specific `DEC-*` item now.


---

## SECTION 8 — APPENDIX A 22-POINT SERVICE CONTRACT AUDIT MATRIX (`PH00-F004`)

Per Master Blueprint Appendix A (`PHERINEPAL-COMPLETE-MASTER-BLUEPRINT-v1.0.md` lines `1593–1643`), every one of the 31 canonical service categories must define all **22 mandatory contract items** (`31 × 22 = 682` contract attributes):

| Appendix A Item # | Blueprint Appendix A Requirement (Lines `1595–1618`) | Current `/src/domain/catalogue.ts` Field | Audit Status | Required Remediation in `AppendixAServiceContract` |
| :---: | :--- | :--- | :---: | :--- |
| **01** | Category owner and product purpose | Partial (`operationalOwnerRole`, `backupOwnerRole`, `owningPhase`; lacks explicit product purpose field) | `NOT VERIFIED` | Add `item01_ownerAndPurpose: { operationalOwnerRole, backupOwnerRole, owningPhase, productPurpose }` |
| **02** | Persona and lifecycle stage mapping (`BEFORE`, `DURING`, `AFTER`) | Partial (`lifecycleStages` present; per-category `personaIds` mapping `PRS-01`..`PRS-15` missing) | `NOT VERIFIED` | Add `item02_personaAndLifecycleMapping: { personaIds: string[], lifecycleStages: LifecycleStage[] }` |
| **03** | Availability state (`AVAILABLE`, `COMING_SOON`, `INFORMATION_ONLY`, `RESTRICTED`) | Defective (8 categories prematurely marked `AVAILABLE` in `PH00` before `DEC-001` approval) | `NOT VERIFIED` | Add `item03_availabilityState: { ph00Status, targetPilotStatus, statusRationale }` and reset 8 prematurely `AVAILABLE` categories to `COMING_SOON` in `PH00` |
| **04** | User-facing search/discovery fields and filters | Missing on `ServiceCategory` | `NOT VERIFIED` | Add `item04_searchDiscoveryFieldsAndFilters: { searchFields: string[], filters: string[], sortOptions: string[] }` |
| **05** | Detail page content and required trust/safety disclosures | Partial (`publicRestrictionNotice` present on some categories; required detail sections missing) | `NOT VERIFIED` | Add `item05_detailPageAndDisclosures: { requiredSections: string[], trustSafetyDisclosures: string[] }` |
| **06** | Booking or action model (instant, approval, quote, advisory, emergency) | Present (`bookingModesAllowed`, `transactional`) | `VERIFIED` | Standardize in `item06_bookingOrActionModel: { transactional: boolean, bookingModesAllowed: string[], holdDurationMinutes: number }` |
| **07** | Required user inputs and validation rules | Missing on `ServiceCategory` | `NOT VERIFIED` | Add `item07_userInputsAndValidationRules: { requiredInputs: string[], serverValidationRules: string[] }` |
| **08** | Pricing, tax, fee, commission, and currency rules | Missing on `ServiceCategory` (only modeled on sample listings) | `NOT VERIFIED` | Add `item08_pricingTaxFeeCommissionCurrency: { currency: 'NPR', vatRateBps: number, commissionBps: number, feePolicy: string }` |
| **09** | Inventory/capacity model and overbooking prevention rule | Partial (`inventoryModel` string present; overbooking lock rule missing) | `NOT VERIFIED` | Add `item09_inventoryAndOverbookingRule: { inventoryModel: string, overbookingLockMechanism: string }` |
| **10** | Partner onboarding and document verification requirements | Present (`verificationRequirements`, `highRiskTwoPersonApproval`) | `VERIFIED` | Map into `item10_partnerOnboardingAndVerification: { requiredDocuments: string[], highRiskTwoPersonApproval: boolean }` |
| **11** | Cancellation, no-show, refund, and dispute rules | Missing on `ServiceCategory` (only modeled on sample listings) | `NOT VERIFIED` | Add `item11_cancellationNoShowRefundDispute: { defaultPolicyVersion: string, cancellationRule: string, noShowRule: string, disputeWorkflow: string }` |
| **12** | Chat/call/notification triggers and templates | Missing on `ServiceCategory` | `NOT VERIFIED` | Add `item12_communicationTriggersAndTemplates: { notificationTriggers: string[], contactMaskingRequired: boolean }` |
| **13** | Offline cache behavior and degraded-network fallback | Missing on `ServiceCategory` | `NOT VERIFIED` | Add `item13_offlineCacheAndDegradedFallback: { offlineCachePolicy: string, degradedFallbackBehavior: string }` |
| **14** | Safety, emergency, weather, or permit dependencies | Partial (`highRiskTwoPersonApproval` present; explicit permit & weather dependencies missing on category) | `NOT VERIFIED` | Add `item14_safetyEmergencyWeatherPermitDeps: { permitRequirements: string[], weatherAdvisoryDependent: boolean, emergencyDirectoryLinked: boolean }` |
| **15** | Admin/operator/partner dashboard views (`D01`–`D08`) | Missing per-category dashboard array on `ServiceCategory` | `NOT VERIFIED` | Add `item15_dashboardViews: { dashboardIds: DashboardId[], primaryOperationalView: string }` |
| **16** | Database tables, state machines, and audit events | Missing on `ServiceCategory` | `NOT VERIFIED` | Add `item16_dataModelStateMachinesAuditEvents: { sqlTables: string[], stateMachines: string[], auditEvents: string[] }` |
| **17** | API endpoints, request/response schemas, and idempotency rules | Missing on `ServiceCategory` | `NOT VERIFIED` | Add `item17_apiEndpointsSchemasIdempotency: { endpoints: string[], requiresIdempotencyKey: boolean, rateLimitTier: string }` |
| **18** | AI touchpoints, grounding rules, and human handoff triggers | Missing on `ServiceCategory` | `NOT VERIFIED` | Add `item18_aiTouchpointsGroundingHandoff: { aiCapabilitiesAllowed: string[], groundingSourceIds: string[], humanHandoffTriggers: string[] }` |
| **19** | Analytics events, KPIs, and operational SLAs | Missing on `ServiceCategory` | `NOT VERIFIED` | Add `item19_analyticsKpisAndSlas: { analyticsEvents: string[], outcomeKpiIds: string[], supportHoursSla: string }` |
| **20** | Security, privacy, RBAC/ABAC, and fraud controls | Missing on `ServiceCategory` | `NOT VERIFIED` | Add `item20_securityPrivacyRbacFraudControls: { readRoles: string[], writeRoles: string[], requiresMfaForOverride: boolean, privacyControls: string[] }` |
| **21** | Unit, integration, E2E, failure-mode, and load tests | Missing on `ServiceCategory` | `NOT VERIFIED` | Add `item21_testingRequirements: { verificationSuiteIds: string[], negativeTestScenarios: string[] }` |
| **22** | Legal, provider, and operational gates before activation | Partial (`gatedReason` on 5 categories; structured `DEC-*`, `LEG-*`, `DEP-*` arrays missing) | `NOT VERIFIED` | Add `item22_legalProviderOperationalGates: { blockingDecisionIds: string[], blockingLegalIds: string[], blockingDependencyIds: string[] }` |

---

## SECTION 9 — COMPLETE 14-SUITE TEST & VERIFICATION SPECIFICATION (`SUITE-01` THROUGH `SUITE-14`)

All automated verification suites in `/scripts/verify-ph00.ts` will execute deterministically against isolated temporary SQLite databases (`/tmp/pherinepal-test-<uuid>.sqlite`) and report using the 5-state vocabulary (`PASS`, `FAIL`, `NOT_RUN`, `BLOCKED`, `GATED`):

| Suite ID | Test IDs Included | Verification Scope & Exact Assertions | Current Pre-Remediation Status | Target Post-Remediation Status |
| :---: | :---: | :--- | :---: | :---: |
| **`SUITE-01`** | `TEST-GOV-01` | **`PH00-F001` Vision & 12 Measurable Outcomes Charter:** Validates `PH00_VISION_AND_OUTCOMES` (`OUT-01`..`OUT-12`), 7 Trust Principles, and non-claim disclaimers. | `NOT VERIFIED` | `PASS` |
| **`SUITE-02`** | `TEST-GOV-02` | **`PH00-F002` 15 Personas & 8 Dashboards RBAC Matrix:** Validates `PRS-01`..`PRS-15`, `allowedDashboardIds`, `lifecycleStages`, `primaryCategoryKeys`, and `VALIDATION_PENDING` field-interview boundary. | `NOT VERIFIED` | `PASS` (`PENDING` field interviews disclosed) |
| **`SUITE-03`** | `TEST-GOV-03` | **`PH00-F003` Lifecycle Journey Maps (`BEFORE`, `DURING`, `AFTER`):** Asserts 100% bidirectional set equality between `CANONICAL_CATEGORIES` and `PH00_LIFECYCLE_JOURNEY_MAPS` (`BEFORE = 21` including `luggage`, `DURING = 29`, `AFTER = 10`). | `NOT VERIFIED` (`FND-026`) | `PASS` |
| **`SUITE-04`** | `TEST-GOV-04`, `TEST-GOV-06` | **`PH00-F004` 31 Categories & 682 Appendix A Contract Items:** Asserts `0 AVAILABLE` in default PH00 governance state (`13 COMING_SOON, 12 INFORMATION_ONLY, 6 RESTRICTED`), validates all `31 × 22 = 682` Appendix A contract fields, and tests runtime category status enum & hard-gate blocks. | `NOT VERIFIED` (`FND-012`, `FND-022`) | `PASS` |
| **`SUITE-05`** | `TEST-GOV-05A` | **`PH00-F005` & `PH00-F006` PRD 12-Point DoD Validator & 240-Feature Register:** Tests `validateFeatureAgainstPrdTemplate()` positive/negative cases; verifies 18 phases (`PH00 = PARTIAL`, `PH01..PH17 = NOT_STARTED`) and all 240 feature IDs. | `NOT VERIFIED` (`FND-028`) | `PASS` |
| **`SUITE-06`** | `TEST-GOV-06A` | **`PH00-F007`..`PH00-F012` Decisions, Risks, Sources, Legal Gates, Pilot Framework & Agent Contract:** Verifies 26 Owner decisions (`PENDING`/`GATED`), truthful risk/dependency/assumption registers, source freshness & research-lead quarantine (`SRC-LEAD-*`), 15 legal gates (`PENDING_COUNSEL_OPINION`), 9 pilot launch gates (`overallPilotLaunchAllowed === false`), and `AI_AGENT_CONTRACT.md`. | `NOT VERIFIED` (`FND-012`, `FND-028`) | `PASS` (External gates reported as `GATED` / `BLOCKED`) |
| **`SUITE-07`** | `TEST-AUTH-01`, `TEST-AUTH-02`, `TEST-GOV-05` | **Authentication, Sessions, RBAC, Partner Ownership & Forbidden Client Fields (`FND-001`, `FND-013`, `FND-015`):** Tests anonymous `401`, wrong password `401`, wrong role `403`, partner cross-tenant `403 PARTNER_OWNERSHIP_MISMATCH`, client `actor`/`mfaVerified`/`simulatePaymentSuccess` `400 FORBIDDEN_CLIENT_SECURITY_FIELD`, and logout session revocation. | `NOT VERIFIED` | `PASS` |
| **`SUITE-08`** | `TEST-MFA-01` | **Server-Side RFC 6238 TOTP MFA Verification (`FND-002`):** Verifies privileged mutations fail with `403 MFA_REQUIRED` when `mfa_verified = 0`, invalid TOTP fails with `401 INVALID_TOTP_CODE`, and valid RFC 6238 TOTP code upgrades session `mfa_verified = 1`. | `NOT VERIFIED` | `PASS` |
| **`SUITE-09`** | `TEST-SOD-01`, `TEST-SOD-02` | **Two-Person Separation of Duties & Two-Stage Partner Verification (`FND-003`, `FND-014`):** Verifies Stage 2 before Stage 1 fails (`422`), same Compliance Officer attempting Stage 1 + Stage 2 fails (`422 SEPARATION_OF_DUTIES_VIOLATION` + SQL `CHECK`), and distinct second Compliance Officer with MFA succeeds (`VERIFIED`). | `NOT VERIFIED` | `PASS` |
| **`SUITE-10`** | `TEST-BOOT-01`, `TEST-SEED-01` | **Bootstrap Role Filtering & Zero Synthetic Operational Seed (`FND-004`, `FND-007`):** Verifies fresh DB has `0` bookings and `0` ledger entries; anonymous `/api/v1/bootstrap` returns empty private arrays and redacted reviewer emails; Traveler A cannot see Traveler B's records. | `NOT VERIFIED` | `PASS` |
| **`SUITE-11`** | `TEST-PAY-01`, `TEST-PAY-02`, `TEST-PAY-03`, `TEST-FIN-03`, `TEST-IDEMP-01`, `TEST-BOOK-01` | **Payment Webhooks, 5-Account Double-Entry Ledger, Idempotency & Quote Ownership (`FND-005`, `FND-006`, `FND-016`, `FND-017`, `FND-018`, `FND-019`):** Verifies booking creation leaves `paymentState = 'CREATED'` with `0` ledger entries; partner `APPROVE` before webhook capture fails (`409`); forged webhook HMAC fails (`401`); valid webhook transitions to `CAPTURED` and posts balanced 5-line journal; webhook replay is idempotent; quote reuse (`409`) and cross-user quote use (`403`) fail; refund/decline posts balanced `REFUND_REVERSAL` journal. | `NOT VERIFIED` | `PASS` (`DEP-003` live PSP keys `GATED`) |
| **`SUITE-12`** | `TEST-DB-01`, `TEST-CONC-01`, `TEST-HOLD-01` | **SQLite WAL Persistence, ACID Rollback, Immutable Audit Trigger, Hold Expiry & Concurrent Final-Unit Contention (`FND-008`, `FND-009`, `FND-020`):** Verifies data survives DB close/reopen; unbalanced journal rolls back; `UPDATE`/`DELETE` on `audit_events` aborts; expired holds release `available_units`; 5 parallel reservation workers on 1-unit listing commit at most 1 booking; live DB row counts are untouched by invariant runner. | `NOT VERIFIED` | `PASS` (`DEP-001` Cloud SQL `BLOCKED`) |
| **`SUITE-13`** | `TEST-PRIV-01`, `TEST-PRIV-02`, `TEST-AI-01` | **Per-Traveler Privacy Consent, Incident Trip Ownership & AI Prompt PII Redaction (`FND-010`, `FND-021`, `FND-025`):** Verifies Traveler A and Traveler B have isolated consent rows with version/purpose/4h TTL and immediate revocation; Traveler B cannot file/view incidents on Traveler A's trip (`403`); AI endpoint redacts emails, phones, and passport numbers. | `NOT VERIFIED` | `PASS` |
| **`SUITE-14`** | `TEST-RATE-01`, `TEST-API-01`, `TEST-API-02` | **Input Schema Validation (`HTTP 400`), Correlation ID Sanitization, `/api/*` 404 JSON Catch-All & Sliding-Window Rate Limiting (`HTTP 429`) (`FND-011`, `FND-023`, `FND-024`):** Verifies negative quantities and past dates return `400`, malformed `X-Correlation-Id` is sanitized, unknown `/api/v1/*` returns `404` JSON (never HTML), and burst traffic triggers `429 TOO_MANY_REQUESTS`. | `NOT VERIFIED` | `PASS` |

---

## SECTION 10 — COMPLETE 28-FINDING TRACEABILITY MATRIX

| Google Finding ID | Independent Finding ID | File & Exact Lines | Root Cause | Remediation | Test ID | Evidence (Current Pre-Remediation State) | Current Status |
| :---: | :---: | :--- | :--- | :--- | :---: | :--- | :---: |
| `GAP-01` / `SEC-01` | **`FND-001`** | `/server.ts:79–415` | No user authentication, sessions, or RBAC middleware; trusts `req.body.actor` | SQLite `users` + `sessions`, `scryptSync` login, HMAC session cookies, `requireAuth` & `requireRole`, reject client identity fields | `TEST-AUTH-01` (`SUITE-07`) | Anonymous `PATCH /api/v1/admin/categories/hotels/status` returns `200 OK` | `NOT VERIFIED` |
| `GAP-02` / `SEC-02` | **`FND-002`** | `/server.ts:88, 154, 311`; `/src/App.tsx:135, 637–643` | Client-supplied `mfaVerified` boolean trusted by server | Remove `mfaVerified` from bodies & UI toggle; add RFC 6238 TOTP `POST /api/v1/auth/mfa/verify` setting `sessions.mfa_verified = 1` | `TEST-MFA-01` (`SUITE-08`) | `"mfaVerified": true` in JSON body bypasses MFA on all admin/compliance routes | `NOT VERIFIED` |
| `GAP-03` / `SEC-03` | **`FND-003`** | `/server.ts:303–356`; `/src/domain/store.ts:670–676` | Unauthenticated `reviewerEmail` string comparison | Bind `primary_reviewer_user_id` & `secondary_approver_user_id` to `req.session.userId` with SQL `CHECK (primary_reviewer_user_id <> secondary_approver_user_id)` | `TEST-SOD-01` (`SUITE-09`) | Anonymous caller passing any email string in `req.body.reviewerEmail` approves `PRT-EXP-005` | `NOT VERIFIED` |
| `GAP-04` / `SEC-04` | **`FND-004`** | `/server.ts:44–76` | Unfiltered `/api/v1/bootstrap` dumps all private records | Role-filter `/api/v1/bootstrap` by authenticated session (`PUBLIC` receives `0` bookings, ledger entries, audit events, incidents, or reviewer emails) | `TEST-BOOT-01` (`SUITE-10`) | Anonymous `GET /api/v1/bootstrap` leaks bookings, ledger journals, audit log, staff emails, and consent | `NOT VERIFIED` |
| `GAP-05` / `FIN-01` | **`FND-005`** | `/server.ts:211–219`; `/src/domain/store.ts:949–965` | `simulatePaymentSuccess` marks bookings `CAPTURED` on creation | Remove `simulatePaymentSuccess`; bookings start at `payment_state = 'CREATED'` with `payment_intents.status = 'CREATED'` and `0` ledger entries | `TEST-PAY-01` (`SUITE-11`) | `/server.ts:217` defaults `simulatePaymentSuccess !== false` to instant capture | `NOT VERIFIED` |
| `GAP-06` / `FIN-02` | **`FND-006`** | `/server.ts:260–275` | Partner `APPROVE` directly sets `paymentState = 'CAPTURED'` and writes capture journal | Require prior verified webhook capture (`payment_state === 'CAPTURED'`) before partner `APPROVE` can confirm booking | `TEST-PAY-02` (`SUITE-11`) | `/server.ts:263, 269` sets `paymentState = 'CAPTURED'` inside `partner-decision` | `NOT VERIFIED` |
| `GAP-07` / `DATA-01` | **`FND-007`** | `/src/domain/store.ts:594–634` | Constructor seeds `BKG-SEED-COMPLETED-01` & synthetic ledger journal | Remove constructor booking/ledger seeding; operational DB starts with `0` bookings and `0` ledger entries | `TEST-SEED-01` (`SUITE-10`) | Fresh boot contains `BKG-SEED-COMPLETED-01` and `2,017,050` paisa fake journal | `NOT VERIFIED` |
| `GAP-08` / `DATA-02` | **`FND-008`** | `/src/domain/store.ts:230–236, 470–473` | Volatile in-memory JS arrays and `Map`s | Implement persistent `node:sqlite` (`DatabaseSync`) database at `/data/pherinepal.sqlite` with `WAL` & `BEGIN IMMEDIATE` transactions; keep Cloud SQL `DEP-001` `BLOCKED` | `TEST-DB-01` (`SUITE-12`) | All state in `PheriNepalDomainStore` is lost on process restart | `NOT VERIFIED` (`DEP-001` `BLOCKED`) |
| `GAP-09` / `TEST-01` | **`FND-009`** | `/server.ts:418–529` | Invariant endpoint mutates live `domainStore` in a sequential loop | Run `/api/v1/admin/verify-invariants` on isolated `/tmp/pherinepal-verify-<uuid>.sqlite` with parallel worker contention | `TEST-CONC-01` (`SUITE-12`) | Calling `/api/v1/admin/verify-invariants` mutates `LST-HMS-102` and adds `RaceUser-A` bookings to live state | `NOT VERIFIED` |
| `GAP-10` / `PRIV-01` | **`FND-010`** | `/server.ts:390–415`; `/src/domain/store.ts:584–592` | Global singleton `travelerPrivacyConsent` shared across all visitors | Create `user_privacy_consents` SQL table keyed by `user_id` with version, purpose, 4h TTL, and revocation endpoint | `TEST-PRIV-01` (`SUITE-13`) | Single `travelerPrivacyConsent` object on `domainStore` shared globally | `NOT VERIFIED` |
| `GAP-11` / `SEC-05` | **`FND-011`** | `/server.ts:28–41` | Missing rate limiting, brute-force protection, CORS & schema validation | Add sliding-window rate limiter (`HTTP 429`), auth lockout, strict CORS, and request body schema validator (`HTTP 400`) | `TEST-RATE-01` (`SUITE-14`) | Zero rate-limiting or input schema middleware mounted in `/server.ts` | `NOT VERIFIED` |
| `GAP-12` / `GOV-01` | **`FND-012`** | `/src/domain/catalogue.ts:95–382`; `/src/App.tsx:742`; `/RISK_REGISTER.md:13–22` | 8 categories prematurely `AVAILABLE` (`App.tsx` says 7); missing 22 Appendix A contract items; overstated risk statuses | Reset PH00 default to `0 AVAILABLE` (`13 COMING_SOON, 12 INFORMATION_ONLY, 6 RESTRICTED`); add all `31 × 22 = 682` Appendix A contract fields; update `RISK_REGISTER.md` truthfully | `TEST-GOV-04` (`SUITE-04`, `SUITE-06`) | `catalogue.ts` has 8 `AVAILABLE` categories while `DEC-001` is `PENDING` | `NOT VERIFIED` |
| *New* | **`FND-013`** | `/server.ts:151–179` | Unauthenticated `POST /api/v1/admin/global-switch` | Enforce `requireAuth` + `requireRole('PLATFORM_ADMIN')` + `requireMfa` on global kill-switch endpoint | `TEST-GOV-05` (`SUITE-07`) | Anonymous POST with `"mfaVerified": true` toggles `globalBookingSwitch` | `NOT VERIFIED` |
| *New* | **`FND-014`** | `/server.ts:303–356` | Single-stage partner approval skips primary review & state precondition check | Implement 2-stage transition (`PENDING_PRIMARY_REVIEW` -> `PENDING_SECOND_APPROVAL` -> `VERIFIED`) enforced by SQL `CHECK` | `TEST-SOD-02` (`SUITE-09`) | `/server.ts:329–340` sets `partner.status = 'VERIFIED'` without checking prior state or non-null `primaryReviewer` | `NOT VERIFIED` |
| *New* | **`FND-015`** | `/server.ts:234–300` | Missing partner ownership check on `partner-decision` | Verify `req.session.partnerId === booking.partnerId` (or `PLATFORM_ADMIN` + MFA) before allowing partner decision | `TEST-AUTH-02` (`SUITE-07`) | Zero ownership check in `/server.ts:234–300` | `NOT VERIFIED` |
| *New* | **`FND-016`** | `/server.ts:269–286`; `/src/domain/store.ts:786, 819–879` | Missing duplicate-ledger guard, missing refund journal, service fee credited to partner payable | Add `UNIQUE(booking_id, event_type)` on `ledger_journals`, credit `PLATFORM_SERVICE_FEE_REVENUE` for mandatory fees, and implement balanced `REFUND_REVERSAL` journal | `TEST-FIN-03` (`SUITE-11`) | `recordDoubleEntryCapture` has no deduplication and credits `mandatoryFeeMinor` to `PARTNER_PAYABLE_LIABILITY` | `NOT VERIFIED` |
| *New* | **`FND-017`** | `/server.ts` (missing route) | No signed payment webhook endpoint or payment intent state machine | Implement `POST /api/v1/payments/webhooks/provider` with HMAC-SHA256 verification and `UNIQUE(provider_event_id)` deduplication | `TEST-PAY-03` (`SUITE-11`) | No `/api/v1/payments/*` routes exist in `/server.ts` | `NOT VERIFIED` |
| *New* | **`FND-018`** | `/server.ts:216`; `/src/domain/store.ts:234, 897–905` | Unbound global `idempotencyKey` allows cross-user IDOR & payload substitution | Require client `idempotencyKey`; bind to `UNIQUE(traveler_user_id, idempotency_key)` + `request_payload_hash` | `TEST-IDEMP-01` (`SUITE-11`) | `processedIdempotencyKeys` maps `key -> bookingId` globally with no user or payload check | `NOT VERIFIED` |
| *New* | **`FND-019`** | `/server.ts:188, 215`; `/src/domain/store.ts:774–814, 907–910` | Quotes unbound to user, reusable infinite times; negative quantities coerced; past `serviceDate` accepted | Bind `quote.traveler_user_id`, mark `quote.consumed_by_booking_id` (`UNIQUE`), reject `quantity <= 0` (`400`) and past/invalid `serviceDate` (`400`) | `TEST-BOOK-01` (`SUITE-11`, `SUITE-14`) | Quotes have no owner or consumed flag; `/server.ts:188` clamps `quantity` with `Math.max(1, ...)` | `NOT VERIFIED` |
| *New* | **`FND-020`** | `/src/domain/store.ts:934–938` | Expired inventory holds (`holdExpiresAtUtc`) never released | Implement `releaseExpiredInventoryHolds(nowUtc)` inside `BEGIN IMMEDIATE` transaction restoring `available_units` | `TEST-HOLD-01` (`SUITE-12`) | `holdExpiresAtUtc` is written on bookings but never read or swept anywhere in code | `NOT VERIFIED` |
| *New* | **`FND-021`** | `/server.ts:359–415`; `/src/domain/store.ts:584–592, 975, 982` | Hardcoded `TRV-001` & `TRP-NEPAL-2026-01`; no trip ownership validation on incidents | Derive `traveler_user_id` from `req.session.userId`; validate booking/trip ownership on `POST /api/v1/incidents` and filter `GET` incidents by role/owner | `TEST-PRIV-02` (`SUITE-13`) | `/src/domain/store.ts:975, 982` and `/server.ts:364, 402` hardcode `TRV-001` and `TRP-NEPAL-2026-01` | `NOT VERIFIED` |
| *New* | **`FND-022`** | `/server.ts:79–149` | Missing runtime enum check on `newStatus`; `peak-climbing` omitted from hard-gate list; `DEC-001` gate not enforced | Validate `newStatus` against `VALID_CATEGORY_STATUSES`; include all 6 restricted categories in hard gate; enforce `DEC-001` pending block | `TEST-GOV-06` (`SUITE-04`, `SUITE-08`) | `/server.ts:108` omits `'peak-climbing'` and does not validate `newStatus` enum | `NOT VERIFIED` |
| *New* | **`FND-023`** | `/server.ts:32–41` | Unsanitized `X-Correlation-Id` header | Validate `X-Correlation-Id` against `/^[A-Za-z0-9._-]{8,64}$/`; regenerate server-side if malformed | `TEST-API-01` (`SUITE-14`) | Arbitrary strings in `x-correlation-id` reflect directly into headers and `auditEvents` | `NOT VERIFIED` |
| *New* | **`FND-024`** | `/server.ts:620–633` | Unknown `/api/*` routes fall through to SPA HTML (`200 OK`) | Mount `/api` 404 JSON catch-all before Vite/static middleware returning `404 { code: 'API_ENDPOINT_NOT_FOUND' }` | `TEST-API-02` (`SUITE-14`) | `GET /api/v1/nonexistent` returns `200 OK` HTML (`index.html`) | `NOT VERIFIED` |
| *New* | **`FND-025`** | `/server.ts:532–618` | `POST /api/v1/ai/assist` skips PII redaction & timeout | Implement `redactPiiFromText()` (scrubbing emails, phones, passports, PANs) before LLM calls, add 8s timeout & rate limiter | `TEST-AI-01` (`SUITE-13`) | `/server.ts:534–572` ignores `aiPromptPiiRedactionEnabled` and sends raw text to model | `NOT VERIFIED` |
| *New* | **`FND-026`** | `/src/domain/ph00Governance.ts:427–529` | `PH00_LIFECYCLE_JOURNEY_MAPS` omits `luggage` (#9) in `BEFORE` | Derive `categoryKeysInvolved` for `BEFORE` (21), `DURING` (29), and `AFTER` (10) directly from `CANONICAL_CATEGORIES` | `TEST-GOV-03` (`SUITE-03`) | `BEFORE.categoryKeysInvolved` has 20 items vs. 21 in `CANONICAL_CATEGORIES` (missing `'luggage'`) | `NOT VERIFIED` |
| *New* | **`FND-027`** | `/src/domain/ph00Governance.ts:20–29, 260–411` | `PH00_PERSONAS` missing structured dashboard/stage/category arrays; `PH00_VISION_AND_OUTCOMES` missing in code | Export `PH00_VISION_AND_OUTCOMES` (`OUT-01`..`OUT-12`) and enrich `PH00_PERSONAS` with `allowedDashboardIds`, `lifecycleStages`, `primaryCategoryKeys` | `TEST-GOV-01`, `TEST-GOV-02` (`SUITE-01`, `SUITE-02`) | `OUT-01`..`OUT-12` only in markdown; `PersonaRecord` lacks typed arrays | `NOT VERIFIED` |
| *New* | **`FND-028`** | `/scripts/verify-ph00.ts:1–308` | Binary `passed: boolean` instead of 5-state vocabulary; missing executable security & persistence suites | Upgrade `verify-ph00.ts` to 5-state vocabulary (`PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`/`GATED`) and execute all 14 verification suites (`SUITE-01`..`SUITE-14`) | `SUITE-01`..`SUITE-14` | `verify-ph00.ts` checks only static file strings (`CHK-01`..`CHK-13`) | `NOT VERIFIED` |
