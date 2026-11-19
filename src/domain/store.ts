/**
 * PHERINEPAL — SERVER-SIDE DOMAIN STORE, 12-POINT BOOKING GATE & APPEND-ONLY LEDGER
 * Blueprint Reference: Sections 9.2, 11.1–11.4, 12.1–12.4, 13, 14, 18, 21.3
 */

import {
  BookingState,
  CANONICAL_CATEGORIES,
  CANONICAL_DASHBOARDS,
  CategoryStatus,
  InventoryHoldState,
  LifecycleStage,
  MASTER_PHASE_REGISTER,
  PaymentState,
  PayoutState,
  ServiceCategory,
} from './catalogue.ts';
import {
  OwnerDecisionFullRecord,
  PH00_ALL_26_DECISIONS,
  PH00_ASSUMPTIONS,
  PH00_DEPENDENCIES,
  PH00_FEATURE_AUDIT_MATRIX,
  PH00_LEGAL_REGISTER,
  PH00_LIFECYCLE_JOURNEY_MAPS,
  PH00_PERSONAS,
  PH00_PILOT_FRAMEWORK,
  PH00_RISKS,
} from './ph00Governance.ts';

export interface PartnerVerificationRecord {
  partnerId: string;
  organizationName: string;
  organizationNameNe: string;
  categoryKey: string;
  province: string;
  district: string;
  locality: string;
  registrationNumber: string;
  licenceAuthority: string;
  licenceNumber: string;
  licenceExpiryUtc: string;
  insuranceValid: boolean;
  status: 'PENDING_PRIMARY_REVIEW' | 'PENDING_SECOND_APPROVAL' | 'VERIFIED' | 'SUSPENDED' | 'RESTRICTED';
  primaryReviewer?: string;
  primaryReviewedAtUtc?: string;
  secondaryApprover?: string;
  secondaryApprovedAtUtc?: string;
  whatWasCheckedSummary: string;
}

export interface InventoryListing {
  listingId: string;
  partnerId: string;
  categoryKey: string;
  title: string;
  titleNe: string;
  locality: string;
  district: string;
  province: string;
  altitudeMeters: number;
  bookingMode: 'INSTANT' | 'APPROVAL';
  basePriceMinorNpr: number; // Stored in integer minor units (paisa, 100 paisa = 1 NPR) per Section 9.2
  taxRateBps: number; // 1300 = 13% VAT
  mandatoryServiceFeeMinorNpr: number;
  currency: 'NPR';
  totalCapacity: number;
  availableUnits: number;
  activeHoldsCount: number;
  approved: boolean;
  suspended: boolean;
  cancellationPolicyVersion: string;
  cancellationPolicySummary: string;
  unitLabel: string;
  durationLabel: string;
  permitRequirements: string[];
}

export interface ImmutableQuoteSnapshot {
  quoteId: string;
  listingId: string;
  partnerId: string;
  categoryKey: string;
  quantity: number;
  currency: 'NPR';
  baseAmountMinor: number;
  mandatoryFeeMinor: number;
  taxAmountMinor: number;
  totalPayableMinor: number;
  commissionBps: number;
  platformCommissionMinor: number;
  partnerReceivableMinor: number;
  cancellationPolicyVersion: string;
  cancellationPolicySummary: string;
  createdAtUtc: string;
  expiresAtUtc: string;
}

export interface BookingRecord {
  bookingId: string;
  tripId: string;
  quoteId: string;
  listingId: string;
  listingTitle: string;
  partnerId: string;
  partnerName: string;
  categoryKey: string;
  travelerId: string;
  travelerName: string;
  bookingMode: 'INSTANT' | 'APPROVAL';
  quantity: number;
  serviceDate: string;
  // Separate 4 state dimensions per Section 11.1 (Rule #5)
  bookingState: BookingState;
  inventoryHoldState: InventoryHoldState;
  paymentState: PaymentState;
  payoutState: PayoutState;
  quoteSnapshot: ImmutableQuoteSnapshot;
  idempotencyKey: string;
  holdExpiresAtUtc: string;
  createdAtUtc: string;
  updatedAtUtc: string;
  voucherCode?: string;
}

export interface LedgerJournalLine {
  accountId: 'PLATFORM_COLLECTION_CLEARING' | 'PARTNER_PAYABLE_LIABILITY' | 'PLATFORM_COMMISSION_REVENUE' | 'TAX_VAT_PAYABLE' | 'TRAVELER_REFUND_CLEARING';
  entryType: 'DEBIT' | 'CREDIT';
  amountMinor: number;
  currency: 'NPR';
}

export interface LedgerJournalEntry {
  journalId: string;
  bookingId: string;
  paymentIntentId: string;
  eventType: 'PAYMENT_CAPTURE_ALLOCATION' | 'REFUND_REVERSAL' | 'PARTNER_PAYOUT_SETTLEMENT';
  description: string;
  lines: LedgerJournalLine[];
  totalDebitMinor: number;
  totalCreditMinor: number;
  balanced: boolean;
  createdAtUtc: string;
  actor: string;
}

export interface AuditEvent {
  auditId: string;
  timestampUtc: string;
  actor: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  reason: string;
  priorValue?: string;
  newValue?: string;
  correlationId: string;
}

export interface OfficialSourceRecord {
  sourceId: string;
  publisher: string;
  title: string;
  titleNe: string;
  urlOrContact: string;
  geographicScope: string;
  categoryKey: string;
  publishedDate: string;
  lastVerifiedUtc: string;
  nextReviewDate: string;
  confidence: 'VERIFIED_OFFICIAL' | 'ADVISORY_TIMESTAMPED';
  summary: string;
  summaryNe: string;
}

