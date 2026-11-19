/**
 * PHERINEPAL — CANONICAL DOMAIN REGISTRY & TYPES
 * Blueprint Reference: Part I (Sections 5, 5.1, 6, 7), Part II (Sections 11, 12, 13), Part III (Section 24)
 * Rule: Single canonical source of truth for all 31 service categories, 8 dashboards,
 * state machines, and 240 feature modules. No duplicated hard-coded category lists.
 */

export type CategoryStatus =
  | 'PLANNED'
  | 'COMING_SOON'
  | 'INFORMATION_ONLY'
  | 'AVAILABLE'
  | 'TEMPORARILY_UNAVAILABLE'
  | 'RESTRICTED'
  | 'RETIRED';

export type LifecycleStage = 'BEFORE' | 'DURING' | 'AFTER';

export type BookingState =
  | 'REQUESTED'
  | 'PENDING_PARTNER'
  | 'APPROVED'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'DISPUTED';

export type InventoryHoldState = 'HELD' | 'CONFIRMED' | 'RELEASED' | 'EXPIRED';

export type PaymentState =
  | 'CREATED'
  | 'REQUIRES_ACTION'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'FAILED'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED'
  | 'DISPUTED'
  | 'REVERSED';

export type PayoutState =
  | 'NOT_ELIGIBLE'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'ON_HOLD';

export type DashboardId =
  | 'traveler'
  | 'partner'
  | 'guide-operator'
  | 'admin'
  | 'verification-compliance'
  | 'finance'
  | 'support-safety'
  | 'content-intelligence';

export interface ServiceCategory {
  index: number;
  key: string;
  displayName: string;
  displayNameNe: string;
  initialBehaviour: string;
  transactional: boolean;
  status: CategoryStatus;
  owningPhase: string;
  operationalOwnerRole: string;
  backupOwnerRole: string;
  lifecycleStages: LifecycleStage[];
  inventoryModel: string;
  verificationRequirements: string[];
  highRiskTwoPersonApproval: boolean;
  bookingModesAllowed: ('INSTANT' | 'APPROVAL')[];
  publicRestrictionNotice?: string;
  gatedReason?: string;
  lastUpdatedUtc: string;
  updatedBy: string;
}

