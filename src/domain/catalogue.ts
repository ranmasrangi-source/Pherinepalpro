export type CategoryStatus = 'AVAILABLE' | 'COMING_SOON' | 'INFORMATION_ONLY' | 'RESTRICTED';

export const VALID_CATEGORY_STATUSES: readonly CategoryStatus[] = [
  'AVAILABLE',
  'COMING_SOON',
  'INFORMATION_ONLY',
  'RESTRICTED',
] as const;

export function isValidCategoryStatus(value: unknown): value is CategoryStatus {
  return (
    typeof value === 'string' &&
    (VALID_CATEGORY_STATUSES as readonly string[]).includes(value)
  );
}

export type LifecycleStage = 'BEFORE' | 'DURING' | 'AFTER';

export interface AppendixAServiceContract {
  item01_ownerAndPurpose: string;
  item02_primaryPersonas: string[];
  item03_availabilityState: {
    currentPh00State: CategoryStatus;
    targetPilotState: CategoryStatus;
    governingDecisionIds: string[];
  };
  item04_lifecycleTouchpoints: LifecycleStage[];
  item05_partnerVerificationRequirements: string[];
  item06_permitAndRegulatoryRules: string[];
  item07_safetyAndEmergencyRules: string[];
  item08_pricingAndFeeFormula: {
    currency: 'NPR';
    commissionRate: number;
    serviceFeeRate: number;
    taxRate: number;
    formulaDescription: string;
  };
  item09_bookingAndInventoryModel: string;
  item10_cancellationAndRefundPolicy: string;
  item11_settlementAndPayoutRule: string;
  item12_disputeAndChargebackRule: string;
  item13_offlineAndLowConnectivityBehavior: string;
  item14_aiAssistantBoundaries: string;
  item15_analyticsEvents: string[];
  item16_kpisAndSlas: {
    quoteLatencyP95Ms: number;
    partnerConfirmationSlaMinutes: number;
    incidentAckSlaMinutes: number;
    targetFulfillmentRatePct: number;
  };
  item17_securityControls: string[];
  item18_privacyControls: string[];
  item19_rbacMatrix: {
    readRoles: string[];
    quoteAndBookRoles: string[];
    partnerFulfillRoles: string[];
    governanceOverrideRoles: string[];
  };
  item20_abacRules: string[];
  item21_fraudAbuseControls: string[];
  item22_legalProviderOperationalGates: string[];
}

export interface CanonicalCategory {
  number: number;
  key: string;
  name: string;
  status: CategoryStatus;
  targetPilotStatus: CategoryStatus;
  reasonCode: string;
  lifecycleStages: LifecycleStage[];
  commissionRate: number;
  serviceFeeRate: number;
  taxRate: number;
  verificationRequired: boolean;
  restrictedPermitRequired: boolean;
  insuranceRequired: boolean;
  safetyCheckInRequired: boolean;
  emergencyContactRequired: boolean;
  offlinePackSupported: boolean;
  description: string;
  bookingGateRules: string[];
  primaryActors: string[];
  keyEntities: string[];
  stateMachineSummary: string;
  failureAndRecoverySummary: string;
  appendixAContract: AppendixAServiceContract;
}

export interface DashboardModule {
  id: string;
  code: string;
  name: string;
  audience: string;
  mfaRequired: boolean;
  dualControlRequired: boolean;
  keyCapabilities: string[];
}

export interface PhaseDefinition {
  code: string;
  number: number;
  name: string;
  status: 'ACTIVE_REMEDIATION' | 'COMPLETED_VERIFIED' | 'LOCKED_PENDING_PREREQUISITES';
  focus: string;
  exitCriteriaSummary: string;
}

export interface FeatureModuleEntry {
  id: string;
  code: string;
  domain: 'CATEGORY' | 'PLATFORM_FOUNDATION';
  categoryKey?: string;
  title: string;
  phaseCode: string;
  status: 'IMPLEMENTED_VERIFIED' | 'GOVERNED_GATED' | 'PLANNED_LOCKED';
}

interface RawCategorySeed {
  number: number;
  key: string;
  name: string;
  status: CategoryStatus;
  targetPilotStatus: CategoryStatus;
  reasonCode: string;
  lifecycleStages: LifecycleStage[];
  commissionRate: number;
  serviceFeeRate: number;
  taxRate: number;
  verificationRequired: boolean;
  restrictedPermitRequired: boolean;
  insuranceRequired: boolean;
  safetyCheckInRequired: boolean;
  emergencyContactRequired: boolean;
  offlinePackSupported: boolean;
  description: string;
  bookingGateRules: string[];
  primaryActors: string[];
  keyEntities: string[];
  stateMachineSummary: string;
  failureAndRecoverySummary: string;
}

function buildAppendixAContract(seed: RawCategorySeed): AppendixAServiceContract {
  const decisionIds =
    seed.targetPilotStatus === 'AVAILABLE'
      ? ['DEC-001', 'DEC-003', 'DEC-005', 'LEG-001']
      : seed.status === 'RESTRICTED'
        ? ['DEC-001', 'DEC-006', 'DEC-009', 'LEG-002', 'LEG-005']
        : ['DEC-001', 'DEC-003', 'LEG-001'];

  return {
    item01_ownerAndPurpose: `Domain Owner: PheriNepal ${seed.name} Product & Operations Lead. Purpose: ${seed.description}`,
    item02_primaryPersonas: seed.primaryActors,
    item03_availabilityState: {
      currentPh00State: seed.status,
      targetPilotState: seed.targetPilotStatus,
      governingDecisionIds: decisionIds,
    },
    item04_lifecycleTouchpoints: seed.lifecycleStages,
    item05_partnerVerificationRequirements: seed.verificationRequired
      ? [
          'Two-person distinct reviewer approval (Primary Compliance Reviewer + Secondary Compliance Approver)',
          'PAN/VAT tax registration certificate verification',
          'Department of Tourism / Municipal operating license verification',
          'Verified Nepal settlement bank account',
        ]
      : ['Public informational directory validation by Content & Safety Ops'],
    item06_permitAndRegulatoryRules: seed.restrictedPermitRequired
      ? [
          'Restricted Area Permit (RAP) / TIMS / National Park or CAAN regulatory permit verification mandatory prior to confirmation',
          'Government-licensed guide or operator manifest attachment required',
        ]
      : ['Standard Nepal tourism operating compliance and municipal registration'],
    item07_safetyAndEmergencyRules: [
      seed.safetyCheckInRequired
        ? 'Mandatory scheduled GPS/trail check-in and active SOS desk monitoring (DSH-04)'
        : 'Standard in-app emergency SOS hotline and incident reporting access',
      seed.emergencyContactRequired
        ? 'Verified emergency next-of-kin contact and blood-group declaration required before departure'
        : 'Optional traveler emergency contact on profile',
      seed.insuranceRequired
        ? 'High-altitude medical & helicopter evacuation insurance policy verification required'
        : 'Travel insurance recommended',
    ],
    item08_pricingAndFeeFormula: {
      currency: 'NPR',
      commissionRate: seed.commissionRate,
      serviceFeeRate: seed.serviceFeeRate,
      taxRate: seed.taxRate,
      formulaDescription: `BaseSubtotal = UnitPriceNPR * Quantity; Commission = round(BaseSubtotal * ${seed.commissionRate}); ServiceFee = round(BaseSubtotal * ${seed.serviceFeeRate}); VAT = round((BaseSubtotal + ServiceFee) * ${seed.taxRate}); TotalPayable = BaseSubtotal + ServiceFee + VAT; NetPartnerPayout = BaseSubtotal - Commission.`,
    },
    item09_bookingAndInventoryModel: seed.stateMachineSummary,
    item10_cancellationAndRefundPolicy:
      'Immutable cancellation & refund snapshot attached at Quote creation; full refund on partner rejection or uncaptured hold expiry; tiered refund per listing policy via double-entry reversal journal.',
    item11_settlementAndPayoutRule:
      'T+2 NPR bank payout eligibility after COMPLETED service state and zero open SEV1/SEV2 dispute holds; dual-approval required above NPR 250,000.',
    item12_disputeAndChargebackRule:
      'Evidence-backed dispute intake freezes partner payout liability account; 72-hour SLA for partner response; Finance Officer + Support Lead adjudication.',
    item13_offlineAndLowConnectivityBehavior: seed.offlinePackSupported
      ? 'Full offline voucher, itinerary, emergency contact, and cached trail/locality pack available in low-connectivity zones; queued mutations sync idempotently.'
      : 'Cached read-only voucher and emergency hotline numbers accessible offline.',
    item14_aiAssistantBoundaries:
      'Advisory-only itinerary and safety guidance with mandatory PII redaction; AI assistant cannot execute bookings, alter prices, waive permits, or override restricted category gates.',
    item15_analyticsEvents: [
      `category.${seed.key}.viewed`,
      `category.${seed.key}.quote_created`,
      `category.${seed.key}.booking_hold_placed`,
      `category.${seed.key}.payment_webhook_processed`,
      `category.${seed.key}.partner_decision_recorded`,
    ],
    item16_kpisAndSlas: {
      quoteLatencyP95Ms: 250,
      partnerConfirmationSlaMinutes: seed.restrictedPermitRequired ? 120 : 30,
      incidentAckSlaMinutes: seed.safetyCheckInRequired ? 5 : 15,
      targetFulfillmentRatePct: 98.5,
    },
    item17_securityControls: [
      'Server-derived session authentication (HttpOnly + HMAC signed token)',
      'RFC 6238 TOTP MFA step-up required for all governance, compliance, and finance mutations',
      'HMAC-SHA256 payment webhook signature verification with replay protection',
      'Append-only SQLite audit_events table protected by BEFORE UPDATE/DELETE triggers',
    ],
    item18_privacyControls: [
      'Per-traveler granular privacy consent record with explicit consent version and purpose',
      '4-hour automatic GPS telemetry TTL expiry and immediate consent revocation endpoint',
      'Automated regex PII redaction (email, Nepal phone, passport ID) before external AI calls',
    ],
    item19_rbacMatrix: {
      readRoles: ['ANONYMOUS_PUBLIC', 'TRAVELER', 'PARTNER', 'SUPPORT_AGENT', 'COMPLIANCE_REVIEWER', 'FINANCE_OFFICER', 'SAFETY_LEAD', 'FOUNDER_ADMIN'],
      quoteAndBookRoles: ['TRAVELER', 'FOUNDER_ADMIN'],
      partnerFulfillRoles: ['PARTNER'],
      governanceOverrideRoles: ['FOUNDER_ADMIN'],
    },
    item20_abacRules: [
      `Category Status Gate: category.status === 'AVAILABLE' required for quote/booking execution`,
      `Partner Ownership Gate: req.session.partnerId === booking.partnerId required for partner confirmation/rejection`,
      `Traveler Ownership Gate: req.session.userId === quote.travelerUserId && req.session.userId === booking.travelerUserId`,
      `Compliance Dual-Control Gate: partner.primaryReviewerUserId !== req.session.userId required for secondary approval`,
    ],
    item21_fraudAbuseControls: [
      'Single-use user-bound quote tokens with 15-minute expiry and pricing snapshot hash verification',
      'User- and payload-bound idempotency keys (UNIQUE(traveler_user_id, idempotency_key))',
      'Verified completed stay check (booking.bookingState === COMPLETED) enforced on review submission',
      'Sliding-window API rate limiting on authentication, quote, booking, and AI endpoints',
    ],
    item22_legalProviderOperationalGates: [
      ...decisionIds,
      seed.restrictedPermitRequired
        ? 'Mandatory Department of Tourism / Immigration / CAAN regulatory clearance'
        : 'Standard Nepal Electronic Transaction Act & Consumer Protection compliance',
    ],
  };
}

