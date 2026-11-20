/**
 * PHERINEPAL — PHASE 00 CANONICAL GOVERNANCE DATA MODULE (PH00-F001 to PH00-F012)
 * Blueprint Reference: PNP-MASTER-ARCH-001 (Sections 1, 2, 3, 7, 18, 22, 23, 24, 30, 32, 33)
 * Rule: Zero Owner/Founder decisions are marked VERIFIED or APPROVED. All 26 Section 32 decisions
 * remain strictly PENDING or GATED.
 */

import { CANONICAL_CATEGORIES, LifecycleStage } from './catalogue';
import { ServerRole } from '../db/database';

export type VerificationStatus =
  | 'VERIFIED'
  | 'NOT_VERIFIED'
  | 'PENDING'
  | 'GATED'
  | 'BLOCKED';

export interface VisionOutcomeMetric {
  outcomeId: string;
  title: string;
  targetKpi: string;
  measurementMethod: string;
  currentBaselineStatus: VerificationStatus;
}

export interface Ph00FeatureAuditRecord {
  featureId: string;
  title: string;
  blueprintSection: string;
  preRemediationStatus: 'PARTIAL' | 'MISSING' | 'INCORRECT_VERIFIED_CLAIM';
  postRemediationStatus: 'PARTIAL' | 'PENDING' | 'GATED';
  gapRemediated: string;
  acceptanceCriteria: string;
  evidenceFile: string;
  ownerApprovalRequired: string;
}

export interface PersonaRecord {
  personaId: string;
  index: number;
  name: string;
  nameNe: string;
  primaryDashboardId: string;
  allowedDashboardIds: string[];
  lifecycleStages: LifecycleStage[];
  primaryCategoryKeys: string[];
  serverRole: ServerRole;
  workflowScope: string;
  empiricalInterviewStatus: 'VALIDATION_PENDING';
  validationProtocolRequired: string;
}

export interface LifecycleJourneyMap {
  stage: 'BEFORE' | 'DURING' | 'AFTER';
  title: string;
  titleNe: string;
  blueprintSection: string;
  capabilities: string[];
  categoryKeysInvolved: string[];
  criticalGatesAndFallbacks: string[];
}

export interface OwnerDecisionFullRecord {
  id: string;
  topic: string;
  question: string;
  options: string;
  technicalImpact: string;
  financialImpact: string;
  legalImpact: string;
  operationalImpact: string;
  owner: string;
  approver: string;
  dueDate: string;
  status: 'PENDING' | 'GATED';
  safeContinuationWork: string;
}

export interface RiskItem {
  riskId: string;
  domain: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  mitigation: string;
  status: string;
  owner: string;
}

export interface DependencyItem {
  dependencyId: string;
  dependentPhase: string;
  description: string;
  providerOrAuthority: string;
  status: 'PENDING' | 'GATED';
  impactIfUnresolved: string;
  safeFallback: string;
}

export interface AssumptionItem {
  assumptionId: string;
  category: string;
  statement: string;
  validationMethod: string;
  validationStatus:
    | 'UNVERIFIED_RESEARCH_LEAD'
    | 'VALIDATION_PENDING'
    | 'UNVERIFIED_PROVIDER_CAPABILITY'
    | 'PENDING_LEGAL_OPINION'
    | 'VALIDATED_DOMAIN_CONSTRAINT'
    | 'VALIDATED_ARCHITECTURAL_RULE'
    | 'VERIFIED_IN_REPOSITORY';
  impactIfFalse: string;
}

export interface LegalQuestionItem {
  legalId: string;
  domainTitle: string;
  question: string;
  jurisdiction: string;
  categoryScope: string;
  authorityOrCounsel: string;
  writtenResponse: 'PENDING_COUNSEL_OPINION';
  evidenceReference: string;
  effectiveExpiryReview: string;
  owner: string;
  launchGateStatus: 'PENDING' | 'GATED';
}

export interface PilotCandidateEvaluation {
  candidateId: string;
  region: string;
  categoryKeys: string[];
  scores: {
    verifiedSupply: string;
    legalReadiness: string;
    operationalStaffing: string;
    demandEvidence: string;
    manageableGeography: string;
    partnerQuality: string;
    supportCapacity: string;
  };
  disposition: 'RECOMMENDED_FOR_OWNER_DECISION' | 'STAGED_SECONDARY_WAVE' | 'REJECTED_FOR_INITIAL_PILOT';
  rejectionOrSelectionRationale: string;
  gateStatus: 'PENDING' | 'RESTRICTED' | 'INFORMATION_ONLY' | 'GATED';
}

export const PH00_FEATURE_AUDIT_MATRIX: Ph00FeatureAuditRecord[] = [
  {
    featureId: 'PH00-F001',
    title: 'Product vision, positioning and measurable outcomes',
    blueprintSection: 'Sections 1.1, 1.2, 1.3 & 29',
    preRemediationStatus: 'PARTIAL',
    postRemediationStatus: 'PARTIAL',
    gapRemediated: 'Formalized vision, 6 product promises, 7 trust principles, and 12 privacy-safe measurable outcome KPIs (OUT-01..OUT-12) with explicit non-claim disclaimers.',
    acceptanceCriteria: 'Vision, brand/lifecycle lines, 7 trust principles, and 12 measurable outcomes documented without unverified market claims.',
    evidenceFile: '/PH00_GOVERNANCE_FOUNDATION.md (§1)',
    ownerApprovalRequired: 'DEC-004 (Final tagline and brand positioning)'
  },
  {
    featureId: 'PH00-F002',
    title: 'Traveler and partner persona validation',
    blueprintSection: 'Section 3',
    preRemediationStatus: 'MISSING',
    postRemediationStatus: 'PARTIAL',
    gapRemediated: 'Catalogued all 15 Blueprint personas (PRS-01..PRS-15) and separated workflow definitions from empirical user interview status (VALIDATION_PENDING).',
    acceptanceCriteria: 'All 15 personas mapped to workflows, dashboards, and explicit empirical interview protocols.',
    evidenceFile: '/PH00_GOVERNANCE_FOUNDATION.md (§2)',
    ownerApprovalRequired: 'Field interview & usability validation sign-off'
  },
  {
    featureId: 'PH00-F003',
    title: 'Before/during/after journey maps',
    blueprintSection: 'Sections 7.1, 7.2 & 7.3',
    preRemediationStatus: 'PARTIAL',
    postRemediationStatus: 'PARTIAL',
    gapRemediated: 'Authored complete BEFORE, DURING, and AFTER lifecycle journey maps covering all Section 7 capabilities, category keys, and offline/safety gates.',
    acceptanceCriteria: 'All 3 lifecycle stages mapped with touchpoints, state transitions, and failure/offline fallbacks.',
    evidenceFile: '/PH00_GOVERNANCE_FOUNDATION.md (§3)',
    ownerApprovalRequired: 'Product Owner journey sign-off'
  },
  {
    featureId: 'PH00-F004',
    title: '31-category taxonomy and category ownership',
    blueprintSection: 'Sections 5, 5.1, 21.1 & Appendix A',
    preRemediationStatus: 'PARTIAL',
    postRemediationStatus: 'PARTIAL',
    gapRemediated: 'Added operationalOwnerRole and backupOwnerRole to all 31 canonical categories in src/domain/catalogue.ts.',
    acceptanceCriteria: '31 categories in single canonical registry with key, EN/NE display name, initial behaviour, status, phase, operational owner, and backup owner.',
    evidenceFile: '/src/domain/catalogue.ts & /PH00_GOVERNANCE_FOUNDATION.md (§4)',
    ownerApprovalRequired: 'DEC-003 (Category-level transactional classification)'
  },
  {
    featureId: 'PH00-F005',
    title: 'Product requirement and acceptance-criteria template',
    blueprintSection: 'Section 23 (Definition of Done)',
    preRemediationStatus: 'MISSING',
    postRemediationStatus: 'PARTIAL',
    gapRemediated: 'Created standardized PRD & 12-point Definition of Done (DoD) acceptance-criteria template.',
    acceptanceCriteria: 'Template enforces all 12 Section 23 Definition of Done criteria, negative/concurrency tests, and evidence links.',
    evidenceFile: '/PH00_GOVERNANCE_FOUNDATION.md (§5)',
    ownerApprovalRequired: 'Product Owner template acceptance'
  },
  {
    featureId: 'PH00-F006',
    title: 'Feature register with unique IDs and phase ownership',
    blueprintSection: 'Section 24 (240 Modules across 18 Phases)',
    preRemediationStatus: 'INCORRECT_VERIFIED_CLAIM',
    postRemediationStatus: 'PARTIAL',
    gapRemediated: 'Enumerated all 240 feature IDs (PH00-F001..PH17-F006) verbatim, removed premature VERIFIED claims, set PH00 to PARTIAL and PH01–PH17 to NOT_STARTED.',
    acceptanceCriteria: '240 unique feature modules across 18 phases matching Section 24 counts (12,16,14,12,16,16,14,16,14,16,14,14,12,14,12,12,10,6); zero premature VERIFIED claims.',
    evidenceFile: '/REQUIREMENTS.md & /src/domain/catalogue.ts',
    ownerApprovalRequired: 'Product Owner register acceptance'
  },
  {
    featureId: 'PH00-F007',
    title: 'Decision log and unresolved-decision workflow',
    blueprintSection: 'Section 32',
    preRemediationStatus: 'INCORRECT_VERIFIED_CLAIM',
    postRemediationStatus: 'PARTIAL',
    gapRemediated: 'Expanded DECISIONS.md from 10 items to all 26 Section 32 Owner Decisions (DEC-001..DEC-026), all strictly set to PENDING or GATED with 4-dimension impact and safe-continuation rules.',
    acceptanceCriteria: 'All 26 Section 32 decisions documented as PENDING or GATED; zero AI self-approved owner decisions.',
    evidenceFile: '/DECISIONS.md',
    ownerApprovalRequired: 'DEC-001 through DEC-026 require explicit Owner/Founder decisions'
  },
  {
    featureId: 'PH00-F008',
    title: 'Risk, dependency and assumption register',
    blueprintSection: 'Sections 2, 21.3 & 25',
    preRemediationStatus: 'PARTIAL',
    postRemediationStatus: 'PARTIAL',
    gapRemediated: 'Separated RISK_REGISTER.md into distinct Risk (RSK-001..012), Dependency (DEP-001..010), and Assumption (ASM-001..010) registers.',
    acceptanceCriteria: 'Risks, Dependencies, and Assumptions have distinct IDs, severity/status classifications, and mitigation/validation plans.',
    evidenceFile: '/RISK_REGISTER.md (§1–§3)',
    ownerApprovalRequired: 'Product Owner & Engineering Lead risk sign-off'
  },
  {
    featureId: 'PH00-F009',
    title: 'Content source and verification policy',
    blueprintSection: 'Sections 2, 14 & 18',
    preRemediationStatus: 'PARTIAL',
    postRemediationStatus: 'PARTIAL',
    gapRemediated: 'Documented formal Content Source & Freshness Policy and quarantined unverified 2026 visitor-arrival and competitor claims as UNVERIFIED_RESEARCH_LEAD.',
    acceptanceCriteria: 'Official sources carry publisher, URL, checked UTC timestamp, review schedule, and quarantine of unsourced market claims.',
    evidenceFile: '/RISK_REGISTER.md (§4)',
    ownerApprovalRequired: 'Content & Editorial Lead verification sign-off'
  },
  {
    featureId: 'PH00-F010',
    title: 'Legal, licensing, insurance and tax question register',
    blueprintSection: 'Section 22',
    preRemediationStatus: 'PARTIAL',
    postRemediationStatus: 'GATED',
    gapRemediated: 'Expanded Legal Register from 5 items to all 15 Section 22 regulatory domains (LEG-001..LEG-015) with 10 required fields and PENDING_COUNSEL_OPINION.',
    acceptanceCriteria: 'All 15 Section 22 legal domains tracked with question, jurisdiction, category, counsel, written response status, and launch gate.',
    evidenceFile: '/RISK_REGISTER.md (§5)',
    ownerApprovalRequired: 'Written opinions from qualified Nepal legal & tax counsel'
  },
  {
    featureId: 'PH00-F011',
    title: 'Pilot-region and pilot-category selection framework',
    blueprintSection: 'Sections 30.1, 30.2 & 30.3',
    preRemediationStatus: 'MISSING',
    postRemediationStatus: 'PENDING',
    gapRemediated: 'Created 7-criteria evaluation framework, candidate comparison matrix with rejection rationale for deferred options, 9 pilot launch gates, and emergency kill-switch conditions.',
    acceptanceCriteria: 'Candidates evaluated across all 7 Section 30.1 criteria with explicit rejection rationale; final choice left PENDING for Owner DEC-001.',
    evidenceFile: '/PH00_GOVERNANCE_FOUNDATION.md (§6)',
    ownerApprovalRequired: 'DEC-001 (Founder / Product Owner pilot selection)'
  },
  {
    featureId: 'PH00-F012',
    title: 'AI coding-agent operating contract and evidence-report format',
    blueprintSection: 'Sections 33, 33.1 & 33.2',
    preRemediationStatus: 'MISSING',
    postRemediationStatus: 'PARTIAL',
    gapRemediated: 'Created standalone /AI_AGENT_CONTRACT.md containing the 14-step procedure, 9 repository safety rules, non-delegable Owner decisions, and 23-field completion report template.',
    acceptanceCriteria: 'Binding repository contract file enforces phase boundaries, evidence requirements, and repository safety.',
    evidenceFile: '/AI_AGENT_CONTRACT.md',
    ownerApprovalRequired: 'Product Owner acceptance of Phase 00 completion report'
  }
];