export interface SupportIncidentRecord {
  incidentId: string;
  tripId?: string;
  bookingId?: string;
  reporterName: string;
  category: 'BOOKING_DISPUTE' | 'ROUTE_WEATHER_DISRUPTION' | 'LOST_DOCUMENT_PROPERTY' | 'PARTNER_COMPLIANCE_REPORT' | 'SAFETY_ESCALATION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'TRIAGED' | 'ESCALATED_TO_AUTHORITY' | 'RESOLVED';
  locality: string;
  description: string;
  assignedTeam: string;
  createdAtUtc: string;
  updatedAtUtc: string;
  resolutionNotes?: string;
}

export interface VerifiedReviewRecord {
  reviewId: string;
  bookingId: string;
  listingId: string;
  listingTitle: string;
  travelerName: string;
  rating: number;
  comment: string;
  verifiedCompletedBooking: boolean;
  moderationState: 'PENDING_MODERATION' | 'PUBLISHED' | 'FLAGGED';
  partnerReply?: string;
  createdAtUtc: string;
}

export interface OwnerDecisionRecord {
  id: string;
  topic: string;
  options: string;
  impact: string;
  status: 'PENDING' | 'GATED' | 'RECOMMENDED' | 'VERIFIED';
  owner: string;
  approver: string;
  dueDate: string;
  finalDecision: string;
}

export interface GateCheckResult {
  allowed: boolean;
  checks: {
    step: number;
    name: string;
    passed: boolean;
    detail: string;
  }[];
  failedReason?: string;
}

class PheriNepalDomainStore {
  public globalBookingSwitch = true;
  public supportOperatingHours = '08:00–20:00 NPT (UTC+05:45), Sunday–Friday. No 24/7 live emergency dispatch claimed.';
  public categories: ServiceCategory[] = structuredClone(CANONICAL_CATEGORIES);
  public processedIdempotencyKeys = new Map<string, string>(); // key -> bookingId

  public partners: PartnerVerificationRecord[] = [
    {
      partnerId: 'PRT-KTM-001',
      organizationName: 'Heritage Patan Courtyard Boutique Stay',
      organizationNameNe: 'हेरिटेज पाटन कोर्टयार्ड बुटिक स्टे',
      categoryKey: 'hotels',
      province: 'Bagmati',
      district: 'Lalitpur',
      locality: 'Patan Durbar Square Buffer Zone',
      registrationNumber: 'OCR-2078-88412',
      licenceAuthority: 'Department of Tourism (DoT) & Lalitpur Metropolitan Ward 16',
      licenceNumber: 'DOT-HTL-4419',
      licenceExpiryUtc: '2027-07-15T00:00:00Z',
      insuranceValid: true,
      status: 'VERIFIED',
      primaryReviewer: 'compliance.anita@pherinepal.np',
      primaryReviewedAtUtc: '2026-10-12T09:15:00Z',
      secondaryApprover: 'audit.rajesh@pherinepal.np',
      secondaryApprovedAtUtc: '2026-10-13T11:40:00Z',
      whatWasCheckedSummary: 'Checked DoT Heritage Hotel Licence, PAN/VAT registration, and fire evacuation plan on 2026-10-13.'
    },
    {
      partnerId: 'PRT-KHB-002',
      organizationName: 'Khumbu Sherpa Alpine Guides Cooperative',
      organizationNameNe: 'खुम्बु शेर्पा अल्पाइन गाइड सहकारी',
      categoryKey: 'trekking',
      province: 'Koshi',
      district: 'Solukhumbu',
      locality: 'Namche Bazaar (3,440m)',
      registrationNumber: 'OCR-2075-11904',
      licenceAuthority: 'Department of Tourism (DoT), TAAN & NATHM',
      licenceNumber: 'TAAN-TRK-9082',
      licenceExpiryUtc: '2027-09-30T00:00:00Z',
      insuranceValid: true,
      status: 'VERIFIED',
      primaryReviewer: 'compliance.anita@pherinepal.np',
      primaryReviewedAtUtc: '2026-10-20T07:30:00Z',
      secondaryApprover: 'safety.pemba@pherinepal.np',
      secondaryApprovedAtUtc: '2026-10-21T14:10:00Z',
      whatWasCheckedSummary: 'Two-person verified: DoT Trekking Agency Licence, TAAN membership, and mandatory high-altitude guide/porter helicopter rescue & medical insurance policies.'
    },
    {
      partnerId: 'PRT-PKR-003',
      organizationName: 'Gandaki Green-Plate Tourist Transport Pvt. Ltd.',
      organizationNameNe: 'गण्डकी हरियो प्लेट पर्यटक यातायात प्रा. लि.',
      categoryKey: 'transport',
      province: 'Gandaki',
      district: 'Kaski',
      locality: 'Lakeside, Pokhara',
      registrationNumber: 'OCR-2076-55320',
      licenceAuthority: 'Department of Transport Management (DoTM)',
      licenceNumber: 'DOTM-GP-2210',
      licenceExpiryUtc: '2027-05-20T00:00:00Z',
      insuranceValid: true,
      status: 'VERIFIED',
      primaryReviewer: 'compliance.anita@pherinepal.np',
      primaryReviewedAtUtc: '2026-11-01T10:00:00Z',
      secondaryApprover: 'audit.rajesh@pherinepal.np',
      secondaryApprovedAtUtc: '2026-11-02T15:25:00Z',
      whatWasCheckedSummary: 'Two-person verified: Green-plate tourist vehicle registration, commercial driver licences, and comprehensive passenger liability insurance.'
    },
    {
      partnerId: 'PRT-LWG-004',
      organizationName: 'Lwangerung Gurung Community Homestay Committee',
      organizationNameNe: 'ल्वाङघलेल गुरुङ सामुदायिक होमस्टे समिति',
      categoryKey: 'homestays',
      province: 'Gandaki',
      district: 'Kaski',
      locality: 'Machhapuchhre Rural Municipality-8, Lwang',
      registrationNumber: 'HOM-GDS-2077-19',
      licenceAuthority: 'Gandaki Province Tourism Office & Local Homestay Committee',
      licenceNumber: 'GND-HMS-019',
      licenceExpiryUtc: '2027-08-01T00:00:00Z',
      insuranceValid: true,
      status: 'VERIFIED',
      primaryReviewer: 'compliance.anita@pherinepal.np',
      primaryReviewedAtUtc: '2026-11-05T08:45:00Z',
      secondaryApprover: 'audit.rajesh@pherinepal.np',
      secondaryApprovedAtUtc: '2026-11-05T16:00:00Z',
      whatWasCheckedSummary: 'Checked Community Homestay Committee registration, host member roster, and hygiene readiness checklist.'
    },
    {
      partnerId: 'PRT-EXP-005',
      organizationName: 'High-Altitude Peak Expeditions Nepal',
      organizationNameNe: 'हाई-अल्टिट्युड पिक एक्सपिडिसन नेपाल',
      categoryKey: 'peak-climbing',
      province: 'Koshi',
      district: 'Solukhumbu',
      locality: 'Chhukung / Island Peak Base',
      registrationNumber: 'OCR-2080-99102',
      licenceAuthority: 'Nepal Mountaineering Association (NMA) & DoT',
      licenceNumber: 'NMA-EXP-312',
      licenceExpiryUtc: '2027-04-30T00:00:00Z',
      insuranceValid: true,
      status: 'PENDING_SECOND_APPROVAL',
      primaryReviewer: 'compliance.anita@pherinepal.np',
      primaryReviewedAtUtc: '2026-11-18T11:20:00Z',
      whatWasCheckedSummary: 'Primary review completed on NMA licence; awaiting second distinct safety officer approval and category un-restriction.'
    }
  ];

