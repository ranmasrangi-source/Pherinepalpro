# PheriNepal — AI Coding-Agent Operating Contract (`AI_AGENT_CONTRACT.md`)

**Document ID:** PNP-GOV-AGENT-CONTRACT-001  
**Blueprint Reference:** Part V (Sections 33, 33.1, 33.2, 34) & Phase 00 (`PH00-F012`)  
**Status:** Mandatory Governance Contract (`PARTIAL` pending Owner Phase 00 sign-off)

---

## 1. Purpose & Authority Boundary

This operating contract governs Google AI and any other AI coding agent or automated assistant working on the **PheriNepal** repository (`PNP-MASTER-ARCH-001`).

1. **Primary Authority:** The Master Blueprint (`PHERINEPAL-COMPLETE-MASTER-BLUEPRINT-v1.0.md`, Document ID `PNP-MASTER-ARCH-001`) is the sole authoritative product and engineering specification.
2. **Evidence Rule:** Existing code, comments, `README` files, or prior AI reports are never proof that a requirement is satisfied. A feature or phase may be marked `VERIFIED` only when supported by reproducible repository, test, provider, or documentary evidence and accepted by the Product Owner / Founder.
3. **Strict Phase Sequencing:** Work must be executed phase-by-phase (`PH00 → PH01 → PH02 → ... → PH17`). An agent working on `PH00` must stop at the `PH00` boundary and wait for explicit Owner approval before starting `PH01`.

---

## 2. Required 14-Step Operating Procedure (Blueprint Section 33)

Every AI coding agent session must execute this exact sequence:

1. **Read Blueprint:** Read the entire Master Blueprint (`PNP-MASTER-ARCH-001`) and relevant companion specifications before proposing or making any change.
2. **Inspect Repository Baseline:** Inspect the actual Git repository, branch, commit hash, package manifests, runtime environment, and database/storage setup.
3. **Report Verified Baseline:** Report the actual verified state of the repository before modifying files.
4. **Trace Feature IDs:** Compare existing implementation against the exact phase feature IDs (`PHxx-Fxxx`).
5. **Escalate Conflicts & Owner Decisions:** Identify conflicts or ambiguities and record them in `DECISIONS.md` as `PENDING` or `GATED`. Never silently resolve an Owner or Founder decision.
6. **Design & Acceptance Criteria First:** Produce or verify the phase acceptance criteria (and UI/UX state designs where applicable) before writing feature implementation code.
7. **Strict Scope Discipline:** Implement only the approved phase scope. Keep unrelated refactors and out-of-phase features out of the active phase delivery.
8. **Enforce Server-Side Rules & Tests:** Add validation, constraints, authorization checks, audit logging, and automated tests with each requirement.
9. **Execute Real Commands:** Run exact lint, typecheck, and verification commands and capture their verbatim output.
10. **Verify Persistence & Sandboxes Honestly:** Clearly distinguish static/in-memory verification from real PostgreSQL and external provider sandbox verification. Never fabricate external database or provider connectivity.
11. **Review Non-Functional Gates:** Verify security, RBAC/MFA, accessibility (WCAG 2.2 AA target), English/Nepali localization, and responsive behaviour.
12. **Synchronize Governance Artefacts:** Update `REQUIREMENTS.md`, `DECISIONS.md`, `RISK_REGISTER.md`, and traceability registers so documentation matches reality.
13. **Honest Defect & Gate Reporting:** Report incomplete work, `PENDING` decisions, and `GATED` dependencies honestly.
14. **Phase Boundary Stop:** Stop at the phase boundary and wait for explicit Owner approval before advancing to the next phase.

---

## 3. Repository Safety Rules (Blueprint Section 33.1)

- **Protect Existing Work:** Do not delete working features or existing valid functionality to simplify implementation or make tests pass. Every file deletion requires explicit written justification.
- **No Unapproved Rewrites:** Do not perform framework migrations or project rewrites without a documented ADR and Owner approval (`DEC-014`, `DEC-015`).
- **Package Stability:** Do not change package versions blindly.
- **Database Safety:** Never run destructive database commands against shared or production environments.
- **Secret Hygiene:** Never commit `.env`, API keys, secrets, customer PII, or provider credentials, and never expose private environment values in reports.
- **Zero Fabrication:** Never fabricate test outputs, screenshots, commit hashes, legal approvals, partner verifications, or deployment statuses.
- **Reproduce Before Claiming Defects:** Cite exact file path, line/symbol, command, and evidence when reporting or fixing a defect.
- **Preserve Invariants:** Never bypass the 12-point Mandatory Booking Gate, separate Booking/Inventory/Payment/Payout state machines, double-entry ledger balance checks, two-person compliance approvals, or immutable audit logs.

---

## 4. Owner Approval Restrictions (Non-Delegable Decisions)

An AI coding agent is **strictly forbidden** from deciding or marking `VERIFIED`/`APPROVED` any of the following:

1. Pilot region and first live transactional category (`DEC-001`).
2. Final eight dashboard labels and role ownership (`DEC-002`).
3. Category-level transactional classification policy (`DEC-003`).
4. Legal entity structure, licensing, and regulatory interpretation (`DEC-005`, `LEG-001`–`LEG-015`).
5. Commission basis, rates, and fee disclosures (`DEC-006`).
6. Support staffing hours and 24/7 or SOS emergency dispatch commitments (`DEC-007`, `DEC-025`).
7. Payment provider selection, merchant eligibility, settlement flow, or any escrow/custody representation (`DEC-008`, `DEC-009`).
8. Tax, VAT, invoicing, and accounting rules (`DEC-012`).

---

## 5. Mandatory 23-Field Phase Completion Report Format (Blueprint Section 33.2)

Every phase handoff must conclude with this exact evidence structure:

```text
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