export const PH00_PERSONAS: PersonaRecord[] = [
  {
    personaId: 'PRS-01',
    index: 1,
    name: 'International Traveler',
    nameNe: 'अन्तर्राष्ट्रिय यात्रु',
    primaryDashboardId: 'traveler',
    workflowScope: 'Visa/permit rules, verified high-altitude guides, transparent NPR/FX pricing, offline vouchers, public emergency directory.',
    empiricalInterviewStatus: 'VALIDATION_PENDING',
    validationProtocolRequired: '5+ structured interviews testing pre-trip permit clarity and quote breakdown.'
  },
  {
    personaId: 'PRS-02',
    index: 2,
    name: 'Nepali Domestic Traveler',
    nameNe: 'आन्तरिक नेपाली यात्रु',
    primaryDashboardId: 'traveler',
    workflowScope: 'Domestic stays, green-plate transport seats, restaurant reservations, Nepali/English bilingual interface.',
    empiricalInterviewStatus: 'VALIDATION_PENDING',
    validationProtocolRequired: '5+ domestic usability tests in Nepali Unicode.'
  },
  {
    personaId: 'PRS-03',
    index: 3,
    name: 'Nepali Diaspora Traveler',
    nameNe: 'गैरआवासीय / डायस्पोरा नेपाली यात्रु',
    primaryDashboardId: 'traveler',
    workflowScope: 'Multi-generational heritage/pilgrimage planning, multi-service Trip ID workspace, clear cancellation terms.',
    empiricalInterviewStatus: 'VALIDATION_PENDING',
    validationProtocolRequired: '3+ diaspora trip planning walkthroughs.'
  },
  {
    personaId: 'PRS-04',
    index: 4,
    name: 'Hotel / Resort Operator',
    nameNe: 'होटल तथा रिसोर्ट सञ्चालक',
    primaryDashboardId: 'partner',
    workflowScope: 'Room/rate-plan inventory, DoT/PAN verification upload, instant vs approval booking rules, VAT payout statements.',
    empiricalInterviewStatus: 'VALIDATION_PENDING',
    validationProtocolRequired: '3+ hotel operator onboarding trials in Kathmandu & Pokhara.'
  },
  {
    personaId: 'PRS-05',
    index: 5,
    name: 'Homestay Host',
    nameNe: 'होमस्टे (घरबास) सञ्चालक',
    primaryDashboardId: 'partner',
    workflowScope: 'Nepali-first availability calendar, community homestay committee certificate upload, assisted onboarding.',
    empiricalInterviewStatus: 'VALIDATION_PENDING',
    validationProtocolRequired: 'Rural homestay committee field usability test under low connectivity.'
  },
  {
    personaId: 'PRS-06',
    index: 6,
    name: 'Guide / Porter',
    nameNe: 'गाइड तथा पोर्टर',
    primaryDashboardId: 'guide-operator',
    workflowScope: 'NATHM/DoT licence & high-altitude insurance verification, assignment schedule, trail incident escalation.',
    empiricalInterviewStatus: 'VALIDATION_PENDING',
    validationProtocolRequired: 'Usability review with NATHM-licensed trekking guides and porters.'
  },
  {
    personaId: 'PRS-07',
    index: 7,
    name: 'Transport Operator / Driver',
    nameNe: 'यातायात व्यवसायी तथा चालक',
    primaryDashboardId: 'guide-operator',
    workflowScope: 'Green-plate vehicle bluebook & commercial licence verification, seat inventory, highway closure updates.',
    empiricalInterviewStatus: 'VALIDATION_PENDING',
    validationProtocolRequired: 'Field test with tourist vehicle operators.'
  },
  {
    personaId: 'PRS-08',
    index: 8,
    name: 'Adventure / Trekking / Climbing Operator',
    nameNe: 'साहसिक, ट्रेकिङ तथा हिमाल आरोहण एजेन्सी',
    primaryDashboardId: 'partner',
    workflowScope: 'Departure schedules, TIMS/RAP/NMA permit checklists, two-person safety review submission, weather rescheduling.',
    empiricalInterviewStatus: 'VALIDATION_PENDING',
    validationProtocolRequired: 'Workflow review with TAAN/NMA registered agencies.'
  },
  {
    personaId: 'PRS-09',
    index: 9,
    name: 'Restaurant / Local Experience Partner',
    nameNe: 'रेस्टुरेन्ट तथा स्थानीय अनुभव साझेदार',
    primaryDashboardId: 'partner',
    workflowScope: 'Table/party-size approval reservations, allergen disclosure, cultural workshop capacity management.',
    empiricalInterviewStatus: 'VALIDATION_PENDING',
    validationProtocolRequired: 'Onboarding walkthrough with local dining and cultural hosts.'
  },
  {
    personaId: 'PRS-10',
    index: 10,
    name: 'Shopping Seller',
    nameNe: 'नेपाली हस्तकला बिक्रेता',
    primaryDashboardId: 'partner',
    workflowScope: 'Craft authenticity / GI origin declaration, SKU inventory, return/export policies (COMING_SOON in PH10).',
    empiricalInterviewStatus: 'VALIDATION_PENDING',
    validationProtocolRequired: 'Deferred until shopping (#14) phase readiness gate.'
  },
  {
    personaId: 'PRS-11',
    index: 11,
    name: 'Customer Support / Operations Staff',
    nameNe: 'ग्राहक सहायता तथा अपरेसन कर्मचारी',
    primaryDashboardId: 'support-safety',
    workflowScope: 'Ticket triage within 08:00–20:00 NPT, weather disruption coordination, lost-found moderation, escalation.',
    empiricalInterviewStatus: 'VALIDATION_PENDING',
    validationProtocolRequired: 'Internal tabletop drill on route closure and dispute escalation.'
  },
  {
    personaId: 'PRS-12',
    index: 12,
    name: 'Verification / Compliance Staff',
    nameNe: 'प्रमाणीकरण तथा अनुपालन अधिकृत',
    primaryDashboardId: 'verification-compliance',
    workflowScope: 'Partner evidence review, licence expiry tracking, two-person Separation of Duties (SoD) approval, suspension.',
    empiricalInterviewStatus: 'VALIDATION_PENDING',
    validationProtocolRequired: 'Compliance drill testing two-person approval and SoD self-approval block.'
  },
  {
    personaId: 'PRS-13',
    index: 13,
    name: 'Finance Staff',
    nameNe: 'वित्त तथा लेखा अधिकृत',
    primaryDashboardId: 'finance',
    workflowScope: 'Double-entry ledger verification, gateway settlement reconciliation, refund approval, partner payout sign-off.',
    empiricalInterviewStatus: 'VALIDATION_PENDING',
    validationProtocolRequired: 'Accounting walkthrough of integer minor unit (paisa) journal entries.'
  },
  {
    personaId: 'PRS-14',
    index: 14,
    name: 'Content / Editorial Staff',
    nameNe: 'सामग्री तथा सम्पादकीय कर्मचारी',
    primaryDashboardId: 'content-intelligence',
    workflowScope: 'Destination profiles, Official Source Registry (SRC-*) freshness checks, EN/NE localization, AI evaluation.',
    empiricalInterviewStatus: 'VALIDATION_PENDING',
    validationProtocolRequired: 'Editorial test verifying citation timestamps and research-lead quarantine.'
  },
  {
    personaId: 'PRS-15',
    index: 15,
    name: 'Administrator / Owner',
    nameNe: 'प्रमुख प्रशासक / संस्थापक',
    primaryDashboardId: 'admin',
    workflowScope: 'Global Booking Kill Switch, 31-category state machine transitions, Owner Decisions Register, MFA audit log.',
    empiricalInterviewStatus: 'VALIDATION_PENDING',
    validationProtocolRequired: 'Owner walkthrough of MFA-protected category transitions and kill switch.'
  }
];