  public listings: InventoryListing[] = [
    {
      listingId: 'LST-HTL-101',
      partnerId: 'PRT-KTM-001',
      categoryKey: 'hotels',
      title: 'Traditional Newa Brick & Carved Timber Courtyard Suite',
      titleNe: 'परम्परागत नेवाः इँटा र काष्ठकला आँगन सुइट',
      locality: 'Patan Swotha',
      district: 'Lalitpur',
      province: 'Bagmati',
      altitudeMeters: 1320,
      bookingMode: 'INSTANT',
      basePriceMinorNpr: 850000, // 8,500.00 NPR
      taxRateBps: 1300, // 13% VAT
      mandatoryServiceFeeMinorNpr: 42500, // 425.00 NPR
      currency: 'NPR',
      totalCapacity: 4,
      availableUnits: 2,
      activeHoldsCount: 0,
      approved: true,
      suspended: false,
      cancellationPolicyVersion: 'POL-STAY-2026-V1',
      cancellationPolicySummary: '100% refund of base & tax if cancelled >= 48 hours before 14:00 NPT check-in. 50% penalty within 48 hours.',
      unitLabel: 'Suite / Night',
      durationLabel: '1 Night (Check-in 14:00 NPT)',
      permitRequirements: ['Valid Passport & Nepal Entry Visa']
    },
    {
      listingId: 'LST-HMS-102',
      partnerId: 'PRT-LWG-004',
      categoryKey: 'homestays',
      title: 'Lwang Organic Tea Garden & Machhapuchhre View Homestay',
      titleNe: 'ल्वाङ अर्गानिक चिया बगान तथा माछापुच्छ्रे दृश्य होमस्टे',
      locality: 'Lwang Village',
      district: 'Kaski',
      province: 'Gandaki',
      altitudeMeters: 1550,
      bookingMode: 'INSTANT',
      basePriceMinorNpr: 240000, // 2,400.00 NPR (includes dinner & breakfast)
      taxRateBps: 1300,
      mandatoryServiceFeeMinorNpr: 12000, // 120.00 NPR
      currency: 'NPR',
      totalCapacity: 6,
      availableUnits: 1, // Deliberately set to 1 remaining unit so the user can test simultaneous final-unit concurrency!
      activeHoldsCount: 0,
      approved: true,
      suspended: false,
      cancellationPolicyVersion: 'POL-HMS-2026-V1',
      cancellationPolicySummary: 'Full refund if cancelled >= 24 hours prior to arrival in Lwang village.',
      unitLabel: 'Private Room + Dal Bhat Dinner & Breakfast',
      durationLabel: '1 Night',
      permitRequirements: ['ACAP Entry Permit (if continuing into Annapurna Conservation Area)']
    },
    {
      listingId: 'LST-TRK-103',
      partnerId: 'PRT-KHB-002',
      categoryKey: 'trekking',
      title: 'Khumbu Gokyo Lakes & Renjo La Acclimatized Guided Trek (12 Days)',
      titleNe: 'खुम्बु गोक्यो ताल र रेन्जो ला निर्देशित पदयात्रा (१२ दिन)',
      locality: 'Lukla to Gokyo Ri (5,357m)',
      district: 'Solukhumbu',
      province: 'Koshi',
      altitudeMeters: 5357,
      bookingMode: 'APPROVAL',
      basePriceMinorNpr: 9500000, // 95,000.00 NPR
      taxRateBps: 1300,
      mandatoryServiceFeeMinorNpr: 250000, // 2,500.00 NPR
      currency: 'NPR',
      totalCapacity: 8,
      availableUnits: 4,
      activeHoldsCount: 0,
      approved: true,
      suspended: false,
      cancellationPolicyVersion: 'POL-TRK-2026-V2',
      cancellationPolicySummary: 'Partner approval required within 24h. Full refund if Lukla weather/route closure prevents departure; 85% refund >= 7 days before departure.',
      unitLabel: 'Trekker Slot (NATHM Licensed Guide & Insurance Included)',
      durationLabel: '12 Days',
      permitRequirements: ['Khumbu Pasang Lhamu Rural Municipality Entry Permit (NPR 3,000)', 'Sagarmatha National Park Entry Permit (NPR 3,000)', 'High-Altitude Evacuation Insurance (>= 5,500m)']
    },
    {
      listingId: 'LST-TRN-104',
      partnerId: 'PRT-PKR-003',
      categoryKey: 'transport',
      title: 'Kathmandu to Pokhara Green-Plate Tourist EV Hiace Reserve Seat',
      titleNe: 'काठमाडौं–पोखरा हरियो प्लेट पर्यटक विद्युतीय माइक्रो सिट',
      locality: 'Sorhakhutte Tourist Bus Park → Pokhara Tourist Bus Park',
      district: 'Kaski',
      province: 'Gandaki',
      altitudeMeters: 822,
      bookingMode: 'INSTANT',
      basePriceMinorNpr: 220000, // 2,200.00 NPR
      taxRateBps: 1300,
      mandatoryServiceFeeMinorNpr: 10000, // 100.00 NPR
      currency: 'NPR',
      totalCapacity: 14,
      availableUnits: 5,
      activeHoldsCount: 0,
      approved: true,
      suspended: false,
      cancellationPolicyVersion: 'POL-TRN-2026-V1',
      cancellationPolicySummary: '100% refund if cancelled >= 12 hours before 07:00 NPT departure or if Prithvi Highway closure is declared by Traffic Police.',
      unitLabel: 'Reserved Passenger Seat',
      durationLabel: '07:00 NPT Departure (~7.5 hrs)',
      permitRequirements: ['Government Photo ID or Passport']
    },
    {
      listingId: 'LST-PEAK-105',
      partnerId: 'PRT-EXP-005',
      categoryKey: 'peak-climbing',
      title: 'Imja Tse (Island Peak 6,189m) NMA Guided Summit Climb',
      titleNe: 'इम्जात्से (आइल्याण्ड पिक ६,१८९ मि.) हिमाल आरोहण',
      locality: 'Imja Valley, Khumbu',
      district: 'Solukhumbu',
      province: 'Koshi',
      altitudeMeters: 6189,
      bookingMode: 'APPROVAL',
      basePriceMinorNpr: 18500000, // 185,000.00 NPR
      taxRateBps: 1300,
      mandatoryServiceFeeMinorNpr: 500000,
      currency: 'NPR',
      totalCapacity: 6,
      availableUnits: 6,
      activeHoldsCount: 0,
      approved: true,
      suspended: false,
      cancellationPolicyVersion: 'POL-PEAK-2026-V1',
      cancellationPolicySummary: 'Restricted Category: Direct checkout disabled until NMA permit and two-person partner approval gate pass.',
      unitLabel: 'Climber Slot',
      durationLabel: '16 Days',
      permitRequirements: ['NMA Climbing Permit', 'Garbage Deposit USD 500', 'IFMGA/NMA Climbing Guide Assignment']
    }
  ];