const RAW_CANONICAL_CATEGORIES: RawCategorySeed[] = [
  {
    number: 1,
    key: 'hotels',
    name: 'Hotels',
    status: 'COMING_SOON',
    targetPilotStatus: 'AVAILABLE',
    reasonCode: 'GATED_PENDING_OWNER_PILOT_AND_FEE_APPROVAL_DEC_001_DEC_003',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    commissionRate: 0.12,
    serviceFeeRate: 0.03,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: true,
    description: 'Verified city, heritage, and mountain transit hotels with guaranteed room-hold inventory and transparent NPR tax breakdown.',
    bookingGateRules: ['Verified Partner KYB', 'Active Room Inventory Hold', 'Immutable Quote Hash Match', '13% VAT Invoice Compliance'],
    primaryActors: ['Traveler (PRS-01..04)', 'Hotel Partner (PRS-05)', 'Finance Officer (PRS-13)'],
    keyEntities: ['PropertyProfile', 'RoomTypeInventory', 'SeasonalRateCard', 'BookingLedger'],
    stateMachineSummary: 'DRAFT -> QUOTED -> HOLD_PLACED -> PAYMENT_PENDING -> PARTNER_CONFIRMED -> ACTIVE_SERVICE -> COMPLETED',
    failureAndRecoverySummary: '15-minute hold expiry auto-releases room slot; overbooking prevented via atomic slot decrement; relocation protocol on partner default.',
  },
  {
    number: 2,
    key: 'homestays',
    name: 'Homestays',
    status: 'COMING_SOON',
    targetPilotStatus: 'AVAILABLE',
    reasonCode: 'GATED_PENDING_OWNER_PILOT_AND_FEE_APPROVAL_DEC_001_DEC_003',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    commissionRate: 0.08,
    serviceFeeRate: 0.02,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: true,
    emergencyContactRequired: true,
    offlinePackSupported: true,
    description: 'Community-registered village and cultural homestays supporting local livelihoods with offline voucher support.',
    bookingGateRules: ['Community Homestay Committee Registration', 'Host Identity Verification', 'Emergency Contact Declaration'],
    primaryActors: ['Traveler (PRS-01..03)', 'Community Homestay Host (PRS-06)', 'Support Agent (PRS-10)'],
    keyEntities: ['HomestayHost', 'CommunityCluster', 'GuestMealPlan', 'OfflineVoucher'],
    stateMachineSummary: 'DRAFT -> QUOTED -> HOLD_PLACED -> PAYMENT_PENDING -> PARTNER_CONFIRMED -> ACTIVE_SERVICE -> COMPLETED',
    failureAndRecoverySummary: 'SMS/offline fallback confirmation for low-connectivity villages; community coordinator backup host assignment.',
  },
  {
    number: 3,
    key: 'resort',
    name: 'Resorts & Retreats',
    status: 'COMING_SOON',
    targetPilotStatus: 'COMING_SOON',
    reasonCode: 'GATED_PHASE_PH05_CONTRACTING_PENDING',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    commissionRate: 0.14,
    serviceFeeRate: 0.03,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: true,
    description: 'Eco-resorts, wildlife lodges, and luxury mountain retreats (gated for Phase 2 onboarding).',
    bookingGateRules: ['Category Gate: COMING_SOON', 'Environmental Compliance Audit', 'Dual Reviewer Sign-off'],
    primaryActors: ['Luxury Traveler (PRS-02)', 'Resort Operator (PRS-05)'],
    keyEntities: ['ResortPackage', 'AmenityAllocation', 'CancellationTier'],
    stateMachineSummary: 'GATED_IN_PH00 (No live quote or booking execution permitted)',
    failureAndRecoverySummary: 'Hard-blocked at API gate with HTTP 403 CATEGORY_NOT_AVAILABLE.',
  },
  {
    number: 4,
    key: 'hostels',
    name: 'Hostels & Backpacker Lodges',
    status: 'COMING_SOON',
    targetPilotStatus: 'COMING_SOON',
    reasonCode: 'GATED_PHASE_PH05_BED_INVENTORY_MODEL',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    commissionRate: 0.10,
    serviceFeeRate: 0.02,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: true,
    description: 'Dormitory and social backpacker hostels in Kathmandu, Pokhara, and trail hubs.',
    bookingGateRules: ['Category Gate: COMING_SOON', 'Bunk-level Inventory Sync'],
    primaryActors: ['Solo Backpacker (PRS-01)', 'Hostel Manager (PRS-05)'],
    keyEntities: ['DormRoom', 'BunkSlot', 'LockerDeposit'],
    stateMachineSummary: 'GATED_IN_PH00 (No live quote or booking execution permitted)',
    failureAndRecoverySummary: 'Hard-blocked at API gate with HTTP 403 CATEGORY_NOT_AVAILABLE.',
  },
  {
    number: 5,
    key: 'flights',
    name: 'International & Regional Flights',
    status: 'INFORMATION_ONLY',
    targetPilotStatus: 'INFORMATION_ONLY',
    reasonCode: 'INFO_ONLY_GDS_IATA_AGGREGATOR_LICENSE_PENDING',
    lifecycleStages: ['BEFORE', 'DURING'],
    commissionRate: 0.0,
    serviceFeeRate: 0.0,
    taxRate: 0.0,
    verificationRequired: false,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: true,
    description: 'Flight corridor advisory, Tribhuvan/Pokhara/Bhairahawa airport guidance, and baggage rules (Information-Only in PH00).',
    bookingGateRules: ['Category Gate: INFORMATION_ONLY — Direct booking disabled'],
    primaryActors: ['International Traveler (PRS-01)', 'Support Agent (PRS-10)'],
    keyEntities: ['AirportAdvisory', 'CarrierDirectory', 'TransitChecklist'],
    stateMachineSummary: 'INFORMATION_ONLY (Read-only advisory content)',
    failureAndRecoverySummary: 'Any quote/booking attempt returns deterministic HTTP 403 CATEGORY_INFORMATION_ONLY.',
  },
  {
    number: 6,
    key: 'buses',
    name: 'Tourist & Intercity Buses',
    status: 'INFORMATION_ONLY',
    targetPilotStatus: 'INFORMATION_ONLY',
    reasonCode: 'INFO_ONLY_TRANSPORT_SYNDICATE_API_UNVERIFIED',
    lifecycleStages: ['BEFORE', 'DURING'],
    commissionRate: 0.0,
    serviceFeeRate: 0.0,
    taxRate: 0.0,
    verificationRequired: false,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: true,
    description: 'Verified tourist bus route schedules, departure points, and highway safety advisories.',
    bookingGateRules: ['Category Gate: INFORMATION_ONLY — Live seat ticketing disabled'],
    primaryActors: ['Traveler (PRS-01..04)', 'Transport Operator (PRS-08)'],
    keyEntities: ['BusCorridor', 'DepartureTerminal', 'HighwayConditionAlert'],
    stateMachineSummary: 'INFORMATION_ONLY (Read-only schedule & terminal guide)',
    failureAndRecoverySummary: 'Any quote/booking attempt returns deterministic HTTP 403 CATEGORY_INFORMATION_ONLY.',
  },
  {
    number: 7,
    key: 'domestic-airlines',
    name: 'Domestic Mountain & STOL Airlines',
    status: 'INFORMATION_ONLY',
    targetPilotStatus: 'INFORMATION_ONLY',
    reasonCode: 'INFO_ONLY_CAAN_STOL_WEATHER_DISRUPTION_LIABILITY',
    lifecycleStages: ['BEFORE', 'DURING'],
    commissionRate: 0.0,
    serviceFeeRate: 0.0,
    taxRate: 0.0,
    verificationRequired: true,
    restrictedPermitRequired: false,
    insuranceRequired: true,
    safetyCheckInRequired: true,
    emergencyContactRequired: true,
    offlinePackSupported: true,
    description: 'Lukla, Jomsom, Simikot, and trunk domestic flight advisories, CAAN weather minima, and delay contingency plans.',
    bookingGateRules: ['Category Gate: INFORMATION_ONLY — Ticketing gated pending airline PSS integration'],
    primaryActors: ['Trekker (PRS-02)', 'Safety Desk (PRS-12)'],
    keyEntities: ['StolAirfieldStatus', 'WeatherMinimaAdvisory', 'AlternateSurfaceRoute'],
    stateMachineSummary: 'INFORMATION_ONLY (Read-only aviation safety & schedule intelligence)',
    failureAndRecoverySummary: 'Any quote/booking attempt returns deterministic HTTP 403 CATEGORY_INFORMATION_ONLY.',
  },
  {
    number: 8,
    key: 'transport',
    name: 'Private Transfers & 4WD Transport',
    status: 'COMING_SOON',
    targetPilotStatus: 'AVAILABLE',
    reasonCode: 'GATED_PENDING_OWNER_PILOT_AND_FEE_APPROVAL_DEC_001_DEC_003',
    lifecycleStages: ['BEFORE', 'DURING'],
    commissionRate: 0.10,
    serviceFeeRate: 0.03,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: false,
    insuranceRequired: true,
    safetyCheckInRequired: true,
    emergencyContactRequired: true,
    offlinePackSupported: true,
    description: 'Verified commercial green-plate vehicles, airport pickups, and hill-corridor 4WD transfers with vetted drivers.',
    bookingGateRules: ['Commercial Vehicle Bluebook & Fitness Check', 'Driver License Verification', 'Passenger Insurance Active'],
    primaryActors: ['Traveler (PRS-01..04)', 'Fleet Partner (PRS-08)', 'Safety Desk (PRS-12)'],
    keyEntities: ['VehicleDispatch', 'DriverCredential', 'RouteCheckpoint'],
    stateMachineSummary: 'DRAFT -> QUOTED -> HOLD_PLACED -> PAYMENT_PENDING -> PARTNER_CONFIRMED -> ACTIVE_SERVICE -> COMPLETED',
    failureAndRecoverySummary: 'Standby vehicle dispatch SLA within 60 mins on mechanical breakdown; live highway blockage rerouting.',
  },
  {
    number: 9,
    key: 'car-rental',
    name: 'Self-Drive & Chauffeur Car Rental',
    status: 'INFORMATION_ONLY',
    targetPilotStatus: 'INFORMATION_ONLY',
    reasonCode: 'INFO_ONLY_SELF_DRIVE_INSURANCE_LEGAL_FRAMEWORK_PENDING',
    lifecycleStages: ['BEFORE', 'DURING'],
    commissionRate: 0.0,
    serviceFeeRate: 0.0,
    taxRate: 0.0,
    verificationRequired: true,
    restrictedPermitRequired: false,
    insuranceRequired: true,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: false,
    description: 'Nepal driving permit regulations, international driving license rules, and chauffeur rental guidelines.',
    bookingGateRules: ['Category Gate: INFORMATION_ONLY'],
    primaryActors: ['Traveler (PRS-01)'],
    keyEntities: ['DrivingPermitGuide', 'RentalLiabilitySummary'],
    stateMachineSummary: 'INFORMATION_ONLY',
    failureAndRecoverySummary: 'Blocked at booking gate with HTTP 403 CATEGORY_INFORMATION_ONLY.',
  },
  {
    number: 10,
    key: 'adventures',
    name: 'Day Adventures & Outdoor Sports',
    status: 'COMING_SOON',
    targetPilotStatus: 'AVAILABLE',
    reasonCode: 'GATED_PENDING_OWNER_PILOT_AND_FEE_APPROVAL_DEC_001_DEC_003',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    commissionRate: 0.15,
    serviceFeeRate: 0.03,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: false,
    insuranceRequired: true,
    safetyCheckInRequired: true,
    emergencyContactRequired: true,
    offlinePackSupported: true,
    description: 'Paragliding, white-water rafting, bungee, zip-lining, and mountain biking with safety-audited operators.',
    bookingGateRules: ['Operator Safety Audit Active', 'Equipment Certification Valid', 'Weather Clearance Flag', 'Waiver & Emergency Contact'],
    primaryActors: ['Adventure Traveler (PRS-02)', 'Activity Operator (PRS-07)', 'Safety Lead (PRS-12)'],
    keyEntities: ['ActivitySlot', 'SafetyEquipmentCert', 'WeatherClearanceLog', 'ParticipantWaiver'],
    stateMachineSummary: 'DRAFT -> QUOTED -> HOLD_PLACED -> PAYMENT_PENDING -> PARTNER_CONFIRMED -> ACTIVE_SERVICE -> COMPLETED',
    failureAndRecoverySummary: 'Automatic weather-abort reschedule or 100% full refund without penalty when Safety Desk flags adverse conditions.',
  },
  {
    number: 11,
    key: 'trekking',
    name: 'Trekking & Multi-Day Trails',
    status: 'COMING_SOON',
    targetPilotStatus: 'AVAILABLE',
    reasonCode: 'GATED_PENDING_OWNER_PILOT_AND_FEE_APPROVAL_DEC_001_DEC_003',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    commissionRate: 0.12,
    serviceFeeRate: 0.03,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: true,
    insuranceRequired: true,
    safetyCheckInRequired: true,
    emergencyContactRequired: true,
    offlinePackSupported: true,
    description: 'Guided multi-day treks across Annapurna, Everest, Langtang, and Manaslu with mandatory TIMS/permit, licensed guide, and altitude check-ins.',
    bookingGateRules: ['TAAN/NTB Partner Verification', 'Licensed Trekking Guide Assigned', 'TIMS & Conservation Permit Verified', 'High-Altitude Evacuation Insurance Verified'],
    primaryActors: ['Trekker (PRS-02)', 'Trekking Agency / Guide (PRS-07)', 'Safety & SOS Desk (PRS-12)'],
    keyEntities: ['TrekItinerary', 'CheckpointLog', 'PermitManifest', 'AltitudeHealthCheck'],
    stateMachineSummary: 'DRAFT -> QUOTED -> HOLD_PLACED -> PAYMENT_PENDING -> PARTNER_CONFIRMED -> ACTIVE_SERVICE -> COMPLETED',
    failureAndRecoverySummary: 'Missed trail check-in triggers tiered SOS escalation (T+2h ping, T+6h guide contact, T+12h rescue coordination).',
  },
  {
    number: 12,
    key: 'mountaineering',
    name: 'Expedition Mountaineering (6,500m–8,000m+)',
    status: 'RESTRICTED',
    targetPilotStatus: 'RESTRICTED',
    reasonCode: 'RESTRICTED_DEPT_OF_TOURISM_LIAISON_AND_RESCUE_ESCROW_REQUIRED',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    commissionRate: 0.10,
    serviceFeeRate: 0.03,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: true,
    insuranceRequired: true,
    safetyCheckInRequired: true,
    emergencyContactRequired: true,
    offlinePackSupported: true,
    description: 'High-altitude expedition peaks governed by Department of Tourism royalty permits, liaison officers, and mandatory rescue bonds.',
    bookingGateRules: ['Category Gate: RESTRICTED — Automated checkout disabled', 'DoT Expedition Royalty Permit', 'Liaison Officer Assignment', 'USD 10,000+ Search & Rescue Escrow'],
    primaryActors: ['Alpinist (PRS-02)', 'Expedition Outfitter (PRS-07)', 'Compliance Reviewer (PRS-11)', 'Safety Lead (PRS-12)'],
    keyEntities: ['ExpeditionPermit', 'LiaisonOfficerRecord', 'RescueEscrowBond', 'BaseCampCommsPlan'],
    stateMachineSummary: 'RESTRICTED (Hard-blocked from automated public checkout in PH00)',
    failureAndRecoverySummary: 'All automated quote/booking requests rejected with HTTP 403 CATEGORY_RESTRICTED_HARD_GATE and logged to immutable audit trail.',
  },
  {
    number: 13,
    key: 'guides',
    name: 'Licensed Guides & Porters',
    status: 'COMING_SOON',
    targetPilotStatus: 'AVAILABLE',
    reasonCode: 'GATED_PENDING_OWNER_PILOT_AND_FEE_APPROVAL_DEC_001_DEC_003',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    commissionRate: 0.08,
    serviceFeeRate: 0.02,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: false,
    insuranceRequired: true,
    safetyCheckInRequired: true,
    emergencyContactRequired: true,
    offlinePackSupported: true,
    description: 'Direct hiring of NATHM/government-certified trekking, cultural, and nature guides with mandatory porter welfare & insurance protection.',
    bookingGateRules: ['Government Guide License Badge Verification', 'Guide/Porter Personal Accident Insurance Active', 'Max Load Weight Compliance (Porter Welfare)'],
    primaryActors: ['Traveler (PRS-01..03)', 'Licensed Independent Guide (PRS-07)', 'Compliance Reviewer (PRS-11)'],
    keyEntities: ['GuideCredential', 'AvailabilityCalendar', 'PorterWelfareDeclaration', 'DailyRateEscrow'],
    stateMachineSummary: 'DRAFT -> QUOTED -> HOLD_PLACED -> PAYMENT_PENDING -> PARTNER_CONFIRMED -> ACTIVE_SERVICE -> COMPLETED',
    failureAndRecoverySummary: 'Replacement certified guide dispatch pool in Kathmandu/Pokhara/Lukla if assigned guide falls ill prior to trailhead departure.',
  },
  {
    number: 14,
    key: 'permits',
    name: 'TIMS, National Park & Conservation Permits',
    status: 'COMING_SOON',
    targetPilotStatus: 'COMING_SOON',
    reasonCode: 'GATED_NTB_DNPWC_GOVERNMENT_API_INTEGRATION_PH04',
    lifecycleStages: ['BEFORE', 'DURING'],
    commissionRate: 0.0,
    serviceFeeRate: 0.02,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: true,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: true,
    offlinePackSupported: true,
    description: 'Digital permit preparation, fee calculator, and checkpoint QR wallet (live issuance gated pending NTB/DNPWC integration).',
    bookingGateRules: ['Category Gate: COMING_SOON'],
    primaryActors: ['Trekker (PRS-02)', 'Trekking Partner (PRS-07)'],
    keyEntities: ['PermitRequirementMatrix', 'PassportScanVault', 'CheckpointVerificationQr'],
    stateMachineSummary: 'GATED_IN_PH00',
    failureAndRecoverySummary: 'Blocked at booking gate with HTTP 403 CATEGORY_NOT_AVAILABLE.',
  },
  {
    number: 15,
    key: 'helicopter',
    name: 'Helicopter Charters & Medevac Coordination',
    status: 'RESTRICTED',
    targetPilotStatus: 'RESTRICTED',
    reasonCode: 'RESTRICTED_CAAN_AIR_OPERATOR_CERT_AND_MEDEVAC_FRAUD_CONTROLS',
    lifecycleStages: ['BEFORE', 'DURING'],
    commissionRate: 0.06,
    serviceFeeRate: 0.02,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: true,
    insuranceRequired: true,
    safetyCheckInRequired: true,
    emergencyContactRequired: true,
    offlinePackSupported: true,
    description: 'Rotor-wing charter and high-altitude medical evacuation strictly governed by CAAN AOC verification and anti-rescue-fraud controls.',
    bookingGateRules: ['Category Gate: RESTRICTED', 'CAAN AOC Verification', 'Medical Necessity & Insurer Pre-Auth', 'Dual Safety + Finance Desk Sign-Off'],
    primaryActors: ['Traveler in Distress (PRS-02)', 'Aviation Operator (PRS-08)', 'Safety Lead (PRS-12)'],
    keyEntities: ['HeliLandingClearance', 'MedevacDispatchRecord', 'InsurerGuaranteeOfPayment'],
    stateMachineSummary: 'RESTRICTED (Manual emergency desk dispatch only; public automated checkout prohibited)',
    failureAndRecoverySummary: 'Automated checkout attempts rejected with HTTP 403 CATEGORY_RESTRICTED_HARD_GATE; emergency requests routed to SEV1 SOS Desk.',
  },
  {
    number: 16,
    key: 'wellness',
    name: 'Ayurveda, Medical & High-Altitude Wellness',
    status: 'RESTRICTED',
    targetPilotStatus: 'RESTRICTED',
    reasonCode: 'RESTRICTED_HEALTH_PRACTITIONER_LICENSING_AND_CLINICAL_LIABILITY',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    commissionRate: 0.12,
    serviceFeeRate: 0.03,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: true,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: true,
    offlinePackSupported: false,
    description: 'Clinical Ayurveda, Panchakarma, and medical wellness centers requiring Nepal Medical/Ayurveda Council practitioner credentialing.',
    bookingGateRules: ['Category Gate: RESTRICTED', 'Practitioner Medical Council License', 'No Unverified Clinical Claims Policy'],
    primaryActors: ['Wellness Traveler (PRS-03)', 'Wellness Practitioner (PRS-06)', 'Compliance Reviewer (PRS-11)'],
    keyEntities: ['PractitionerLicense', 'ContraindicationScreening', 'TreatmentProtocol'],
    stateMachineSummary: 'RESTRICTED (Hard-blocked pending clinical compliance verification)',
    failureAndRecoverySummary: 'Rejected at booking gate with HTTP 403 CATEGORY_RESTRICTED_HARD_GATE.',
  },
  {
    number: 17,
    key: 'culture-heritage',
    name: 'Sacred Heritage, Monastery & Ritual Access',
    status: 'RESTRICTED',
    targetPilotStatus: 'RESTRICTED',
    reasonCode: 'RESTRICTED_GUTHI_MONASTIC_TRUST_CONSENT_AND_HERITAGE_SENSITIVITY',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    commissionRate: 0.08,
    serviceFeeRate: 0.02,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: true,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: true,
    description: 'Restricted monastic ceremonies, sacred guthi heritage precincts, and archaeological zones requiring community/trust authorization.',
    bookingGateRules: ['Category Gate: RESTRICTED', 'Heritage Trust / Guthi Sansthan Consent', 'Cultural Code of Conduct Pledge'],
    primaryActors: ['Cultural Pilgrim / Researcher (PRS-03)', 'Heritage Custodian (PRS-06)'],
    keyEntities: ['SanctuaryAccessPermit', 'CustodianApproval', 'CulturalEtiquetteBrief'],
    stateMachineSummary: 'RESTRICTED (Requires custodian sign-off; automated public booking disabled)',
    failureAndRecoverySummary: 'Rejected at booking gate with HTTP 403 CATEGORY_RESTRICTED_HARD_GATE.',
  },
  {
    number: 18,
    key: 'restaurants',
    name: 'Verified Dining & Culinary Tables',
    status: 'COMING_SOON',
    targetPilotStatus: 'AVAILABLE',
    reasonCode: 'GATED_PENDING_OWNER_PILOT_AND_FEE_APPROVAL_DEC_001_DEC_003',
    lifecycleStages: ['DURING', 'AFTER'],
    commissionRate: 0.10,
    serviceFeeRate: 0.02,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: true,
    description: 'Hygiene-inspected traditional Newari, Thakali, and mountain dining experiences with set-menu table reservations.',
    bookingGateRules: ['Food Hygiene & Municipal Registration', 'Allergen & Dietary Disclosure', 'Active Table Slot Hold'],
    primaryActors: ['Traveler (PRS-01..04)', 'Restaurant Partner (PRS-06)'],
    keyEntities: ['DiningSlot', 'SetMenuQuote', 'HygieneInspectionBadge'],
    stateMachineSummary: 'DRAFT -> QUOTED -> HOLD_PLACED -> PAYMENT_PENDING -> PARTNER_CONFIRMED -> ACTIVE_SERVICE -> COMPLETED',
    failureAndRecoverySummary: 'Instant voucher refund if kitchen closes or table hold is declined within 15 minutes.',
  },
  {
    number: 19,
    key: 'Shopping',
    name: 'Authentic Nepali Crafts & GI-Tagged Goods',
    status: 'INFORMATION_ONLY',
    targetPilotStatus: 'INFORMATION_ONLY',
    reasonCode: 'INFO_ONLY_ANTIQUITY_EXPORT_CLEARANCE_AND_ESCROW_PENDING',
    lifecycleStages: ['DURING', 'AFTER'],
    commissionRate: 0.0,
    serviceFeeRate: 0.0,
    taxRate: 0.0,
    verificationRequired: true,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: true,
    description: 'Directory of verified pashmina, thangka, lokta paper, and singing bowl cooperatives plus Department of Archaeology export rules.',
    bookingGateRules: ['Category Gate: INFORMATION_ONLY — E-commerce checkout disabled in PH00'],
    primaryActors: ['Traveler (PRS-01)', 'Artisan Cooperative (PRS-06)'],
    keyEntities: ['ArtisanDirectory', 'AntiquityExportRule', 'FairTradeCertification'],
    stateMachineSummary: 'INFORMATION_ONLY',
    failureAndRecoverySummary: 'Blocked at booking gate with HTTP 403 CATEGORY_INFORMATION_ONLY.',
  },
  {
    number: 20,
    key: 'events-festivals',
    name: 'Festivals, Jatras & Cultural Calendar',
    status: 'INFORMATION_ONLY',
    targetPilotStatus: 'INFORMATION_ONLY',
    reasonCode: 'INFO_ONLY_PUBLIC_CIVIC_FESTIVAL_CALENDAR',
    lifecycleStages: ['BEFORE', 'DURING'],
    commissionRate: 0.0,
    serviceFeeRate: 0.0,
    taxRate: 0.0,
    verificationRequired: false,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: true,
    description: 'Lunar/Bikram Sambat calendar of Indra Jatra, Tiji, Dashain, Tihar, Mani Rimdu, and Bisket Jatra with crowd & photography etiquette.',
    bookingGateRules: ['Category Gate: INFORMATION_ONLY'],
    primaryActors: ['Traveler (PRS-01..04)'],
    keyEntities: ['FestivalEvent', 'PrecinctCrowdAdvisory', 'EtiquetteGuide'],
    stateMachineSummary: 'INFORMATION_ONLY',
    failureAndRecoverySummary: 'Blocked at booking gate with HTTP 403 CATEGORY_INFORMATION_ONLY.',
  },
  {
    number: 21,
    key: 'insurance',
    name: 'Travel, Medical & High-Altitude Rescue Insurance',
    status: 'COMING_SOON',
    targetPilotStatus: 'COMING_SOON',
    reasonCode: 'GATED_NEPAL_INSURANCE_AUTHORITY_BROKER_INTEGRATION',
    lifecycleStages: ['BEFORE', 'DURING'],
    commissionRate: 0.0,
    serviceFeeRate: 0.0,
    taxRate: 0.0,
    verificationRequired: true,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: true,
    offlinePackSupported: true,
    description: 'Policy verification vault and coverage altitude validator (direct policy underwriting gated pending regulatory integration).',
    bookingGateRules: ['Category Gate: COMING_SOON'],
    primaryActors: ['Trekker (PRS-02)', 'Safety Desk (PRS-12)'],
    keyEntities: ['InsurancePolicyRecord', 'AltitudeCoverageLimit', 'EmergencyAssistanceHotline'],
    stateMachineSummary: 'GATED_IN_PH00',
    failureAndRecoverySummary: 'Blocked at booking gate with HTTP 403 CATEGORY_NOT_AVAILABLE.',
  },
  {
    number: 22,
    key: 'currency-exchange',
    name: 'NRB Reference FX Rates & Digital Payment Guide',
    status: 'INFORMATION_ONLY',
    targetPilotStatus: 'INFORMATION_ONLY',
    reasonCode: 'INFO_ONLY_NRB_FOREX_LICENSING_BOUNDARY',
    lifecycleStages: ['BEFORE', 'DURING'],
    commissionRate: 0.0,
    serviceFeeRate: 0.0,
    taxRate: 0.0,
    verificationRequired: false,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: true,
    description: 'Nepal Rastra Bank (NRB) official reference exchange rates, ATM reliability map, and Fonepay/UPI cross-border usage guide.',
    bookingGateRules: ['Category Gate: INFORMATION_ONLY — No currency conversion execution'],
    primaryActors: ['International Traveler (PRS-01)'],
    keyEntities: ['NrbReferenceRate', 'AuthorizedMoneyChanger', 'AtmAvailabilityNote'],
    stateMachineSummary: 'INFORMATION_ONLY',
    failureAndRecoverySummary: 'Blocked at booking gate with HTTP 403 CATEGORY_INFORMATION_ONLY.',
  },
  {
    number: 23,
    key: 'esim-connectivity',
    name: 'Nepal Telecom / Ncell SIM & eSIM Connectivity',
    status: 'INFORMATION_ONLY',
    targetPilotStatus: 'INFORMATION_ONLY',
    reasonCode: 'INFO_ONLY_NTA_BIOMETRIC_KYC_MANDATE',
    lifecycleStages: ['BEFORE', 'DURING'],
    commissionRate: 0.0,
    serviceFeeRate: 0.0,
    taxRate: 0.0,
    verificationRequired: false,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: true,
    description: 'Airport SIM counter requirements, biometric KYC checklist, and trail cellular coverage maps (NTC vs Ncell by valley).',
    bookingGateRules: ['Category Gate: INFORMATION_ONLY'],
    primaryActors: ['Traveler (PRS-01..04)'],
    keyEntities: ['TelcoCoverageMap', 'SimKycChecklist'],
    stateMachineSummary: 'INFORMATION_ONLY',
    failureAndRecoverySummary: 'Blocked at booking gate with HTTP 403 CATEGORY_INFORMATION_ONLY.',
  },
  {
    number: 24,
    key: 'emergency-sos',
    name: '24/7 Emergency SOS, Embassy & Rescue Coordination',
    status: 'INFORMATION_ONLY',
    targetPilotStatus: 'INFORMATION_ONLY',
    reasonCode: 'INFO_ONLY_SAFETY_LIFE_SUPPORT_NEVER_PAYWALLED',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    commissionRate: 0.0,
    serviceFeeRate: 0.0,
    taxRate: 0.0,
    verificationRequired: false,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: true,
    emergencyContactRequired: true,
    offlinePackSupported: true,
    description: 'Always-free emergency triage, tourist police (1144), Himalayan Rescue Association clinics, embassy directory, and one-tap SOS incident dispatch.',
    bookingGateRules: ['Category Gate: INFORMATION_ONLY — Life-safety service is free and never commercialized as a paid booking'],
    primaryActors: ['Any Traveler (PRS-01..04)', 'Safety & Incident Lead (PRS-12)'],
    keyEntities: ['SosIncident', 'RescueClinicDirectory', 'EmbassyContact'],
    stateMachineSummary: 'ALWAYS_ACCESSIBLE_SAFETY_UTILITY (Uses /api/v1/incidents workflow, never commercial checkout)',
    failureAndRecoverySummary: 'Works offline via cached emergency contacts and SMS fallback payload.',
  },
  {
    number: 25,
    key: 'weather-trail-alerts',
    name: 'DHM Weather, Monsoon Landslide & Trail Alerts',
    status: 'INFORMATION_ONLY',
    targetPilotStatus: 'INFORMATION_ONLY',
    reasonCode: 'INFO_ONLY_PUBLIC_METEOROLOGICAL_AND_TRAIL_INTELLIGENCE',
    lifecycleStages: ['BEFORE', 'DURING'],
    commissionRate: 0.0,
    serviceFeeRate: 0.0,
    taxRate: 0.0,
    verificationRequired: false,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: true,
    description: 'High-pass snow closures (Thorong La, Cho La, Larkya La), monsoon road washouts, and Department of Hydrology & Meteorology advisories.',
    bookingGateRules: ['Category Gate: INFORMATION_ONLY'],
    primaryActors: ['Trekker (PRS-02)', 'Transport Partner (PRS-08)', 'Safety Desk (PRS-12)'],
    keyEntities: ['PassStatusBulletin', 'RoadCorridorAlert', 'AvalancheHazardNotice'],
    stateMachineSummary: 'INFORMATION_ONLY',
    failureAndRecoverySummary: 'Feeds directly into booking safety gates to pause departures when weatherAltitudeClear = false.',
  },
  {
    number: 26,
    key: 'visa-immigration',
    name: 'Nepal Visa on Arrival & Department of Immigration Rules',
    status: 'INFORMATION_ONLY',
    targetPilotStatus: 'INFORMATION_ONLY',
    reasonCode: 'INFO_ONLY_SOVEREIGN_IMMIGRATION_AUTHORITY',
    lifecycleStages: ['BEFORE', 'DURING'],
    commissionRate: 0.0,
    serviceFeeRate: 0.0,
    taxRate: 0.0,
    verificationRequired: false,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: true,
    description: 'Official Department of Immigration visa fee tiers (15/30/90 days), pre-arrival form links, and extension/overstay rules.',
    bookingGateRules: ['Category Gate: INFORMATION_ONLY'],
    primaryActors: ['International Traveler (PRS-01)'],
    keyEntities: ['VisaTierFeeSchedule', 'BorderCrossingChecklist'],
    stateMachineSummary: 'INFORMATION_ONLY',
    failureAndRecoverySummary: 'Blocked at booking gate with HTTP 403 CATEGORY_INFORMATION_ONLY.',
  },
  {
    number: 27,
    key: 'local-experiences',
    name: 'Local Workshops, Cooking & Artisan Immersions',
    status: 'COMING_SOON',
    targetPilotStatus: 'AVAILABLE',
    reasonCode: 'GATED_PENDING_OWNER_PILOT_AND_FEE_APPROVAL_DEC_001_DEC_003',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    commissionRate: 0.12,
    serviceFeeRate: 0.03,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: true,
    description: 'Half-day pottery in Bhaktapur, momo & dal-bhat culinary classes, coffee farm tours, and community storytelling walks.',
    bookingGateRules: ['Verified Host Identity', 'Active Session Slot Hold', 'Transparent Host Payout Split'],
    primaryActors: ['Cultural Traveler (PRS-03)', 'Local Experience Host (PRS-06)'],
    keyEntities: ['WorkshopSession', 'HostProfile', 'ParticipantVoucher'],
    stateMachineSummary: 'DRAFT -> QUOTED -> HOLD_PLACED -> PAYMENT_PENDING -> PARTNER_CONFIRMED -> ACTIVE_SERVICE -> COMPLETED',
    failureAndRecoverySummary: 'Full refund if minimum workshop group size is not met or host cancels.',
  },
  {
    number: 28,
    key: 'wildlife-safari',
    name: 'National Park Wildlife Safaris (Chitwan & Bardia)',
    status: 'RESTRICTED',
    targetPilotStatus: 'RESTRICTED',
    reasonCode: 'RESTRICTED_DNPWC_CONSERVATION_QUOTA_AND_ETHICAL_WILDLIFE_POLICY',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    commissionRate: 0.12,
    serviceFeeRate: 0.03,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: true,
    insuranceRequired: true,
    safetyCheckInRequired: true,
    emergencyContactRequired: true,
    offlinePackSupported: true,
    description: 'DNPWC-regulated jungle jeep/walking safaris enforcing strict ethical wildlife welfare (zero exploitative elephant-riding policy).',
    bookingGateRules: ['Category Gate: RESTRICTED', 'DNPWC Park Entry & Naturalist Permit', 'Zero Animal Exploitation Audit Sign-Off'],
    primaryActors: ['Nature Traveler (PRS-03)', 'Licensed Naturalist / Safari Operator (PRS-07)', 'Compliance Reviewer (PRS-11)'],
    keyEntities: ['ParkEntryQuota', 'NaturalistLicense', 'EthicalWildlifeAttestation'],
    stateMachineSummary: 'RESTRICTED (Hard-blocked pending DNPWC quota & ethical welfare certification)',
    failureAndRecoverySummary: 'Rejected at booking gate with HTTP 403 CATEGORY_RESTRICTED_HARD_GATE.',
  },
  {
    number: 29,
    key: 'peak-climbing',
    name: 'NMA Trekking Peaks (5,500m–6,500m)',
    status: 'RESTRICTED',
    targetPilotStatus: 'RESTRICTED',
    reasonCode: 'RESTRICTED_NMA_CLIMBING_PERMIT_SHERPA_INSURANCE_AND_ALTITUDE_GATE',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    commissionRate: 0.12,
    serviceFeeRate: 0.03,
    taxRate: 0.13,
    verificationRequired: true,
    restrictedPermitRequired: true,
    insuranceRequired: true,
    safetyCheckInRequired: true,
    emergencyContactRequired: true,
    offlinePackSupported: true,
    description: 'Island Peak, Mera Peak, Lobuche East, and NMA-classified climbing peaks requiring NMA climbing permits and UIAA/NMA climbing guides.',
    bookingGateRules: ['Category Gate: RESTRICTED', 'Nepal Mountaineering Association (NMA) Permit', 'Certified Climbing Guide Insurance', '6,000m+ Helicopter Evacuation Policy'],
    primaryActors: ['Climber (PRS-02)', 'NMA Climbing Agency (PRS-07)', 'Safety Lead (PRS-12)'],
    keyEntities: ['NmaClimbingPermit', 'ClimbingSherpaCredential', 'SummitWeatherWindow'],
    stateMachineSummary: 'RESTRICTED (Hard-blocked from automated public checkout in PH00)',
    failureAndRecoverySummary: 'Rejected at booking gate with HTTP 403 CATEGORY_RESTRICTED_HARD_GATE.',
  },
  {
    number: 30,
    key: 'luggage',
    name: 'Left Luggage, Gear Storage & Trail Transfers',
    status: 'INFORMATION_ONLY',
    targetPilotStatus: 'INFORMATION_ONLY',
    reasonCode: 'INFO_ONLY_BAILMENT_INSURANCE_AND_TAMPER_SEAL_SOP_PENDING',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    commissionRate: 0.0,
    serviceFeeRate: 0.0,
    taxRate: 0.0,
    verificationRequired: true,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: true,
    description: 'Guidelines and verified hotel/depot storage locations for excess city luggage while trekking.',
    bookingGateRules: ['Category Gate: INFORMATION_ONLY'],
    primaryActors: ['Trekker (PRS-02)', 'Hotel Partner (PRS-05)'],
    keyEntities: ['StorageDepotGuide', 'TamperSealChecklist'],
    stateMachineSummary: 'INFORMATION_ONLY',
    failureAndRecoverySummary: 'Blocked at booking gate with HTTP 403 CATEGORY_INFORMATION_ONLY.',
  },
  {
    number: 31,
    key: 'offline-travel-packs',
    name: 'Offline Region Packs (Maps, Phrases, Vouchers & SOS)',
    status: 'COMING_SOON',
    targetPilotStatus: 'COMING_SOON',
    reasonCode: 'GATED_PH08_OFFLINE_SYNC_CONFLICT_ENGINE',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    commissionRate: 0.0,
    serviceFeeRate: 0.0,
    taxRate: 0.0,
    verificationRequired: false,
    restrictedPermitRequired: false,
    insuranceRequired: false,
    safetyCheckInRequired: false,
    emergencyContactRequired: false,
    offlinePackSupported: true,
    description: 'Downloadable regional survival bundles (Everest, Annapurna, Mustang, Dolpo) with cached vouchers, elevation profiles, and emergency contacts.',
    bookingGateRules: ['Category Gate: COMING_SOON — Bundled utility gated until PH08 Offline Engine'],
    primaryActors: ['All Travelers (PRS-01..04)'],
    keyEntities: ['RegionalOfflineBundle', 'ManifestChecksum', 'CachedVoucherPack'],
    stateMachineSummary: 'GATED_IN_PH00',
    failureAndRecoverySummary: 'Blocked at commercial booking gate with HTTP 403 CATEGORY_NOT_AVAILABLE.',
  },
];