export const PH00_LIFECYCLE_JOURNEY_MAPS: LifecycleJourneyMap[] = [
  {
    stage: 'BEFORE',
    title: 'Before Travel — Plan, Verify & Arrange',
    titleNe: 'यात्रा अघि — योजना, प्रमाणीकरण र बुकिङ',
    blueprintSection: 'Section 7.1',
    capabilities: [
      'Destination discovery & 31-category honest status inspection',
      'Route, best-season, and official visa/TIMS/RAP permit library (SRC-NTB-01, SRC-DOIM-01)',
      'Server-calculated immutable quote with base price, mandatory fees, 13% VAT & policy snapshot',
      'Partner & listing verification badge showing what was checked and licence expiry',
      '12-Point Mandatory Booking Gate & atomic inventory hold reservation (INSTANT vs APPROVAL)',
      'Packing checklist, document readiness & offline voucher/emergency pack preparation'
    ],
    categoryKeysInvolved: [
      'hotels',
      'homestays',
      'adventures',
      'trekking',
      'peak-climbing',
      'guides',
      'transport',
      'flights',
      'esim',
      'sim-info',
      'offline-maps',
      'local-experiences',
      'hidden-nepal',
      'ai-guide',
      'trip-planning',
      'weather-alerts',
      'companion-matching',
      'group-travel',
      'travel-wallet',
      'support'
    ],
    criticalGatesAndFallbacks: [
      'COMING_SOON, INFORMATION_ONLY, and RESTRICTED categories strictly disable checkout.',
      'Payment success alone never confirms an APPROVAL booking (remains PENDING_PARTNER).',
      'Quotes expire after 15 minutes and lock policy versions immutably.'
    ]
  },
  {
    stage: 'DURING',
    title: 'During Travel — Navigate, Experience & Stay Safe',
    titleNe: 'यात्राको क्रममा — मार्गदर्शन, अनुभव र सुरक्षा',
    blueprintSection: 'Section 7.2',
    capabilities: [
      'Live multi-service Trip ID timeline, independent service vouchers & verified partner contacts',
      'Check-in / check-out state transitions and schedule disruption updates',
      'Timestamped official DHM/CAAN weather & route closure notices (SRC-DHM-01)',
      'Offline itinerary, Nepali translation/phrase help & nearby hospital/pharmacy/ATM discovery',
      'Opt-in, purpose-limited, revocable 4-hour GPS location sharing consent',
      'Staffed support ticket & incident triage (08:00–20:00 NPT) + public Emergency Contact Directory (100 / 1144 / 102)'
    ],
    categoryKeysInvolved: [
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
      'lost-found',
      'companion-matching',
      'group-travel',
      'travel-wallet',
      'support'
    ],
    criticalGatesAndFallbacks: [
      'SOS (#21) is hard-locked to RESTRICTED / GATED; UI never claims 24/7 emergency dispatch.',
      'Public emergency directory (Nepal Police 100, Tourist Police 1144, Ambulance 102) works without login.',
      'Weather advisories display UTC verification timestamps and never convert stale data into safety guarantees.'
    ]
  },
  {
    stage: 'AFTER',
    title: 'After Travel — Reconcile, Review & Remember',
    titleNe: 'यात्रा पछि — हिसाब मिलान, समीक्षा र सम्झना',
    blueprintSection: 'Section 7.3',
    capabilities: [
      'Trip completion record and actual versus estimated expenditure summary in NPR',
      'Full booking, payment, tax receipt, and double-entry refund history',
      'Booking-verified review invitation (strictly gated on COMPLETED booking state) & moderation',
      'Complaint, partial-fulfilment refund, and dispute follow-up workflow',
      'Digital Travel Passport verified destination stamps & private-by-default Travel Memories album',
      'Gated Rewards boundary (RESTRICTED pending tax/accounting sign-off) & repeat-trip recommendations'
    ],
    categoryKeysInvolved: [
      'shopping',
      'ai-guide',
      'passport',
      'memories',
      'reviews',
      'rewards',
      'lost-found',
      'group-travel',
      'travel-wallet',
      'support'
    ],
    criticalGatesAndFallbacks: [
      'Only COMPLETED bookings can generate a verified service review.',
      'Rewards (#26) and Travel Wallet (#30) remain RESTRICTED / GATED until accounting & NRB approvals exist.',
      'User memories default to private with explicit deletion and retention controls.'
    ]
  }
];