  public quotes = new Map<string, ImmutableQuoteSnapshot>();
  public bookings: BookingRecord[] = [];
  public ledgerEntries: LedgerJournalEntry[] = [];
  public auditEvents: AuditEvent[] = [];
  public officialSources: OfficialSourceRecord[] = [
    {
      sourceId: 'SRC-NTB-01',
      publisher: 'Nepal Tourism Board (NTB) & TAAN',
      title: 'Mandatory Licensed Trekking Guide & TIMS Directive',
      titleNe: 'अनिवार्य इजाजतपत्र प्राप्त ट्रेकिङ गाइड तथा टिम्स (TIMS) निर्देशिका',
      urlOrContact: 'https://ntb.gov.np / +977-1-4256909',
      geographicScope: 'All National Parks & Conservation Areas in Nepal',
      categoryKey: 'trekking',
      publishedDate: '2026-04-01',
      lastVerifiedUtc: '2026-11-19T08:00:00Z',
      nextReviewDate: '2026-12-19',
      confidence: 'VERIFIED_OFFICIAL',
      summary: 'Trekkers in conservation areas and national parks require an official TIMS card / local rural municipality permit and a NATHM/DoT-licensed guide with valid high-altitude insurance.',
      summaryNe: 'राष्ट्रिय निकुञ्ज र संरक्षण क्षेत्रमा पदयात्रा गर्दा आधिकारिक टिम्स कार्ड/स्थानीय गाउँपालिका अनुमति र बीमा गरिएको इजाजतपत्र प्राप्त गाइड आवश्यक पर्दछ।'
    },
    {
      sourceId: 'SRC-DOIM-01',
      publisher: 'Department of Immigration, Kalikasthan, Kathmandu',
      title: 'Nepal Tourist Visa On-Arrival & Restricted Area Permit (RAP) Fees',
      titleNe: 'नेपाल पर्यटक भिसा (अन-अराइभल) र निषेधित क्षेत्र अनुमति शुल्क',
      urlOrContact: 'https://immigration.gov.np / +977-1-4529659',
      geographicScope: 'TIA Kathmandu & Land Border Immigration Offices',
      categoryKey: 'trip-planning',
      publishedDate: '2026-01-15',
      lastVerifiedUtc: '2026-11-19T08:00:00Z',
      nextReviewDate: '2026-12-15',
      confidence: 'VERIFIED_OFFICIAL',
      summary: 'Visa On-Arrival: 15 Days USD 30, 30 Days USD 50, 90 Days USD 125. Restricted areas (Upper Mustang, Upper Dolpo, Manaslu, Nar Phu) require issuance through a licensed Nepali trekking agency.',
      summaryNe: 'अन-अराइभल भिसा: १५ दिन ३० डलर, ३० दिन ५० डलर, ९० दिन १२५ डलर। निषेधित क्षेत्रका लागि दर्ता भएको ट्रेकिङ एजेन्सीमार्फत मात्र अनुमति जारी गरिन्छ।'
    },
    {
      sourceId: 'SRC-DHM-01',
      publisher: 'Department of Hydrology and Meteorology (DHM) —MFD TIA',
      title: 'High-Himalaya & Domestic Mountain Flight Weather Bulletin',
      titleNe: 'उच्च हिमाली तथा आन्तरिक हिमाली उडान मौसम बुलेटिन',
      urlOrContact: 'https://dhm.gov.np / +977-1-4113191',
      geographicScope: 'Khumbu (Lukla), Annapurna (Jomsom), & Kathmandu Valley',
      categoryKey: 'weather-alerts',
      publishedDate: '2026-11-19',
      lastVerifiedUtc: '2026-11-19T06:30:00Z',
      nextReviewDate: '2026-11-20',
      confidence: 'ADVISORY_TIMESTAMPED',
      summary: 'Clear morning visibility in Kathmandu, Pokhara, and Lukla (06:00–11:30 NPT). Afternoon katabatic crosswinds expected above 4,000m (Renjo La & Cho La). Advisory is timestamped and not a real-time guarantee.',
      summaryNe: 'बिहान काठमाडौं, पोखरा र लुक्लामा मौसम सफा रहनेछ। दिउँसो ४,००० मिटरमाथि तीव्र हावा चल्ने सम्भावना छ। यो समय-अंकित आधिकारिक सूचना मात्र हो।'
    },
    {
      sourceId: 'SRC-TP-01',
      publisher: 'Nepal Tourist Police Headquarters, Bhrikutimandap',
      title: 'Verified Public Emergency & Tourist Assistance Directory',
      titleNe: 'प्रमाणित सार्वजनिक आपतकालीन तथा पर्यटक प्रहरी निर्देशिका',
      urlOrContact: 'Toll-Free: 1144 | Nepal Police: 100 | +977-1-4247041',
      geographicScope: 'Nationwide (Kathmandu, Pokhara, Lukla, Sauraha, Lumbini)',
      categoryKey: 'support',
      publishedDate: '2026-07-01',
      lastVerifiedUtc: '2026-11-19T08:00:00Z',
      nextReviewDate: '2026-12-19',
      confidence: 'VERIFIED_OFFICIAL',
      summary: 'Accessible without login (Section 14). Dial 100 for Nepal Police, 1144 for Tourist Police, 102 for Ambulance. PheriNepal does not replace emergency services and live SOS dispatch remains GATED.',
      summaryNe: 'लगइन बिना नै उपलब्ध। नेपाल प्रहरी: १००, पर्यटक प्रहरी: ११४४, एम्बुलेन्स: १०२। फेरीनेपालले सरकारी आपतकालीन सेवालाई प्रतिस्थापन गर्दैन।'
    }
  ];

