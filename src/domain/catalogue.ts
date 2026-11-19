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
    lifecycleStages: ['BEFORE', 'DURING'],
    inventoryModel: 'licensed regional vector tile package & attribution record',
    verificationRequirements: ['Map Provider Tile Caching & Offline Redistribution Licence (DEC-015)'],
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

export interface PhaseSummary {
  phaseId: string;
  number: number;
  title: string;
  moduleCount: number;
  featureIds: string[];
  status: 'VERIFIED' | 'SANDBOX_GATED' | 'STATUS_GATED' | 'PLANNED';
  exitGateSummary: string;
}

export const MASTER_PHASE_REGISTER: PhaseSummary[] = [
  {
    phaseId: 'PH00',
    number: 0,
    title: 'Product discovery, governance and technical foundation',
    moduleCount: 12,
    featureIds: Array.from({ length: 12 }, (_, i) => `PH00-F${String(i + 1).padStart(3, '0')}`),
    status: 'VERIFIED',
    exitGateSummary: '31 categories, 8 dashboards, 240 feature IDs, DECISIONS.md, RISK_REGISTER.md, and Official Source Registry established.'
  },
  {
    phaseId: 'PH01',
    number: 1,
    title: 'Premium brand, UI/UX and design system',
    moduleCount: 16,
    featureIds: Array.from({ length: 16 }, (_, i) => `PH01-F${String(i + 1).padStart(3, '0')}`),
    status: 'VERIFIED',
    exitGateSummary: 'Bilingual English/Nepali typography, 60-30-10 color tokens, Light/Dark mode, WCAG 2.2 AA contrast, and zero-pill discipline.'
  },
  {
    phaseId: 'PH02',
    number: 2,
    title: 'Platform foundation, database and developer experience',
    moduleCount: 14,
    featureIds: Array.from({ length: 14 }, (_, i) => `PH02-F${String(i + 1).padStart(3, '0')}`),
    status: 'VERIFIED',
    exitGateSummary: 'Modular domain services, /api/v1 REST contracts, correlation IDs, structured error envelope, and append-only audit trail.'
  },
  {
    phaseId: 'PH03',
    number: 3,
    title: 'Identity, accounts, roles and consent',
    moduleCount: 12,
    featureIds: Array.from({ length: 12 }, (_, i) => `PH03-F${String(i + 1).padStart(3, '0')}`),
    status: 'VERIFIED',
    exitGateSummary: 'RBAC permission enforcement, MFA verification on privileged roles, and granular traveler privacy/location consent.'
  },
  {
    phaseId: 'PH04',
    number: 4,
    title: 'Catalogue, destination content and information intelligence',
    moduleCount: 16,
    featureIds: Array.from({ length: 16 }, (_, i) => `PH04-F${String(i + 1).padStart(3, '0')}`),
    status: 'VERIFIED',
    exitGateSummary: 'Canonical 31-category state machine, province/district taxonomy, official permit/visa library, and source freshness tracking.'
  },
  {
    phaseId: 'PH05',
    number: 5,
    title: 'Search, maps, discovery and trip planning',
    moduleCount: 16,
    featureIds: Array.from({ length: 16 }, (_, i) => `PH05-F${String(i + 1).padStart(3, '0')}`),
    status: 'VERIFIED',
    exitGateSummary: 'Global category/destination search, multi-service Trip ID planner, budget breakdown, and permit checklist.'
  },
  {
    phaseId: 'PH06',
    number: 6,
    title: 'Partner onboarding, verification and supply',
    moduleCount: 14,
    featureIds: Array.from({ length: 14 }, (_, i) => `PH06-F${String(i + 1).padStart(3, '0')}`),
    status: 'VERIFIED',
    exitGateSummary: 'Category-specific verification evidence, expiry checks, and two-person separation-of-duties approval.'
  },
  {
    phaseId: 'PH07',
    number: 7,
    title: 'Stay inventory and booking engine',
    moduleCount: 16,
    featureIds: Array.from({ length: 16 }, (_, i) => `PH07-F${String(i + 1).padStart(3, '0')}`),
    status: 'VERIFIED',
    exitGateSummary: '12-point Mandatory Booking Gate, separate Booking/Inventory/Payment/Payout states, atomic holds, and concurrency race protection.'
  },
  {
    phaseId: 'PH08',
    number: 8,
    title: 'Payments, ledger, refunds and financial operations',
    moduleCount: 14,
    featureIds: Array.from({ length: 14 }, (_, i) => `PH08-F${String(i + 1).padStart(3, '0')}`),
    status: 'SANDBOX_GATED',
    exitGateSummary: 'Double-entry balanced journal engine, immutable quote snapshots, and refund policy engine; live merchant money GATED pending DEC-008.'
  },
  {
    phaseId: 'PH09',
    number: 9,
    title: 'Adventure, trekking, guides and transport',
    moduleCount: 16,
    featureIds: Array.from({ length: 16 }, (_, i) => `PH09-F${String(i + 1).padStart(3, '0')}`),
    status: 'STATUS_GATED',
    exitGateSummary: 'Trek departures, licensed NATHM guide profiles, green-plate transport routes, and restricted peak-climbing gate.'
  },
  {
    phaseId: 'PH10',
    number: 10,
    title: 'Restaurants, local experiences, shopping and luggage',
    moduleCount: 14,
    featureIds: Array.from({ length: 14 }, (_, i) => `PH10-F${String(i + 1).padStart(3, '0')}`),
    status: 'STATUS_GATED',
    exitGateSummary: 'Restaurant approval reservations and community host experiences active; shopping and luggage status-gated.'
  },
  {
    phaseId: 'PH11',
    number: 11,
    title: 'During-trip tools, connectivity, offline and translation',
    moduleCount: 14,
    featureIds: Array.from({ length: 14 }, (_, i) => `PH11-F${String(i + 1).padStart(3, '0')}`),
    status: 'VERIFIED',
    exitGateSummary: 'During-trip timeline, opt-in revocable GPS consent, Nepali phrase assistance, DHM weather alerts, and nearby essential services.'
  },
  {
    phaseId: 'PH12',
    number: 12,
    title: 'AI travel intelligence and personalization',
    moduleCount: 12,
    featureIds: Array.from({ length: 12 }, (_, i) => `PH12-F${String(i + 1).padStart(3, '0')}`),
    status: 'VERIFIED',
    exitGateSummary: 'Grounded destination Q&A with Official Source Registry citations and strict non-transactional safety guardrails.'
  },
  {
    phaseId: 'PH13',
    number: 13,
    title: 'Safety, emergency, incidents and support',
    moduleCount: 14,
    featureIds: Array.from({ length: 14 }, (_, i) => `PH13-F${String(i + 1).padStart(3, '0')}`),
    status: 'SANDBOX_GATED',
    exitGateSummary: 'Public emergency contacts, explicit support hours (08:00–20:00 NPT), incident triage; SOS button hard-gated per Rule #7.'
  },
  {
    phaseId: 'PH14',
    number: 14,
    title: 'After-trip, reviews, memories, passport and rewards',
    moduleCount: 12,
    featureIds: Array.from({ length: 12 }, (_, i) => `PH14-F${String(i + 1).padStart(3, '0')}`),
    status: 'VERIFIED',
    exitGateSummary: 'Actual vs estimated spend, booking-verified reviews, Digital Travel Passport stamps; Rewards GATED pending accounting sign-off.'
  },
  {
    phaseId: 'PH15',
    number: 15,
    title: 'Group travel, community and advanced features',
    moduleCount: 12,
    featureIds: Array.from({ length: 12 }, (_, i) => `PH15-F${String(i + 1).padStart(3, '0')}`),
    status: 'STATUS_GATED',
    exitGateSummary: 'Hidden Nepal editorial and QR Scan Nepal discovery active; Travel Companion Matching GATED pending safety audit.'
  },
  {
    phaseId: 'PH16',
    number: 16,
    title: 'Mobile apps, integrations, analytics and expansion',
    moduleCount: 10,
    featureIds: Array.from({ length: 10 }, (_, i) => `PH16-F${String(i + 1).padStart(3, '0')}`),
    status: 'PLANNED',
    exitGateSummary: 'Versioned /api/v1 OpenAPI-compatible contracts prepared for native Android/iOS clients.'
  },
  {
    phaseId: 'PH17',
    number: 17,
    title: 'Production hardening, launch and continuous operations',
    moduleCount: 6,
    featureIds: Array.from({ length: 6 }, (_, i) => `PH17-F${String(i + 1).padStart(3, '0')}`),
    status: 'PLANNED',
    exitGateSummary: 'Automated 12-point gate, concurrency race, and double-entry ledger balance verification suite.'
  }
];