export const PH00_ALL_26_DECISIONS: OwnerDecisionFullRecord[] = [
  {
    id: 'DEC-001',
    topic: 'Pilot Region & First Live Category',
    question: 'Which geographic region and service category will launch first for pilot transactions?',
    options: 'A) Kathmandu Valley & Pokhara (hotels, homestays, restaurants, local-experiences, green-plate transport) | B) Khumbu/Annapurna (trekking, guides) | C) Nationwide INFORMATION_ONLY first',
    technicalImpact: 'Controls category/location status flags in canonical registry.',
    financialImpact: 'Defines initial GMV, refund reserve, and payout volume.',
    legalImpact: 'Requires category-specific DoT/local licensing before enabling live checkout.',
    operationalImpact: 'Determines field onboarding and support staffing geography.',
    owner: 'Product Owner',
    approver: 'Founder / Product Owner',
    dueDate: 'PH00 Exit',
    status: 'PENDING',
    safeContinuationWork: 'Build and verify the 31-category state machine, pilot scoring framework (PH00-F011), and 12-point booking gate in sandbox mode.'
  },
  {
    id: 'DEC-002',
    topic: 'Final Eight Dashboard Labels & Ownership',
    question: 'Approve or revise the proposed 8-dashboard role mapping in Blueprint Section 6?',
    options: 'A) Approve Section 6 mapping (Traveler, Partner, Guide/Operator, Admin, Verification & Compliance, Finance, Support & Safety, Content & Intelligence) | B) Custom role naming',
    technicalImpact: 'Governs RBAC permission matrix and dashboard route isolation.',
    financialImpact: 'Isolates Finance & Payout approval permissions.',
    legalImpact: 'Enforces Separation of Duties (SoD) between compliance and finance.',
    operationalImpact: 'Defines staff training and MFA enforcement boundaries.',
    owner: 'Product Owner',
    approver: 'Product Owner',
    dueDate: 'PH00 Exit',
    status: 'PENDING',
    safeContinuationWork: 'Implement proposed 8-dashboard architecture and permission checks as recommended baseline while keeping labels configurable.'
  },
  {
    id: 'DEC-003',
    topic: 'Category-Level Transactional Classification',
    question: 'Which of the 31 categories are permitted to be transactional vs strictly information-only?',
    options: 'A) Adopt Section 5 initial behaviour table | B) Restrict phase-1 transactional flag strictly to accommodation (hotels, homestays)',
    technicalImpact: 'Enforced by Mandatory Booking Gate #2 (category.transactional).',
    financialImpact: 'Determines which categories can generate quotes and ledger entries.',
    legalImpact: 'High-risk categories carry regulatory licensing prerequisites.',
    operationalImpact: 'Dictates verification evidence checklist per category.',
    owner: 'Product & Legal Lead',
    approver: 'Product Owner',
    dueDate: 'Before PH04 Exit',
    status: 'PENDING',
    safeContinuationWork: 'Enforce transactional flag in canonical 31-category registry and block checkout on non-transactional or gated categories.'
  },
  {
    id: 'DEC-004',
    topic: 'Final Tagline & Visual Identity',
    question: 'Approve brand line, lifecycle line, product idea, and bilingual visual system?',
    options: 'A) "Your Complete Nepal Travel Companion" / "Before You Go. While You Explore. After You Return." | B) Alternative Nepali-first brand positioning',
    technicalImpact: 'Design tokens and bilingual i18n translation keys.',
    financialImpact: 'Brand asset production budget.',
    legalImpact: 'Trademark registration and public claim accuracy.',
    operationalImpact: 'Consistent editorial voice across English and Nepali.',
    owner: 'Brand & Design Lead',
    approver: 'Product Owner',
    dueDate: 'Before PH01 Exit',
    status: 'PENDING',
    safeContinuationWork: 'Maintain clean translation keys and semantic CSS tokens.'
  },
  {
    id: 'DEC-005',
    topic: 'Company Structure & Permitted Business Activities',
    question: 'Under what legal entity structure and tourism licences will PheriNepal operate?',
    options: 'A) Marketplace technology intermediary partnering with licensed operators | B) Direct DoT/NTB licensed travel/trekking agency + marketplace',
    technicalImpact: 'Determines tax invoice issuer fields and merchant-of-record logic.',
    financialImpact: 'Governs gross vs net revenue recognition and VAT liability.',
    legalImpact: 'OCR company charter and DoT/NTB licensing (LEG-001, LEG-002).',
    operationalImpact: 'Determines contractual duty of care on bookings.',
    owner: 'Legal Counsel',
    approver: 'Founder',
    dueDate: 'Before PH06',
    status: 'GATED',
    safeContinuationWork: 'Keep live production money GATED; parameterize invoice and partner agreement metadata.'
  },
  {
    id: 'DEC-006',
    topic: 'Commission Basis, Rates & Fee Disclosures',
    question: 'What commission rates, service fees, or partner subscription models apply per category?',
    options: 'A) Category-tiered commission percentage + transparent traveler fee | B) Partner subscription / flat fee model',
    technicalImpact: 'Parameterizes server quote engine and double-entry ledger split.',
    financialImpact: 'Core unit economics and platform take-rate.',
    legalImpact: 'Pre-commitment fee disclosure compliance (LEG-007).',
    operationalImpact: 'Partner commercial contract schedules.',
    owner: 'Finance & Commercial Lead',
    approver: 'Founder',
    dueDate: 'Before PH08',
    status: 'PENDING',
    safeContinuationWork: 'Use configurable basis-point rate plans in sandbox quote engine without claiming final commercial rates.'
  },
  {
    id: 'DEC-007',
    topic: 'Support Hours, Languages & Staffing Model',
    question: 'What are the actual staffed operating hours, languages, and SLAs for traveler and partner support?',
    options: 'A) 08:00–20:00 NPT (English & Nepali) with explicit non-24/7 disclosure | B) 24/7 multi-shift staffed operations desk',
    technicalImpact: 'Controls support SLA timers and operating-hours notices.',
    financialImpact: 'Support operations payroll budget.',
    legalImpact: 'Rule #7 strictly forbids advertising 24/7 support without staffed coverage.',
    operationalImpact: 'Shift rosters, escalation handoffs, and ticket triage queues.',
    owner: 'Operations & Support Lead',
    approver: 'Product Owner',
    dueDate: 'Before PH13',
    status: 'GATED',
    safeContinuationWork: 'Publish explicit 08:00–20:00 NPT support hours and block all 24/7 support claims.'
  },
  {
    id: 'DEC-008',
    topic: 'Payment Provider(s), Merchant Eligibility & Settlement Flow',
    question: 'Which domestic (eSewa, Khalti, Fonepay) and international (Stripe/card) providers are contracted?',
    options: 'A) Domestic PSPs (NPR) + International card gateway via provider-neutral adapters | B) Single aggregator gateway',
    technicalImpact: 'Payment provider adapter framework (PH08-F001) and signed webhook verification.',
    financialImpact: 'Gateway MDR fees, FX spread, and settlement T+N timing.',
    legalImpact: 'NRB PSP/PSO merchant agreements and cross-border collection rules (LEG-008).',
    operationalImpact: 'Daily settlement reconciliation workflow.',
    owner: 'Finance & Engineering Lead',
    approver: 'Founder',
    dueDate: 'Before PH08',
    status: 'GATED',
    safeContinuationWork: 'Implement provider-neutral payment state machine in sandbox mode with zero live money.'
  },
  {
    id: 'DEC-009',
    topic: 'Lawful Handling of Collected Funds (No False Escrow Claims)',
    question: 'How are traveler funds collected, held, and settled to partners under Nepal law?',
    options: 'A) Standard merchant capture and contractual partner payout schedule (never described as escrow) | B) Licensed bank escrow arrangement',
    technicalImpact: 'Separate Payment (AUTHORIZED/CAPTURED) and Payout (PENDING_REVIEW/PAID) states.',
    financialImpact: 'Refund reserve and partner payable liability tracking.',
    legalImpact: 'Rule #6 forbids describing any payment as escrow unless legal structure and provider contract establish it.',
    operationalImpact: 'Partner payout eligibility and approval workflow.',
    owner: 'Legal & Finance Counsel',
    approver: 'Founder',
    dueDate: 'Before PH08',
    status: 'GATED',
    safeContinuationWork: 'Enforce strict ban on escrow claims across UI/API; record balanced double-entry journal lines.'
  },
  {
    id: 'DEC-010',
    topic: 'Booking Approval Response Windows & Hold Duration by Category',
    question: 'How long do temporary inventory holds and partner approval windows last?',
    options: 'A) 15-minute checkout inventory hold; 24-hour partner approval window | B) Category-specific durations',
    technicalImpact: 'Expiry timestamps (holdExpiresAtUtc) and idempotent hold-release jobs.',
    financialImpact: 'Payment authorization expiry windows.',
    legalImpact: 'Transparent expiry disclosure to travelers.',
    operationalImpact: 'Partner response SLA monitoring.',
    owner: 'Product & Operations Lead',
    approver: 'Product Owner',
    dueDate: 'Before PH07',
    status: 'PENDING',
    safeContinuationWork: 'Enforce configurable 15-minute quote/hold expiry timestamps in domain store.'
  },
  {
    id: 'DEC-011',
    topic: 'Refund, Cancellation & No-Show Policy by Category',
    question: 'What are the exact versioned cancellation tiers and refund penalties per category?',
    options: 'A) Standardized platform policy tiers + force-majeure weather closure full refund | B) Partner-custom tiers above platform floor',
    technicalImpact: 'Immutable policy version snapshotting (cancellationPolicyVersion) on quotes and bookings.',
    financialImpact: 'Partial refund and cancellation fee ledger reversals.',
    legalImpact: 'Consumer protection disclosure compliance (LEG-007, LEG-015).',
    operationalImpact: 'Dispute evidence evaluation.',
    owner: 'Product, Finance & Legal',
    approver: 'Product Owner',
    dueDate: 'Before PH07',
    status: 'PENDING',
    safeContinuationWork: 'Attach immutable policy version snapshots to every server quote.'
  },
  {
    id: 'DEC-012',
    topic: 'Tax, VAT, Invoices & Accounting Treatment',
    question: 'How are Nepal VAT (13%), TDS, municipal tourism fees, and tax invoices issued?',
    options: 'A) Platform issues commission tax invoice; partner issues service tax invoice | B) Consolidated invoicing per IRD ruling',
    technicalImpact: 'Tax calculation in integer minor units (paisa) and TAX_VAT_PAYABLE ledger account.',
    financialImpact: 'IRD VAT/TDS reconciliation and statutory audit compliance.',
    legalImpact: 'Inland Revenue Department (IRD) Nepal tax compliance (LEG-009).',
    operationalImpact: 'Mandatory partner PAN/VAT verification.',
    owner: 'Tax & Finance Counsel',
    approver: 'Founder',
    dueDate: 'Before PH08',
    status: 'GATED',
    safeContinuationWork: 'Compute all quotes in integer minor units (paisa) with explicit 13% VAT ledger split.'
  },
  {
    id: 'DEC-013',
    topic: 'Hosting, Database, Queue, Storage & Monitoring Providers',
    question: 'Which cloud infrastructure providers will host staging and production?',
    options: 'A) GCP (Cloud Run, Cloud SQL PostgreSQL, Cloud Storage) | B) AWS / alternative managed cloud',
    technicalImpact: 'Connection pooling, object storage signed URLs, and backup automation.',
    financialImpact: 'Monthly infrastructure OpEx (Section 31).',
    legalImpact: 'Data residency and subprocessor review (DEC-019).',
    operationalImpact: 'Monitoring, alerting, and DR restore drills.',
    owner: 'Infrastructure Lead',
    approver: 'Founder / CTO',
    dueDate: 'Before PH02 Exit',
    status: 'PENDING',
    safeContinuationWork: 'Keep domain logic decoupled behind clean repository/store interfaces.'
  },
  {
    id: 'DEC-014',
    topic: 'Exact Runtime, Framework & PostgreSQL Versions',
    question: 'Confirm target framework and PostgreSQL major/minor versions after repository compatibility audit.',
    options: 'A) Retain working Vite 8.3 + React 19 + TypeScript 7.0 + Express 4.21 modular monolith & attach PostgreSQL 16+ in PH02 | B) Full Next.js 16 migration',
    technicalImpact: 'Section 8 & 33.1 forbid blindly rewriting or upgrading a working repository.',
    financialImpact: 'Prevents unnecessary rewrite cost.',
    legalImpact: 'N/A.',
    operationalImpact: 'CI/CD build stability.',
    owner: 'Lead Architect',
    approver: 'Product Owner',
    dueDate: 'PH00 Exit',
    status: 'PENDING',
    safeContinuationWork: 'Preserve working Vite + React 19 + Express modular monolith baseline without destructive framework migration.'
  },
  {
    id: 'DEC-015',
    topic: 'API Architecture — Route Handlers vs Separate Service',
    question: 'Should /api/v1 run inside the modular monolith or a separate NestJS service?',
    options: 'A) Modular monolith domain services with typed /api/v1 REST contracts (Section 8.1 recommendation) | B) Separate NestJS service',
    technicalImpact: 'Service boundary enforcement and transaction atomicity.',
    financialImpact: 'Single-deployment vs multi-cluster cost.',
    legalImpact: 'N/A.',
    operationalImpact: 'Avoids premature microservices and distributed transactions (Section 8.1).',
    owner: 'Lead Architect',
    approver: 'Product Owner',
    dueDate: 'Before PH02',
    status: 'PENDING',
    safeContinuationWork: 'Structure backend as modular domain services served under versioned /api/v1/* endpoints.'
  },
  {
    id: 'DEC-016',
    topic: 'Authentication Provider & Session Strategy',
    question: 'Use self-managed server sessions or a managed identity provider?',
    options: 'A) Server-managed HttpOnly/Secure/SameSite sessions with Argon2id + TOTP MFA | B) Managed Identity Provider + server session verification',
    technicalImpact: 'Auth middleware, session rotation, and MFA enforcement (PH03).',
    financialImpact: 'Per-MAU identity cost vs self-hosted.',
    legalImpact: 'Credential security and privacy compliance.',
    operationalImpact: 'Account recovery and session revocation workflows.',
    owner: 'Security & Auth Lead',
    approver: 'CTO / Product Owner',
    dueDate: 'Before PH03',
    status: 'PENDING',
    safeContinuationWork: 'Enforce MFA and RBAC permission checks on all privileged admin/compliance/finance endpoints.'
  },
  {
    id: 'DEC-017',
    topic: 'Map, Geocoding, Routing & Offline Map Licences',
    question: 'Which map provider will be licensed, and do contract terms permit offline tile caching?',
    options: 'A) Commercial map provider with explicit offline tile redistribution rights | B) Online-only maps; keep offline-maps (#13) RESTRICTED',
    technicalImpact: 'Map discovery adapter (PH05) and offline tile pack downloader (PH11).',
    financialImpact: 'Per-tile/API quota fees and offline licensing fees.',
    legalImpact: 'Copyright, attribution, and offline redistribution contract (LEG-013).',
    operationalImpact: 'Quota and attribution compliance.',
    owner: 'Product & Legal Lead',
    approver: 'Founder',
    dueDate: 'Before PH05 / PH11',
    status: 'GATED',
    safeContinuationWork: 'Keep offline-maps (#13) hard-locked to RESTRICTED (licence-gated) until written licence is attached.'
  },
  {
    id: 'DEC-018',
    topic: 'AI Provider, Model, Budget & Data-Processing Terms',
    question: 'Which LLM provider, model version, token budget, and zero-data-retention DPA apply?',
    options: 'A) Gemini API (@google/genai) with PII redaction, strict cost caps, and Official Source Registry grounding | B) Alternative enterprise LLM',
    technicalImpact: '/api/v1/ai/assist grounding, citation validation, and deterministic fallback.',
    financialImpact: 'Monthly token budget caps.',
    legalImpact: 'Subprocessor DPA and PII redaction before external model calls (Section 16 & 19).',
    operationalImpact: 'Factuality and safety evaluation dataset monitoring.',
    owner: 'AI & Security Lead',
    approver: 'Product Owner',
    dueDate: 'Before PH12',
    status: 'PENDING',
    safeContinuationWork: 'Enforce non-transactional AI guardrails (Rule #10) and deterministic official-source citation fallback.'
  },
  {
    id: 'DEC-019',
    topic: 'Data Retention, Deletion & Cross-Border Transfer Policy',
    question: 'What exact retention periods and cross-border transfer rules apply to user, booking, and location data?',
    options: 'A) Ephemeral GPS (<= 4h auto-expiry), 7-year financial ledger retention, self-service account erasure/anonymization | B) Counsel-amended schedule',
    technicalImpact: 'TTL cleanup jobs and account anonymization pipeline (PH03-F011).',
    financialImpact: 'Storage retention cost.',
    legalImpact: 'Nepal Individual Privacy Act and cross-border data transfer compliance (LEG-010).',
    operationalImpact: 'Privacy export/deletion request handling.',
    owner: 'Privacy & Legal Counsel',
    approver: 'Product Owner',
    dueDate: 'Before PH03 / PH14',
    status: 'GATED',
    safeContinuationWork: 'Enforce 4-hour auto-expiry on opt-in GPS consent and PII redaction defaults.'
  },
  {
    id: 'DEC-020',
    topic: 'Reliability Targets — SLO, RPO & RTO',
    question: 'What exact availability SLO, Recovery Point Objective (RPO), and Recovery Time Objective (RTO) commitments are approved?',
    options: 'A) 99.5% initial SLO, RPO <= 15m, RTO <= 2h (verified by restore drills) | B) Multi-region HA tier',
    technicalImpact: 'Backup frequency, health checks, and failover architecture (Section 28).',
    financialImpact: 'HA infrastructure cost.',
    legalImpact: 'Never invent SLO/RPO/RTO targets as public commitments before hosting review.',
    operationalImpact: 'On-call incident response and restore drills.',
    owner: 'DevOps & Reliability Lead',
    approver: 'CTO / Founder',
    dueDate: 'Before PH17',
    status: 'PENDING',
    safeContinuationWork: 'Implement health checks and emergency kill switches without publishing unverified SLA commitments.'
  },
  {
    id: 'DEC-021',
    topic: 'Native Mobile App Timing (Android & iOS)',
    question: 'When will native Phase 16 mobile apps begin development relative to Web platform stability?',
    options: 'A) Defer native Android/iOS (PH16) until /api/v1 contracts and web pilot gates pass | B) Parallel mobile shell development',
    technicalImpact: 'API-first /api/v1 contract stability (Section 8).',
    financialImpact: 'Mobile engineering and app-store budget.',
    legalImpact: 'App Store / Play Store compliance.',
    operationalImpact: 'Release management.',
    owner: 'Product & Mobile Lead',
    approver: 'Product Owner',
    dueDate: 'Before PH16',
    status: 'PENDING',
    safeContinuationWork: 'Build responsive mobile/tablet/desktop web UI and versioned /api/v1 endpoints.'
  },
  {
    id: 'DEC-022',
    topic: 'Travel Companion Matching Activation Gate',
    question: 'Under what safety, identity verification, and moderation controls can companion-matching (#28) be enabled?',
    options: 'A) Keep companion-matching (#28) strictly RESTRICTED / GATED | B) Enable only after KYC identity verification, blocking, and safety audit pass',
    technicalImpact: 'Server-side hard block on companion-matching category activation.',
    financialImpact: 'Identity verification cost.',
    legalImpact: 'Personal safety duty of care and minor protection (LEG-010, LEG-014).',
    operationalImpact: 'Abuse and harassment moderation staffing.',
    owner: 'Trust & Safety Lead',
    approver: 'Founder / Product Owner',
    dueDate: 'Before PH15',
    status: 'GATED',
    safeContinuationWork: 'Hard-lock companion-matching (#28) to RESTRICTED / GATED server-side.'
  },
  {
    id: 'DEC-023',
    topic: 'SOS Emergency Feature Activation Gate',
    question: 'What staffing, responder agreements, and live drills are required before sos (#21) can ever be enabled?',
    options: 'A) Keep sos (#21) strictly RESTRICTED / GATED and provide verified public emergency directory (100 / 1144 / 102) | B) Staff 24/7 dispatch center with live responder drills',
    technicalImpact: 'Server-side hard block on sos (#21) activation; public emergency directory accessible without login.',
    financialImpact: '24/7 emergency dispatch staffing and liability insurance.',
    legalImpact: 'Rule #7 forbids exposing an SOS or 24/7 emergency promise without staffed operations and approved drills (LEG-014).',
    operationalImpact: 'Emergency escalation SOPs and live responder drills.',
    owner: 'Safety & Operations Lead',
    approver: 'Founder',
    dueDate: 'Before PH13',
    status: 'GATED',
    safeContinuationWork: 'Hard-lock sos (#21) to RESTRICTED / GATED; keep public Emergency Contact Directory accessible without login.'
  },
  {
    id: 'DEC-024',
    topic: 'Final Partner Verification Rules & Re-Check Frequency per Category',
    question: 'What exact documentary evidence and expiry re-verification intervals apply to each of the 31 categories?',
    options: 'A) Adopt Section 13 & Appendix A category evidence checklist with expiry-driven re-verification and two-person approval for high-risk supply | B) Counsel-amended checklist',
    technicalImpact: 'Enforced by Mandatory Booking Gate #5, Gate #7 (licenceExpiryUtc), and Gate #12 (two-person SoD).',
    financialImpact: 'Compliance verification operations cost.',
    legalImpact: 'Regulatory compliance with DoT, TAAN, NMA, DoTM (LEG-002..LEG-006).',
    operationalImpact: 'Verification queue SLA and expiry alerts.',
    owner: 'Compliance & Verification Lead',
    approver: 'Product Owner',
    dueDate: 'Before PH06',
    status: 'PENDING',
    safeContinuationWork: 'Enforce licence expiry check (Gate #7) and two-person Separation of Duties approval (Gate #12).'
  },
  {
    id: 'DEC-025',
    topic: 'Travel Wallet (#30) & Stored-Value / E-Money Regulatory Decision',
    question: 'Will PheriNepal apply for NRB stored-value wallet licensing or omit wallet functionality?',
    options: 'A) Keep travel-wallet (#30) strictly RESTRICTED / GATED and process direct per-booking payments only | B) Partner with NRB-licensed PSP under regulatory sign-off',
    technicalImpact: 'Server-side hard block on travel-wallet (#30) activation.',
    financialImpact: 'Client fund segregation and capital requirements.',
    legalImpact: 'Nepal Rastra Bank (NRB) Payment and Settlement Act compliance (LEG-008).',
    operationalImpact: 'AML/KYC compliance operations.',
    owner: 'Legal & Finance Counsel',
    approver: 'Founder',
    dueDate: 'Before PH08',
    status: 'GATED',
    safeContinuationWork: 'Hard-lock travel-wallet (#30) to RESTRICTED / GATED server-side.'
  },
  {
    id: 'DEC-026',
    topic: 'Rewards & Loyalty Accounting Policy (#26)',
    question: 'How are loyalty points accounted for, taxed, and isolated from the cash ledger?',
    options: 'A) Keep rewards (#26) RESTRICTED / GATED until deferred-revenue accounting rules and separate non-cash ledger are approved | B) Non-monetary passport stamps only (#23)',
    technicalImpact: 'Strict separation between cash double-entry ledger and any future rewards ledger (Section 12.2).',
    financialImpact: 'Balance sheet deferred liability accounting.',
    legalImpact: 'Tax and promotional terms compliance (LEG-008, LEG-009).',
    operationalImpact: 'Loyalty fraud prevention.',
    owner: 'Finance Lead',
    approver: 'Founder / CFO',
    dueDate: 'Before PH14',
    status: 'GATED',
    safeContinuationWork: 'Hard-lock rewards (#26) to RESTRICTED / GATED and keep double-entry cash ledger strictly isolated.'
  }
];