  public incidents: SupportIncidentRecord[] = [
    {
      incidentId: 'INC-2026-001',
      tripId: 'TRP-NEPAL-2026-01',
      reporterName: 'Aarav Sharma (Traveler)',
      category: 'ROUTE_WEATHER_DISRUPTION',
      severity: 'MEDIUM',
      status: 'TRIAGED',
      locality: 'Manthali / Lukla Sector',
      description: 'Afternoon wind hold at Lukla; requesting 24-hour trek departure date adjustment with Khumbu Sherpa Alpine Guides Cooperative.',
      assignedTeam: 'Trekking Support Desk (08:00–20:00 NPT)',
      createdAtUtc: '2026-11-19T07:15:00Z',
      updatedAtUtc: '2026-11-19T07:40:00Z',
      resolutionNotes: 'Partner notified; zero-fee date modification window active per POL-TRK-2026-V2.'
    }
  ];

  public reviews: VerifiedReviewRecord[] = [
    {
      reviewId: 'REV-2026-901',
      bookingId: 'BKG-SEED-COMPLETED-01',
      listingId: 'LST-HTL-101',
      listingTitle: 'Traditional Newa Brick & Carved Timber Courtyard Suite',
      travelerName: 'Elena Rostova',
      rating: 5,
      comment: 'Quiet courtyard 3 minutes from Patan Museum. Exact VAT and service fee breakdown matched our pre-trip quote to the paisa.',
      verifiedCompletedBooking: true,
      moderationState: 'PUBLISHED',
      partnerReply: 'Dhanyabad Elena! We are glad you enjoyed the Swotha courtyard breakfast.',
      createdAtUtc: '2026-11-15T10:20:00Z'
    }
  ];

  public decisions: OwnerDecisionFullRecord[] = structuredClone(PH00_ALL_26_DECISIONS);

  public ph00Governance = {
    featureAuditMatrix: PH00_FEATURE_AUDIT_MATRIX,
    personas: PH00_PERSONAS,
    journeyMaps: PH00_LIFECYCLE_JOURNEY_MAPS,
    decisions: PH00_ALL_26_DECISIONS,
    risks: PH00_RISKS,
    dependencies: PH00_DEPENDENCIES,
    assumptions: PH00_ASSUMPTIONS,
    legalRegister: PH00_LEGAL_REGISTER,
    pilotFramework: PH00_PILOT_FRAMEWORK,
  };

  public travelerPrivacyConsent = {
    travelerId: 'TRV-001',
    essentialServiceTermsAccepted: true,
    duringTripGpsSharingOptIn: false,
    gpsSharingExpiresAtUtc: null as string | null,
    aiPromptPiiRedactionEnabled: true,
    marketingNotificationsOptIn: false,
    updatedAtUtc: '2026-11-19T08:00:00Z'
  };