export const CANONICAL_CATEGORIES: ServiceCategory[] = [
  {
    index: 1,
    key: 'hotels',
    displayName: 'Hotels & Resorts',
    displayNameNe: 'होटल तथा रिसोर्टहरू',
    initialBehaviour: 'Status-gated transactional',
    transactional: true,
    status: 'AVAILABLE',
    owningPhase: 'PH07',
    operationalOwnerRole: 'Stay Supply Lead',
    backupOwnerRole: 'Verification Lead',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'room/unit × date × occupancy × rate plan',
    verificationRequirements: ['Company Registration', 'PAN/VAT Certificate', 'DoT/Local Ward Operating Licence', 'Fire & Safety Declaration'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: ['INSTANT', 'APPROVAL'],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 2,
    key: 'homestays',
    displayName: 'Homestays',
    displayNameNe: 'होमस्टे (घरबास)',
    initialBehaviour: 'Status-gated transactional',
    transactional: true,
    status: 'AVAILABLE',
    owningPhase: 'PH07',
    operationalOwnerRole: 'Community Stay Lead',
    backupOwnerRole: 'Partner Support Lead',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'room/unit × date × occupancy × host meal plan',
    verificationRequirements: ['Homestay Operating Committee Registration', 'Host Citizenship/Identity', 'Ownership/Authority Declaration'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: ['INSTANT', 'APPROVAL'],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 3,
    key: 'adventures',
    displayName: 'Adventures & Experiences',
    displayNameNe: 'साहसिक खेल तथा अनुभवहरू',
    initialBehaviour: 'Status-gated transactional',
    transactional: true,
    status: 'AVAILABLE',
    owningPhase: 'PH09',
    operationalOwnerRole: 'Adventure Ops Lead',
    backupOwnerRole: 'Safety & Compliance Lead',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'session/departure × capacity × participant requirements',
    verificationRequirements: ['Adventure Operator Licence', 'Equipment Safety Inspection Record', 'Participant Liability & Rescue Insurance'],
    highRiskTwoPersonApproval: true,
    bookingModesAllowed: ['APPROVAL', 'INSTANT'],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 4,
    key: 'trekking',
    displayName: 'Trekking',
    displayNameNe: 'पदयात्रा (ट्रेकिङ)',
    initialBehaviour: 'Status-gated transactional',
    transactional: true,
    status: 'AVAILABLE',
    owningPhase: 'PH09',
    operationalOwnerRole: 'Mountain & Trek Lead',
    backupOwnerRole: 'Safety & Compliance Lead',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'departure × group capacity × guide/operator/permit readiness',
    verificationRequirements: ['DoT Trekking Agency Licence', 'TAAN Membership', 'Guide & Porter High-Altitude Insurance', 'Tax Clearance'],
    highRiskTwoPersonApproval: true,
    bookingModesAllowed: ['APPROVAL'],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 5,
    key: 'peak-climbing',
    displayName: 'Peak Climbing',
    displayNameNe: 'हिमाल आरोहण',
    initialBehaviour: 'Restricted/status-gated',
    transactional: true,
    status: 'RESTRICTED',
    owningPhase: 'PH09',
    operationalOwnerRole: 'Expedition Safety Lead',
    backupOwnerRole: 'Compliance Officer',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'expedition departure × climbing permit quota × IFMGA/NMA guide ratio',
    verificationRequirements: ['NMA / DoT Mountaineering Licence', 'High-Altitude Helicopter Rescue Insurance Proof', 'Liaison Officer & Garbage Deposit Compliance'],
    highRiskTwoPersonApproval: true,
    bookingModesAllowed: ['APPROVAL'],
    publicRestrictionNotice: 'Restricted: Direct online checkout is disabled. Peak climbing requires mandatory NMA/DoT permit verification, liaison clearance, and two-person safety review.',
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 6,
    key: 'guides',
    displayName: 'Guides & Porters',
    displayNameNe: 'गाइड तथा पोर्टरहरू',
    initialBehaviour: 'Status-gated transactional',
    transactional: true,
    status: 'AVAILABLE',
    owningPhase: 'PH09',
    operationalOwnerRole: 'Guide Relations Lead',
    backupOwnerRole: 'Verification Lead',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'person availability × date/time × qualification/category',
    verificationRequirements: ['NATHM / DoT Official Guide Licence', 'Valid First-Aid / High-Altitude Training', 'Personal Accident & Medical Insurance'],
    highRiskTwoPersonApproval: true,
    bookingModesAllowed: ['APPROVAL'],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 7,
    key: 'transport',
    displayName: 'Transport',
    displayNameNe: 'यातायात सेवा',
    initialBehaviour: 'Status-gated transactional',
    transactional: true,
    status: 'AVAILABLE',
    owningPhase: 'PH09',
    operationalOwnerRole: 'Fleet & Mobility Lead',
    backupOwnerRole: 'Operations Lead',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'route/trip × vehicle/seat × schedule',
    verificationRequirements: ['Tourist Vehicle Bluebook (Green Plate)', 'Commercial Driver Licence', 'Passenger Comprehensive Insurance', 'Route Permit'],
    highRiskTwoPersonApproval: true,
    bookingModesAllowed: ['INSTANT', 'APPROVAL'],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 8,
    key: 'flights',
    displayName: 'Flights',
    displayNameNe: 'हवाई उडान',
    initialBehaviour: 'Provider-dependent; information or integration',
    transactional: false,
    status: 'INFORMATION_ONLY',
    owningPhase: 'PH09',
    operationalOwnerRole: 'Aviation Integrations Lead',
    backupOwnerRole: 'Commercial Lead',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'provider itinerary/seat data (no local inventory claim without live GDS/airline confirmation)',
    verificationRequirements: ['CAAN Air Operator Certificate / Approved GDS Aggregator Contract'],
    highRiskTwoPersonApproval: true,
    bookingModesAllowed: [],
    publicRestrictionNotice: 'Information Only: Live flight seat inventory and ticketing require direct airline/GDS provider contract activation.',
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 9,
    key: 'luggage',
    displayName: 'Luggage Services',
    displayNameNe: 'सामान भण्डारण तथा ढुवानी',
    initialBehaviour: 'Status-gated transactional',
    transactional: true,
    status: 'COMING_SOON',
    owningPhase: 'PH09',
    operationalOwnerRole: 'Logistics Ops Lead',
    backupOwnerRole: 'Partner Support Lead',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'location × time slot × capacity × custody seal record',
    verificationRequirements: ['Facility CCTV & Custody Security Audit', 'Bailee Liability Policy'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: ['INSTANT'],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 10,
    key: 'nearby-services',
    displayName: 'Nearby Services',
    displayNameNe: 'नजिकैका अत्यावश्यक सेवाहरू',
    initialBehaviour: 'Information/discovery',
    transactional: false,
    status: 'INFORMATION_ONLY',
    owningPhase: 'PH11',
    operationalOwnerRole: 'Geo & Directory Lead',
    backupOwnerRole: 'Content Editor',
    lifecycleStages: ['DURING'],
    inventoryModel: 'source freshness & opening-hours confidence (not bookable inventory)',
    verificationRequirements: ['Official Directory Citation & Last-Verified Timestamp'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: [],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 11,
    key: 'esim',
    displayName: 'eSIM',
    displayNameNe: 'ई-सिम (eSIM)',
    initialBehaviour: 'Provider-dependent transactional',
    transactional: true,
    status: 'COMING_SOON',
    owningPhase: 'PH11',
    operationalOwnerRole: 'Connectivity Product Lead',
    backupOwnerRole: 'Legal & Integrations Lead',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'provider plan × region/device compatibility × activation entitlement',
    verificationRequirements: ['NTA Compliance & Authorised Telecom Reseller Agreement'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: ['INSTANT'],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 12,
    key: 'sim-info',
    displayName: 'SIM Information',
    displayNameNe: 'सिम कार्ड जानकारी',
    initialBehaviour: 'Information only unless approved',
    transactional: false,
    status: 'INFORMATION_ONLY',
    owningPhase: 'PH11',
    operationalOwnerRole: 'Content & Editorial Lead',
    backupOwnerRole: 'Connectivity Product Lead',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'non-transactional official telecom KYC & counter guide',
    verificationRequirements: ['NTC / Ncell Official Tariff & Passport KYC Source Verification'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: [],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 13,
    key: 'offline-maps',
    displayName: 'Offline Maps',
    displayNameNe: 'अफलाइन नक्सा',
    initialBehaviour: 'Licence-gated',
    transactional: false,
    status: 'RESTRICTED',
    owningPhase: 'PH11',
    operationalOwnerRole: 'GIS & Maps Lead',
    backupOwnerRole: 'Legal Counsel',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'licensed regional vector tile package & attribution record',
    verificationRequirements: ['Map Provider Tile Caching & Offline Redistribution Licence (DEC-017)'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: [],
    publicRestrictionNotice: 'Licence-Gated: Offline map tile downloads remain restricted until map provider redistribution rights and attribution contracts are finalized.',
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 14,
    key: 'shopping',
    displayName: 'Shopping',
    displayNameNe: 'नेपाली हस्तकला तथा किनमेल',
    initialBehaviour: 'Status-gated marketplace',
    transactional: true,
    status: 'COMING_SOON',
    owningPhase: 'PH10',
    operationalOwnerRole: 'Marketplace Lead',
    backupOwnerRole: 'Finance & Tax Lead',
    lifecycleStages: ['DURING', 'AFTER'],
    inventoryModel: 'SKU/variant × quantity × fulfilment location',
    verificationRequirements: ['Seller PAN/VAT', 'Authentic Craft / GI Origin Declaration', 'Return & Export Policy'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: ['INSTANT'],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 15,
    key: 'restaurants',
    displayName: 'Restaurants',
    displayNameNe: 'रेस्टुरेन्ट तथा भान्सा',
    initialBehaviour: 'Reservation/booking gated',
    transactional: true,
    status: 'AVAILABLE',
    owningPhase: 'PH10',
    operationalOwnerRole: 'Dining & Local Lead',
    backupOwnerRole: 'Partner Support Lead',
    lifecycleStages: ['DURING'],
    inventoryModel: 'table/party size × date/time slot (partner confirmation required)',
    verificationRequirements: ['Food Hygiene & Municipal Business Registration', 'Allergen Disclosure Commitment'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: ['APPROVAL'],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 16,
    key: 'local-experiences',
    displayName: 'Local Experiences',
    displayNameNe: 'स्थानीय संस्कृति तथा अनुभव',
    initialBehaviour: 'Status-gated transactional',
    transactional: true,
    status: 'AVAILABLE',
    owningPhase: 'PH10',
    operationalOwnerRole: 'Cultural Experiences Lead',
    backupOwnerRole: 'Community Stay Lead',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'workshop/session × host capacity × language support',
    verificationRequirements: ['Host Identity Verification', 'Community Tourism Endorsement'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: ['INSTANT', 'APPROVAL'],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 17,
    key: 'hidden-nepal',
    displayName: 'Hidden Nepal',
    displayNameNe: 'लुकेको नेपाल (अन्वेषण)',
    initialBehaviour: 'Editorial/discovery',
    transactional: false,
    status: 'INFORMATION_ONLY',
    owningPhase: 'PH15',
    operationalOwnerRole: 'Chief Editorial Lead',
    backupOwnerRole: 'Content Reviewer',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'editorial article × verified locality citation × seasonal advisory',
    verificationRequirements: ['Editorial Fact-Check & Local Municipality Citation'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: [],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 18,
    key: 'ai-guide',
    displayName: 'AI Travel Guide',
    displayNameNe: 'एआई यात्रा सहायक',
    initialBehaviour: 'Assistive; safety-gated',
    transactional: false,
    status: 'INFORMATION_ONLY',
    owningPhase: 'PH12',
    operationalOwnerRole: 'AI Quality & RAG Lead',
    backupOwnerRole: 'Safety & Compliance Lead',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    inventoryModel: 'grounded RAG response × official source citation × safety boundary check',
    verificationRequirements: ['Grounded Source Registry Citation', 'Zero Autonomous Money/Booking/Emergency Authority'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: [],
    publicRestrictionNotice: 'Assistive Only: AI answers are grounded in official registries with timestamps. AI cannot confirm bookings, move money, or dispatch emergency responders.',
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 19,
    key: 'trip-planning',
    displayName: 'Trip Planning',
    displayNameNe: 'यात्रा योजना तथा तालिका',
    initialBehaviour: 'Planning tool',
    transactional: false,
    status: 'INFORMATION_ONLY',
    owningPhase: 'PH05',
    operationalOwnerRole: 'Core Product Lead',
    backupOwnerRole: 'Engineering Lead',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'multi-service Trip ID workspace × day-by-day itinerary × budget & permit checklist',
    verificationRequirements: ['Server-Calculated Quote & Route Feasibility Disclaimer'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: [],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 20,
    key: 'weather-alerts',
    displayName: 'Weather Alerts',
    displayNameNe: 'मौसम तथा सूचना',
    initialBehaviour: 'Official-source dependent',
    transactional: false,
    status: 'INFORMATION_ONLY',
    owningPhase: 'PH11',
    operationalOwnerRole: 'Safety Information Lead',
    backupOwnerRole: 'Operations Lead',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'official DHM/CAAN bulletin × publication timestamp × coverage disclaimer',
    verificationRequirements: ['Official DHM / CAAN Source Attribution & Freshness Timestamp'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: [],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 21,
    key: 'sos',
    displayName: 'SOS',
    displayNameNe: 'आपतकालीन सहायता (SOS)',
    initialBehaviour: 'GATED until staffed response',
    transactional: false,
    status: 'RESTRICTED',
    owningPhase: 'PH13',
    operationalOwnerRole: 'Head of Safety & Incident Ops',
    backupOwnerRole: 'Founder / Legal Counsel',
    lifecycleStages: ['DURING'],
    inventoryModel: 'GATED — requires 24/7 staffed dispatch, drills & legal clearance',
    verificationRequirements: ['24/7 Staffed Response Center', 'Verified Responder Escalation Drills', 'Legal Duty-of-Care Sign-off'],
    highRiskTwoPersonApproval: true,
    bookingModesAllowed: [],
    gatedReason: 'GATED (Rule #7): Live SOS dispatch is disabled until 24/7 staffed response operations, verified responder escalation, and live drills are approved. Use the verified public Emergency Contact Directory (Nepal Police 100 / Tourist Police 1144).',
    publicRestrictionNotice: 'GATED: PheriNepal does not currently operate a 24/7 live emergency dispatch center. In an emergency, contact Nepal Police (100) or Tourist Police (1144) directly.',
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 22,
    key: 'qr-scan',
    displayName: 'QR Scan Nepal',
    displayNameNe: 'क्यूआर स्क्यान नेपाल',
    initialBehaviour: 'Information/discovery',
    transactional: false,
    status: 'INFORMATION_ONLY',
    owningPhase: 'PH15',
    operationalOwnerRole: 'Heritage Content Lead',
    backupOwnerRole: 'GIS & Maps Lead',
    lifecycleStages: ['DURING'],
    inventoryModel: 'heritage monument QR code × verified historical citation × audio/text guide',
    verificationRequirements: ['Department of Archaeology / Local Guthi Source Citation'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: [],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 23,
    key: 'passport',
    displayName: 'Digital Travel Passport',
    displayNameNe: 'डिजिटल यात्रा राहदानी',
    initialBehaviour: 'Account feature',
    transactional: false,
    status: 'INFORMATION_ONLY',
    owningPhase: 'PH14',
    operationalOwnerRole: 'Traveler Experience Lead',
    backupOwnerRole: 'Privacy Lead',
    lifecycleStages: ['DURING', 'AFTER'],
    inventoryModel: 'traveler account × verified completed booking/check-in stamp',
    verificationRequirements: ['Completed Booking or Consent-Verified Check-In Proof'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: [],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 24,
    key: 'memories',
    displayName: 'Travel Memories',
    displayNameNe: 'यात्रा सम्झनाहरू',
    initialBehaviour: 'User-controlled media',
    transactional: false,
    status: 'INFORMATION_ONLY',
    owningPhase: 'PH14',
    operationalOwnerRole: 'Privacy & Media Lead',
    backupOwnerRole: 'Security Engineer',
    lifecycleStages: ['DURING', 'AFTER'],
    inventoryModel: 'private media album × explicit sharing consent × retention/deletion control',
    verificationRequirements: ['MIME/Malware Scan', 'Privacy Visibility Control (Private by Default)'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: [],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 25,
    key: 'reviews',
    displayName: 'Reviews',
    displayNameNe: 'समीक्षा तथा मूल्याङ्कन',
    initialBehaviour: 'Moderated; booking-verified eligibility',
    transactional: false,
    status: 'INFORMATION_ONLY',
    owningPhase: 'PH14',
    operationalOwnerRole: 'Trust & Moderation Lead',
    backupOwnerRole: 'Support Operations Lead',
    lifecycleStages: ['AFTER'],
    inventoryModel: 'completed booking ID × traveler review × moderation state × partner reply',
    verificationRequirements: ['Verified Completed Booking State (COMPLETED)', 'Anti-Abuse Moderation Check'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: [],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 26,
    key: 'rewards',
    displayName: 'Rewards',
    displayNameNe: 'रिवार्ड तथा लॉयल्टी',
    initialBehaviour: 'Gated until financial/accounting rules approved',
    transactional: false,
    status: 'RESTRICTED',
    owningPhase: 'PH14',
    operationalOwnerRole: 'Finance & Accounting Lead',
    backupOwnerRole: 'CFO / Legal Counsel',
    lifecycleStages: ['AFTER'],
    inventoryModel: 'GATED — separate non-cash points ledger pending tax & accounting sign-off',
    verificationRequirements: ['Tax & Liability Accounting Policy Approval', 'Separate Non-Cash Ledger Isolation'],
    highRiskTwoPersonApproval: true,
    bookingModesAllowed: [],
    gatedReason: 'GATED: Loyalty points issuance and redemption remain disabled until accounting liability rules and separate rewards ledger policies are approved.',
    publicRestrictionNotice: 'Gated: Rewards program is currently disabled pending financial and accounting policy approval.',
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 27,
    key: 'lost-found',
    displayName: 'Lost & Found',
    displayNameNe: 'हराएको तथा फेला परेको',
    initialBehaviour: 'Moderated support workflow',
    transactional: false,
    status: 'INFORMATION_ONLY',
    owningPhase: 'PH13',
    operationalOwnerRole: 'Support Operations Lead',
    backupOwnerRole: 'Trust & Moderation Lead',
    lifecycleStages: ['DURING', 'AFTER'],
    inventoryModel: 'incident report × moderation check × tourist police / embassy referral guide',
    verificationRequirements: ['Support Staff Moderation & PII Redaction'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: [],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 28,
    key: 'companion-matching',
    displayName: 'Travel Companion Matching',
    displayNameNe: 'सहयात्री मिलान',
    initialBehaviour: 'GATED pending safety/privacy controls',
    transactional: false,
    status: 'RESTRICTED',
    owningPhase: 'PH15',
    operationalOwnerRole: 'Trust, Safety & Privacy Lead',
    backupOwnerRole: 'Legal Counsel',
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'GATED — pending identity verification, minor protection, blocking & safety review',
    verificationRequirements: ['Identity Verification Policy', 'Harassment/Blocking Controls', 'Minor Protection & Privacy Audit'],
    highRiskTwoPersonApproval: true,
    bookingModesAllowed: [],
    gatedReason: 'GATED: Travel Companion Matching is disabled until identity verification, anti-harassment blocking, and safety controls pass audit.',
    publicRestrictionNotice: 'Gated: Travel Companion Matching is disabled pending safety, identity verification, and privacy controls.',
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 29,
    key: 'group-travel',
    displayName: 'Group Travel & Community',
    displayNameNe: 'सामूहिक यात्रा तथा समुदाय',
    initialBehaviour: 'Staged release',
    transactional: false,
    status: 'COMING_SOON',
    owningPhase: 'PH15',
    operationalOwnerRole: 'Community Product Lead',
    backupOwnerRole: 'Trust & Moderation Lead',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    inventoryModel: 'shared trip workspace × member permission role × moderated community Q&A',
    verificationRequirements: ['Community Moderation Queue & Abuse Reporting'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: [],
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 30,
    key: 'travel-wallet',
    displayName: 'Travel Wallet',
    displayNameNe: 'ट्राभल वालेट',
    initialBehaviour: 'GATED pending legal/payment/accounting review',
    transactional: true,
    status: 'RESTRICTED',
    owningPhase: 'PH08',
    operationalOwnerRole: 'Head of Finance & Regulatory',
    backupOwnerRole: 'Legal Counsel / Founder',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    inventoryModel: 'GATED — stored-value e-money prohibited without NRB licensing & legal approval',
    verificationRequirements: ['Nepal Rastra Bank (NRB) Stored-Value / PSP Legal Opinion', 'Audited Client Fund Segregation'],
    highRiskTwoPersonApproval: true,
    bookingModesAllowed: [],
    gatedReason: 'GATED (Section 22): Travel Wallet is strictly disabled pending Nepal Rastra Bank (NRB) regulatory review, payment licensing, and accounting approval.',
    publicRestrictionNotice: 'Gated: Stored-value Travel Wallet is disabled pending regulatory and legal review.',
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  },
  {
    index: 31,
    key: 'support',
    displayName: 'Travel Support & Dispute Assistance',
    displayNameNe: 'यात्रा सहायता तथा विवाद समाधान',
    initialBehaviour: 'Service hours and staffing must be explicit',
    transactional: false,
    status: 'INFORMATION_ONLY',
    owningPhase: 'PH13',
    operationalOwnerRole: 'Support Operations Lead',
    backupOwnerRole: 'Finance & Dispute Lead',
    lifecycleStages: ['BEFORE', 'DURING', 'AFTER'],
    inventoryModel: 'support ticket / dispute case × explicit operating hours (08:00–20:00 NPT) × SLA target',
    verificationRequirements: ['Explicit Published Operating Hours (No False 24/7 Promise)', 'Evidence Audit Trail'],
    highRiskTwoPersonApproval: false,
    bookingModesAllowed: [],
    publicRestrictionNotice: 'Staffed Support Hours: 08:00–20:00 Nepal Standard Time (UTC+05:45), Sunday–Friday. We do not claim 24/7 live agent staffing.',
    lastUpdatedUtc: '2026-11-19T08:00:00Z',
    updatedBy: 'system-seed'
  }
];

export interface DashboardDefinition {
  id: DashboardId;
  index: number;
  name: string;
  nameNe: string;
  targetRole: string;
  requiresMfa: boolean;
  permissions: string[];
  description: string;
  owningPhases: string[];
}

export const CANONICAL_DASHBOARDS: DashboardDefinition[] = [
  {
    id: 'traveler',
    index: 1,
    name: 'Traveler Dashboard',
    nameNe: 'यात्रु ड्यासबोर्ड',
    targetRole: 'TRAVELER',
    requiresMfa: false,
    permissions: ['trip:read', 'trip:write', 'quote:create', 'booking:create', 'review:create_verified', 'consent:manage'],
    description: 'Profile, Before/During/After trips, saved places, quotes, bookings, vouchers, payments/refunds, support, consent and memories.',
    owningPhases: ['PH03', 'PH05', 'PH07', 'PH11', 'PH14']
  },
  {
    id: 'partner',
    index: 2,
    name: 'Partner Dashboard',
    nameNe: 'साझेदार (पार्टनर) ड्यासबोर्ड',
    targetRole: 'PARTNER_OPERATOR',
    requiresMfa: false,
    permissions: ['listing:manage', 'inventory:manage', 'booking:respond_approval', 'document:upload', 'payout:read'],
    description: 'Organization profile, listings, availability calendar, approval bookings, staff roles, compliance documents, performance and payout statements.',
    owningPhases: ['PH06', 'PH07', 'PH10']
  },
  {
    id: 'guide-operator',
    index: 3,
    name: 'Guide & Operator Dashboard',
    nameNe: 'गाइड तथा अपरेटर ड्यासबोर्ड',
    targetRole: 'GUIDE_OPERATOR',
    requiresMfa: false,
    permissions: ['guide:schedule', 'trek:departure_manage', 'permit:checklist_verify', 'incident:escalate'],
    description: 'NATHM/TAAN qualifications, assignments, trek departure schedules, group capacity, TIMS/permit readiness, trip updates and incident escalation.',
    owningPhases: ['PH09', 'PH11', 'PH13']
  },
  {
    id: 'admin',
    index: 4,
    name: 'Admin & Governance Dashboard',
    nameNe: 'प्रमुख प्रशासक ड्यासबोर्ड',
    targetRole: 'PLATFORM_ADMIN',
    requiresMfa: true,
    permissions: ['category:configure_status', 'gate:emergency_disable', 'decision:record', 'audit:read_all', 'invariant:verify'],
    description: 'Global booking switch, 31-category status state machine, 240-module phase register, owner decisions register, feature flags and immutable audit log.',
    owningPhases: ['PH00', 'PH02', 'PH04', 'PH17']
  },
  {
    id: 'verification-compliance',
    index: 5,
    name: 'Verification & Compliance Dashboard',
    nameNe: 'प्रमाणीकरण तथा अनुपालन ड्यासबोर्ड',
    targetRole: 'COMPLIANCE_OFFICER',
    requiresMfa: true,
    permissions: ['verification:review_primary', 'verification:approve_secondary', 'partner:restrict', 'licence:track_expiry'],
    description: 'Partner evidence queue, licence/insurance expiry tracking, two-person separation-of-duties approval workflow, restrictions and compliance history.',
    owningPhases: ['PH06', 'PH09']
  },
  {
    id: 'finance',
    index: 6,
    name: 'Finance & Ledger Dashboard',
    nameNe: 'वित्त तथा लेजर ड्यासबोर्ड',
    targetRole: 'FINANCE_OFFICER',
    requiresMfa: true,
    permissions: ['ledger:read', 'refund:approve', 'payout:approve', 'reconciliation:run', 'dispute:manage'],
    description: 'Double-entry balanced ledger journals, payment intent reconciliation, refund policy execution, commissions, partner payout approvals and financial audit.',
    owningPhases: ['PH08']
  },
  {
    id: 'support-safety',
    index: 7,
    name: 'Support & Safety Dashboard',
    nameNe: 'सहायता तथा सुरक्षा ड्यासबोर्ड',
    targetRole: 'SUPPORT_SAFETY_STAFF',
    requiresMfa: false,
    permissions: ['ticket:manage', 'incident:triage', 'emergency_contact:verify', 'sos:view_gate'],
    description: 'Support tickets, explicit operating hours (08:00–20:00 NPT), incident severity triage, verified public emergency contacts and SOS gate enforcement.',
    owningPhases: ['PH13']
  },
  {
    id: 'content-intelligence',
    index: 8,
    name: 'Content & Intelligence Dashboard',
    nameNe: 'सामग्री तथा एआई इन्टेलिजेन्स ड्यासबोर्ड',
    targetRole: 'CONTENT_AI_EDITOR',
    requiresMfa: false,
    permissions: ['content:publish', 'source:verify_freshness', 'review:moderate', 'ai:evaluate_grounding'],
    description: 'Destination profiles, Official Source Registry citations & freshness, English/Nepali localization, review moderation and AI grounding evaluation.',
    owningPhases: ['PH04', 'PH12', 'PH14', 'PH15']
  }
];

export type PhaseStatus = 'PARTIAL' | 'NOT_STARTED' | 'PENDING' | 'GATED' | 'VERIFIED';

export interface FeatureModuleItem {
  id: string;
  phaseId: string;
  title: string;
  status: PhaseStatus;
}

export interface PhaseSummary {
  phaseId: string;
  number: number;
  title: string;
  moduleCount: number;
  featureIds: string[];
  features: FeatureModuleItem[];
  status: PhaseStatus;
  exitGateSummary: string;
}

function buildPhaseFeatures(
  phaseId: string,
  titles: string[],
  defaultStatus: PhaseStatus
): FeatureModuleItem[] {
  return titles.map((title, idx) => ({
    id: `${phaseId}-F${String(idx + 1).padStart(3, '0')}`,
    phaseId,
    title,
    status: defaultStatus
  }));
}

const PH00_TITLES = [
  'Product vision, positioning and measurable outcomes',
  'Traveler and partner persona validation',
  'Before/during/after journey maps',
  '31-category taxonomy and category ownership',
  'Product requirement and acceptance-criteria template',
  'Feature register with unique IDs and phase ownership',
  'Decision log and unresolved-decision workflow',
  'Risk, dependency and assumption register',
  'Content source and verification policy',
  'Legal, licensing, insurance and tax question register',
  'Pilot-region and pilot-category selection framework',
  'AI coding-agent operating contract and evidence-report format'
];

const PH01_TITLES = [
  'Brand strategy, positioning and voice',
  'Logo system and asset rules',
  'Semantic colour tokens and contrast',
  'Typography with Nepali/Latin font testing',
  'Spacing, grid, sizing, elevation and radius tokens',
  'Iconography and illustration direction',
  'Photography and media art direction',
  'Reusable component library',
  'Navigation, header, footer and responsive menu',
  'Mobile/tablet/desktop layout system',
  'Light/dark themes and contrast',
  'Forms, validation, feedback and notification patterns',
  'Tables, filters, search, cards and map patterns',
  'Design tokens and developer handoff',
  'Interaction, motion and micro-interaction guidelines',
  'Accessibility-first design patterns, WCAG 2.2 AA target'
];

const PH02_TITLES = [
  'Repository structure and package boundaries',
  'Environment configuration and validation',
  'Reproducible local development',
  'PostgreSQL schema and migration framework',
  'Constraints, indexes and transaction policy',
  'Domain layer and service boundaries',
  'API framework and versioning',
  'Typed validation and shared schemas',
  'Error model and correlation IDs',
  'Logging, metrics and tracing baseline',
  'File/object storage abstraction',
  'Background job/event-processing foundation',
  'CI, code quality and dependency scanning',
  'Seed data, fixtures and test infrastructure'
];

const PH03_TITLES = [
  'Traveler registration and account creation',
  'Email/phone verification and OTP lifecycle',
  'Secure login, logout and sessions',
  'Password management and recovery',
  'MFA for privileged accounts',
  'Role-based access control',
  'Organization and partner membership',
  'Tenant and record-level isolation',
  'Profile and traveler preferences',
  'Consent, privacy and notification preferences',
  'Export, correction, deletion and retention workflow',
  'Session/device management and suspicious-login controls'
];

const PH04_TITLES = [
  '31-category catalogue and metadata',
  'Category/location availability status',
  'Status history and audit trail',
  'Category-specific information templates',
  'Destination profiles and editorial pages',
  'Province/district/municipality/locality taxonomy',
  'Attraction and point-of-interest records',
  'History, culture and local etiquette',
  'Best-season and climate information',
  'Permit, visa and entry information library',
  'Official contact and public-service directory',
  'Source registry, citations and verification workflow',
  'Content freshness, expiry and review scheduling',
  'English/Nepali editorial workflow',
  'Media rights and moderation',
  'SEO metadata, canonical URLs and structured data'
];

const PH05_TITLES = [
  'Global category/destination search',
  'Suggestions and typo tolerance',
  'Filters and sorting',
  'Map-based discovery',
  'Distance and geospatial search',
  'Nearby services discovery',
  'Destination comparison',
  'Attraction/activity discovery',
  'Date/guest/requirement-aware search',
  'Saved places and wishlists',
  'Trip itinerary builder',
  'Day-by-day schedule and timeline',
  'Travel time, distance and route planning',
  'Budget calculator and cost breakdown',
  'Packing/preparation checklists',
  'Permit/document planning checklist'
];

const PH06_TITLES = [
  'Partner application and business profile',
  'Identity and registration evidence',
  'Licence, permit and insurance evidence',
  'Document review and verification queue',
  'Two-person approval and separation of duties',
  'Category-specific partner readiness checklist',
  'Partner agreement and terms acceptance',
  'Listing creation and editing',
  'Listing photos, media and ownership declaration',
  'Staff invitations and roles',
  'Partner availability and operating schedule',
  'Suspension, restriction and reinstatement',
  'Partner performance and compliance history',
  'Assisted onboarding and audit history'
];

const PH07_TITLES = [
  'Property/accommodation listing model',
  'Room/unit and occupancy model',
  'Rate plans, taxes, fees and price breakdown',
  'Availability calendar and inventory rules',
  'Minimum/maximum stay and booking windows',
  'Search-to-listing availability validation',
  'Expiring temporary inventory holds',
  'Instant Booking workflow',
  'Approval Booking workflow',
  'Booking state machine and transition policy',
  'Confirmation and traveler notifications',
  'Check-in/check-out and service completion',
  'Modification and rescheduling',
  'Cancellation, no-show and partial fulfilment',
  'Multi-service Trip ID with independent booking records',
  'Booking history, vouchers and receipts'
];

const PH08_TITLES = [
  'Payment provider adapter framework',
  'Payment intent and checkout session',
  'Payment status state machine',
  'Signed, idempotent webhook processing',
  'Double-entry financial ledger',
  'Booking-to-payment allocation',
  'Refund calculation and execution',
  'Partial refund and cancellation fee rules',
  'Commission calculation and disclosure',
  'Partner payout and approval',
  'Reconciliation and settlement reporting',
  'Dispute/chargeback evidence workflow',
  'Tax, invoice and receipt records',
  'Finance dashboard and financial audit log'
];

const PH09_TITLES = [
  'Adventure activity catalogue/detail',
  'Trek route and itinerary catalogue',
  'Trek package and departure dates',
  'Peak-climbing product and expedition details',
  'Guide/porter profile and qualifications',
  'Guide availability and assignment',
  'Operator/agency profile',
  'Group size and capacity',
  'Equipment and inclusion/exclusion details',
  'Permit/restricted-area checklist integration',
  'Safety briefing and risk acknowledgement',
  'Vehicle, fleet and driver profiles',
  'Transport routes, schedules and seat capacity',
  'Airport transfer and private hire booking',
  'Flight search/information provider integration',
  'Luggage storage, transfer and tracking workflow'
];

const PH10_TITLES = [
  'Restaurant profiles and menus',
  'Table reservation and party-size rules',
  'Reservation confirmation and cancellation',
  'Food preferences and allergen disclosure',
  'Local experience catalogue',
  'Community tourism and host experiences',
  'Event, workshop and festival listings',
  'Experience schedule, capacity and booking',
  'Shopping seller onboarding',
  'Product catalogue, variants and inventory',
  'Shopping cart and checkout',
  'Order fulfilment, delivery and tracking',
  'Returns, refunds and seller disputes',
  'Local partner settlement and payout reporting'
];

const PH11_TITLES = [
  'My Trip live trip dashboard',
  'Trip timeline and itinerary updates',
  'GPS sharing with explicit consent',
  'Route navigation and saved routes',
  'Licensed offline map downloads',
  'Offline itinerary and vouchers',
  'Offline emergency information pack',
  'Connectivity and SIM information',
  'eSIM catalogue and purchase flow',
  'Translation and phrase assistance',
  'Weather and official alert feed',
  'Travel disruption and route closure alerts',
  'Nearby hospital/pharmacy/ATM/bank/fuel discovery',
  'Sync queue and conflict-safe offline synchronization'
];

const PH12_TITLES = [
  'AI travel assistant',
  'Grounded destination Q&A',
  'Personalized itinerary generation',
  'Trip plan refinement and constraint checks',
  'Budget-aware recommendations',
  'Weather/context-aware trusted-source suggestions',
  'Multilingual conversational assistance',
  'AI-assisted content drafting for human review',
  'Recommendation ranking and explanation',
  'Preference and personalization controls',
  'AI evaluation, feedback and quality dashboard',
  'AI safety, abuse, cost and provider fallback controls'
];

const PH13_TITLES = [
  'Safety information hub',
  'Verified emergency contact directory',
  'SOS interface and activation policy',
  'Incident reporting and case creation',
  'Severity classification and triage',
  'Escalation and responder assignment',
  'Emergency contact notification with consent',
  'Incident timeline and status updates',
  'Traveler support center and help articles',
  'Support ticket/live chat where staffed',
  'Complaint and dispute intake',
  'Lost-document/property assistance',
  'Fraud/scam reporting and abuse controls',
  'Post-incident follow-up and audit'
];

const PH14_TITLES = [
  'Trip completion and post-trip summary',
  'Actual versus estimated expenditure',
  'Booking/payment/receipt/refund history',
  'Verified review invitation and submission',
  'Review moderation and appeal',
  'Partner reply and service recovery',
  'Digital travel passport and stamps',
  'Private travel memories/media album',
  'Shareable trip story with privacy controls',
  'Rewards and loyalty rules',
  'Separate rewards ledger and redemption',
  'Personalized repeat-trip recommendations'
];

const PH15_TITLES = [
  'Group trip creation and invitations',
  'Shared itinerary and collaborative editing',
  'Group member roles and permissions',
  'Group expense splitting and settlement records',
  'Travel community posts and questions',
  'Community moderation and reporting',
  'QR Scan Nepal information experience',
  'Hidden Nepal editorial discovery',
  'Companion discovery and matching',
  'Companion safety checks, blocking and reporting',
  'Sustainable/responsible travel guidance',
  'Accessibility and inclusive-travel preference discovery'
];

const PH16_TITLES = [
  'Android application using stable API',
  'iOS application using stable API',
  'Push notification integration',
  'Deep links and universal links',
  'Partner/provider integration hub',
  'Public/partner API governance and webhooks',
  'Business intelligence and operations dashboards',
  'Multi-currency display and exchange-rate source',
  'Corporate/group travel account support',
  'New destination and international-market configuration'
];

const PH17_TITLES = [
  'Production deployment and environment promotion',
  'Security assessment and penetration testing',
  'Performance, load, stress and soak testing',
  'Backup, disaster recovery and restore drills',
  'Monitoring, alerting, SLOs and incident response',
  'Controlled launch, rollback and continuous improvement'
];

const ALL_PHASE_DEFINITIONS: {
  phaseId: string;
  number: number;
  title: string;
  titles: string[];
  status: PhaseStatus;
  exitGateSummary: string;
}[] = [
  {
    phaseId: 'PH00',
    number: 0,
    title: 'Product discovery, governance and technical foundation',
    titles: PH00_TITLES,
    status: 'PARTIAL',
    exitGateSummary: 'PH00-F001..F012 artefacts, 31 categories, 8 dashboards, 240 feature IDs, 26 decisions (PENDING/GATED), RSK/DEP/ASM registers, 15 legal gates, and AI contract implemented; awaits Owner sign-off (Rule #11).'
  },
  {
    phaseId: 'PH01',
    number: 1,
    title: 'Premium brand, UI/UX and design system',
    titles: PH01_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Blocked on PH00 Owner exit approval and DEC-004 sign-off.'
  },
  {
    phaseId: 'PH02',
    number: 2,
    title: 'Platform foundation, database and developer experience',
    titles: PH02_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Blocked on PH00 exit approval and managed PostgreSQL provisioning (DEP-001, DEC-013).'
  },
  {
    phaseId: 'PH03',
    number: 3,
    title: 'Identity, accounts, roles and consent',
    titles: PH03_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Blocked on PH00–PH02 completion and DEC-016.'
  },
  {
    phaseId: 'PH04',
    number: 4,
    title: 'Catalogue, destination content and information intelligence',
    titles: PH04_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Blocked on PH00–PH03 completion and DEC-003.'
  },
  {
    phaseId: 'PH05',
    number: 5,
    title: 'Search, maps, discovery and trip planning',
    titles: PH05_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Blocked on PH00–PH04 completion and map licence (DEC-017).'
  },
  {
    phaseId: 'PH06',
    number: 6,
    title: 'Partner onboarding, verification and supply',
    titles: PH06_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Blocked on PH00–PH05 completion and DEC-024.'
  },
  {
    phaseId: 'PH07',
    number: 7,
    title: 'Stay inventory and booking engine',
    titles: PH07_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Blocked on PH00–PH06 completion and DEC-010, DEC-011.'
  },
  {
    phaseId: 'PH08',
    number: 8,
    title: 'Payments, ledger, refunds and financial operations',
    titles: PH08_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Gated on DEC-008, DEC-009, DEC-012, LEG-008, LEG-009.'
  },
  {
    phaseId: 'PH09',
    number: 9,
    title: 'Adventure, trekking, guides and transport',
    titles: PH09_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Gated on LEG-003, LEG-004 and category readiness.'
  },
  {
    phaseId: 'PH10',
    number: 10,
    title: 'Restaurants, local experiences, shopping and luggage',
    titles: PH10_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Gated on LEG-006 and category readiness.'
  },
  {
    phaseId: 'PH11',
    number: 11,
    title: 'During-trip tools, connectivity, offline and translation',
    titles: PH11_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Gated on offline map and eSIM provider contracts (DEP-006, DEP-007).'
  },
  {
    phaseId: 'PH12',
    number: 12,
    title: 'AI travel intelligence and personalization',
    titles: PH12_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Gated on DEC-018 and evaluation dataset.'
  },
  {
    phaseId: 'PH13',
    number: 13,
    title: 'Safety, emergency, incidents and support',
    titles: PH13_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Gated on DEC-007, DEC-023 (SOS hard-gated until 24/7 staffed drills).'
  },
  {
    phaseId: 'PH14',
    number: 14,
    title: 'After-trip, reviews, memories, passport and rewards',
    titles: PH14_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Gated on DEC-019, DEC-026 (Rewards gated on accounting sign-off).'
  },
  {
    phaseId: 'PH15',
    number: 15,
    title: 'Group travel, community and advanced features',
    titles: PH15_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Gated on DEC-022 (Companion matching gated on safety audit).'
  },
  {
    phaseId: 'PH16',
    number: 16,
    title: 'Mobile apps, integrations, analytics and expansion',
    titles: PH16_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Gated on DEC-021 and stable /api/v1 governance.'
  },
  {
    phaseId: 'PH17',
    number: 17,
    title: 'Production hardening, launch and continuous operations',
    titles: PH17_TITLES,
    status: 'NOT_STARTED',
    exitGateSummary: 'Not started. Gated on all upstream phases, penetration testing, and DR drills.'
  }
];

export const MASTER_PHASE_REGISTER: PhaseSummary[] = ALL_PHASE_DEFINITIONS.map((def) => {
  const features = buildPhaseFeatures(def.phaseId, def.titles, def.status);
  if (def.phaseId === 'PH00') {
    // Set PH00-F010 to GATED and PH00-F011 to PENDING to match exact audit matrix
    features[9].status = 'GATED';
    features[10].status = 'PENDING';
  }
  return {
    phaseId: def.phaseId,
    number: def.number,
    title: def.title,
    moduleCount: def.titles.length,
    featureIds: features.map((f) => f.id),
    features,
    status: def.status,
    exitGateSummary: def.exitGateSummary
  };
});