export const PH00_RISKS: RiskItem[] = [
  {
    riskId: 'RSK-001',
    domain: 'Financial / Booking',
    description: 'Payment request succeeds while inventory slot is taken or booking transaction fails, causing an unbooked charge.',
    severity: 'CRITICAL',
    mitigation: 'Separate 4-dimension state machines (Booking, InventoryHold, Payment, Payout). Payment never auto-confirms a booking without atomic inventory hold lock (Rule #5).',
    status: 'MITIGATED_IN_SANDBOX',
    owner: 'Engineering Lead'
  },
  {
    riskId: 'RSK-002',
    domain: 'Concurrency',
    description: 'Two travelers attempt to reserve the final room, trek departure seat, or transport unit simultaneously.',
    severity: 'CRITICAL',
    mitigation: 'Atomic server-side check-and-decrement on inventory capacity with idempotency key deduplication and expiring holds.',
    status: 'MITIGATED_IN_SANDBOX',
    owner: 'Engineering Lead'
  },
  {
    riskId: 'RSK-003',
    domain: 'Safety / Duty of Care',
    description: 'Exposing an active SOS button or claiming 24/7 emergency response when no staffed dispatch center is operational.',
    severity: 'CRITICAL',
    mitigation: 'Category sos (#21) is hard-locked to RESTRICTED / GATED server-side (Rule #7). Public Emergency Contact Directory (100 / 1144 / 102) is accessible without login.',
    status: 'MITIGATED_BY_HARD_GATE',
    owner: 'Safety & Ops Lead'
  },
  {
    riskId: 'RSK-004',
    domain: 'Legal / Escrow',
    description: 'Describing collected funds as "escrow" or "protected until service completion" without a lawful escrow arrangement.',
    severity: 'CRITICAL',
    mitigation: 'Strictly prohibited in UI copy, quote snapshots, and API payloads (Rule #6 & DEC-009). Double-entry ledger records clearing, partner payable, commission, and VAT explicitly.',
    status: 'MITIGATED_BY_POLICY',
    owner: 'Legal & Finance Lead'
  },
  {
    riskId: 'RSK-005',
    domain: 'Partner Compliance',
    description: 'Unverified, suspended, or expired-licence partner accepting bookings in high-risk categories.',
    severity: 'HIGH',
    mitigation: '12-Point Mandatory Booking Gate checks partner VERIFIED status (Gate #5), non-expired licence & insurance (Gate #7), and two-person approval (Gate #12).',
    status: 'MITIGATED_IN_SANDBOX',
    owner: 'Verification & Compliance Lead'
  },
  {
    riskId: 'RSK-006',
    domain: 'AI Hallucination / Safety',
    description: 'AI assistant inventing permit rules, weather safety clearance, or attempting to autonomously confirm bookings or move money.',
    severity: 'HIGH',
    mitigation: 'AI is strictly assistive (Rule #10). Grounded in Official Source Registry (SRC-*) with UTC verification timestamps and zero booking/money authority.',
    status: 'MITIGATED_IN_SANDBOX',
    owner: 'AI Quality Lead'
  },
  {
    riskId: 'RSK-007',
    domain: 'Data Privacy / Location',
    description: 'Indefinite retention or non-consensual tracking of traveler GPS coordinates during a trip.',
    severity: 'HIGH',
    mitigation: 'During-trip GPS sharing defaults to OFF, is opt-in, revocable at any time, and auto-expires after 4 hours (Section 14 & 16).',
    status: 'MITIGATED_IN_SANDBOX',
    owner: 'Privacy & Security Lead'
  },
  {
    riskId: 'RSK-008',
    domain: 'External Provider Outage',
    description: 'Payment gateway, weather feed, LLM provider, or map provider experiences downtime during travel.',
    severity: 'HIGH',
    mitigation: 'Platform degrades safely (Principle #10): deterministic source-registry fallback for AI, printable vouchers, and idempotent retry handling.',
    status: 'OPEN_MONITORED',
    owner: 'Platform Reliability Lead'
  },
  {
    riskId: 'RSK-009',
    domain: 'Stale Official Information',
    description: 'Outdated visa fee, TIMS permit rule, or DHM weather bulletin presented to travelers as current fact.',
    severity: 'HIGH',
    mitigation: 'Every official source record stores lastVerifiedUtc and nextReviewDate; advisories carry explicit non-real-time disclaimers (Section 18).',
    status: 'MITIGATED_BY_DESIGN',
    owner: 'Content & Editorial Lead'
  },
  {
    riskId: 'RSK-010',
    domain: 'Privilege Escalation / SoD',
    description: 'Single staff member self-approving a high-risk partner or executing an unauthorized category/financial state change.',
    severity: 'CRITICAL',
    mitigation: 'MFA verification check + Separation of Duties (primaryReviewer !== secondaryApprover) enforced server-side and logged to immutable auditEvents.',
    status: 'MITIGATED_IN_SANDBOX',
    owner: 'Security Lead'
  },
  {
    riskId: 'RSK-011',
    domain: 'Premature Phase Completion Claims',
    description: 'Marking features or phases VERIFIED based on documentation or unapproved assumptions rather than actual evidence and Owner sign-off.',
    severity: 'HIGH',
    mitigation: 'Automated PH00 verification script (scripts/verify-ph00.ts) and AI_AGENT_CONTRACT.md enforce PH00 PARTIAL status and PH01–PH17 NOT_STARTED status.',
    status: 'MITIGATED_BY_AUDIT',
    owner: 'Governance Engineer'
  },
  {
    riskId: 'RSK-012',
    domain: 'Stored-Value Regulatory Breach',
    description: 'Offering a top-up travel-wallet (#30) or cash-equivalent rewards (#26) prior to Nepal Rastra Bank (NRB) and tax clearance.',
    severity: 'CRITICAL',
    mitigation: 'Both travel-wallet (#30) and rewards (#26) are hard-locked to RESTRICTED / GATED server-side (DEC-025, DEC-026, LEG-008).',
    status: 'MITIGATED_BY_HARD_GATE',
    owner: 'Legal & Finance Counsel'
  }
];