  constructor() {
    // Seed one completed booking and balanced ledger journal so Traveler, Partner, and Finance dashboards have initial verified data
    const seedListing = this.listings[0];
    const seedQuote = this.createImmutableQuote(seedListing.listingId, 2, 'system-seed');
    const seedBookingId = 'BKG-SEED-COMPLETED-01';
    this.bookings.push({
      bookingId: seedBookingId,
      tripId: 'TRP-NEPAL-2026-01',
      quoteId: seedQuote.quoteId,
      listingId: seedListing.listingId,
      listingTitle: seedListing.title,
      partnerId: seedListing.partnerId,
      partnerName: 'Heritage Patan Courtyard Boutique Stay',
      categoryKey: seedListing.categoryKey,
      travelerId: 'TRV-001',
      travelerName: 'Aarav Sharma',
      bookingMode: 'INSTANT',
      quantity: 2,
      serviceDate: '2026-11-14',
      bookingState: 'COMPLETED',
      inventoryHoldState: 'CONFIRMED',
      paymentState: 'CAPTURED',
      payoutState: 'PENDING_REVIEW',
      quoteSnapshot: seedQuote,
      idempotencyKey: 'IDEMP-SEED-001',
      holdExpiresAtUtc: '2026-11-14T10:15:00Z',
      createdAtUtc: '2026-11-14T10:00:00Z',
      updatedAtUtc: '2026-11-16T11:00:00Z',
      voucherCode: 'PNP-VCH-8841'
    });
    this.recordDoubleEntryCapture(seedBookingId, 'PI-SEED-001', seedQuote, 'system-seed');
    this.recordAudit({
      actor: 'system-seed',
      actorRole: 'PLATFORM_ADMIN',
      action: 'PHASE_00_BASELINE_INITIALIZED',
      targetType: 'CATALOGUE_REGISTRY',
      targetId: 'PNP-MASTER-ARCH-001',
      reason: 'Initialized canonical 31 categories, 8 dashboards, 240 feature modules, and 12-point booking gate.',
      correlationId: 'CORR-INIT-0001'
    });
  }

  public recordAudit(params: {
    actor: string;
    actorRole: string;
    action: string;
    targetType: string;
    targetId: string;
    reason: string;
    priorValue?: string;
    newValue?: string;
    correlationId: string;
  }): AuditEvent {
    const event: AuditEvent = {
      auditId: `AUD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      timestampUtc: new Date().toISOString(),
      ...params
    };
    this.auditEvents.unshift(event);
    return event;
  }

  /**
   * Section 11.4 — Mandatory 12-Point Server-Side Booking Gate
   */
  public evaluateMandatoryBookingGate(listingId: string, quantity: number, quoteId?: string): GateCheckResult {
    const listing = this.listings.find((l) => l.listingId === listingId);
    const category = listing ? this.categories.find((c) => c.key === listing.categoryKey) : undefined;
    const partner = listing ? this.partners.find((p) => p.partnerId === listing.partnerId) : undefined;
    const quote = quoteId ? this.quotes.get(quoteId) : undefined;
    const nowMs = Date.now();

    const quoteValid = quoteId
      ? Boolean(quote && quote.listingId === listingId && quote.quantity === quantity && new Date(quote.expiresAtUtc).getTime() > nowMs)
      : true;

    const twoPersonApproved = category?.highRiskTwoPersonApproval
      ? Boolean(
          partner?.primaryReviewer &&
            partner?.secondaryApprover &&
            partner.primaryReviewer !== partner.secondaryApprover
        )
      : Boolean(partner?.primaryReviewer);

    const licenceValid = partner
      ? new Date(partner.licenceExpiryUtc).getTime() > nowMs && partner.insuranceValid
      : false;

    const checks = [
      {
        step: 1,
        name: 'Global Booking Switch Enabled',
        passed: this.globalBookingSwitch === true,
        detail: this.globalBookingSwitch ? 'Global transaction switch is ENABLED' : 'Global emergency kill-switch is ACTIVE'
      },
      {
        step: 2,
        name: 'Category Transactional & Enabled',
        passed: Boolean(category && category.transactional && !category.gatedReason),
        detail: category
          ? `Category "${category.key}" transactional=${category.transactional}`
          : 'Unknown category'
      },
      {
        step: 3,
        name: 'Category/Location Status is AVAILABLE',
        passed: category?.status === 'AVAILABLE',
        detail: `Current status is ${category?.status ?? 'UNKNOWN'} (must be AVAILABLE)`
      },
      {
        step: 4,
        name: 'Booking Mode Enabled for Category',
        passed: Boolean(listing && category?.bookingModesAllowed.includes(listing.bookingMode)),
        detail: listing ? `Mode ${listing.bookingMode} allowed` : 'Listing missing'
      },
      {
        step: 5,
        name: 'Partner Active & Verified for Category',
        passed: Boolean(partner && partner.status === 'VERIFIED' && partner.categoryKey === listing?.categoryKey),
        detail: partner ? `Partner ${partner.partnerId} status=${partner.status}` : 'Partner not found'
      },
      {
        step: 6,
        name: 'Listing Approved & Not Suspended',
        passed: Boolean(listing && listing.approved && !listing.suspended),
        detail: listing ? `approved=${listing.approved}, suspended=${listing.suspended}` : 'Listing missing'
      },
      {
        step: 7,
        name: 'Required Licence & Insurance Valid (Not Expired)',
        passed: licenceValid,
        detail: partner ? `Licence ${partner.licenceNumber} expires ${partner.licenceExpiryUtc.slice(0, 10)}` : 'No licence record'
      },
      {
        step: 8,
        name: 'Inventory Available & Server Quote Valid',
        passed: Boolean(listing && listing.availableUnits >= quantity && quantity > 0 && quoteValid),
        detail: listing
          ? `Requested=${quantity}, Available=${listing.availableUnits}, QuoteValid=${quoteValid}`
          : 'No inventory'
      },
      {
        step: 9,
        name: 'Payment Adapter Path Approved (Sandbox Ledger Mode)',
        passed: category?.key !== 'travel-wallet' && category?.key !== 'rewards',
        detail: 'Sandbox payment intent & double-entry ledger active (no false escrow claim)'
      },
      {
        step: 10,
        name: 'Versioned Cancellation/Refund Policy Attached',
        passed: Boolean(listing?.cancellationPolicyVersion && listing?.cancellationPolicySummary),
        detail: listing ? `Policy ${listing.cancellationPolicyVersion} snapshotted` : 'Missing policy'
      },
      {
        step: 11,
        name: 'Support & Incident Operations Staffed for Category',
        passed: category?.key !== 'sos' && category?.key !== 'companion-matching',
        detail: `Explicit staffed support hours (${this.supportOperatingHours})`
      },
      {
        step: 12,
        name: 'Two-Person Distinct Approvals Recorded',
        passed: twoPersonApproved,
        detail: twoPersonApproved
          ? `Verified by ${partner?.primaryReviewer} & ${partner?.secondaryApprover || 'compliance'}`
          : 'Missing distinct secondary approver for high-risk category'
      }
    ];

    const firstFailure = checks.find((c) => !c.passed);
    return {
      allowed: !firstFailure,
      checks,
      failedReason: firstFailure ? `Gate #${firstFailure.step} Failed (${firstFailure.name}): ${firstFailure.detail}` : undefined
    };
  }