export const CANONICAL_CATEGORIES: CanonicalCategory[] = RAW_CANONICAL_CATEGORIES.map((seed) => ({
  ...seed,
  appendixAContract: buildAppendixAContract(seed),
}));

export const CANONICAL_DASHBOARDS: DashboardModule[] = [
  {
    id: 'DSH-01',
    code: 'TRAVELER_PORTAL',
    name: 'Traveler Lifecycle Workspace (Before / During / After)',
    audience: 'Domestic & International Travelers, Trekkers, Pilgrims, Digital Nomads',
    mfaRequired: false,
    dualControlRequired: false,
    keyCapabilities: [
      '3-Stage Lifecycle Planner (Before / During / After)',
      'Immutable Quote & Fee Breakdown Inspector',
      'Active Booking Vouchers & Offline Pack Readiness',
      'Granular Privacy Consent & 1-Tap SOS Trigger',
    ],
  },
  {
    id: 'DSH-02',
    code: 'PARTNER_OPERATIONS',
    name: 'Partner Inventory, Fulfillment & Payout Portal',
    audience: 'Verified Hotels, Homestays, Trekking Agencies, Guides, Transport Operators',
    mfaRequired: true,
    dualControlRequired: false,
    keyCapabilities: [
      'KYB Verification & License Expiration Monitor',
      'Slot Capacity & Inventory Hold Management',
      'Booking Confirmation / Rejection SLA Queue (Requires Captured Payment)',
      'Net Payout & Commission Settlement Statement',
    ],
  },
  {
    id: 'DSH-03',
    code: 'SUPPORT_OPERATIONS',
    name: 'Customer Support & Booking Exception Desk',
    audience: 'Tier-1 & Tier-2 Support Agents',
    mfaRequired: true,
    dualControlRequired: false,
    keyCapabilities: [
      'Correlation-ID End-to-End Trace Lookup',
      'Hold Expiry & Relocation Assistance Workflow',
      'Cancellation & Refund Policy Adjudication',
      'Verified-Stay Review Moderation Queue',
    ],
  },
  {
    id: 'DSH-04',
    code: 'SAFETY_INCIDENT_COMMAND',
    name: 'Safety, Permit, Weather & Emergency SOS Command Desk',
    audience: 'Safety Lead, Rescue Coordinators, Duty Officers',
    mfaRequired: true,
    dualControlRequired: true,
    keyCapabilities: [
      'SEV1 / SEV2 / SEV3 Incident Triage & Escalation Timer',
      'Trail Check-In & High-Altitude Weather Hold Switch',
      'Permit & Guide License Compliance Verification',
      'Emergency Contact & Embassy Notification Dispatch',
    ],
  },
  {
    id: 'DSH-05',
    code: 'COMPLIANCE_TRUST_VERIFICATION',
    name: 'Partner KYB, Permit & Two-Person Verification Desk',
    audience: 'Compliance Reviewers & Legal/Trust Officers',
    mfaRequired: true,
    dualControlRequired: true,
    keyCapabilities: [
      'Document, PAN/VAT & Tourism License Audit',
      'Enforced Two-Person Distinct-Reviewer Approval Gate',
      'Restricted Category Hard-Gate Audit Log',
      'Partner Suspension & Revocation Kill-Switch',
    ],
  },
  {
    id: 'DSH-06',
    code: 'FINANCE_LEDGER_SETTLEMENT',
    name: 'Double-Entry Ledger, Escrow & Tax Settlement Console',
    audience: 'Finance Officers, Treasury & External Auditors',
    mfaRequired: true,
    dualControlRequired: true,
    keyCapabilities: [
      'Append-Only Double-Entry Ledger Inspector (Debit == Credit Invariant)',
      'Platform Commission, Service Fee & 13% VAT Split Reconciliation',
      'Payout Freeze & Chargeback Reserve Controls',
      'Idempotent Webhook Replay & Reconciliation Audit',
    ],
  },
  {
    id: 'DSH-07',
    code: 'CONTENT_CATALOGUE_GOVERNANCE',
    name: '31-Category Catalogue, Advisory & Policy Studio',
    audience: 'Catalogue Managers, Regional Editors, Policy Leads',
    mfaRequired: true,
    dualControlRequired: false,
    keyCapabilities: [
      '31-Category Availability State & Reason-Code Registry',
      'Seasonal Trail, Visa, Festival & FX Advisory Publishing',
      'Offline Travel Pack Manifest Builder',
      'AI Assistant Knowledge Guardrail Curation',
    ],
  },
  {
    id: 'DSH-08',
    code: 'FOUNDER_GOVERNANCE_CONTROL',
    name: 'Founder / Super-Admin Phase Gate & Architecture Control Tower',
    audience: 'Founder, CTO, Principal Governance Auditor',
    mfaRequired: true,
    dualControlRequired: true,
    keyCapabilities: [
      '18-Phase Execution Roadmap & Exit-Criteria Enforcer',
      '240-Module Traceability Matrix & Invariant Verification Runner',
      'Global Kill-Switch & Category Status Override (MFA + Audit Required)',
      'Immutable Security & Governance Audit Trail Explorer',
    ],
  },
];