export const PH00_DEPENDENCIES: DependencyItem[] = [
  {
    dependencyId: 'DEP-001',
    dependentPhase: 'PH02',
    description: 'Provisioned PostgreSQL database instance (Cloud SQL or equivalent) with migration & backup access (DEC-013, DEC-014).',
    providerOrAuthority: 'Cloud Host / GCP Project Owner',
    status: 'GATED',
    impactIfUnresolved: 'External managed PostgreSQL multi-instance deployment and PITR drills (PH02-F004) remain blocked until GCP/Cloud SQL project provisioning is authorized.',
    safeFallback: 'Modular monolith runs persistent relational SQLite (node:sqlite DatabaseSync at data/pherinepal.sqlite) with WAL, FOREIGN KEYS, CHECK/UNIQUE constraints, versioned migrations, and BEGIN IMMEDIATE transactions.'
  },
  {
    dependencyId: 'DEP-002',
    dependentPhase: 'PH06 / PH07 / PH08',
    description: 'Written Nepal legal counsel opinion on company registration, DoT/NTB licensing, and intermediary rules (LEG-001, LEG-002).',
    providerOrAuthority: 'Qualified Nepal Corporate Counsel',
    status: 'PENDING',
    impactIfUnresolved: 'Live commercial partner contracting and production checkout cannot launch.',
    safeFallback: 'All categories operate in non-production sandbox or INFORMATION_ONLY / RESTRICTED states.'
  },
  {
    dependencyId: 'DEP-003',
    dependentPhase: 'PH08',
    description: 'Approved merchant agreements and API credentials for domestic (eSewa, Khalti, Fonepay) and international (Stripe) gateways (DEC-008).',
    providerOrAuthority: 'Payment Service Providers (PSPs) & NRB',
    status: 'GATED',
    impactIfUnresolved: 'Live payment capture and automated partner payouts cannot go live.',
    safeFallback: 'Sandbox payment state machine and double-entry ledger tested with synthetic minor units (paisa).'
  },
  {
    dependencyId: 'DEP-004',
    dependentPhase: 'PH09',
    description: 'Official verification workflows with DoT, TAAN, NMA, and NATHM licence directories (LEG-003).',
    providerOrAuthority: 'DoT / TAAN / NMA / NATHM',
    status: 'GATED',
    impactIfUnresolved: 'High-risk mountain categories cannot open for public instant booking.',
    safeFallback: 'peak-climbing (#5) locked to RESTRICTED; trekking (#4) & guides (#6) require two-person manual compliance verification.'
  },
  {
    dependencyId: 'DEP-005',
    dependentPhase: 'PH09 (flights #8)',
    description: 'Domestic & international airline GDS / aggregator API contract (LEG-004).',
    providerOrAuthority: 'Airlines / CAAN / GDS Provider',
    status: 'GATED',
    impactIfUnresolved: 'Live flight seat inventory and ticket issuance unavailable.',
    safeFallback: 'Category flights (#8) locked to INFORMATION_ONLY (never claims inventory without provider confirmation).'
  },
  {
    dependencyId: 'DEP-006',
    dependentPhase: 'PH11 (offline-maps #13)',
    description: 'Commercial map provider licence with explicit offline vector tile caching and redistribution rights (DEC-017, LEG-013).',
    providerOrAuthority: 'Map Provider & Legal Counsel',
    status: 'GATED',
    impactIfUnresolved: 'Offline map package downloads cannot be distributed legally.',
    safeFallback: 'Category offline-maps (#13) hard-locked to RESTRICTED (licence-gated).'
  },
  {
    dependencyId: 'DEP-007',
    dependentPhase: 'PH11 (esim #11)',
    description: 'Authorised telecom reseller contract & NTA compliance clearance for eSIM issuance.',
    providerOrAuthority: 'Nepal Telecommunications Authority (NTA) / eSIM Provider',
    status: 'GATED',
    impactIfUnresolved: 'Direct eSIM purchase unavailable.',
    safeFallback: 'esim (#11) set to COMING_SOON; sim-info (#12) provides verified passport KYC guide (INFORMATION_ONLY).'
  },
  {
    dependencyId: 'DEP-008',
    dependentPhase: 'PH11 (weather-alerts #20)',
    description: 'Official Department of Hydrology and Meteorology (DHM) and CAAN advisory feed republication terms.',
    providerOrAuthority: 'DHM / MFD TIA / CAAN',
    status: 'PENDING',
    impactIfUnresolved: 'Automated real-time weather monitoring cannot be claimed.',
    safeFallback: 'Timestamped official bulletins displayed with explicit non-real-time disclaimers.'
  },
  {
    dependencyId: 'DEP-009',
    dependentPhase: 'PH13 (sos #21, support #31)',
    description: '24/7 staffed incident response center, verified responder escalation agreements, and live emergency drills (DEC-007, DEC-023).',
    providerOrAuthority: 'Internal Operations & Emergency Responders',
    status: 'GATED',
    impactIfUnresolved: 'Live SOS button and 24/7 support promises are strictly prohibited (Rule #7).',
    safeFallback: 'Explicit support hours (08:00–20:00 NPT) published; public Emergency Contact Directory (100 / 1144 / 102) accessible without login.'
  },
  {
    dependencyId: 'DEP-010',
    dependentPhase: 'PH12 (ai-guide #18)',
    description: 'Approved production LLM API key (GEMINI_API_KEY), token cost budget, and zero-data-retention DPA (DEC-018).',
    providerOrAuthority: 'AI Model Provider',
    status: 'PENDING',
    impactIfUnresolved: 'Live generative calls depend on runtime key availability.',
    safeFallback: 'Deterministic Official Source Registry citation engine provides 100% grounded fallback answers.'
  }
];