  /**
   * Section 4 (#8) & Section 12.4 — Server-calculated immutable quote snapshot in integer minor units (paisa)
   */
  public createImmutableQuote(listingId: string, quantity: number, actor: string): ImmutableQuoteSnapshot {
    const listing = this.listings.find((l) => l.listingId === listingId);
    if (!listing) {
      throw new Error(`Listing ${listingId} not found.`);
    }
    const baseAmountMinor = listing.basePriceMinorNpr * quantity;
    const mandatoryFeeMinor = listing.mandatoryServiceFeeMinorNpr * quantity;
    const taxableMinor = baseAmountMinor + mandatoryFeeMinor;
    const taxAmountMinor = Math.round((taxableMinor * listing.taxRateBps) / 10000);
    const totalPayableMinor = taxableMinor + taxAmountMinor;
    const commissionBps = 1000; // 10.00% transparent platform commission in sandbox
    const platformCommissionMinor = Math.round((baseAmountMinor * commissionBps) / 10000);
    const partnerReceivableMinor = baseAmountMinor + mandatoryFeeMinor - platformCommissionMinor;

    const now = new Date();
    const expires = new Date(now.getTime() + 15 * 60 * 1000); // 15-minute quote & hold expiry
    const quoteId = `QTE-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const snapshot: ImmutableQuoteSnapshot = {
      quoteId,
      listingId: listing.listingId,
      partnerId: listing.partnerId,
      categoryKey: listing.categoryKey,
      quantity,
      currency: 'NPR',
      baseAmountMinor,
      mandatoryFeeMinor,
      taxAmountMinor,
      totalPayableMinor,
      commissionBps,
      platformCommissionMinor,
      partnerReceivableMinor,
      cancellationPolicyVersion: listing.cancellationPolicyVersion,
      cancellationPolicySummary: listing.cancellationPolicySummary,
      createdAtUtc: now.toISOString(),
      expiresAtUtc: expires.toISOString()
    };

    this.quotes.set(quoteId, snapshot);
    return snapshot;
  }

  /**
   * Section 12.2 — Append-only Double-Entry Financial Ledger (Total Debits == Total Credits)
   */
  public recordDoubleEntryCapture(
    bookingId: string,
    paymentIntentId: string,
    quote: ImmutableQuoteSnapshot,
    actor: string
  ): LedgerJournalEntry {
    const lines: LedgerJournalLine[] = [
      {
        accountId: 'PLATFORM_COLLECTION_CLEARING',
        entryType: 'DEBIT',
        amountMinor: quote.totalPayableMinor,
        currency: 'NPR'
      },
      {
        accountId: 'PARTNER_PAYABLE_LIABILITY',
        entryType: 'CREDIT',
        amountMinor: quote.partnerReceivableMinor,
        currency: 'NPR'
      },
      {
        accountId: 'PLATFORM_COMMISSION_REVENUE',
        entryType: 'CREDIT',
        amountMinor: quote.platformCommissionMinor,
        currency: 'NPR'
      },
      {
        accountId: 'TAX_VAT_PAYABLE',
        entryType: 'CREDIT',
        amountMinor: quote.taxAmountMinor,
        currency: 'NPR'
      }
    ];

    const totalDebitMinor = lines
      .filter((l) => l.entryType === 'DEBIT')
      .reduce((acc, l) => acc + l.amountMinor, 0);
    const totalCreditMinor = lines
      .filter((l) => l.entryType === 'CREDIT')
      .reduce((acc, l) => acc + l.amountMinor, 0);

    if (totalDebitMinor !== totalCreditMinor) {
      throw new Error(`CRITICAL_LEDGER_INVARIANT_VIOLATION: Debits (${totalDebitMinor}) != Credits (${totalCreditMinor})`);
    }

    const journal: LedgerJournalEntry = {
      journalId: `JRN-${Date.now()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      bookingId,
      paymentIntentId,
      eventType: 'PAYMENT_CAPTURE_ALLOCATION',
      description: `Double-entry allocation for booking ${bookingId} (Quote ${quote.quoteId})`,
      lines,
      totalDebitMinor,
      totalCreditMinor,
      balanced: totalDebitMinor === totalCreditMinor,
      createdAtUtc: new Date().toISOString(),
      actor
    };

    this.ledgerEntries.unshift(journal);
    return journal;
  }

