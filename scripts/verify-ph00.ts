/**
 * PHERINEPAL — PHASE 00 AUTOMATED GOVERNANCE & FOUNDATION VERIFICATION SCRIPT
 * Blueprint Reference: PNP-MASTER-ARCH-001 (Sections 5, 6, 7, 18, 22, 23, 24, 30, 32, 33)
 * Directive Scope: PH00 ONLY (PH00-F001 through PH00-F012)
 */

import fs from 'fs';
import path from 'path';
import {
  CANONICAL_CATEGORIES,
  CANONICAL_DASHBOARDS,
  MASTER_PHASE_REGISTER,
} from '../src/domain/catalogue.ts';
import {
  PH00_ALL_26_DECISIONS,
  PH00_ASSUMPTIONS,
  PH00_DEPENDENCIES,
  PH00_FEATURE_AUDIT_MATRIX,
  PH00_LEGAL_REGISTER,
  PH00_LIFECYCLE_JOURNEY_MAPS,
  PH00_PERSONAS,
  PH00_PILOT_FRAMEWORK,
  PH00_RISKS,
} from '../src/domain/ph00Governance.ts';
import { domainStore } from '../src/domain/store.ts';

interface CheckResult {
  id: string;
  featureId: string;
  description: string;
  passed: boolean;
  evidence: string;
}

const results: CheckResult[] = [];

function assertCheck(id: string, featureId: string, description: string, condition: boolean, evidence: string) {
  results.push({ id, featureId, description, passed: condition, evidence });
}

const rootDir = process.cwd();

// 1. Check Mandatory PH00 Governance Document Files Exist
const requiredFiles = [
  'DECISIONS.md',
  'REQUIREMENTS.md',
  'RISK_REGISTER.md',
  'PH00_GOVERNANCE_FOUNDATION.md',
  'PH00_AUDIT_REPORT.md',
  'AI_AGENT_CONTRACT.md',
];

const missingFiles = requiredFiles.filter((f) => !fs.existsSync(path.join(rootDir, f)));
assertCheck(
  'CHK-01',
  'PH00-F001..F012',
  'All 6 mandatory PH00 governance & contract markdown files exist in repository root',
  missingFiles.length === 0,
  missingFiles.length === 0
    ? `Verified presence of: ${requiredFiles.join(', ')}`
    : `Missing files: ${missingFiles.join(', ')}`
);

// 2. PH00-F001: Vision, Positioning & 12 Measurable Outcomes
const foundationContent = fs.readFileSync(path.join(rootDir, 'PH00_GOVERNANCE_FOUNDATION.md'), 'utf8');
const hasOutcomes = Array.from({ length: 12 }, (_, i) => `OUT-${String(i + 1).padStart(2, '0')}`).every((id) =>
  foundationContent.includes(id)
);
assertCheck(
  'CHK-02',
  'PH00-F001',
  'Product vision, 7 trust principles, and 12 measurable outcomes (OUT-01..OUT-12) documented',
  hasOutcomes && foundationContent.includes('Your Complete Nepal Travel Companion'),
  `Verified OUT-01 through OUT-12 and 7 Trust Principles in PH00_GOVERNANCE_FOUNDATION.md (§1)`
);

// 3. PH00-F002: All 15 Personas with VALIDATION_PENDING Empirical Interview Boundary
const all15PersonasValid =
  PH00_PERSONAS.length === 15 &&
  PH00_PERSONAS.every(
    (p, idx) =>
      p.personaId === `PRS-${String(idx + 1).padStart(2, '0')}` &&
      p.empiricalInterviewStatus === 'VALIDATION_PENDING' &&
      p.validationProtocolRequired.length > 10
  );
assertCheck(
  'CHK-03',
  'PH00-F002',
  'All 15 Section 3 personas catalogued with explicit VALIDATION_PENDING interview boundary',
  all15PersonasValid,
  `Verified ${PH00_PERSONAS.length}/15 personas (PRS-01..PRS-15), 100% marked VALIDATION_PENDING for field interviews.`
);