export const PH00_ASSUMPTIONS: AssumptionItem[] = [
  {
    assumptionId: 'ASM-001',
    category: 'Market Context',
    statement: 'Earlier draft market context claims regarding monthly 2026 Nepal visitor-arrival figures, visitor spend, and commission benchmarks represent actual market demand.',
    validationMethod: 'Cross-check against primary NTB / Ministry of Culture, Tourism and Civil Aviation statistical reports with methodology and retrieval date (Section 2).',
    validationStatus: 'UNVERIFIED_RESEARCH_LEAD',
    impactIfFalse: 'Commercial projections would be distorted; figures are quarantined from public claims until verified.'
  },
  {
    assumptionId: 'ASM-002',
    category: 'Competitor Context',
    statement: 'Named candidates (Booking.com, Airbnb, eSewa Hotels, ghumNepal, Hop Nepal, Hotel Nepal app) have specific listing, verification, price, and support gaps in Nepal.',
    validationMethod: 'Dated feature-by-feature competitor teardown across listing, verification, price transparency, booking, support, and reviews (Section 2).',
    validationStatus: 'UNVERIFIED_RESEARCH_LEAD',
    impactIfFalse: 'Positioning claims could be inaccurate; no candidate may be called "closest competitor" until dated comparison is complete.'
  },
  {
    assumptionId: 'ASM-003',
    category: 'Traveler Personas',
    statement: 'International, domestic Nepali, and diaspora travelers prefer one unified Before/During/After trip workspace (Trip ID) over fragmented point apps.',
    validationMethod: 'Structured user interviews and prototype usability tests across personas PRS-01, PRS-02, and PRS-03 (PH00-F002).',
    validationStatus: 'VALIDATION_PENDING',
    impactIfFalse: 'UX entry points may require stronger single-service shortcuts alongside Trip ID grouping.'
  },
  {
    assumptionId: 'ASM-004',
    category: 'Partner Inclusion',
    statement: 'Homestay hosts (PRS-05), local guides/porters (PRS-06), and small operators can complete digital verification and approval-booking responses within 24 hours.',
    validationMethod: 'Field usability testing in Nepali (नेपाली), assisted onboarding trials (PH06-F014), and SMS/notification fallback tests.',
    validationStatus: 'VALIDATION_PENDING',
    impactIfFalse: 'High partner approval-expiry rate on APPROVAL bookings without assisted onboarding.'
  },
  {
    assumptionId: 'ASM-005',
    category: 'Payment Capability',
    statement: 'Domestic PSPs (eSewa, Khalti, Fonepay) and international gateways support authorization/hold-and-capture or split marketplace payouts.',
    validationMethod: 'Direct written technical and merchant contract confirmation from each payment provider (Section 12.1 & 12.3).',
    validationStatus: 'UNVERIFIED_PROVIDER_CAPABILITY',
    impactIfFalse: 'Cannot assume hold-and-release at check-in is available; must rely on capture + double-entry ledger payout/refund control.'
  },
  {
    assumptionId: 'ASM-006',
    category: 'Connectivity',
    statement: 'Travelers on high-altitude trekking routes experience intermittent or zero cellular connectivity for 24–72+ hours.',
    validationMethod: 'Offline voucher, itinerary, and emergency directory caching verification (PH11-F006, PH11-F007).',
    validationStatus: 'VALIDATED_DOMAIN_CONSTRAINT',
    impactIfFalse: 'Offline resilience remains beneficial across all rural corridors.'
  },
  {
    assumptionId: 'ASM-007',
    category: 'Regulatory Classification',
    statement: 'Operating a status-gated platform where verified partners supply accommodation, guides, and transport qualifies as a regulated intermediary requiring specific DoT/IRD registrations.',
    validationMethod: 'Written legal opinion from qualified Nepal corporate and tourism counsel (LEG-001..LEG-015).',
    validationStatus: 'PENDING_LEGAL_OPINION',
    impactIfFalse: 'Licensing, VAT invoicing, and insurance obligations may shift between platform and partner.'
  },
  {
    assumptionId: 'ASM-008',
    category: 'Review Integrity',
    statement: 'Restricting review submission strictly to travelers with a COMPLETED booking record prevents fake marketplace rating inflation.',
    validationMethod: 'Moderation queue audit and anti-abuse testing (PH14-F004, PH14-F005).',
    validationStatus: 'VALIDATED_ARCHITECTURAL_RULE',
    impactIfFalse: 'Partner self-booking collusion must still be monitored via Finance and Moderation controls.'
  },
  {
    assumptionId: 'ASM-009',
    category: 'Repository Runtime',
    statement: 'The existing Vite 8.3 + React 19 + TypeScript 7.0 + Express 4.21 repository serves as a compliant modular monolith baseline for Phase 00 without a destructive Next.js rewrite.',
    validationMethod: 'tsc --noEmit, vite build, and /api/v1 contract verification (DEC-014).',
    validationStatus: 'VERIFIED_IN_REPOSITORY',
    impactIfFalse: 'If SSR/SEO in Phase 04 requires Next.js, an ADR (DEC-014) will govern a controlled migration.'
  },
  {
    assumptionId: 'ASM-010',
    category: 'Currency Precision',
    statement: 'Storing and calculating all NPR amounts in integer minor units (100 paisa = 1.00 NPR) eliminates binary floating-point rounding drift.',
    validationMethod: 'Automated double-entry ledger balance tests (totalDebitMinor === totalCreditMinor).',
    validationStatus: 'VERIFIED_IN_REPOSITORY',
    impactIfFalse: 'Multi-currency FX display (PH16-F008) will additionally require explicit rate timestamps and rounding rules.'
  }
];

export const PH00_LEGAL_REGISTER: LegalQuestionItem[] = [
  {
    legalId: 'LEG-001',
    domainTitle: 'Company Registration & Permitted Business Activities',
    question: 'What OCR corporate charter objects and Department of Industry/Tourism registrations are required for PheriNepal?',
    jurisdiction: 'Nepal',
    categoryScope: 'All 31 Categories',
    authorityOrCounsel: 'Office of the Company Registrar (OCR) / Nepal Corporate Counsel',
    writtenResponse: 'PENDING_COUNSEL_OPINION',
    evidenceReference: 'None (Awaiting Written Counsel Opinion)',
    effectiveExpiryReview: 'Pending / Annual Review',
    owner: 'Founder & Legal Lead',
    launchGateStatus: 'GATED'
  },
  {
    legalId: 'LEG-002',
    domainTitle: 'Tourism, Travel Agency & Tour Operator Rules',
    question: 'Under what conditions does aggregating packages require a direct Department of Tourism (DoT) travel agency licence vs partner licence verification?',
    jurisdiction: 'Nepal',
    categoryScope: 'adventures, local-experiences, trip-planning',
    authorityOrCounsel: 'Department of Tourism (DoT) / Nepal Tourism Board (NTB)',
    writtenResponse: 'PENDING_COUNSEL_OPINION',
    evidenceReference: 'None (Awaiting Written Counsel Opinion)',
    effectiveExpiryReview: 'Pending / Annual Review',
    owner: 'Legal & Compliance Lead',
    launchGateStatus: 'GATED'
  },
  {
    legalId: 'LEG-003',
    domainTitle: 'Trekking, Guide, Porter & Mountaineering Rules',
    question: 'What mandatory TIMS, conservation permits, NMA climbing royalties, liaison officer rules, and guide/porter insurance limits must be enforced?',
    jurisdiction: 'Nepal',
    categoryScope: 'trekking (#4), peak-climbing (#5), guides (#6)',
    authorityOrCounsel: 'DoT / TAAN / NMA / NATHM',
    writtenResponse: 'PENDING_COUNSEL_OPINION',
    evidenceReference: 'None (Awaiting Written Counsel Opinion)',
    effectiveExpiryReview: 'Pending / Seasonal Review',
    owner: 'Safety & Compliance Lead',
    launchGateStatus: 'GATED'
  },
  {
    legalId: 'LEG-004',
    domainTitle: 'Transport & Aviation Intermediary Restrictions',
    question: 'What DoTM green-plate tourist vehicle rules and CAAN aviation ticketing intermediary licences apply?',
    jurisdiction: 'Nepal',
    categoryScope: 'transport (#7), flights (#8)',
    authorityOrCounsel: 'Dept. of Transport Management (DoTM) / CAAN',
    writtenResponse: 'PENDING_COUNSEL_OPINION',
    evidenceReference: 'None (Awaiting Written Counsel Opinion)',
    effectiveExpiryReview: 'Pending / Annual Review',
    owner: 'Operations & Legal Lead',
    launchGateStatus: 'GATED'
  },
  {
    legalId: 'LEG-005',
    domainTitle: 'Accommodation, Hotel & Homestay Registration',
    question: 'What federal DoT tourist-standard classification and provincial/local ward homestay committee registrations are mandatory?',
    jurisdiction: 'Nepal (Federal, Provincial, Local)',
    categoryScope: 'hotels (#1), homestays (#2)',
    authorityOrCounsel: 'DoT / Provincial Tourism Offices / Municipalities',
    writtenResponse: 'PENDING_COUNSEL_OPINION',
    evidenceReference: 'None (Awaiting Written Counsel Opinion)',
    effectiveExpiryReview: 'Pending / Annual Review',
    owner: 'Partner Verification Lead',
    launchGateStatus: 'PENDING'
  },
  {
    legalId: 'LEG-006',
    domainTitle: 'Food, Restaurant & Marketplace Seller Obligations',
    question: 'What municipal food hygiene licences, allergen disclosures, craft authenticity, and export/return rules apply?',
    jurisdiction: 'Nepal',
    categoryScope: 'restaurants (#15), shopping (#14), luggage (#9)',
    authorityOrCounsel: 'DFTQC / Local Municipalities',
    writtenResponse: 'PENDING_COUNSEL_OPINION',
    evidenceReference: 'None (Awaiting Written Counsel Opinion)',
    effectiveExpiryReview: 'Pending / Annual Review',
    owner: 'Marketplace Compliance Lead',
    launchGateStatus: 'GATED'
  },
  {
    legalId: 'LEG-007',
    domainTitle: 'Consumer Protection, Advertising & Price Disclosure',
    question: 'How must base fares, mandatory fees, 13% VAT, commissions, and cancellation terms be disclosed under Nepal Consumer Protection Act?',
    jurisdiction: 'Nepal',
    categoryScope: 'All Transactional Categories',
    authorityOrCounsel: 'Dept. of Commerce, Supplies & Consumer Protection',
    writtenResponse: 'PENDING_COUNSEL_OPINION',
    evidenceReference: 'None (Awaiting Written Counsel Opinion)',
    effectiveExpiryReview: 'Pending / Annual Review',
    owner: 'Product & Legal Lead',
    launchGateStatus: 'PENDING'
  },
  {
    legalId: 'LEG-008',
    domainTitle: 'Payment Collection, Marketplace Settlement, Refunds & Wallet/E-Money Rules',
    question: 'What NRB Payment and Settlement Act rules govern collecting traveler funds, settling to partners, and operating travel-wallet (#30)?',
    jurisdiction: 'Nepal & Cross-Border',
    categoryScope: 'All Payments, travel-wallet (#30), rewards (#26)',
    authorityOrCounsel: 'Nepal Rastra Bank (NRB) / Banking Counsel',
    writtenResponse: 'PENDING_COUNSEL_OPINION',
    evidenceReference: 'None (Awaiting Written Counsel Opinion)',
    effectiveExpiryReview: 'Pending / Annual Review',
    owner: 'Finance & Legal Counsel',
    launchGateStatus: 'GATED'
  },
  {
    legalId: 'LEG-009',
    domainTitle: 'Tax, VAT, Invoices & Accounting Compliance',
    question: 'What Inland Revenue Department (IRD) electronic invoicing, 13% VAT, TDS withholding, and 7-year ledger retention rules apply?',
    jurisdiction: 'Nepal',
    categoryScope: 'All Financial Operations (PH08)',
    authorityOrCounsel: 'Inland Revenue Department (IRD) / Chartered Accountant',
    writtenResponse: 'PENDING_COUNSEL_OPINION',
    evidenceReference: 'None (Awaiting Written Tax Opinion)',
    effectiveExpiryReview: 'Pending / Fiscal Year Review',
    owner: 'Finance Lead',
    launchGateStatus: 'GATED'
  },
  {
    legalId: 'LEG-010',
    domainTitle: 'Privacy, Cybersecurity, Data Transfers & Retention',
    question: 'What Individual Privacy Act (Nepal) and international consent, erasure, breach notification, and cross-border hosting rules apply?',
    jurisdiction: 'Nepal & International',
    categoryScope: 'All User, Partner, Location & AI Data',
    authorityOrCounsel: 'Privacy & Cybersecurity Counsel',
    writtenResponse: 'PENDING_COUNSEL_OPINION',
    evidenceReference: 'None (Awaiting Written Counsel Opinion)',
    effectiveExpiryReview: 'Pending / Annual Review',
    owner: 'Security & Privacy Lead',
    launchGateStatus: 'GATED'
  },
  {
    legalId: 'LEG-011',
    domainTitle: 'Insurance & Platform Liability',
    question: 'What corporate general liability and partner mandatory passenger/trekker rescue insurance verification policies are required?',
    jurisdiction: 'Nepal & International',
    categoryScope: 'adventures, trekking, peak-climbing, guides, transport',
    authorityOrCounsel: 'Nepal Insurance Authority (Beema Pradhikaran) / Broker',
    writtenResponse: 'PENDING_COUNSEL_OPINION',
    evidenceReference: 'None (Awaiting Written Counsel Opinion)',
    effectiveExpiryReview: 'Pending / Annual Renewal',
    owner: 'Risk & Legal Lead',
    launchGateStatus: 'GATED'
  },
  {
    legalId: 'LEG-012',
    domainTitle: 'Employment & Independent Contractor Arrangements',
    question: 'How must platform agreements with guides, porters, drivers, and operational support staff be structured under Nepal Labour Act?',
    jurisdiction: 'Nepal',
    categoryScope: 'guides (#6), transport (#7), Internal Staff',
    authorityOrCounsel: 'Labour & Employment Counsel',
    writtenResponse: 'PENDING_COUNSEL_OPINION',
    evidenceReference: 'None (Awaiting Written Counsel Opinion)',
    effectiveExpiryReview: 'Pending / Annual Review',
    owner: 'HR & Legal Lead',
    launchGateStatus: 'PENDING'
  },
  {
    legalId: 'LEG-013',
    domainTitle: 'Intellectual Property, Map/Media Licences & Content Rights',
    question: 'What licensing terms govern map tiles, offline map downloads (#13), heritage monument QR guides (#22), and user-uploaded memories (#24)?',
    jurisdiction: 'Nepal & International',
    categoryScope: 'offline-maps (#13), qr-scan (#22), memories (#24)',
    authorityOrCounsel: 'Map Providers / Dept. of Archaeology / IP Counsel',
    writtenResponse: 'PENDING_COUNSEL_OPINION',
    evidenceReference: 'None (Awaiting Licence Contracts)',
    effectiveExpiryReview: 'Pending / Contract Expiry',
    owner: 'Content & Legal Lead',
    launchGateStatus: 'GATED'
  },
  {
    legalId: 'LEG-014',
    domainTitle: 'Emergency / SOS Representations & Duty of Care',
    question: 'What legal disclaimers and response standards govern emergency directories and the sos (#21) feature?',
    jurisdiction: 'Nepal & International',
    categoryScope: 'sos (#21), weather-alerts (#20), support (#31)',
    authorityOrCounsel: 'Safety & Liability Counsel',
    writtenResponse: 'PENDING_COUNSEL_OPINION',
    evidenceReference: 'None (Awaiting Written Counsel Opinion)',
    effectiveExpiryReview: 'Pending / Pre-Drill Review',
    owner: 'Safety & Legal Lead',
    launchGateStatus: 'GATED'
  },
  {
    legalId: 'LEG-015',
    domainTitle: 'Terms of Service, Privacy Notice, Cancellation & Dispute Policies',
    question: 'Are customer Terms of Service, Partner Agreements, Privacy Notices, and Dispute Rules approved in English and Nepali?',
    jurisdiction: 'Nepal',
    categoryScope: 'Platform-Wide (PH03, PH06, PH07, PH13)',
    authorityOrCounsel: 'External Legal Counsel',
    writtenResponse: 'PENDING_COUNSEL_OPINION',
    evidenceReference: 'None (Awaiting Written Counsel Opinion)',
    effectiveExpiryReview: 'Pending / Versioned Snapshot',
    owner: 'Legal Lead',
    launchGateStatus: 'GATED'
  }
];