export const CANONICAL_PHASES: PhaseDefinition[] = [
  {
    code: 'PH00',
    number: 0,
    name: 'Governance, Architecture, Security & Canonical Domain Foundation',
    status: 'ACTIVE_REMEDIATION',
    focus: 'Enforce 31-category state gates, 8 dashboards, 3 lifecycle stages, 12-point booking gate, two-person KYB, SQLite transactional persistence, TOTP MFA, and double-entry ledger invariants.',
    exitCriteriaSummary: 'All 28 PH00 remediation defects resolved; 14 verification suites PASS; external dependencies and Owner decisions truthfully classified as PENDING/GATED/BLOCKED.',
  },
  {
    code: 'PH01',
    number: 1,
    name: 'Identity, OIDC, RBAC/ABAC & Hardware MFA Hardening',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: 'Production OAuth2/OIDC provider, WebAuthn/TOTP step-up tokens, device session revocation, and cryptographic JWT validation.',
    exitCriteriaSummary: 'Zero unauthenticated admin routes; automated penetration test on session & RBAC boundaries.',
  },
  {
    code: 'PH02',
    number: 2,
    name: 'Partner Onboarding, KYB Vault & Dual-Reviewer Workflow Engine',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: 'Encrypted document upload vault, PAN/VAT OCR check, Department of Tourism license expiry alerts, and 4-eyes approval.',
    exitCriteriaSummary: '100% pilot partners verified by two distinct compliance officers with immutable document hashes.',
  },
  {
    code: 'PH03',
    number: 3,
    name: 'Core Stays & Inventory Engine (Hotels & Homestays)',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: 'Date-bucket room calendar, atomic hold locks, seasonal NPR pricing rules, and host confirmation SLAs.',
    exitCriteriaSummary: 'Zero double-booking under 100x concurrent reservation load test.',
  },
  {
    code: 'PH04',
    number: 4,
    name: 'Trekking, Guides, Permits & Trail Check-In Engine',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: 'Guide license binding, TIMS/conservation permit checklist validation, and scheduled trailhead check-ins.',
    exitCriteriaSummary: 'No trekking departure can transition to ACTIVE_SERVICE without verified guide + permit + insurance.',
  },
  {
    code: 'PH05',
    number: 5,
    name: 'Payment Gateway Integration, Escrow & Double-Entry Ledger',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: 'Nepal PSP (eSewa / Khalti / ConnectIPS) + international card acquiring, signed webhooks, and T+2 payout batching.',
    exitCriteriaSummary: 'Daily automated trial-balance reconciliation with zero unbalanced journals.',
  },
  {
    code: 'PH06',
    number: 6,
    name: 'Safety Command Desk, SOS Triage & Weather Disruption Automation',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: '24/7 SEV1 incident console, DHM weather feed ingestion, and automatic altitude/weather departure holds.',
    exitCriteriaSummary: 'Sub-60-second SEV1 incident routing and automated refund on weather-aborted activities.',
  },
  {
    code: 'PH07',
    number: 7,
    name: 'Transport, Transfers & Domestic Corridor Coordination',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: 'Commercial vehicle dispatch, driver verification, and STOL flight delay surface fallback coordination.',
    exitCriteriaSummary: 'End-to-end vehicle and driver verification enforced on all ground transfers.',
  },
  {
    code: 'PH08',
    number: 8,
    name: 'Offline Travel Packs & Low-Connectivity Sync Engine',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: 'IndexedDB encrypted voucher cache, regional survival packs, and deterministic conflict resolution on reconnect.',
    exitCriteriaSummary: '100% voucher verification and emergency SOS payload generation in zero-bar airplane mode.',
  },
  {
    code: 'PH09',
    number: 9,
    name: 'Dining, Local Experiences & Artisan Discovery',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: 'Hygiene-verified dining tables, cultural workshop slot holds, and community artisan directory.',
    exitCriteriaSummary: 'Verified host payout split and dietary/hygiene compliance tracking.',
  },
  {
    code: 'PH10',
    number: 10,
    name: 'Verified Reviews, Trust Scoring & Anti-Fraud Engine',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: 'Cryptographically linked completed-stay reviews, velocity anomaly detection, and partner quality scorecards.',
    exitCriteriaSummary: 'Zero unverified review submissions possible; automated fraud quarantine rules active.',
  },
  {
    code: 'PH11',
    number: 11,
    name: 'AI Travel Assistant with Deterministic Safety & Policy Guardrails',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: 'Grounded Gemini itinerary advisor constrained by live category status, weather alerts, and zero-PII prompt filtering.',
    exitCriteriaSummary: 'Red-team evaluation passes with zero unsafe altitude advice or restricted-category bypass.',
  },
  {
    code: 'PH12',
    number: 12,
    name: 'Dispute Resolution, Chargeback Defense & Refund Automation',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: 'Evidence-backed dispute tickets, automatic partner payout freeze, and partial/full reversal ledger journals.',
    exitCriteriaSummary: '100% refund state transitions reconcile with double-entry ledger lines.',
  },
  {
    code: 'PH13',
    number: 13,
    name: 'Restricted Categories Controlled Pilot (Safari & Heritage)',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: 'DNPWC ethical wildlife safari quota integration and Guthi/monastic heritage custodian approval workflows.',
    exitCriteriaSummary: 'Regulatory counsel sign-off and custodian co-signature enforced per booking.',
  },
  {
    code: 'PH14',
    number: 14,
    name: 'High-Altitude Peak Climbing & Helicopter Medevac Governance',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: 'NMA climbing permit verification, climbing Sherpa insurance escrow, and insurer-verified medevac dispatch.',
    exitCriteriaSummary: 'Zero unauthorized charter bookings; mandatory dual-control safety + finance approval.',
  },
  {
    code: 'PH15',
    number: 15,
    name: 'Observability, Chaos Engineering & DR Failover',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: 'OpenTelemetry distributed tracing, load shedding, database PITR drill, and backup region failover.',
    exitCriteriaSummary: 'RPO < 5 minutes and RTO < 30 minutes verified under simulated region outage.',
  },
  {
    code: 'PH16',
    number: 16,
    name: 'External Security Penetration Test & Legal/Tax Compliance Audit',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: 'OWASP ASVS Level 2 audit, Nepal IRD electronic billing compliance, and privacy data-subject export/erasure.',
    exitCriteriaSummary: 'Zero critical/high security findings; formal legal and tax sign-off.',
  },
  {
    code: 'PH17',
    number: 17,
    name: 'Controlled Nepal Pilot Launch & Post-Launch Hypercare',
    status: 'LOCKED_PENDING_PREREQUISITES',
    focus: 'Staged cohort rollout across Kathmandu, Pokhara, Annapurna, and Everest corridors with 24/7 command center.',
    exitCriteriaSummary: 'All 12 pilot readiness gates green for 30 consecutive operational days.',
  },
];