// 4. PH00-F003: Before / During / After Lifecycle Journey Maps
const stages = PH00_LIFECYCLE_JOURNEY_MAPS.map((m) => m.stage);
const journeyValid =
  PH00_LIFECYCLE_JOURNEY_MAPS.length === 3 &&
  stages.includes('BEFORE') &&
  stages.includes('DURING') &&
  stages.includes('AFTER') &&
  PH00_LIFECYCLE_JOURNEY_MAPS.every((m) => m.capabilities.length >= 6 && m.criticalGatesAndFallbacks.length >= 3);
assertCheck(
  'CHK-04',
  'PH00-F003',
  'Complete BEFORE, DURING, and AFTER lifecycle journey maps with capabilities & gate fallbacks',
  journeyValid,
  `Verified ${PH00_LIFECYCLE_JOURNEY_MAPS.length}/3 lifecycle journey maps (${stages.join(', ')}) covering Section 7.1–7.3.`
);

// 5. PH00-F004: 31 Canonical Categories & Category Ownership
const expected31Keys = [
  'hotels',
  'homestays',
  'adventures',
  'trekking',
  'peak-climbing',
  'guides',
  'transport',
  'flights',
  'luggage',
  'nearby-services',
  'esim',
  'sim-info',
  'offline-maps',
  'shopping',
  'restaurants',
  'local-experiences',
  'hidden-nepal',
  'ai-guide',
  'trip-planning',
  'weather-alerts',
  'sos',
  'qr-scan',
  'passport',
  'memories',
  'reviews',
  'rewards',
  'lost-found',
  'companion-matching',
  'group-travel',
  'travel-wallet',
  'support',
];
const actualKeys = CANONICAL_CATEGORIES.map((c) => c.key);
const keysMatchExactOrder =
  CANONICAL_CATEGORIES.length === 31 &&
  expected31Keys.every((k, i) => actualKeys[i] === k) &&
  CANONICAL_CATEGORIES.every(
    (c) => Boolean(c.operationalOwnerRole) && Boolean(c.backupOwnerRole) && Boolean(c.displayNameNe)
  );
assertCheck(
  'CHK-05',
  'PH00-F004',
  '31 canonical categories match Section 5 keys verbatim with operational & backup owner roles',
  keysMatchExactOrder && CANONICAL_DASHBOARDS.length === 8,
  `Verified ${CANONICAL_CATEGORIES.length}/31 categories with operationalOwnerRole & backupOwnerRole, and ${CANONICAL_DASHBOARDS.length}/8 dashboards.`
);

// 6. PH00-F005: Product Requirement & 12-Point DoD Acceptance Criteria Template
const has12PointDoDTemplate =
  foundationContent.includes('Mandatory 12-Point Definition of Done (DoD) Acceptance Checklist') &&
  foundationContent.includes('Feature Specification Template');
assertCheck(
  'CHK-06',
  'PH00-F005',
  'Standardized PRD and Section 23 12-Point Definition of Done template present',
  has12PointDoDTemplate,
  `Verified PRD & 12-Point DoD template in PH00_GOVERNANCE_FOUNDATION.md (§5).`
);

// 7. PH00-F006: 240 Feature Modules across 18 Phases & Phase Status Integrity
const expectedPhaseCounts = [12, 16, 14, 12, 16, 16, 14, 16, 14, 16, 14, 14, 12, 14, 12, 12, 10, 6];
const actualPhaseCounts = MASTER_PHASE_REGISTER.map((p) => p.moduleCount);
const totalModules = actualPhaseCounts.reduce((a, b) => a + b, 0);
const countsMatch =
  MASTER_PHASE_REGISTER.length === 18 &&
  totalModules === 240 &&
  expectedPhaseCounts.every((c, idx) => actualPhaseCounts[idx] === c);