  /**
   * Section 11.2 & 11.3 — Atomic Inventory Reservation & Separate State Machine Booking Creation
   */
  public executeAtomicBooking(params: {
    quoteId: string;
    travelerName: string;
    serviceDate: string;
    idempotencyKey: string;
    simulatePaymentSuccess: boolean;
    correlationId: string;
  }): {
    booking: BookingRecord;
    idempotentReplay: boolean;
    gateEvaluation: GateCheckResult;
  } {
    // 1. Idempotency check (Section 10.1 & 11.3)
    const existingBookingId = this.processedIdempotencyKeys.get(params.idempotencyKey);
    if (existingBookingId) {
      const existing = this.bookings.find((b) => b.bookingId === existingBookingId)!;
      return {
        booking: existing,
        idempotentReplay: true,
        gateEvaluation: this.evaluateMandatoryBookingGate(existing.listingId, existing.quantity)
      };
    }

    const quote = this.quotes.get(params.quoteId);
    if (!quote) {
      throw new Error('INVALID_QUOTE: Quote not found or not server-calculated.');
    }

    // 2. Run 12-Point Mandatory Booking Gate
    const gateEvaluation = this.evaluateMandatoryBookingGate(quote.listingId, quote.quantity, quote.quoteId);
    if (!gateEvaluation.allowed) {
      this.recordAudit({
        actor: params.travelerName,
        actorRole: 'TRAVELER',
        action: 'BOOKING_BLOCKED_BY_MANDATORY_GATE',
        targetType: 'LISTING',
        targetId: quote.listingId,
        reason: gateEvaluation.failedReason || 'Mandatory gate check failed',
        correlationId: params.correlationId
      });
      throw new Error(gateEvaluation.failedReason || 'Mandatory booking gate failed.');
    }

    const listing = this.listings.find((l) => l.listingId === quote.listingId)!;
    const partner = this.partners.find((p) => p.partnerId === listing.partnerId)!;

    // 3. Atomic inventory decrement (prevents overbooking race condition)
    if (listing.availableUnits < quote.quantity) {
      throw new Error('CONCURRENCY_INVENTORY_EXHAUSTED: Final unit was already reserved.');
    }
    listing.availableUnits -= quote.quantity;
    listing.activeHoldsCount += quote.quantity;

    const nowIso = new Date().toISOString();
    const holdExpiresIso = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const bookingId = `BKG-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 4. Separate State Machines (Rule #5: Payment success alone never confirms an Approval booking;
    // payment failure leaves booking unconfirmed and releases inventory hold)
    let bookingState: BookingState = 'REQUESTED';
    let inventoryHoldState: InventoryHoldState = 'HELD';
    let paymentState: PaymentState = 'CREATED';
    let payoutState: PayoutState = 'NOT_ELIGIBLE';
    let voucherCode: string | undefined;

    if (!params.simulatePaymentSuccess) {
      // Payment failed -> Release inventory hold immediately!
      paymentState = 'FAILED';
      bookingState = 'CANCELLED';
      inventoryHoldState = 'RELEASED';
      listing.availableUnits += quote.quantity;
      listing.activeHoldsCount -= quote.quantity;
    } else if (listing.bookingMode === 'INSTANT') {
      // Instant Booking: Gate passed + Inventory locked + Payment captured -> CONFIRMED
      paymentState = 'CAPTURED';
      inventoryHoldState = 'CONFIRMED';
      bookingState = 'CONFIRMED';
      payoutState = 'PENDING_REVIEW';
      listing.activeHoldsCount -= quote.quantity;
      voucherCode = `PNP-VCH-${Math.floor(1000 + Math.random() * 9000)}`;
      this.recordDoubleEntryCapture(bookingId, `PI-${bookingId}`, quote, params.travelerName);
    } else {
      // Approval Booking (Rule #5): Even though payment authorization succeeded, booking is PENDING_PARTNER, NOT CONFIRMED!
      paymentState = 'AUTHORIZED';
      inventoryHoldState = 'HELD';
      bookingState = 'PENDING_PARTNER';
      payoutState = 'NOT_ELIGIBLE';
    }

    const record: BookingRecord = {
      bookingId,
      tripId: 'TRP-NEPAL-2026-01',
      quoteId: quote.quoteId,
      listingId: listing.listingId,
      listingTitle: listing.title,
      partnerId: partner.partnerId,
      partnerName: partner.organizationName,
      categoryKey: listing.categoryKey,
      travelerId: 'TRV-001',
      travelerName: params.travelerName,
      bookingMode: listing.bookingMode,
      quantity: quote.quantity,
      serviceDate: params.serviceDate,
      bookingState,
      inventoryHoldState,
      paymentState,
      payoutState,
      quoteSnapshot: quote,
      idempotencyKey: params.idempotencyKey,
      holdExpiresAtUtc: holdExpiresIso,
      createdAtUtc: nowIso,
      updatedAtUtc: nowIso,
      voucherCode
    };

    this.bookings.unshift(record);
    this.processedIdempotencyKeys.set(params.idempotencyKey, bookingId);

    this.recordAudit({
      actor: params.travelerName,
      actorRole: 'TRAVELER',
      action: `BOOKING_${bookingState}`,
      targetType: 'BOOKING',
      targetId: bookingId,
      reason: `Mode=${listing.bookingMode}, Booking=${bookingState}, Inventory=${inventoryHoldState}, Payment=${paymentState}`,
      correlationId: params.correlationId
    });

    return {
      booking: record,
      idempotentReplay: false,
      gateEvaluation
    };
  }
}

export const domainStore = new PheriNepalDomainStore();
export { CANONICAL_CATEGORIES, CANONICAL_DASHBOARDS, MASTER_PHASE_REGISTER };
export type { CategoryStatus, LifecycleStage };