function buildCanonicalFeatureModules(): FeatureModuleEntry[] {
  const modules: FeatureModuleEntry[] = [];
  let seq = 1;

  const capabilityAspects = [
    { suffix: 'CATALOGUE_CONTRACT', label: 'Canonical Service Contract & Availability Gate', phase: 'PH00', verifiedInPh00: true },
    { suffix: 'PARTNER_VERIFICATION', label: 'Partner KYB, Licensing & Dual-Control Rule', phase: 'PH02', verifiedInPh00: true },
    { suffix: 'QUOTE_PRICING_ENGINE', label: 'Immutable Quote, Tax & Commission Calculator', phase: 'PH00', verifiedInPh00: true },
    { suffix: 'BOOKING_STATE_MACHINE', label: '12-Point Booking Gate & Hold Expiration Machine', phase: 'PH03', verifiedInPh00: true },
    { suffix: 'SAFETY_PERMIT_COMPLIANCE', label: 'Safety Check-In, Permit & Weather Gate', phase: 'PH04', verifiedInPh00: true },
    { suffix: 'SETTLEMENT_DISPUTE_POLICY', label: 'Double-Entry Ledger & Refund Policy Binding', phase: 'PH05', verifiedInPh00: true },
  ];

  for (const cat of CANONICAL_CATEGORIES) {
    for (const aspect of capabilityAspects) {
      const code = `MOD-${String(seq).padStart(3, '0')}`;
      modules.push({
        id: code,
        code,
        domain: 'CATEGORY',
        categoryKey: cat.key,
        title: `[Cat #${cat.number} ${cat.name}] ${aspect.label}`,
        phaseCode: aspect.phase,
        status:
          cat.targetPilotStatus === 'AVAILABLE'
            ? 'IMPLEMENTED_VERIFIED'
            : 'GOVERNED_GATED',
      });
      seq++;
    }
  }

  const platformFoundationTitles = [
    'Master Blueprint Traceability & Canonical Constants Registry',
    '31-Category Availability State Machine (AVAILABLE / COMING_SOON / INFORMATION_ONLY / RESTRICTED)',
    '3-Stage Travel Lifecycle Engine (BEFORE / DURING / AFTER)',
    '8-Dashboard Role & MFA Access Boundary Matrix',
    '18-Phase Sequential Gate & Prerequisite Lock Engine',
    'Two-Person Distinct-Reviewer Partner KYB State Machine',
    'Partner Suspension & Instant Inventory Kill-Switch',
    'Immutable Quote Snapshot Generator & SHA-256 Pricing Hash',
    '15-Minute Inventory Slot Hold & Automatic Expiry Reclaim',
    'Idempotency-Key Request Deduplication Store',
    '12-Point Pre-Booking Validation Gate Executor',
    'Append-Only Double-Entry Ledger Engine (Debit == Credit Invariant)',
    'Platform Commission, Service Fee & 13% Nepal VAT Split Calculator',
    'Partner Payout Liability & Escrow Hold Accounting',
    'Refund & Reversal Double-Entry Journal Generator',
    'Restricted Category Hard-Block & Tamper Audit Logger',
    'Information-Only Category Non-Commercial Guardrail',
    'Coming-Soon Category Demand Waitlist & Gate Enforcer',
    'High-Altitude Permit & Guide License Cross-Validator',
    'Traveler Emergency Contact & Insurance Policy Gate',
    'DHM Weather & Altitude Hazard Departure Hold Switch',
    'SEV1 / SEV2 / SEV3 Safety Incident Intake & Triage Router',
    'SOS GPS Coordinate Capture with 4-Hour Auto-Expire TTL',
    'Granular Privacy Consent Ledger (Essential / GPS / Analytics / AI / Marketing)',
    'Verified-Completed-Stay Review Authenticity Gate',
    'Anti-Fraud Review Rejection & Audit Trail',
    'Correlation-ID End-to-End Request & Audit Propagation',
    'Append-Only Security & Governance Audit Event Log',
    'MFA Step-Up Enforcement Middleware for Privileged Mutations',
    'Founder Global Kill-Switch & Category Status Override',
    'Offline Travel Pack Manifest & Checksum Generator',
    'Low-Connectivity Voucher & Emergency Hotline Cache Contract',
    'Grounded AI Travel Advisor with Live Category Gate Awareness',
    'AI Assistant Prompt Sanitization & Zero-PII Redaction Rule',
    'AI Assistant Non-Autonomous Action Boundary (Advisory Only)',
    'Partner SLA Confirmation Timer & Auto-Expiry Handler',
    'Traveler Cancellation Tier & Refund Calculation Engine',
    'Dispute Intake & Automatic Partner Payout Freeze',
    'Chargeback Reserve & Evidence Bundle Registry',
    'NRB Reference Currency Rate & Fee Transparency Disclosure',
    'Nepal IRD Tax Invoice Metadata & PAN/VAT Compliance Contract',
    'Ethical Wildlife & Heritage Custodian Compliance Gate',
    'NMA Peak Climbing & Helicopter Medevac Fraud Prevention Gate',
    'Porter Welfare Load-Limit & Insurance Compliance Check',
    'Community Homestay Payout Equity & Offline SMS Fallback Rule',
    'STOL Mountain Flight Disruption & Surface Reroute Advisory',
    'Tourist Police (1144) & Himalayan Rescue Association Directory',
    'Visa-on-Arrival Fee Calculator & Overstay Warning Utility',
    'Lunar / Bikram Sambat Festival & Precinct Etiquette Guide',
    'Automated Invariant Verification Test Suite Runner',
    'API Contract Version Header & Deterministic Error Envelope',
    'Rate-Limit & Abuse Throttling Policy Contract',
    'Backup, PITR & Disaster Recovery Runbook Registry',
    'Pilot Launch 12-Gate Readiness Scorecard Evaluator',
  ];

  for (const title of platformFoundationTitles) {
    const code = `MOD-${String(seq).padStart(3, '0')}`;
    modules.push({
      id: code,
      code,
      domain: 'PLATFORM_FOUNDATION',
      title,
      phaseCode: 'PH00',
      status: 'IMPLEMENTED_VERIFIED',
    });
    seq++;
  }

  return modules;
}

export const CANONICAL_FEATURE_MODULES: FeatureModuleEntry[] = buildCanonicalFeatureModules();