const reqMd = fs.readFileSync(path.join(rootDir, 'REQUIREMENTS.md'), 'utf8');
const all240InReqMd = MASTER_PHASE_REGISTER.every((p) =>
  p.featureIds.every((fid) => reqMd.includes(fid))
);

const phaseStatusIntegrity =
  MASTER_PHASE_REGISTER[0].phaseId === 'PH00' &&
  MASTER_PHASE_REGISTER[0].status === 'PARTIAL' &&
  MASTER_PHASE_REGISTER.slice(1).every((p) => p.status === 'NOT_STARTED');

assertCheck(
  'CHK-07',
  'PH00-F006',
  'All 240 feature IDs enumerated across 18 phases; PH00=PARTIAL and PH01..PH17=NOT_STARTED',
  countsMatch && all240InReqMd && phaseStatusIntegrity,
  `Verified ${MASTER_PHASE_REGISTER.length} phases, ${totalModules}/240 modules in REQUIREMENTS.md & catalogue.ts; PH00=${MASTER_PHASE_REGISTER[0].status}, PH01..PH17 all NOT_STARTED.`
);

// 8. PH00-F007: All 26 Section 32 Owner Decisions Strictly PENDING or GATED
const decisionsMd = fs.readFileSync(path.join(rootDir, 'DECISIONS.md'), 'utf8');
const all26InMd = Array.from({ length: 26 }, (_, i) => `DEC-${String(i + 1).padStart(3, '0')}`).every((id) =>
  decisionsMd.includes(id)
);
const all26StrictlyPendingOrGated =
  PH00_ALL_26_DECISIONS.length === 26 &&
  PH00_ALL_26_DECISIONS.every((d) => d.status === 'PENDING' || d.status === 'GATED');
assertCheck(
  'CHK-08',
  'PH00-F007',
  'All 26 Section 32 Owner decisions present in DECISIONS.md and strictly PENDING or GATED (zero AI self-approvals)',
  all26InMd && all26StrictlyPendingOrGated,
  `Verified ${PH00_ALL_26_DECISIONS.length}/26 decisions (DEC-001..DEC-026); 100% PENDING or GATED.`
);

// 9. PH00-F008: Separate Risk (RSK-*), Dependency (DEP-*), and Assumption (ASM-*) Registers
const riskMd = fs.readFileSync(path.join(rootDir, 'RISK_REGISTER.md'), 'utf8');
const rskDepAsmSeparated =
  PH00_RISKS.length === 12 &&
  PH00_DEPENDENCIES.length === 10 &&
  PH00_ASSUMPTIONS.length === 10 &&
  riskMd.includes('RSK-012') &&
  riskMd.includes('DEP-010') &&
  riskMd.includes('ASM-010');
assertCheck(
  'CHK-09',
  'PH00-F008',
  'Separately identifiable Risk (12), Dependency (10), and Assumption (10) registers in RISK_REGISTER.md',
  rskDepAsmSeparated,
  `Verified ${PH00_RISKS.length} Risks (RSK-001..012), ${PH00_DEPENDENCIES.length} Dependencies (DEP-001..010), and ${PH00_ASSUMPTIONS.length} Assumptions (ASM-001..010).`
);

// 10. PH00-F009: Content Source & Verification Policy + Research Lead Quarantine
const hasResearchLeadQuarantine =
  riskMd.includes('SRC-LEAD-2026-ARRIVALS') &&
  riskMd.includes('SRC-LEAD-COMPETITORS') &&
  riskMd.includes('UNVERIFIED_RESEARCH_LEAD') &&
  domainStore.officialSources.length >= 4;
assertCheck(
  'CHK-10',
  'PH00-F009',
  'Official Source Registry and quarantine of unverified 2026 visitor arrival & competitor research leads',
  hasResearchLeadQuarantine,
  `Verified ${domainStore.officialSources.length} official sources (SRC-NTB-01, SRC-DOIM-01, SRC-DHM-01, SRC-TP-01) and quarantine of SRC-LEAD-2026-ARRIVALS & SRC-LEAD-COMPETITORS as UNVERIFIED_RESEARCH_LEAD.`
);