export const PH00_PILOT_FRAMEWORK: PilotCandidateEvaluation[] = [
  {
    candidateId: 'PILOT-CAND-A',
    region: 'Kathmandu Valley (Kathmandu, Lalitpur/Patan, Bhaktapur) & Pokhara (Kaski)',
    categoryKeys: ['hotels', 'homestays', 'restaurants', 'local-experiences', 'transport'],
    scores: {
      verifiedSupply: 'HIGH — High density of DoT/PAN registered hotels & homestay committees',
      legalReadiness: 'MEDIUM-HIGH — Standard municipal/DoT registration (subject to LEG-001/005)',
      operationalStaffing: 'HIGH — Manageable within 08:00–20:00 NPT staffed hours',
      demandEvidence: 'HIGH — Primary arrival and domestic leisure corridor',
      manageableGeography: 'HIGH — Reliable 4G/fiber connectivity and road/air access',
      partnerQuality: 'HIGH — Capable of 15-min holds and <24h approval turnarounds',
      supportCapacity: 'HIGH — Low high-altitude life-safety dispatch risk'
    },
    disposition: 'RECOMMENDED_FOR_OWNER_DECISION',
    rejectionOrSelectionRationale: 'Recommended initial pilot candidate for Owner Decision DEC-001: proves the 12-point booking gate and double-entry ledger with lowest life-safety and regulatory friction.',
    gateStatus: 'PENDING'
  },
  {
    candidateId: 'PILOT-CAND-B',
    region: 'Khumbu (Solukhumbu) & Annapurna (Kaski/Manang)',
    categoryKeys: ['trekking', 'guides', 'adventures'],
    scores: {
      verifiedSupply: 'HIGH — Strong TAAN/NATHM cooperative supply',
      legalReadiness: 'MEDIUM — Requires TIMS, National Park permits & mandatory rescue insurance checks (LEG-003)',
      operationalStaffing: 'MEDIUM — Requires two-person compliance reviewers & Lukla weather disruption desk',
      demandEvidence: 'HIGH — Core international trekking corridor',
      manageableGeography: 'LOW-MEDIUM — High-altitude intermittent connectivity & weather flight holds',
      partnerQuality: 'MEDIUM-HIGH — Requires assisted onboarding and 24h APPROVAL mode',
      supportCapacity: 'MEDIUM — Requires strict non-SOS boundary and HRA/Tourist Police referral'
    },
    disposition: 'STAGED_SECONDARY_WAVE',
    rejectionOrSelectionRationale: 'Deferred from instant-booking wave to Staged Approval-Booking Wave: requires two-person safety verification and weather rescheduling SOP drills.',
    gateStatus: 'PENDING'
  },
  {
    candidateId: 'PILOT-CAND-C',
    region: 'High-Himalaya 6,000m+ Expedition Peaks (Island Peak, Mera Peak, etc.)',
    categoryKeys: ['peak-climbing'],
    scores: {
      verifiedSupply: 'MEDIUM — Specialized NMA expedition operators',
      legalReadiness: 'LOW — NMA climbing royalties, liaison officers, garbage deposits (LEG-003)',
      operationalStaffing: 'LOW — High technical mountaineering compliance burden',
      demandEvidence: 'MEDIUM — Seasonal expedition windows',
      manageableGeography: 'LOW — Extreme altitude, helicopter rescue dependency',
      partnerQuality: 'HIGH — IFMGA/NMA certified operators',
      supportCapacity: 'LOW — High life-safety liability risk'
    },
    disposition: 'REJECTED_FOR_INITIAL_PILOT',
    rejectionOrSelectionRationale: 'Rejected for Initial Pilot: High life-safety and regulatory complexity. Kept in RESTRICTED status until NMA permit verification and safety drills mature.',
    gateStatus: 'RESTRICTED'
  },
  {
    candidateId: 'PILOT-CAND-D',
    region: 'Domestic & International Aviation Sectors',
    categoryKeys: ['flights'],
    scores: {
      verifiedSupply: 'LOW — Requires live airline/GDS contract (DEP-005)',
      legalReadiness: 'LOW — CAAN aviation ticketing intermediary rules (LEG-004)',
      operationalStaffing: 'LOW — Requires real-time flight delay/cancellation re-ticketing desk',
      demandEvidence: 'HIGH — High traveler interest',
      manageableGeography: 'MEDIUM — Frequent mountain airfield weather holds',
      partnerQuality: 'N/A — Direct airline/aggregator integration required',
      supportCapacity: 'LOW — High refund/disruption volume during monsoon/winter'
    },
    disposition: 'REJECTED_FOR_INITIAL_PILOT',
    rejectionOrSelectionRationale: 'Rejected for Initial Pilot: Blueprint Appendix A forbids claiming flight inventory without provider confirmation. Kept in INFORMATION_ONLY.',
    gateStatus: 'INFORMATION_ONLY'
  },
  {
    candidateId: 'PILOT-CAND-E',
    region: 'Platform-Wide Regulated Financial, Social & Emergency Modules',
    categoryKeys: ['sos', 'travel-wallet', 'rewards', 'companion-matching', 'offline-maps'],
    scores: {
      verifiedSupply: 'N/A',
      legalReadiness: 'BLOCKED — NRB e-money (LEG-008), Tax (LEG-009), Map licence (LEG-013), Duty of Care (LEG-014)',
      operationalStaffing: 'BLOCKED — SOS requires 24/7 staffed response center & live drills (Rule #7)',
      demandEvidence: 'MEDIUM',
      manageableGeography: 'N/A',
      partnerQuality: 'N/A',
      supportCapacity: 'BLOCKED — Unstaffed 24/7 emergency or social moderation'
    },
    disposition: 'REJECTED_FOR_INITIAL_PILOT',
    rejectionOrSelectionRationale: 'Rejected for Initial Pilot: Hard-locked to RESTRICTED / GATED server-side until statutory licences, tax opinions, map redistribution contracts, and 24/7 staffed emergency drills exist.',
    gateStatus: 'GATED'
  }
];
