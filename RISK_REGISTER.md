# PheriNepal — Risk, Dependency, Legal & Research Register (`RISK_REGISTER.md`)

**Document ID:** PNP-GOV-RISK-001  
**Blueprint Reference:** Sections 2, 11.4, 14, 21.3, 22 & Phase 00 (`PH00-F008`, `PH00-F009`, `PH00-F010`)

## 1. Operational, Technical & Financial Risk Register (`PH00-F008`)

| Risk ID | Category | Risk Description | Severity | Mitigation & Server-Side Control | Status | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `RSK-001` | Financial / Booking | Payment request succeeds while inventory slot is taken or booking transaction fails, causing unbooked charge. | `CRITICAL` | Separate state machines for Booking (`REQUESTED` → `CONFIRMED`), Inventory (`HELD` → `CONFIRMED`), Payment (`AUTHORIZED` → `CAPTURED`), and Payout. Payment never auto-confirms booking without atomic inventory lock. | `MITIGATED` | Engineering Lead |
| `RSK-002` | Concurrency | Two travelers attempt to book the final room, trek departure seat, or vehicle simultaneously. | `CRITICAL` | Atomic server-side check-and-lock on inventory slot capacity with idempotency key validation and expiring holds (`HELD` with UTC timestamp expiry). | `MITIGATED` | Engineering Lead |
| `RSK-003` | Safety / Duty of Care | Exposing an active SOS button or claiming 24/7 emergency dispatch when no staffed response center is on duty. | `CRITICAL` | Category `sos` (#21) is hard-locked to `GATED` server-side. Emergency directory provides verified public numbers (Nepal Police 100, Tourist Police 1144) with explicit source timestamps and non-replacement disclaimers. | `MITIGATED` | Safety & Ops Lead |
| `RSK-004` | Legal / Escrow | Describing collected funds as "escrow" or "protected until service completion" without legal escrow structure. | `HIGH` | Prohibited in copy and API responses (Rule #6). Double-entry ledger tracks platform receivable, partner payable, and commission explicitly. | `MITIGATED` | Legal & Finance |
| `RSK-005` | Partner Compliance | Unverified or expired-license operator publishing high-risk trekking, peak-climbing, or transport listings. | `HIGH` | 12-Point Mandatory Booking Gate (Section 11.4) verifies partner status, category readiness, license expiry, and two-person approval before any quote or booking mutation. | `MITIGATED` | Verification Lead |
| `RSK-006` | AI Hallucination | AI assistant inventing permit fees, weather safety clearance, or confirming bookings autonomously. | `HIGH` | AI is strictly assistive (`PH12`). Grounded against Official Source Registry with citations, timestamps, and hard boundary disallowing booking/money/verification mutations (Rule #10). | `MITIGATED` | AI Quality Lead |

---

## 2. Legal, Licensing, Insurance & Tax Question Register (`PH00-F010` & Section 22)

| Legal Gate ID | Jurisdiction | Category Scope | Question / Requirement | Authority / Counsel | Status | Launch Gate Impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `LEG-001` | Nepal | All Transactional | Company registration, Department of Tourism (DoT) / NTB intermediary vs tour operator classification. | Nepal Corporate Counsel | `PENDING` | Blocks live production money flow (`Phase 08`). |
| `LEG-002` | Nepal | `trekking`, `peak-climbing`, `guides` | Mandatory TIMS, National Park permits, NMA peak royalties, and licensed guide insurance verification rules. | TAAN / NMA / DoT | `GATED` | `peak-climbing` remains `RESTRICTED`; `trekking` requires two-person compliance verification. |
| `LEG-003` | Nepal | `travel-wallet`, `rewards`, Payments | Nepal Rastra Bank (NRB) PSO/PSP rules on marketplace settlement, holding periods, and stored-value wallets. | NRB Regulatory Counsel | `GATED` | `travel-wallet` (#30) and `rewards` (#26) remain `GATED`. |
| `LEG-004` | Nepal / Int'l | `offline-maps`, `weather-alerts` | Map tile caching/offline redistribution rights and DHM/CAAN official advisory republication terms. | Map Provider & Legal | `GATED` | `offline-maps` (#13) remains `RESTRICTED` (licence-gated). |
| `LEG-005` | Nepal | `companion-matching`, `sos` | Duty-of-care liability, privacy consent, identity verification, and emergency dispatch representations. | Safety & Privacy Counsel | `GATED` | `sos` (#21) and `companion-matching` (#28) remain `GATED`. |

---

## 3. Market Research & Official Content Source Registry (`PH00-F009` & Section 2)

> **Rule:** Treat historical visitor statistics and qualitative market claims as **research leads** until verified against primary datasets with retrieval dates and methodology.

| Source ID | Publisher | Document / Feed Title | URL / Reference | Geography | Last Checked (UTC) | Next Review | Confidence / Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `SRC-NTB-01` | Nepal Tourism Board (NTB) | Tourism Statistics & Official Entry Advisory | `https://ntb.gov.np` | Nationwide | `2026-11-19T08:00:00Z` | `2026-12-19` | `VERIFIED_OFFICIAL_SOURCE` (Used for destination & permit baselines; 2026 arrival figures flagged as research leads pending annual statistical report). |
| `SRC-DOIM-01` | Department of Immigration Nepal | Tourist Visa On-Arrival & Restricted Area Permit Schedule | `https://immigration.gov.np` | Entry Points & Restricted Areas | `2026-11-19T08:00:00Z` | `2026-12-01` | `VERIFIED_OFFICIAL_SOURCE` (15/30/90-day visa fee schedules & Upper Mustang/Dolpo permit rules). |
| `SRC-DHM-01` | Dept. of Hydrology & Meteorology (DHM) | Mountain Weather & River Basin Bulletins | `https://dhm.gov.np` | High Himalaya & Valleys | `2026-11-19T06:30:00Z` | `2026-11-20` | `OFFICIAL_SOURCE_DEPENDENT` (Timestamped advisory only; not a real-time life-safety guarantee). |
| `SRC-TP-01` | Nepal Tourist Police (Bhrikutimandap) | Emergency Directory & Incident Intake Contacts | Hotline `1144` / `+977-1-4247041` | Nationwide | `2026-11-19T08:00:00Z` | `2026-12-19` | `VERIFIED_OFFICIAL_SOURCE` (Publicly accessible without login per Section 14). |