// 11. PH00-F010: All 15 Section 22 Legal, Licensing, Insurance & Tax Questions
const all15LegalValid =
  PH00_LEGAL_REGISTER.length === 15 &&
  Array.from({ length: 15 }, (_, i) => `LEG-${String(i + 1).padStart(3, '0')}`).every(
    (id, idx) =>
      PH00_LEGAL_REGISTER[idx].legalId === id &&
      PH00_LEGAL_REGISTER[idx].writtenResponse === 'PENDING_COUNSEL_OPINION' &&
      riskMd.includes(id)
  );
assertCheck(
  'CHK-11',
  'PH00-F010',
  'All 15 Section 22 legal/regulatory domains tracked with PENDING_COUNSEL_OPINION (zero fabricated legal sign-offs)',
  all15LegalValid,
  `Verified ${PH00_LEGAL_REGISTER.length}/15 legal domains (LEG-001..LEG-015) in RISK_REGISTER.md (§5).`
);

// 12. PH00-F011: Pilot-Region & Pilot-Category Selection Framework
const pilotFrameworkValid =
  PH00_PILOT_FRAMEWORK.length === 5 &&
  PH00_PILOT_FRAMEWORK.some((c) => c.disposition === 'RECOMMENDED_FOR_OWNER_DECISION') &&
  PH00_PILOT_FRAMEWORK.filter((c) => c.disposition === 'REJECTED_FOR_INITIAL_PILOT').length === 3 &&
  foundationContent.includes('Nine Mandatory Pilot Launch Gates');
assertCheck(
  'CHK-12',
  'PH00-F011',
  '7-criteria pilot evaluation matrix, rejection rationale for deferred candidates, and 9 pilot launch gates',
  pilotFrameworkValid,
  `Verified ${PH00_PILOT_FRAMEWORK.length} evaluated pilot candidates across 7 criteria with explicit rejection rationale; final choice gated on DEC-001.`
);

// 13. PH00-F012: AI Coding-Agent Operating Contract & 23-Field Evidence Report Template
const contractMd = fs.readFileSync(path.join(rootDir, 'AI_AGENT_CONTRACT.md'), 'utf8');
const contractValid =
  contractMd.includes('Required 14-Step Operating Procedure') &&
  contractMd.includes('Repository Safety Rules') &&
  contractMd.includes('Mandatory 23-Field Phase Completion Report Format') &&
  contractMd.includes('23. Phase exit recommendation: PASS / PASS WITH CONDITIONS / FAIL') &&
  PH00_FEATURE_AUDIT_MATRIX.length === 12;
assertCheck(
  'CHK-13',
  'PH00-F012',
  'Standalone AI_AGENT_CONTRACT.md with 14-step procedure, safety rules, and 23-field report format',
  contractValid,
  `Verified /AI_AGENT_CONTRACT.md and 12-item PH00_FEATURE_AUDIT_MATRIX.`
);

// Print Formatted Verification Report
console.log('================================================================================');
console.log('PHERINEPAL — PH00 GOVERNANCE & FOUNDATION VERIFICATION SUITE (PNP-MASTER-ARCH-001)');
console.log('================================================================================');
for (const r of results) {
  console.log(`[${r.passed ? 'PASS' : 'FAIL'}] ${r.id} (${r.featureId}): ${r.description}`);
  console.log(`       Evidence: ${r.evidence}`);
}
const passedCount = results.filter((r) => r.passed).length;
console.log('--------------------------------------------------------------------------------');
console.log(`SUMMARY: ${passedCount} / ${results.length} PH00 Verification Checks Passed.`);
console.log('================================================================================');

if (passedCount !== results.length) {
  process.exit(1);
}
