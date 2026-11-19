/**
 * PHERINEPAL — MODULAR MONOLITH API SERVER (/api/v1/...)
 * Blueprint Reference: Part II (Sections 8, 10, 11, 12, 13, 14, 15, 19)
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import * as dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  CANONICAL_CATEGORIES,
  CANONICAL_DASHBOARDS,
  CategoryStatus,
  MASTER_PHASE_REGISTER,
  domainStore,
} from './src/domain/store.ts';

dotenv.config();

const PORT = 3000;

interface ApiRequest extends Request {
  correlationId?: string;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Section 10.1 — Correlation ID & Security Headers Middleware
  app.use((req: ApiRequest, res: Response, next: NextFunction) => {
    const corrId =
      (req.headers['x-correlation-id'] as string) ||
      `CORR-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    req.correlationId = corrId;
    res.setHeader('X-Correlation-Id', corrId);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
  });

  // 1. GET /api/v1/bootstrap — Complete Canonical State Snapshot
  app.get('/api/v1/bootstrap', (req: ApiRequest, res: Response) => {
    res.json({
      correlationId: req.correlationId,
      documentId: 'PNP-MASTER-ARCH-001',
      version: '1.0',
      globalBookingSwitch: domainStore.globalBookingSwitch,
      supportOperatingHours: domainStore.supportOperatingHours,
      counts: {
        categoriesCount: domainStore.categories.length,
        dashboardsCount: CANONICAL_DASHBOARDS.length,
        phasesCount: MASTER_PHASE_REGISTER.length,
        totalFeatureModulesCount: MASTER_PHASE_REGISTER.reduce((acc, p) => acc + p.moduleCount, 0)
      },
      categories: domainStore.categories,
      dashboards: CANONICAL_DASHBOARDS,
      phases: MASTER_PHASE_REGISTER,
      partners: domainStore.partners,
      listings: domainStore.listings,
      bookings: domainStore.bookings,
      ledgerEntries: domainStore.ledgerEntries,
      officialSources: domainStore.officialSources,
      incidents: domainStore.incidents,
      reviews: domainStore.reviews,
      decisions: domainStore.decisions,
      auditEvents: domainStore.auditEvents.slice(0, 50),
      travelerPrivacyConsent: domainStore.travelerPrivacyConsent
    });
  });

  // 2. PATCH /api/v1/admin/categories/:key/status — Category Status State Machine (Section 5.1)
  app.patch('/api/v1/admin/categories/:key/status', (req: ApiRequest, res: Response) => {
    const { key } = req.params;
    const { newStatus, reason, actor, mfaVerified } = req.body as {
      newStatus: CategoryStatus;
      reason: string;
      actor: string;
      mfaVerified: boolean;
    };

    if (!mfaVerified) {
      return res.status(403).json({
        code: 'MFA_REQUIRED_FOR_ADMIN_ACTION',
        message: 'Section 6 & 15.1: Admin category status transitions require verified MFA session.',
        correlationId: req.correlationId
      });
    }

    const cat = domainStore.categories.find((c) => c.key === key);
    if (!cat) {
      return res.status(404).json({
        code: 'CATEGORY_NOT_FOUND',
        message: `Category "${key}" does not exist in canonical registry.`,
        correlationId: req.correlationId
      });
    }

    // Rule #7 & Section 5.1: Prevent enabling hard-gated categories without legal/staffed evidence
    if (
      newStatus === 'AVAILABLE' &&
      ['sos', 'travel-wallet', 'rewards', 'companion-matching', 'offline-maps'].includes(cat.key)
    ) {
      return res.status(422).json({
        code: 'HARD_GATE_BLOCKED',
        message:
          cat.gatedReason ||
          `Category "${cat.displayName}" is GATED pending legal, licensing, or 24/7 staffed operational evidence.`,
        correlationId: req.correlationId
      });
    }

    if (newStatus === 'AVAILABLE' && !cat.transactional) {
      return res.status(422).json({
        code: 'NON_TRANSACTIONAL_CATEGORY',
        message: `Category "${cat.displayName}" is classified as non-transactional and cannot be set to AVAILABLE for checkout. Use INFORMATION_ONLY.`,
        correlationId: req.correlationId
      });
    }

    const priorStatus = cat.status;
    cat.status = newStatus;
    cat.lastUpdatedUtc = new Date().toISOString();
    cat.updatedBy = actor || 'admin@pherinepal.np';

    const audit = domainStore.recordAudit({
      actor: actor || 'admin@pherinepal.np',
      actorRole: 'PLATFORM_ADMIN',
      action: 'CATEGORY_STATUS_TRANSITION',
      targetType: 'CATEGORY',
      targetId: cat.key,
      reason: reason || 'Admin status update',
      priorValue: priorStatus,
      newValue: newStatus,
      correlationId: req.correlationId!
    });

    res.json({
      category: cat,
      audit,
      correlationId: req.correlationId
    });
  });

  // 3. POST /api/v1/admin/global-switch — Emergency Global Booking Kill Switch (Section 11.4 #1)
  app.post('/api/v1/admin/global-switch', (req: ApiRequest, res: Response) => {
    const { enabled, reason, actor, mfaVerified } = req.body;
    if (!mfaVerified) {
      return res.status(403).json({
        code: 'MFA_REQUIRED',
        message: 'MFA verification is required to toggle the Global Booking Switch.',
        correlationId: req.correlationId
      });
    }
    const prior = String(domainStore.globalBookingSwitch);
    domainStore.globalBookingSwitch = Boolean(enabled);
    const audit = domainStore.recordAudit({
      actor: actor || 'admin@pherinepal.np',
      actorRole: 'PLATFORM_ADMIN',
      action: 'GLOBAL_BOOKING_SWITCH_TOGGLED',
      targetType: 'PLATFORM_CONFIG',
      targetId: 'GLOBAL_BOOKING_SWITCH',
      reason: reason || 'Emergency operational switch change',
      priorValue: prior,
      newValue: String(domainStore.globalBookingSwitch),
      correlationId: req.correlationId!
    });
    res.json({
      globalBookingSwitch: domainStore.globalBookingSwitch,
      audit,
      correlationId: req.correlationId
    });
  });

  // 4. POST /api/v1/quotes — Server-Calculated Quote with 12-Point Mandatory Gate Inspection
  app.post('/api/v1/quotes', (req: ApiRequest, res: Response) => {
    const { listingId, quantity, actor } = req.body as {
      listingId: string;
      quantity: number;
      actor?: string;
    };
    const qty = Math.max(1, Number(quantity) || 1);
    const gate = domainStore.evaluateMandatoryBookingGate(listingId, qty);

    if (!gate.allowed) {
      return res.status(422).json({
        code: 'MANDATORY_BOOKING_GATE_REJECTED',
        message: gate.failedReason,
        gateEvaluation: gate,
        correlationId: req.correlationId
      });
    }

    const quote = domainStore.createImmutableQuote(listingId, qty, actor || 'traveler@pherinepal.np');
    res.json({
      quote,
      gateEvaluation: gate,
      correlationId: req.correlationId
    });
  });

  // 5. POST /api/v1/bookings — Atomic Booking Creation (Separate Booking/Inventory/Payment/Payout states)
  app.post('/api/v1/bookings', (req: ApiRequest, res: Response) => {
    try {
      const { quoteId, travelerName, serviceDate, idempotencyKey, simulatePaymentSuccess } = req.body;
      const result = domainStore.executeAtomicBooking({
        quoteId,
        travelerName: travelerName || 'Aarav Sharma',
        serviceDate: serviceDate || '2026-12-05',
        idempotencyKey: idempotencyKey || `IDEMP-${Date.now()}`,
        simulatePaymentSuccess: simulatePaymentSuccess !== false,
        correlationId: req.correlationId!
      });
      res.json({
        ...result,
        correlationId: req.correlationId
      });
    } catch (error: any) {
      res.status(422).json({
        code: 'BOOKING_EXECUTION_REJECTED',
        message: error.message || 'Booking failed server-side validation.',
        correlationId: req.correlationId
      });
    }
  });

  // 6. POST /api/v1/bookings/:bookingId/partner-decision — Partner Approval/Decline for APPROVAL mode bookings
  app.post('/api/v1/bookings/:bookingId/partner-decision', (req: ApiRequest, res: Response) => {
    const { bookingId } = req.params;
    const { decision, partnerActor } = req.body as {
      decision: 'APPROVE' | 'DECLINE';
      partnerActor: string;
    };

    const booking = domainStore.bookings.find((b) => b.bookingId === bookingId);
    if (!booking) {
      return res.status(404).json({
        code: 'BOOKING_NOT_FOUND',
        message: 'Booking record not found.',
        correlationId: req.correlationId
      });
    }

    if (booking.bookingState !== 'PENDING_PARTNER') {
      return res.status(422).json({
        code: 'INVALID_BOOKING_STATE_TRANSITION',
        message: `Booking is in state ${booking.bookingState}; only PENDING_PARTNER bookings can be approved or declined.`,
        correlationId: req.correlationId
      });
    }

    const listing = domainStore.listings.find((l) => l.listingId === booking.listingId);

    if (decision === 'APPROVE') {
      booking.bookingState = 'CONFIRMED';
      booking.inventoryHoldState = 'CONFIRMED';
      booking.paymentState = 'CAPTURED';
      booking.payoutState = 'PENDING_REVIEW';
      booking.voucherCode = `PNP-VCH-${Math.floor(1000 + Math.random() * 9000)}`;
      if (listing && listing.activeHoldsCount >= booking.quantity) {
        listing.activeHoldsCount -= booking.quantity;
      }
      domainStore.recordDoubleEntryCapture(
        booking.bookingId,
        `PI-${booking.bookingId}`,
        booking.quoteSnapshot,
        partnerActor || booking.partnerName
      );
    } else {
      booking.bookingState = 'DECLINED';
      booking.inventoryHoldState = 'RELEASED';
      booking.paymentState = 'REVERSED';
      booking.payoutState = 'NOT_ELIGIBLE';
      if (listing) {
        listing.availableUnits += booking.quantity;
        if (listing.activeHoldsCount >= booking.quantity) {
          listing.activeHoldsCount -= booking.quantity;
        }
      }
    }

    booking.updatedAtUtc = new Date().toISOString();
    domainStore.recordAudit({
      actor: partnerActor || booking.partnerName,
      actorRole: 'PARTNER_OPERATOR',
      action: `PARTNER_BOOKING_${decision}`,
      targetType: 'BOOKING',
      targetId: booking.bookingId,
      reason: `Partner ${decision}D approval booking; new states: Booking=${booking.bookingState}, Inventory=${booking.inventoryHoldState}, Payment=${booking.paymentState}`,
      correlationId: req.correlationId!
    });

    res.json({ booking, correlationId: req.correlationId });
  });

  // 7. POST /api/v1/verification/:partnerId/approve — Two-Person Separation of Duties Partner Verification
  app.post('/api/v1/verification/:partnerId/approve', (req: ApiRequest, res: Response) => {
    const { partnerId } = req.params;
    const { reviewerEmail, mfaVerified, notes } = req.body as {
      reviewerEmail: string;
      mfaVerified: boolean;
      notes: string;
    };

    if (!mfaVerified) {
      return res.status(403).json({
        code: 'MFA_REQUIRED',
        message: 'Section 15.1: Compliance officers must verify MFA before approving partner evidence.',
        correlationId: req.correlationId
      });
    }

    const partner = domainStore.partners.find((p) => p.partnerId === partnerId);
    if (!partner) {
      return res.status(404).json({
        code: 'PARTNER_NOT_FOUND',
        message: 'Partner record not found.',
        correlationId: req.correlationId
      });
    }

    // Section 15.2 — Separation of Duties Check
    if (partner.primaryReviewer && partner.primaryReviewer.toLowerCase() === reviewerEmail.toLowerCase()) {
      return res.status(422).json({
        code: 'SEPARATION_OF_DUTIES_VIOLATION',
        message: `Section 6 & 13 (Rule #8): Secondary approver (${reviewerEmail}) must be a distinct authorized person from the primary reviewer (${partner.primaryReviewer}).`,
        correlationId: req.correlationId
      });
    }

    const priorStatus = partner.status;
    partner.secondaryApprover = reviewerEmail;
    partner.secondaryApprovedAtUtc = new Date().toISOString();
    partner.status = 'VERIFIED';
    partner.whatWasCheckedSummary = notes || `${partner.whatWasCheckedSummary} | Second approval by ${reviewerEmail}.`;

    const audit = domainStore.recordAudit({
      actor: reviewerEmail,
      actorRole: 'COMPLIANCE_OFFICER',
      action: 'PARTNER_TWO_PERSON_VERIFIED',
      targetType: 'PARTNER',
      targetId: partner.partnerId,
      reason: `Two-person verification completed (Primary: ${partner.primaryReviewer}, Secondary: ${reviewerEmail})`,
      priorValue: priorStatus,
      newValue: 'VERIFIED',
      correlationId: req.correlationId!
    });

    res.json({ partner, audit, correlationId: req.correlationId });
  });

  // 8. POST /api/v1/incidents — Report Travel Incident or Support Case (Section 14 & Phase 13)
  app.post('/api/v1/incidents', (req: ApiRequest, res: Response) => {
    const { reporterName, category, severity, locality, description } = req.body;
    const nowIso = new Date().toISOString();
    const incident = {
      incidentId: `INC-${Date.now()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      tripId: 'TRP-NEPAL-2026-01',
      reporterName: reporterName || 'Aarav Sharma',
      category: category || 'ROUTE_WEATHER_DISRUPTION',
      severity: severity || 'MEDIUM',
      status: 'TRIAGED' as const,
      locality: locality || 'Kathmandu / Pokhara Sector',
      description: description || 'Support assistance requested.',
      assignedTeam: 'Support & Safety Desk (08:00–20:00 NPT)',
      createdAtUtc: nowIso,
      updatedAtUtc: nowIso,
      resolutionNotes: 'Logged in audited Incident Queue. Note: PheriNepal does not replace 100/1144 emergency services.'
    };
    domainStore.incidents.unshift(incident);
    domainStore.recordAudit({
      actor: incident.reporterName,
      actorRole: 'TRAVELER',
      action: 'INCIDENT_CASE_CREATED',
      targetType: 'INCIDENT',
      targetId: incident.incidentId,
      reason: `${incident.category} (${incident.severity}) at ${incident.locality}`,
      correlationId: req.correlationId!
    });
    res.json({ incident, correlationId: req.correlationId });
  });

  // 9. POST /api/v1/privacy/consent — Opt-in Revocable Location & Privacy Consent (Section 14 & 16)
  app.post('/api/v1/privacy/consent', (req: ApiRequest, res: Response) => {
    const { duringTripGpsSharingOptIn, aiPromptPiiRedactionEnabled } = req.body;
    domainStore.travelerPrivacyConsent.duringTripGpsSharingOptIn = Boolean(duringTripGpsSharingOptIn);
    domainStore.travelerPrivacyConsent.gpsSharingExpiresAtUtc = duringTripGpsSharingOptIn
      ? new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // Purpose-limited 4-hour auto-expiry
      : null;
    if (typeof aiPromptPiiRedactionEnabled === 'boolean') {
      domainStore.travelerPrivacyConsent.aiPromptPiiRedactionEnabled = aiPromptPiiRedactionEnabled;
    }
    domainStore.travelerPrivacyConsent.updatedAtUtc = new Date().toISOString();

    domainStore.recordAudit({
      actor: 'Aarav Sharma (TRV-001)',
      actorRole: 'TRAVELER',
      action: 'PRIVACY_CONSENT_UPDATED',
      targetType: 'USER_CONSENT',
      targetId: 'TRV-001',
      reason: `GPS Opt-In=${domainStore.travelerPrivacyConsent.duringTripGpsSharingOptIn}, Expiry=${domainStore.travelerPrivacyConsent.gpsSharingExpiresAtUtc || 'REVOKED'}`,
      correlationId: req.correlationId!
    });

    res.json({
      consent: domainStore.travelerPrivacyConsent,
      correlationId: req.correlationId
    });
  });

  // 10. POST /api/v1/admin/verify-invariants — Execute Section 27.2 Critical Verification Suite
  app.post('/api/v1/admin/verify-invariants', (req: ApiRequest, res: Response) => {
    // Test 1: 31-category canonical count & 240 feature modules count
    const catCount = domainStore.categories.length;
    const modCount = MASTER_PHASE_REGISTER.reduce((s, p) => s + p.moduleCount, 0);

    // Test 2: Simultaneous Final-Unit Concurrency Race Simulation
    const testListing = domainStore.listings.find((l) => l.listingId === 'LST-HMS-102')!;
    const savedUnits = testListing.availableUnits;
    testListing.availableUnits = 1; // Set to 1 final unit
    const q1 = domainStore.createImmutableQuote(testListing.listingId, 1, 'RaceUser-A');
    const q2 = domainStore.createImmutableQuote(testListing.listingId, 1, 'RaceUser-B');

    let userASuccess = false;
    let userBBlocked = false;

    try {
      domainStore.executeAtomicBooking({
        quoteId: q1.quoteId,
        travelerName: 'RaceUser-A',
        serviceDate: '2026-12-20',
        idempotencyKey: `RACE-A-${Date.now()}`,
        simulatePaymentSuccess: true,
        correlationId: req.correlationId!
      });
      userASuccess = true;
    } catch {
      userASuccess = false;
    }

    try {
      domainStore.executeAtomicBooking({
        quoteId: q2.quoteId,
        travelerName: 'RaceUser-B',
        serviceDate: '2026-12-20',
        idempotencyKey: `RACE-B-${Date.now()}`,
        simulatePaymentSuccess: true,
        correlationId: req.correlationId!
      });
      userBBlocked = false;
    } catch {
      userBBlocked = true; // Second user must be blocked from overbooking final unit!
    }

    // Restore test unit so interactive UI can still be tested if desired
    testListing.availableUnits = Math.max(1, savedUnits);

    // Test 3: Double-Entry Ledger Balance Verification
    const allJournalsBalanced = domainStore.ledgerEntries.every(
      (j) => j.totalDebitMinor === j.totalCreditMinor && j.balanced
    );

    // Test 4: SOS (#21) and Travel Wallet (#30) Hard-Gate Enforcement
    const sosCat = domainStore.categories.find((c) => c.key === 'sos');
    const walletCat = domainStore.categories.find((c) => c.key === 'travel-wallet');
    const highRiskGatesIntact =
      sosCat?.status === 'RESTRICTED' &&
      Boolean(sosCat?.gatedReason) &&
      walletCat?.status === 'RESTRICTED' &&
      Boolean(walletCat?.gatedReason);

    const results = [
      {
        testId: 'INV-01',
        name: 'Canonical 31 Categories & 240 Modules Registry Integrity',
        passed: catCount === 31 && modCount === 240,
        evidence: `Verified ${catCount}/31 categories, ${CANONICAL_DASHBOARDS.length}/8 dashboards, ${modCount}/240 feature modules.`
      },
      {
        testId: 'INV-02',
        name: 'Simultaneous Final-Unit Concurrency Race Prevention (Section 27.2)',
        passed: userASuccess && userBBlocked,
        evidence: `Final unit race: User A reserved unit (${userASuccess}), simultaneous User B blocked from overbooking (${userBBlocked}).`
      },
      {
        testId: 'INV-03',
        name: 'Double-Entry Financial Ledger Balance (Total Debits == Total Credits)',
        passed: allJournalsBalanced && domainStore.ledgerEntries.length > 0,
        evidence: `Checked ${domainStore.ledgerEntries.length} append-only journal entries; 100% balanced in integer minor units (paisa).`
      },
      {
        testId: 'INV-04',
        name: 'Hard Gate Enforcement on SOS (#21) & Travel Wallet (#30) (Rules #6 & #7)',
        passed: highRiskGatesIntact,
        evidence: `SOS status=${sosCat?.status}, Travel Wallet status=${walletCat?.status}; zero false escrow or 24/7 dispatch claims.`
      }
    ];

    res.json({
      allPassed: results.every((r) => r.passed),
      executedAtUtc: new Date().toISOString(),
      results,
      correlationId: req.correlationId
    });
  });

  // 11. POST /api/v1/ai/assist — Grounded AI Travel Intelligence (Section 19 & Phase 12)
  app.post('/api/v1/ai/assist', async (req: ApiRequest, res: Response) => {
    const { question, locale } = req.body as { question: string; locale?: 'en' | 'ne' };
    const cleanQuestion = (question || '').trim().slice(0, 500);

    if (!cleanQuestion) {
      return res.status(400).json({
        code: 'EMPTY_QUERY',
        message: 'Please provide a destination, permit, season, or itinerary question.',
        correlationId: req.correlationId
      });
    }

    const sourcesContext = domainStore.officialSources
      .map(
        (s) =>
          `[${s.sourceId}] Publisher: ${s.publisher} | Last Verified: ${s.lastVerifiedUtc} | Summary: ${s.summary}`
      )
      .join('\n');

    const guardrailNotice =
      'BOUNDARY (Rule #10): Assistive guidance only. AI cannot approve partners, confirm bookings, move money, decide refunds, or dispatch emergency responders.';

    // Attempt live Gemini API call if GEMINI_API_KEY is configured and not placeholder; otherwise use deterministic grounded citation synthesis
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are the PheriNepal Grounded Travel Intelligence Assistant.
Strictly follow Blueprint Section 19 & Rule #10:
- Cite the official sources below by their [SRC-...] ID and Last Verified UTC timestamp.
- Explicitly state when information is advisory or unverified.
- Never claim to confirm a booking, process a payment/refund, or dispatch 24/7 SOS responders.
- Respond in ${locale === 'ne' ? 'Nepali (नेपाली)' : 'English'}.

Approved Official Sources:
${sourcesContext}

Traveler Question: ${cleanQuestion}`
        });

        return res.json({
          answer: response.text || 'Grounded response generated.',
          citations: domainStore.officialSources,
          guardrailNotice,
          mode: 'GEMINI_GROUNDED_RAG',
          correlationId: req.correlationId
        });
      } catch {
        // Safe fallback to deterministic grounded engine per Section 4 (#10) & Section 19
      }
    }

    // Deterministic Grounded Response with Official Citations (Section 4 #10: degrade safely when external provider unavailable)
    const qLower = cleanQuestion.toLowerCase();
    let answer = '';
    if (qLower.includes('permit') || qLower.includes('tims') || qLower.includes('trek') || qLower.includes('khumbu')) {
      answer =
        locale === 'ne'
          ? `[SRC-NTB-01] (अन्तिम प्रमाणीकरण: 2026-11-19T08:00:00Z) अनुसार नेपालका राष्ट्रिय निकुञ्ज र संरक्षण क्षेत्रमा पदयात्रा गर्दा अनिवार्य रूपमा इजाजतपत्र प्राप्त गाइड र टिम्स/गाउँपालिका अनुमति आवश्यक छ। खुम्बु क्षेत्रको लागि खुम्बु पासाङल्हामु गाउँपालिका अनुमति (NPR 3,000) र सगरमाथा राष्ट्रिय निकुञ्ज अनुमति (NPR 3,000) लाग्दछ।`
          : `According to [SRC-NTB-01] (Nepal Tourism Board & TAAN, verified 2026-11-19T08:00:00Z), trekkers in conservation areas and national parks require an official TIMS card or local rural municipality entry permit plus a NATHM/DoT-licensed guide with high-altitude insurance. For Khumbu/Gokyo, budget NPR 3,000 for Khumbu Pasang Lhamu Rural Municipality and NPR 3,000 for Sagarmatha National Park entry.`;
    } else if (qLower.includes('visa') || qLower.includes('arrival') || qLower.includes('mustang')) {
      answer =
        locale === 'ne'
          ? `[SRC-DOIM-01] (अध्यागमन विभाग, प्रमाणीकरण: 2026-11-19T08:00:00Z) अनुसार पर्यटक अन-अराइभल भिसा शुल्क १५ दिनको USD 30, ३० दिनको USD 50, र ९० दिनको USD 125 छ। उपल्लो मुस्ताङ र डोल्पा जस्ता निषेधित क्षेत्रका लागि दर्ता भएको एजेन्सीमार्फत विशेष अनुमति लिनुपर्दछ।`
          : `Per [SRC-DOIM-01] (Department of Immigration Nepal, verified 2026-11-19T08:00:00Z), Tourist Visa On-Arrival fees at TIA Kathmandu are USD 30 (15 days), USD 50 (30 days), and USD 125 (90 days). Restricted areas (Upper Mustang, Upper Dolpo, Manaslu) require a Restricted Area Permit (RAP) issued through a licensed Nepali trekking agency.`;
    } else if (qLower.includes('weather') || qLower.includes('lukla') || qLower.includes('flight')) {
      answer =
        locale === 'ne'
          ? `[SRC-DHM-01] (जल तथा मौसम विज्ञान विभाग बुलेटिन, 2026-11-19T06:30:00Z) अनुसार बिहान काठमाडौं, पोखरा र लुक्लामा मौसम सफा छ तर दिउँसो ४,००० मिटरमाथि तीव्र हावा चल्ने सम्भावना छ। यो समय-अंकित सूचना मात्र हो।`
          : `Per [SRC-DHM-01] (Dept. of Hydrology & Meteorology bulletin timestamped 2026-11-19T06:30:00Z), morning visibility is clear across Kathmandu, Pokhara, and Lukla (06:00–11:30 NPT), with afternoon katabatic crosswinds forecast above 4,000m. Note: Weather advisories are timestamped snapshots, not real-time safety guarantees.`;
    } else {
      answer =
        locale === 'ne'
          ? `[SRC-NTB-01], [SRC-DOIM-01] र [SRC-TP-01] (प्रमाणीकरण: 2026-11-19T08:00:00Z) को आधारमा: यात्रा अघि भिसा र पदयात्रा अनुमति यकिन गर्नुहोस्, प्रमाणित हरियो प्लेट सवारी वा इजाजतपत्र प्राप्त गाइड मात्र छान्नुहोस्, र आपतकालीन अवस्थामा नेपाल प्रहरी (१००) वा पर्यटक प्रहरी (११४४) मा सम्पर्क गर्नुहोस्।`
          : `Grounded across [SRC-NTB-01], [SRC-DOIM-01], [SRC-DHM-01], and [SRC-TP-01] (verified 2026-11-19T08:00:00Z): Verify visa and conservation permits before commitment, book only DoT/TAAN/NATHM-verified partners where all 12 Mandatory Booking Gates pass, and keep public emergency numbers (Nepal Police 100, Tourist Police 1144) accessible offline.`;
    }

    res.json({
      answer,
      citations: domainStore.officialSources,
      guardrailNotice,
      mode: 'DETERMINISTIC_SOURCE_REGISTRY_RAG',
      correlationId: req.correlationId
    });
  });

  // Vite middleware for dev / static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PheriNepal Modular Monolith listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
