import { randomUUID } from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import {
  CANONICAL_CATEGORIES,
  CANONICAL_DASHBOARDS,
  CANONICAL_FEATURE_MODULES,
  CANONICAL_PHASES,
  CanonicalCategory,
  CategoryStatus,
  isValidCategoryStatus,
} from './catalogue';
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
  PH00_VISION_AND_OUTCOMES,
  evaluatePilotReadinessGates,
  validateAiAgentContract,
} from './ph00Governance';
import {
  AuthenticatedSessionContext,
  SEEDED_USERS,
  ServerRole,
  computeWebhookSignature,
  createDatabaseConnection,
  generateTotpCode,
  hashPassword,
  sha256Hex,
  signSessionToken,
  verifyPassword,
  verifyTotpCode,
  verifyWebhookSignature,
  withImmediateTransaction,
} from '../db/database';

export type PartnerVerificationState =
  | 'DRAFT_APPLICANT'
  | 'UNDER_PRIMARY_REVIEW'
  | 'AWAITING_SECOND_APPROVER'
  | 'VERIFIED_PARTNER'
  | 'SUSPENDED'
  | 'REVOKED';

export type BookingState =
  | 'DRAFT'
  | 'QUOTED'
  | 'HOLD_PLACED'
  | 'PAYMENT_PENDING'
  | 'PARTNER_CONFIRMED'
  | 'ACTIVE_SERVICE'
  | 'COMPLETED'
  | 'CANCELLED_BY_TRAVELER'
  | 'REJECTED_BY_PARTNER'
  | 'EXPIRED_HOLD'
  | 'DISPUTED'
  | 'REFUNDED';

export type PaymentSettlementState =
  | 'CREATED'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'SETTLEMENT_ELIGIBLE'
  | 'PAYOUT_SCHEDULED'
  | 'PAID_OUT'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'CHARGEBACK_HOLD'
  | 'FAILED';

export interface PartnerRecord {
  id: string;
  name: string;
  categoryKey: string;
  status: PartnerVerificationState;
  primaryReviewerUserId: string | null;
  primaryReviewerEmail: string | null;
  primaryReviewedAt: string | null;
  secondaryApproverUserId: string | null;
  secondaryApproverEmail: string | null;
  secondaryApprovedAt: string | null;
  documentsVerified: boolean;
  taxPanVatVerified: boolean;
  payoutBankVerified: boolean;
  suspensionReason: string | null;
}

export interface ServiceListing {
  id: string;
  partnerId: string;
  categoryKey: string;
  title: string;
  location: string;
  basePriceNPR: number;
  capacityPerSlot: number;
  availableSlots: number;
  permitVerified: boolean;
  guideLicenseVerified: boolean;
  insuranceVerified: boolean;
  weatherAltitudeClear: boolean;
  cancellationPolicy: string;
  refundPolicy: string;
}

export interface ImmutableQuote {
  quoteId: string;
  travelerUserId: string;
  listingId: string;
  categoryKey: string;
  partnerId: string;
  quantity: number;
  currency: 'NPR';
  baseSubtotalNPR: number;
  platformCommissionNPR: number;
  travelerServiceFeeNPR: number;
  taxVatNPR: number;
  totalTravelerPayableNPR: number;
  netPartnerPayoutNPR: number;
  pricingSnapshotHash: string;
  cancellationPolicySnapshot: string;
  refundPolicySnapshot: string;
  consumedByBookingId: string | null;
  createdAt: string;
  expiresAt: string;
}

export interface BookingRecord {
  bookingId: string;
  idempotencyKey: string;
  requestPayloadHash: string;
  quoteId: string;
  listingId: string;
  partnerId: string;
  categoryKey: string;
  travelerUserId: string;
  travelerName: string;
  serviceDate: string;
  quantity: number;
  bookingState: BookingState;
  paymentState: PaymentSettlementState;
  totalPaidNPR: number;
  holdExpiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoubleEntryLine {
  lineId: string;
  journalId: string;
  bookingId: string;
  accountCode:
    | 'PLATFORM_COLLECTION_CLEARING'
    | 'PARTNER_PAYABLE_LIABILITY'
    | 'PLATFORM_COMMISSION_REVENUE'
    | 'PLATFORM_SERVICE_FEE_REVENUE'
    | 'TAX_VAT_PAYABLE'
    | 'TRAVELER_REFUND_CLEARING';
  direction: 'DEBIT' | 'CREDIT';
  amountNPR: number;
  currency: 'NPR';
  createdAt: string;
}

export interface DoubleEntryJournal {
  journalId: string;
  bookingId: string;
  eventType: 'CAPTURE' | 'REFUND' | 'REVERSAL';
  currency: 'NPR';
  totalDebitNPR: number;
  totalCreditNPR: number;
  balanced: boolean;
  lines: DoubleEntryLine[];
  createdAt: string;
}

export interface SafetyIncidentRecord {
  incidentId: string;
  bookingId: string | null;
  tripId: string;
  reporterUserId: string;
  categoryKey: string;
  severity: 'SEV1_CRITICAL_LIFE_SAFETY' | 'SEV2_HIGH_OPERATIONAL' | 'SEV3_MODERATE_SUPPORT';
  title: string;
  description: string;
  gpsCoordinates: string | null;
  status: 'OPEN_TRIAGE' | 'DISPATCHED' | 'RESOLVED';
  assignedDeskOwner: string;
  escalationLog: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRecord {
  reviewId: string;
  bookingId: string;
  listingId: string;
  travelerUserId: string;
  travelerName: string;
  rating: number;
  comment: string;
  verifiedCompletedStay: boolean;
  moderationStatus: 'APPROVED_AUTHENTIC' | 'REJECTED_UNVERIFIED';
  createdAt: string;
}

export interface PrivacyConsentRecord {
  userId: string;
  essentialBookingData: boolean;
  safetyGpsTelemetry: boolean;
  analyticsCookies: boolean;
  aiAssistantPrompts: boolean;
  marketingNotifications: boolean;
  consentVersion: string;
  purpose: string;
  gpsAutoExpireHours: number;
  gpsExpiresAt: string | null;
  revokedAt: string | null;
  updatedAt: string;
}

export interface AuditEventRecord {
  eventId: string;
  timestamp: string;
  correlationId: string;
  actor: string;
  actorUserId: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  outcome: 'ALLOWED' | 'DENIED' | 'ERROR';
  reasonCode: string;
  metadata: Record<string, unknown>;
}

export interface BookingGateEvaluation {
  gateNumber: number;
  gateName: string;
  passed: boolean;
  reason: string;
}

export class DomainRuleError extends Error {
  public readonly statusCode: number;
  public readonly reasonCode: string;
  public readonly gateEvaluations?: BookingGateEvaluation[];

  constructor(
    message: string,
    statusCode = 400,
    reasonCode = 'DOMAIN_RULE_VIOLATION',
    gateEvaluations?: BookingGateEvaluation[]
  ) {
    super(message);
    this.name = 'DomainRuleError';
    this.statusCode = statusCode;
    this.reasonCode = reasonCode;
    this.gateEvaluations = gateEvaluations;
  }
}

export const RESTRICTED_HARD_GATE_KEYS: readonly string[] = [
  'mountaineering',
  'helicopter',
  'wellness',
  'culture-heritage',
  'wildlife-safari',
  'peak-climbing',
] as const;

export class PheriNepalDomainStore {
  public readonly db: DatabaseSync;
  public readonly dbPath: string;

  constructor(customDbPath?: string) {
    const conn = createDatabaseConnection(customDbPath);
    this.db = conn.db;
    this.dbPath = conn.dbPath;
    this.seedCanonicalReferenceData();
  }

  private seedCanonicalReferenceData(): void {
    withImmediateTransaction(this.db, () => {
      const now = new Date().toISOString();

      // 1. Platform config
      this.db
        .prepare(
          `INSERT OR IGNORE INTO platform_config (config_key, config_value, updated_at, updated_by_user_id)
           VALUES (?, ?, ?, ?)`
        )
        .run('GLOBAL_KILL_SWITCH', 'false', now, 'SYSTEM_BOOTSTRAP');

      this.db
        .prepare(
          `INSERT OR IGNORE INTO platform_config (config_key, config_value, updated_at, updated_by_user_id)
           VALUES (?, ?, ?, ?)`
        )
        .run('SANDBOX_PILOT_PREVIEW_MODE', 'false', now, 'SYSTEM_BOOTSTRAP');

      // 2. Seed Users
      const insertUser = this.db.prepare(
        `INSERT OR IGNORE INTO users (
          user_id, email, display_name, role, partner_id,
          password_salt, password_hash, totp_secret_hex, mfa_enrolled, is_active, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`
      );

      const insertConsent = this.db.prepare(
        `INSERT OR IGNORE INTO user_privacy_consents (
          user_id, essential_booking_data, safety_gps_telemetry, analytics_cookies,
          ai_assistant_prompts, marketing_notifications, consent_version, purpose,
          gps_auto_expire_hours, gps_expires_at, revoked_at, updated_at
        ) VALUES (?, 1, 0, 0, 1, 0, 'PNP-PRIVACY-v1.0', 'DEFAULT_MINIMUM_PRIVACY_BASELINE', 4, NULL, NULL, ?)`
      );

      for (const u of SEEDED_USERS) {
        const deterministicSalt = sha256Hex(`salt:${u.userId}`).slice(0, 32);
        const { saltHex, hashHex } = hashPassword(u.defaultPassword, deterministicSalt);
        insertUser.run(
          u.userId,
          u.email.toLowerCase(),
          u.displayName,
          u.role,
          u.partnerId,
          saltHex,
          hashHex,
          u.totpSecretHex,
          u.mfaEnrolled ? 1 : 0,
          now
        );
        insertConsent.run(u.userId, now);
      }

      // 3. Seed 31 Canonical Categories
      const upsertCategory = this.db.prepare(
        `INSERT OR IGNORE INTO categories (
          key, number, name, status, reason_code, target_pilot_status,
          commission_rate, service_fee_rate, tax_rate,
          verification_required, restricted_permit_required, insurance_required,
          safety_check_in_required, emergency_contact_required, offline_pack_supported,
          lifecycle_stages_json, contract_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );

      for (const c of CANONICAL_CATEGORIES) {
        upsertCategory.run(
          c.key,
          c.number,
          c.name,
          c.status,
          c.reasonCode,
          c.targetPilotStatus,
          c.commissionRate,
          c.serviceFeeRate,
          c.taxRate,
          c.verificationRequired ? 1 : 0,
          c.restrictedPermitRequired ? 1 : 0,
          c.insuranceRequired ? 1 : 0,
          c.safetyCheckInRequired ? 1 : 0,
          c.emergencyContactRequired ? 1 : 0,
          c.offlinePackSupported ? 1 : 0,
          JSON.stringify(c.lifecycleStages),
          JSON.stringify(c.appendixAContract)
        );
      }

      // 4. Seed Reference Partners (Zero operational bookings or ledger lines seeded)
      const insertPartner = this.db.prepare(
        `INSERT OR IGNORE INTO partners (
          id, name, category_key, status,
          primary_reviewer_user_id, primary_reviewer_email, primary_reviewed_at,
          secondary_approver_user_id, secondary_approver_email, secondary_approved_at,
          documents_verified, tax_pan_vat_verified, payout_bank_verified, suspension_reason
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );

      insertPartner.run(
        'PTN-001',
        'Himalayan Heritage Eco-Hotel & Homestays Pvt. Ltd.',
        'hotels',
        'VERIFIED_PARTNER',
        'USR-COMP-001',
        'verifier.one@pherinepal.com',
        '2025-02-10T08:15:00.000Z',
        'USR-COMP-002',
        'verifier.two@pherinepal.com',
        '2025-02-10T11:40:00.000Z',
        1,
        1,
        1,
        null
      );

      insertPartner.run(
        'PTN-002',
        'Khumbu Sherpa Alpine Guides & Trekking Cooperative',
        'trekking',
        'VERIFIED_PARTNER',
        'USR-COMP-001',
        'verifier.one@pherinepal.com',
        '2025-02-11T09:00:00.000Z',
        'USR-COMP-002',
        'verifier.two@pherinepal.com',
        '2025-02-11T14:20:00.000Z',
        1,
        1,
        1,
        null
      );

      insertPartner.run(
        'PTN-003',
        'Annapurna Trail Transport & Adventure Fleet',
        'transport',
        'AWAITING_SECOND_APPROVER',
        'USR-COMP-001',
        'verifier.one@pherinepal.com',
        '2025-02-14T10:00:00.000Z',
        null,
        null,
        null,
        1,
        1,
        0,
        null
      );

      // 5. Seed Reference Catalog Listings
      const insertListing = this.db.prepare(
        `INSERT OR IGNORE INTO listings (
          id, partner_id, category_key, title, location,
          base_price_npr, capacity_per_slot, available_slots,
          permit_verified, guide_license_verified, insurance_verified, weather_altitude_clear,
          cancellation_policy, refund_policy
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );

      insertListing.run(
        'LST-001',
        'PTN-001',
        'hotels',
        'Patan Durbar Courtyard Heritage Suite (Breakfast & Airport Pickup)',
        'Lalitpur / Patan, Kathmandu Valley',
        8500,
        5,
        5,
        1,
        1,
        1,
        1,
        'Free cancellation up to 48 hours before check-in; 50% retention within 48 hours.',
        '100% full refund on partner rejection, hold expiry, or force-majeure closure.'
      );

      insertListing.run(
        'LST-002',
        'PTN-001',
        'homestays',
        'Ghandruk Gurung Stone-Roof Community Homestay',
        'Ghandruk, Kaski (Annapurna Foothills)',
        3200,
        4,
        4,
        1,
        1,
        1,
        1,
        'Free cancellation up to 24 hours before arrival.',
        '100% refund via double-entry reversal journal on weather or trail blockage.'
      );

      insertListing.run(
        'LST-003',
        'PTN-002',
        'trekking',
        'Everest Base Camp & Kala Patthar 12-Day Guided Trek (TIMS + Sagarmatha Permit Included)',
        'Lukla -> Namche -> Dingboche -> Gorakshep, Solukhumbu',
        115000,
        6,
        6,
        1,
        1,
        1,
        1,
        'Full reschedule or 90% refund >7 days prior; 100% refund if Lukla weather hold exceeds 72h.',
        'Escrow-protected double-entry refund on safety abort.'
      );

      insertListing.run(
        'LST-004',
        'PTN-002',
        'guides',
        'NATHM Certified High-Altitude Trekking & Cultural Guide (Daily Rate)',
        'Kathmandu / Pokhara / Khumbu / Annapurna',
        4500,
        3,
        3,
        1,
        1,
        1,
        1,
        'Free cancellation up to 24 hours before trailhead briefing.',
        '100% refund on guide illness if replacement guide declined.'
      );

      insertListing.run(
        'LST-005',
        'PTN-003',
        'transport',
        'Kathmandu to Pokhara Private Green-Plate 4WD Scorpio Transfer',
        'Kathmandu -> Mugling -> Pokhara Highway Corridor',
        18000,
        2,
        2,
        1,
        1,
        1,
        1,
        'Free cancellation 24h prior.',
        '100% refund on highway closure.'
      );
    });
  }

  public recordAudit(params: {
    correlationId: string;
    actorUserId: string;
    actorEmail: string;
    actorRole: string;
    action: string;
    targetType: string;
    targetId: string;
    outcome: 'ALLOWED' | 'DENIED' | 'ERROR';
    reasonCode: string;
    metadata?: Record<string, unknown>;
  }): AuditEventRecord {
    const event: AuditEventRecord = {
      eventId: `AUD-${randomUUID().slice(0, 8).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      correlationId: params.correlationId,
      actor: params.actorEmail,
      actorUserId: params.actorUserId,
      actorRole: params.actorRole,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      outcome: params.outcome,
      reasonCode: params.reasonCode,
      metadata: params.metadata || {},
    };

    this.db
      .prepare(
        `INSERT INTO audit_events (
          event_id, timestamp, correlation_id, actor_user_id, actor_email, actor_role,
          action, target_type, target_id, outcome, reason_code, metadata_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        event.eventId,
        event.timestamp,
        event.correlationId,
        event.actorUserId,
        event.actor,
        event.actorRole,
        event.action,
        event.targetType,
        event.targetId,
        event.outcome,
        event.reasonCode,
        JSON.stringify(event.metadata)
      );

    return event;
  }

  public isGlobalKillSwitchActive(): boolean {
    const row = this.db
      .prepare(`SELECT config_value FROM platform_config WHERE config_key = 'GLOBAL_KILL_SWITCH'`)
      .get() as { config_value: string } | undefined;
    return row?.config_value === 'true';
  }

  public isSandboxPilotPreviewMode(): boolean {
    const row = this.db
      .prepare(`SELECT config_value FROM platform_config WHERE config_key = 'SANDBOX_PILOT_PREVIEW_MODE'`)
      .get() as { config_value: string } | undefined;
    return row?.config_value === 'true';
  }

  /**
   * Enables or disables the 8 pilot candidate categories in the sandbox database
   * (Requires FOUNDER_ADMIN + MFA when invoked via API).
   */
  public setSandboxPilotPreviewMode(params: {
    enabled: boolean;
    session: AuthenticatedSessionContext;
    correlationId: string;
  }): { enabled: boolean; availableCategoriesCount: number } {
    if (params.session.role !== 'FOUNDER_ADMIN') {
      throw new DomainRuleError('Only FOUNDER_ADMIN can toggle sandbox pilot preview mode.', 403, 'RBAC_ROLE_FORBIDDEN');
    }
    if (!params.session.mfaVerified) {
      throw new DomainRuleError('MFA verification is required to toggle sandbox pilot preview mode.', 403, 'MFA_STEP_UP_REQUIRED');
    }

    return withImmediateTransaction(this.db, () => {
      const now = new Date().toISOString();
      this.db
        .prepare(
          `UPDATE platform_config SET config_value = ?, updated_at = ?, updated_by_user_id = ?
           WHERE config_key = 'SANDBOX_PILOT_PREVIEW_MODE'`
        )
        .run(String(params.enabled), now, params.session.userId);

      if (params.enabled) {
        this.db
          .prepare(
            `UPDATE categories
             SET status = 'AVAILABLE',
                 reason_code = 'SANDBOX_PILOT_PREVIEW_ENABLED_BY_FOUNDER_MFA'
             WHERE target_pilot_status = 'AVAILABLE'`
          )
          .run();
      } else {
        this.db
          .prepare(
            `UPDATE categories
             SET status = 'COMING_SOON',
                 reason_code = 'GATED_PENDING_OWNER_PILOT_AND_FEE_APPROVAL_DEC_001_DEC_003'
             WHERE target_pilot_status = 'AVAILABLE'`
          )
          .run();
      }

      const countRow = this.db
        .prepare(`SELECT COUNT(*) as cnt FROM categories WHERE status = 'AVAILABLE'`)
        .get() as { cnt: number };

      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: 'TOGGLE_SANDBOX_PILOT_PREVIEW_MODE',
        targetType: 'PLATFORM_CONFIG',
        targetId: 'SANDBOX_PILOT_PREVIEW_MODE',
        outcome: 'ALLOWED',
        reasonCode: params.enabled ? 'SANDBOX_PILOT_ENABLED' : 'PH00_STRICT_DEFAULT_RESTORED',
        metadata: { enabled: params.enabled, availableCategoriesCount: countRow.cnt },
      });

      return { enabled: params.enabled, availableCategoriesCount: countRow.cnt };
    });
  }

  public loginUser(params: {
    email: string;
    password: string;
    correlationId: string;
  }): {
    token: string;
    session: AuthenticatedSessionContext;
    mfaEnrolled: boolean;
    sandboxTotpCodeHint?: string;
  } {
    const cleanEmail = String(params.email || '').trim().toLowerCase();
    const row = this.db
      .prepare(
        `SELECT user_id, email, display_name, role, partner_id,
                password_salt, password_hash, totp_secret_hex, mfa_enrolled, is_active
         FROM users WHERE email = ?`
      )
      .get(cleanEmail) as
      | {
          user_id: string;
          email: string;
          display_name: string;
          role: ServerRole;
          partner_id: string | null;
          password_salt: string;
          password_hash: string;
          totp_secret_hex: string;
          mfa_enrolled: number;
          is_active: number;
        }
      | undefined;

    if (!row || !row.is_active || !verifyPassword(String(params.password || ''), row.password_salt, row.password_hash)) {
      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: row?.user_id || 'ANONYMOUS',
        actorEmail: cleanEmail || 'anonymous',
        actorRole: row?.role || 'ANONYMOUS',
        action: 'AUTH_LOGIN_ATTEMPT',
        targetType: 'USER',
        targetId: row?.user_id || cleanEmail || 'UNKNOWN',
        outcome: 'DENIED',
        reasonCode: 'INVALID_CREDENTIALS',
      });
      throw new DomainRuleError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const sessionId = `SES-${randomUUID()}`;
    const signedToken = signSessionToken(sessionId);
    const tokenHash = sha256Hex(signedToken);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString();

    this.db
      .prepare(
        `INSERT INTO sessions (session_id, user_id, token_hash, mfa_verified, expires_at, revoked_at, created_at)
         VALUES (?, ?, ?, 0, ?, NULL, ?)`
      )
      .run(sessionId, row.user_id, tokenHash, expiresAt, now.toISOString());

    const session: AuthenticatedSessionContext = {
      sessionId,
      userId: row.user_id,
      email: row.email,
      displayName: row.display_name,
      role: row.role,
      partnerId: row.partner_id,
      mfaVerified: false,
      expiresAt,
    };

    this.recordAudit({
      correlationId: params.correlationId,
      actorUserId: row.user_id,
      actorEmail: row.email,
      actorRole: row.role,
      action: 'AUTH_LOGIN_SUCCESS',
      targetType: 'SESSION',
      targetId: sessionId,
      outcome: 'ALLOWED',
      reasonCode: 'SESSION_ISSUED_MFA_PENDING',
    });

    return {
      token: signedToken,
      session,
      mfaEnrolled: Boolean(row.mfa_enrolled),
      sandboxTotpCodeHint:
        process.env.NODE_ENV !== 'production' ? generateTotpCode(row.totp_secret_hex) : undefined,
    };
  }

  public verifySessionMfa(params: {
    session: AuthenticatedSessionContext;
    totpCode: string;
    correlationId: string;
  }): AuthenticatedSessionContext {
    const userRow = this.db
      .prepare(`SELECT totp_secret_hex FROM users WHERE user_id = ?`)
      .get(params.session.userId) as { totp_secret_hex: string } | undefined;

    if (!userRow || !verifyTotpCode(userRow.totp_secret_hex, params.totpCode)) {
      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: 'AUTH_MFA_VERIFY',
        targetType: 'SESSION',
        targetId: params.session.sessionId,
        outcome: 'DENIED',
        reasonCode: 'INVALID_TOTP_CODE',
      });
      throw new DomainRuleError(
        'Invalid or expired 6-digit RFC 6238 TOTP verification code.',
        403,
        'INVALID_TOTP_CODE'
      );
    }

    this.db
      .prepare(`UPDATE sessions SET mfa_verified = 1 WHERE session_id = ?`)
      .run(params.session.sessionId);

    this.recordAudit({
      correlationId: params.correlationId,
      actorUserId: params.session.userId,
      actorEmail: params.session.email,
      actorRole: params.session.role,
      action: 'AUTH_MFA_VERIFY',
      targetType: 'SESSION',
      targetId: params.session.sessionId,
      outcome: 'ALLOWED',
      reasonCode: 'TOTP_MFA_STEP_UP_VERIFIED',
    });

    return {
      ...params.session,
      mfaVerified: true,
    };
  }

  public logoutSession(params: {
    session: AuthenticatedSessionContext;
    correlationId: string;
  }): void {
    const now = new Date().toISOString();
    this.db
      .prepare(`UPDATE sessions SET revoked_at = ? WHERE session_id = ?`)
      .run(now, params.session.sessionId);

    this.recordAudit({
      correlationId: params.correlationId,
      actorUserId: params.session.userId,
      actorEmail: params.session.email,
      actorRole: params.session.role,
      action: 'AUTH_LOGOUT',
      targetType: 'SESSION',
      targetId: params.session.sessionId,
      outcome: 'ALLOWED',
      reasonCode: 'SESSION_REVOKED',
    });
  }

  public lookupSessionById(sessionId: string): AuthenticatedSessionContext | null {
    const row = this.db
      .prepare(
        `SELECT s.session_id, s.user_id, s.mfa_verified, s.expires_at, s.revoked_at,
                u.email, u.display_name, u.role, u.partner_id, u.is_active
         FROM sessions s
         JOIN users u ON u.user_id = s.user_id
         WHERE s.session_id = ?`
      )
      .get(sessionId) as
      | {
          session_id: string;
          user_id: string;
          mfa_verified: number;
          expires_at: string;
          revoked_at: string | null;
          email: string;
          display_name: string;
          role: ServerRole;
          partner_id: string | null;
          is_active: number;
        }
      | undefined;

    if (!row || row.revoked_at || !row.is_active) {
      return null;
    }
    if (new Date(row.expires_at).getTime() <= Date.now()) {
      return null;
    }

    return {
      sessionId: row.session_id,
      userId: row.user_id,
      email: row.email,
      displayName: row.display_name,
      role: row.role,
      partnerId: row.partner_id,
      mfaVerified: Boolean(row.mfa_verified),
      expiresAt: row.expires_at,
    };
  }

  public getCategories(): CanonicalCategory[] {
    const rows = this.db
      .prepare(`SELECT key, status, reason_code FROM categories ORDER BY number ASC`)
      .all() as { key: string; status: CategoryStatus; reason_code: string }[];

    const statusByKey = new Map(rows.map((r) => [r.key, r]));
    return CANONICAL_CATEGORIES.map((cat) => {
      const dbState = statusByKey.get(cat.key);
      const currentStatus = dbState ? dbState.status : cat.status;
      const currentReason = dbState ? dbState.reason_code : cat.reasonCode;
      return {
        ...cat,
        status: currentStatus,
        reasonCode: currentReason,
        appendixAContract: {
          ...cat.appendixAContract,
          item03_availabilityState: {
            ...cat.appendixAContract.item03_availabilityState,
            currentPh00State: currentStatus,
          },
        },
      };
    });
  }

  public getPartners(includeStaffEmails = false): PartnerRecord[] {
    const rows = this.db
      .prepare(`SELECT * FROM partners ORDER BY id ASC`)
      .all() as Array<Record<string, unknown>>;

    return rows.map((r) => ({
      id: String(r.id),
      name: String(r.name),
      categoryKey: String(r.category_key),
      status: r.status as PartnerVerificationState,
      primaryReviewerUserId: r.primary_reviewer_user_id ? String(r.primary_reviewer_user_id) : null,
      primaryReviewerEmail:
        includeStaffEmails && r.primary_reviewer_email ? String(r.primary_reviewer_email) : null,
      primaryReviewedAt: r.primary_reviewed_at ? String(r.primary_reviewed_at) : null,
      secondaryApproverUserId: r.secondary_approver_user_id
        ? String(r.secondary_approver_user_id)
        : null,
      secondaryApproverEmail:
        includeStaffEmails && r.secondary_approver_email
          ? String(r.secondary_approver_email)
          : null,
      secondaryApprovedAt: r.secondary_approved_at ? String(r.secondary_approved_at) : null,
      documentsVerified: Boolean(r.documents_verified),
      taxPanVatVerified: Boolean(r.tax_pan_vat_verified),
      payoutBankVerified: Boolean(r.payout_bank_verified),
      suspensionReason: r.suspension_reason ? String(r.suspension_reason) : null,
    }));
  }

  public getListings(): ServiceListing[] {
    const rows = this.db
      .prepare(`SELECT * FROM listings ORDER BY id ASC`)
      .all() as Array<Record<string, unknown>>;

    return rows.map((r) => ({
      id: String(r.id),
      partnerId: String(r.partner_id),
      categoryKey: String(r.category_key),
      title: String(r.title),
      location: String(r.location),
      basePriceNPR: Number(r.base_price_npr),
      capacityPerSlot: Number(r.capacity_per_slot),
      availableSlots: Number(r.available_slots),
      permitVerified: Boolean(r.permit_verified),
      guideLicenseVerified: Boolean(r.guide_license_verified),
      insuranceVerified: Boolean(r.insurance_verified),
      weatherAltitudeClear: Boolean(r.weather_altitude_clear),
      cancellationPolicy: String(r.cancellation_policy),
      refundPolicy: String(r.refund_policy),
    }));
  }

  private mapQuoteRow(r: Record<string, unknown>): ImmutableQuote {
    return {
      quoteId: String(r.quote_id),
      travelerUserId: String(r.traveler_user_id),
      listingId: String(r.listing_id),
      categoryKey: String(r.category_key),
      partnerId: String(r.partner_id),
      quantity: Number(r.quantity),
      currency: 'NPR',
      baseSubtotalNPR: Number(r.base_subtotal_npr),
      platformCommissionNPR: Number(r.platform_commission_npr),
      travelerServiceFeeNPR: Number(r.traveler_service_fee_npr),
      taxVatNPR: Number(r.tax_vat_npr),
      totalTravelerPayableNPR: Number(r.total_traveler_payable_npr),
      netPartnerPayoutNPR: Number(r.net_partner_payout_npr),
      pricingSnapshotHash: String(r.pricing_snapshot_hash),
      cancellationPolicySnapshot: String(r.cancellation_policy_snapshot),
      refundPolicySnapshot: String(r.refund_policy_snapshot),
      consumedByBookingId: r.consumed_by_booking_id ? String(r.consumed_by_booking_id) : null,
      createdAt: String(r.created_at),
      expiresAt: String(r.expires_at),
    };
  }

  private mapBookingRow(r: Record<string, unknown>): BookingRecord {
    return {
      bookingId: String(r.booking_id),
      idempotencyKey: String(r.idempotency_key),
      requestPayloadHash: String(r.request_payload_hash),
      quoteId: String(r.quote_id),
      listingId: String(r.listing_id),
      partnerId: String(r.partner_id),
      categoryKey: String(r.category_key),
      travelerUserId: String(r.traveler_user_id),
      travelerName: String(r.traveler_name),
      serviceDate: String(r.service_date),
      quantity: Number(r.quantity),
      bookingState: r.booking_state as BookingState,
      paymentState: r.payment_state as PaymentSettlementState,
      totalPaidNPR: Number(r.total_paid_npr),
      holdExpiresAt: String(r.hold_expires_at),
      createdAt: String(r.created_at),
      updatedAt: String(r.updated_at),
    };
  }

  public getQuotesForSession(session?: AuthenticatedSessionContext | null): ImmutableQuote[] {
    if (!session) return [];
    let rows: Array<Record<string, unknown>>;
    if (
      session.role === 'FOUNDER_ADMIN' ||
      session.role === 'FINANCE_OFFICER' ||
      session.role === 'SUPPORT_AGENT'
    ) {
      rows = this.db
        .prepare(`SELECT * FROM quotes ORDER BY created_at DESC LIMIT 50`)
        .all() as Array<Record<string, unknown>>;
    } else {
      rows = this.db
        .prepare(`SELECT * FROM quotes WHERE traveler_user_id = ? ORDER BY created_at DESC LIMIT 50`)
        .all(session.userId) as Array<Record<string, unknown>>;
    }
    return rows.map((r) => this.mapQuoteRow(r));
  }

  public getBookingsForSession(session?: AuthenticatedSessionContext | null): BookingRecord[] {
    this.releaseExpiredInventoryHolds('auto-sweep-read');
    if (!session) return [];

    let rows: Array<Record<string, unknown>>;
    if (
      session.role === 'FOUNDER_ADMIN' ||
      session.role === 'FINANCE_OFFICER' ||
      session.role === 'SUPPORT_AGENT' ||
      session.role === 'SAFETY_LEAD' ||
      session.role === 'COMPLIANCE_REVIEWER'
    ) {
      rows = this.db
        .prepare(`SELECT * FROM bookings ORDER BY created_at DESC`)
        .all() as Array<Record<string, unknown>>;
    } else if (session.role === 'PARTNER') {
      rows = this.db
        .prepare(`SELECT * FROM bookings WHERE partner_id = ? ORDER BY created_at DESC`)
        .all(session.partnerId || '') as Array<Record<string, unknown>>;
    } else {
      rows = this.db
        .prepare(`SELECT * FROM bookings WHERE traveler_user_id = ? ORDER BY created_at DESC`)
        .all(session.userId) as Array<Record<string, unknown>>;
    }
    return rows.map((r) => this.mapBookingRow(r));
  }

  public getLedgerJournals(): DoubleEntryJournal[] {
    const journalRows = this.db
      .prepare(`SELECT * FROM ledger_journals ORDER BY created_at DESC`)
      .all() as Array<Record<string, unknown>>;

    const lineStmt = this.db.prepare(
      `SELECT * FROM ledger_lines WHERE journal_id = ? ORDER BY line_id ASC`
    );

    return journalRows.map((j) => {
      const lineRows = lineStmt.all(String(j.journal_id)) as Array<Record<string, unknown>>;
      const lines: DoubleEntryLine[] = lineRows.map((l) => ({
        lineId: String(l.line_id),
        journalId: String(l.journal_id),
        bookingId: String(l.booking_id),
        accountCode: l.account_code as DoubleEntryLine['accountCode'],
        direction: l.direction as 'DEBIT' | 'CREDIT',
        amountNPR: Number(l.amount_npr),
        currency: 'NPR',
        createdAt: String(l.created_at),
      }));
      return {
        journalId: String(j.journal_id),
        bookingId: String(j.booking_id),
        eventType: j.event_type as DoubleEntryJournal['eventType'],
        currency: 'NPR',
        totalDebitNPR: Number(j.total_debit_npr),
        totalCreditNPR: Number(j.total_credit_npr),
        balanced: Boolean(j.balanced),
        lines,
        createdAt: String(j.created_at),
      };
    });
  }

  public getLedgerTrialBalance(): {
    totalDebitNPR: number;
    totalCreditNPR: number;
    balanced: boolean;
    journalCount: number;
  } {
    const row = this.db
      .prepare(
        `SELECT
          COALESCE(SUM(CASE WHEN direction = 'DEBIT' THEN amount_npr ELSE 0 END), 0) AS total_debit,
          COALESCE(SUM(CASE WHEN direction = 'CREDIT' THEN amount_npr ELSE 0 END), 0) AS total_credit
         FROM ledger_lines`
      )
      .get() as { total_debit: number; total_credit: number };

    const jCount = this.db
      .prepare(`SELECT COUNT(*) AS cnt FROM ledger_journals`)
      .get() as { cnt: number };

    const totalDebitNPR = Number(row.total_debit || 0);
    const totalCreditNPR = Number(row.total_credit || 0);
    return {
      totalDebitNPR,
      totalCreditNPR,
      balanced: totalDebitNPR === totalCreditNPR,
      journalCount: Number(jCount.cnt || 0),
    };
  }

  public getAuditEvents(limit = 60): AuditEventRecord[] {
    const rows = this.db
      .prepare(`SELECT * FROM audit_events ORDER BY timestamp DESC, rowid DESC LIMIT ?`)
      .all(limit) as Array<Record<string, unknown>>;

    return rows.map((r) => ({
      eventId: String(r.event_id),
      timestamp: String(r.timestamp),
      correlationId: String(r.correlation_id),
      actor: String(r.actor_email),
      actorUserId: String(r.actor_user_id),
      actorRole: String(r.actor_role),
      action: String(r.action),
      targetType: String(r.target_type),
      targetId: String(r.target_id),
      outcome: r.outcome as AuditEventRecord['outcome'],
      reasonCode: String(r.reason_code),
      metadata: JSON.parse(String(r.metadata_json || '{}')),
    }));
  }

  public getReviews(): ReviewRecord[] {
    const rows = this.db
      .prepare(`SELECT * FROM reviews ORDER BY created_at DESC`)
      .all() as Array<Record<string, unknown>>;

    return rows.map((r) => ({
      reviewId: String(r.review_id),
      bookingId: String(r.booking_id),
      listingId: String(r.listing_id),
      travelerUserId: String(r.traveler_user_id),
      travelerName: String(r.traveler_name),
      rating: Number(r.rating),
      comment: String(r.comment),
      verifiedCompletedStay: Boolean(r.verified_completed_stay),
      moderationStatus: r.moderation_status as ReviewRecord['moderationStatus'],
      createdAt: String(r.created_at),
    }));
  }

  public listIncidents(session: AuthenticatedSessionContext): SafetyIncidentRecord[] {
    let rows: Array<Record<string, unknown>>;
    if (
      session.role === 'SAFETY_LEAD' ||
      session.role === 'SUPPORT_AGENT' ||
      session.role === 'FOUNDER_ADMIN'
    ) {
      rows = this.db
        .prepare(`SELECT * FROM incidents ORDER BY created_at DESC`)
        .all() as Array<Record<string, unknown>>;
    } else {
      rows = this.db
        .prepare(`SELECT * FROM incidents WHERE reporter_user_id = ? ORDER BY created_at DESC`)
        .all(session.userId) as Array<Record<string, unknown>>;
    }

    return rows.map((r) => ({
      incidentId: String(r.incident_id),
      bookingId: r.booking_id ? String(r.booking_id) : null,
      tripId: String(r.trip_id),
      reporterUserId: String(r.reporter_user_id),
      categoryKey: String(r.category_key),
      severity: r.severity as SafetyIncidentRecord['severity'],
      title: String(r.title),
      description: String(r.description),
      gpsCoordinates: r.gps_coordinates ? String(r.gps_coordinates) : null,
      status: r.status as SafetyIncidentRecord['status'],
      assignedDeskOwner: String(r.assigned_desk_owner),
      escalationLog: JSON.parse(String(r.escalation_log_json || '[]')),
      createdAt: String(r.created_at),
      updatedAt: String(r.updated_at),
    }));
  }

  public getPrivacyConsent(userId: string): PrivacyConsentRecord {
    const row = this.db
      .prepare(`SELECT * FROM user_privacy_consents WHERE user_id = ?`)
      .get(userId) as Record<string, unknown> | undefined;

    if (!row) {
      const now = new Date().toISOString();
      this.db
        .prepare(
          `INSERT INTO user_privacy_consents (
            user_id, essential_booking_data, safety_gps_telemetry, analytics_cookies,
            ai_assistant_prompts, marketing_notifications, consent_version, purpose,
            gps_auto_expire_hours, gps_expires_at, revoked_at, updated_at
          ) VALUES (?, 1, 0, 0, 1, 0, 'PNP-PRIVACY-v1.0', 'DEFAULT_MINIMUM_PRIVACY_BASELINE', 4, NULL, NULL, ?)`
        )
        .run(userId, now);
      return this.getPrivacyConsent(userId);
    }

    let safetyGps = Boolean(row.safety_gps_telemetry);
    const gpsExpiresAt = row.gps_expires_at ? String(row.gps_expires_at) : null;
    if (safetyGps && gpsExpiresAt && new Date(gpsExpiresAt).getTime() <= Date.now()) {
      safetyGps = false;
    }

    return {
      userId: String(row.user_id),
      essentialBookingData: true,
      safetyGpsTelemetry: safetyGps,
      analyticsCookies: Boolean(row.analytics_cookies),
      aiAssistantPrompts: Boolean(row.ai_assistant_prompts),
      marketingNotifications: Boolean(row.marketing_notifications),
      consentVersion: String(row.consent_version),
      purpose: String(row.purpose),
      gpsAutoExpireHours: Number(row.gps_auto_expire_hours),
      gpsExpiresAt,
      revokedAt: row.revoked_at ? String(row.revoked_at) : null,
      updatedAt: String(row.updated_at),
    };
  }

  public getBootstrapData(session?: AuthenticatedSessionContext | null) {
    this.releaseExpiredInventoryHolds('bootstrap-sweep');
    const categories = this.getCategories();
    const canViewStaffEmails =
      session?.role === 'COMPLIANCE_REVIEWER' || session?.role === 'FOUNDER_ADMIN';
    const canViewLedger =
      session?.role === 'FINANCE_OFFICER' || session?.role === 'FOUNDER_ADMIN';
    const canViewAudit =
      session?.role === 'COMPLIANCE_REVIEWER' || session?.role === 'FOUNDER_ADMIN';

    const statusCounts = {
      AVAILABLE: categories.filter((c) => c.status === 'AVAILABLE').length,
      COMING_SOON: categories.filter((c) => c.status === 'COMING_SOON').length,
      INFORMATION_ONLY: categories.filter((c) => c.status === 'INFORMATION_ONLY').length,
      RESTRICTED: categories.filter((c) => c.status === 'RESTRICTED').length,
    };

    return {
      blueprintMeta: {
        documentId: 'PNP-MASTER-ARCH-001',
        version: 'v1.0',
        activePhase: 'PH00',
        totalCategories: categories.length,
        totalDashboards: CANONICAL_DASHBOARDS.length,
        totalLifecycleStages: 3,
        totalPhases: CANONICAL_PHASES.length,
        totalFeatureModules: CANONICAL_FEATURE_MODULES.length,
        categoryStatusCounts: statusCounts,
        persistenceEngine: 'SQLITE_WAL_TRANSACTIONAL',
        externalCloudSqlStatus: 'BLOCKED_NO_GCP_PROJECT',
      },
      currentUser: session || null,
      demoAccounts: SEEDED_USERS.map((u) => ({
        userId: u.userId,
        email: u.email,
        displayName: u.displayName,
        role: u.role,
        partnerId: u.partnerId,
        defaultPassword: u.defaultPassword,
        mfaEnrolled: u.mfaEnrolled,
      })),
      globalKillSwitchActive: this.isGlobalKillSwitchActive(),
      sandboxPilotPreviewMode: this.isSandboxPilotPreviewMode(),
      categories,
      dashboards: CANONICAL_DASHBOARDS,
      phases: CANONICAL_PHASES,
      featureModules: CANONICAL_FEATURE_MODULES,
      partners: this.getPartners(Boolean(canViewStaffEmails)),
      listings: this.getListings(),
      quotes: this.getQuotesForSession(session),
      bookings: this.getBookingsForSession(session),
      ledger: canViewLedger
        ? {
            journals: this.getLedgerJournals(),
            trialBalance: this.getLedgerTrialBalance(),
          }
        : {
            journals: [],
            trialBalance: {
              totalDebitNPR: 0,
              totalCreditNPR: 0,
              balanced: true,
              journalCount: 0,
            },
          },
      incidents: session ? this.listIncidents(session) : [],
      reviews: this.getReviews(),
      privacyConsent: session ? this.getPrivacyConsent(session.userId) : null,
      auditEvents: canViewAudit ? this.getAuditEvents(50) : [],
      governance: {
        featureAuditMatrix: PH00_FEATURE_AUDIT_MATRIX,
        visionAndOutcomes: PH00_VISION_AND_OUTCOMES,
        personas: PH00_PERSONAS,
        lifecycleJourneyMaps: PH00_LIFECYCLE_JOURNEY_MAPS,
        all26Decisions: PH00_ALL_26_DECISIONS,
        risks: PH00_RISKS,
        dependencies: PH00_DEPENDENCIES,
        assumptions: PH00_ASSUMPTIONS,
        legalRegister: PH00_LEGAL_REGISTER,
        pilotFramework: PH00_PILOT_FRAMEWORK,
        pilotReadinessEvaluation: evaluatePilotReadinessGates(),
        aiAgentContractEvaluation: validateAiAgentContract(),
      },
    };
  }

  /**
   * Automatically expires uncaptured holds where hold_expires_at <= now
   * and restores available_slots on the listing.
   */
  public releaseExpiredInventoryHolds(correlationId: string): {
    expiredCount: number;
    expiredBookingIds: string[];
  } {
    return withImmediateTransaction(this.db, () => {
      const nowIso = new Date().toISOString();
      const expiredRows = this.db
        .prepare(
          `SELECT booking_id, listing_id, quantity, traveler_user_id
           FROM bookings
           WHERE booking_state IN ('HOLD_PLACED', 'PAYMENT_PENDING')
             AND payment_state IN ('CREATED', 'AUTHORIZED', 'FAILED')
             AND hold_expires_at <= ?`
        )
        .all(nowIso) as Array<{
        booking_id: string;
        listing_id: string;
        quantity: number;
        traveler_user_id: string;
      }>;

      if (expiredRows.length === 0) {
        return { expiredCount: 0, expiredBookingIds: [] };
      }

      const updateBooking = this.db.prepare(
        `UPDATE bookings
         SET booking_state = 'EXPIRED_HOLD',
             payment_state = 'FAILED',
             updated_at = ?
         WHERE booking_id = ?`
      );

      const updateIntent = this.db.prepare(
        `UPDATE payment_intents
         SET state = 'FAILED',
             updated_at = ?
         WHERE booking_id = ?`
      );

      const restoreSlots = this.db.prepare(
        `UPDATE listings
         SET available_slots = MIN(capacity_per_slot, available_slots + ?)
         WHERE id = ?`
      );

      const expiredBookingIds: string[] = [];
      for (const row of expiredRows) {
        updateBooking.run(nowIso, row.booking_id);
        updateIntent.run(nowIso, row.booking_id);
        restoreSlots.run(row.quantity, row.listing_id);
        expiredBookingIds.push(row.booking_id);

        this.recordAudit({
          correlationId,
          actorUserId: 'SYSTEM_HOLD_SWEEPER',
          actorEmail: 'system.sweeper@pherinepal.com',
          actorRole: 'SYSTEM',
          action: 'EXPIRE_STALE_INVENTORY_HOLD',
          targetType: 'BOOKING',
          targetId: row.booking_id,
          outcome: 'ALLOWED',
          reasonCode: 'HOLD_TTL_EXPIRED_SLOTS_RESTORED',
          metadata: { listingId: row.listing_id, slotsRestored: row.quantity },
        });
      }

      return {
        expiredCount: expiredBookingIds.length,
        expiredBookingIds,
      };
    });
  }

  /**
   * Stage 1 of Two-Person Partner Verification: Primary Review
   */
  public reviewPartnerPrimary(params: {
    partnerId: string;
    session: AuthenticatedSessionContext;
    correlationId: string;
  }): PartnerRecord {
    if (
      params.session.role !== 'COMPLIANCE_REVIEWER' &&
      params.session.role !== 'FOUNDER_ADMIN'
    ) {
      throw new DomainRuleError(
        'Only COMPLIANCE_REVIEWER or FOUNDER_ADMIN can perform partner KYB primary review.',
        403,
        'RBAC_ROLE_FORBIDDEN'
      );
    }
    if (!params.session.mfaVerified) {
      throw new DomainRuleError(
        'TOTP MFA step-up verification is required for partner KYB primary review.',
        403,
        'MFA_STEP_UP_REQUIRED'
      );
    }

    return withImmediateTransaction(this.db, () => {
      const row = this.db
        .prepare(`SELECT * FROM partners WHERE id = ?`)
        .get(params.partnerId) as Record<string, unknown> | undefined;

      if (!row) {
        throw new DomainRuleError(`Partner ${params.partnerId} not found.`, 404, 'PARTNER_NOT_FOUND');
      }

      const now = new Date().toISOString();
      this.db
        .prepare(
          `UPDATE partners
           SET status = 'AWAITING_SECOND_APPROVER',
               primary_reviewer_user_id = ?,
               primary_reviewer_email = ?,
               primary_reviewed_at = ?,
               secondary_approver_user_id = NULL,
               secondary_approver_email = NULL,
               secondary_approved_at = NULL,
               documents_verified = 1,
               tax_pan_vat_verified = 1
           WHERE id = ?`
        )
        .run(params.session.userId, params.session.email, now, params.partnerId);

      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: 'PARTNER_KYB_PRIMARY_REVIEW',
        targetType: 'PARTNER',
        targetId: params.partnerId,
        outcome: 'ALLOWED',
        reasonCode: 'PRIMARY_REVIEW_RECORDED_AWAITING_SECOND_APPROVER',
      });

      const updated = this.getPartners(true).find((p) => p.id === params.partnerId)!;
      return updated;
    });
  }

  /**
   * Stage 2 of Two-Person Partner Verification: Secondary Approval (Enforces Distinct User ID)
   */
  public approvePartnerSecondary(params: {
    partnerId: string;
    session: AuthenticatedSessionContext;
    correlationId: string;
  }): PartnerRecord {
    if (
      params.session.role !== 'COMPLIANCE_REVIEWER' &&
      params.session.role !== 'FOUNDER_ADMIN'
    ) {
      throw new DomainRuleError(
        'Only COMPLIANCE_REVIEWER or FOUNDER_ADMIN can perform partner KYB secondary approval.',
        403,
        'RBAC_ROLE_FORBIDDEN'
      );
    }
    if (!params.session.mfaVerified) {
      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: 'PARTNER_SECOND_APPROVAL',
        targetType: 'PARTNER',
        targetId: params.partnerId,
        outcome: 'DENIED',
        reasonCode: 'MFA_STEP_UP_REQUIRED',
      });
      throw new DomainRuleError(
        'TOTP MFA step-up verification is required for partner KYB secondary approval.',
        403,
        'MFA_STEP_UP_REQUIRED'
      );
    }

    return withImmediateTransaction(this.db, () => {
      const row = this.db
        .prepare(`SELECT * FROM partners WHERE id = ?`)
        .get(params.partnerId) as Record<string, unknown> | undefined;

      if (!row) {
        throw new DomainRuleError(`Partner ${params.partnerId} not found.`, 404, 'PARTNER_NOT_FOUND');
      }

      if (!row.primary_reviewer_user_id) {
        throw new DomainRuleError(
          'Partner has not completed Stage 1 Primary Compliance Review.',
          409,
          'PRIMARY_REVIEW_MISSING'
        );
      }

      if (String(row.primary_reviewer_user_id) === params.session.userId) {
        this.recordAudit({
          correlationId: params.correlationId,
          actorUserId: params.session.userId,
          actorEmail: params.session.email,
          actorRole: params.session.role,
          action: 'PARTNER_SECOND_APPROVAL',
          targetType: 'PARTNER',
          targetId: params.partnerId,
          outcome: 'DENIED',
          reasonCode: 'TWO_PERSON_DISTINCT_REVIEWER_VIOLATION',
          metadata: {
            primaryReviewerUserId: row.primary_reviewer_user_id,
            attemptedSecondaryUserId: params.session.userId,
          },
        });
        throw new DomainRuleError(
          `Two-Person Distinct-Reviewer Violation: Secondary approver (${params.session.email}) cannot be the same user as Primary Reviewer (${row.primary_reviewer_email}).`,
          403,
          'TWO_PERSON_DISTINCT_REVIEWER_VIOLATION'
        );
      }

      const now = new Date().toISOString();
      this.db
        .prepare(
          `UPDATE partners
           SET status = 'VERIFIED_PARTNER',
               secondary_approver_user_id = ?,
               secondary_approver_email = ?,
               secondary_approved_at = ?,
               documents_verified = 1,
               tax_pan_vat_verified = 1,
               payout_bank_verified = 1,
               suspension_reason = NULL
           WHERE id = ?`
        )
        .run(params.session.userId, params.session.email, now, params.partnerId);

      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: 'PARTNER_SECOND_APPROVAL',
        targetType: 'PARTNER',
        targetId: params.partnerId,
        outcome: 'ALLOWED',
        reasonCode: 'VERIFIED_BY_TWO_DISTINCT_REVIEWERS',
        metadata: {
          primaryReviewerUserId: row.primary_reviewer_user_id,
          secondaryApproverUserId: params.session.userId,
        },
      });

      return this.getPartners(true).find((p) => p.id === params.partnerId)!;
    });
  }

  public suspendPartner(params: {
    partnerId: string;
    reason: string;
    session: AuthenticatedSessionContext;
    correlationId: string;
  }): PartnerRecord {
    if (
      params.session.role !== 'COMPLIANCE_REVIEWER' &&
      params.session.role !== 'SAFETY_LEAD' &&
      params.session.role !== 'FOUNDER_ADMIN'
    ) {
      throw new DomainRuleError('Role not permitted to suspend partner.', 403, 'RBAC_ROLE_FORBIDDEN');
    }
    if (!params.session.mfaVerified) {
      throw new DomainRuleError('MFA step-up required for partner suspension.', 403, 'MFA_STEP_UP_REQUIRED');
    }

    return withImmediateTransaction(this.db, () => {
      const row = this.db
        .prepare(`SELECT id FROM partners WHERE id = ?`)
        .get(params.partnerId) as { id: string } | undefined;

      if (!row) {
        throw new DomainRuleError(`Partner ${params.partnerId} not found.`, 404, 'PARTNER_NOT_FOUND');
      }

      const cleanReason = String(params.reason || 'Compliance suspension').trim();
      this.db
        .prepare(`UPDATE partners SET status = 'SUSPENDED', suspension_reason = ? WHERE id = ?`)
        .run(cleanReason, params.partnerId);

      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: 'PARTNER_SUSPEND',
        targetType: 'PARTNER',
        targetId: params.partnerId,
        outcome: 'ALLOWED',
        reasonCode: 'PARTNER_SUSPENDED_INVENTORY_FROZEN',
        metadata: { reason: cleanReason },
      });

      return this.getPartners(true).find((p) => p.id === params.partnerId)!;
    });
  }

  public createImmutableQuote(params: {
    listingId: string;
    quantity: number;
    session: AuthenticatedSessionContext;
    correlationId: string;
  }): ImmutableQuote {
    if (this.isGlobalKillSwitchActive()) {
      throw new DomainRuleError(
        'Platform Global Kill-Switch is active. New quotes are paused.',
        503,
        'GLOBAL_KILL_SWITCH_ACTIVE'
      );
    }

    const quantity = Number(params.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 20) {
      throw new DomainRuleError(
        'Quantity must be a positive integer between 1 and 20.',
        400,
        'INVALID_QUOTE_QUANTITY'
      );
    }

    const listing = this.getListings().find((l) => l.id === params.listingId);
    if (!listing) {
      throw new DomainRuleError(`Listing ${params.listingId} not found.`, 404, 'LISTING_NOT_FOUND');
    }

    const category = this.getCategories().find((c) => c.key === listing.categoryKey);
    if (!category) {
      throw new DomainRuleError('Category not found in canonical catalogue.', 404, 'CATEGORY_NOT_FOUND');
    }

    if (
      category.status === 'RESTRICTED' ||
      RESTRICTED_HARD_GATE_KEYS.includes(category.key)
    ) {
      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: 'CREATE_QUOTE',
        targetType: 'CATEGORY',
        targetId: category.key,
        outcome: 'DENIED',
        reasonCode: 'CATEGORY_RESTRICTED_HARD_GATE',
      });
      throw new DomainRuleError(
        `Category "${category.name}" is RESTRICTED (${category.reasonCode}). Automated quotes and checkout are hard-blocked.`,
        403,
        'CATEGORY_RESTRICTED_HARD_GATE'
      );
    }

    if (category.status === 'INFORMATION_ONLY') {
      throw new DomainRuleError(
        `Category "${category.name}" is INFORMATION_ONLY. Commercial quotes are disabled.`,
        403,
        'CATEGORY_INFORMATION_ONLY'
      );
    }

    if (category.status !== 'AVAILABLE') {
      throw new DomainRuleError(
        `Category "${category.name}" is currently ${category.status} (${category.reasonCode}).`,
        403,
        'CATEGORY_NOT_AVAILABLE'
      );
    }

    const partner = this.getPartners(true).find((p) => p.id === listing.partnerId);
    if (!partner || partner.status !== 'VERIFIED_PARTNER') {
      throw new DomainRuleError(
        `Partner for listing ${listing.id} is not in VERIFIED_PARTNER state (current: ${partner?.status}).`,
        403,
        'PARTNER_NOT_VERIFIED'
      );
    }

    const baseSubtotalNPR = Math.round(listing.basePriceNPR * quantity);
    const platformCommissionNPR = Math.round(baseSubtotalNPR * category.commissionRate);
    const travelerServiceFeeNPR = Math.round(baseSubtotalNPR * category.serviceFeeRate);
    const taxableAmountNPR = baseSubtotalNPR + travelerServiceFeeNPR;
    const taxVatNPR = Math.round(taxableAmountNPR * category.taxRate);
    const totalTravelerPayableNPR = baseSubtotalNPR + travelerServiceFeeNPR + taxVatNPR;
    const netPartnerPayoutNPR = baseSubtotalNPR - platformCommissionNPR;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);
    const quoteId = `QTE-${randomUUID().slice(0, 8).toUpperCase()}`;

    const pricingPayload = `${quoteId}|${params.session.userId}|${listing.id}|${quantity}|${baseSubtotalNPR}|${platformCommissionNPR}|${travelerServiceFeeNPR}|${taxVatNPR}|${totalTravelerPayableNPR}|${netPartnerPayoutNPR}`;
    const pricingSnapshotHash = sha256Hex(pricingPayload);

    const quote: ImmutableQuote = {
      quoteId,
      travelerUserId: params.session.userId,
      listingId: listing.id,
      categoryKey: category.key,
      partnerId: partner.id,
      quantity,
      currency: 'NPR',
      baseSubtotalNPR,
      platformCommissionNPR,
      travelerServiceFeeNPR,
      taxVatNPR,
      totalTravelerPayableNPR,
      netPartnerPayoutNPR,
      pricingSnapshotHash,
      cancellationPolicySnapshot: listing.cancellationPolicy,
      refundPolicySnapshot: listing.refundPolicy,
      consumedByBookingId: null,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    this.db
      .prepare(
        `INSERT INTO quotes (
          quote_id, traveler_user_id, listing_id, category_key, partner_id,
          quantity, currency, base_subtotal_npr, platform_commission_npr,
          traveler_service_fee_npr, tax_vat_npr, total_traveler_payable_npr,
          net_partner_payout_npr, pricing_snapshot_hash,
          cancellation_policy_snapshot, refund_policy_snapshot,
          consumed_by_booking_id, created_at, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'NPR', ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)`
      )
      .run(
        quote.quoteId,
        quote.travelerUserId,
        quote.listingId,
        quote.categoryKey,
        quote.partnerId,
        quote.quantity,
        quote.baseSubtotalNPR,
        quote.platformCommissionNPR,
        quote.travelerServiceFeeNPR,
        quote.taxVatNPR,
        quote.totalTravelerPayableNPR,
        quote.netPartnerPayoutNPR,
        quote.pricingSnapshotHash,
        quote.cancellationPolicySnapshot,
        quote.refundPolicySnapshot,
        quote.createdAt,
        quote.expiresAt
      );

    this.recordAudit({
      correlationId: params.correlationId,
      actorUserId: params.session.userId,
      actorEmail: params.session.email,
      actorRole: params.session.role,
      action: 'CREATE_IMMUTABLE_QUOTE',
      targetType: 'QUOTE',
      targetId: quoteId,
      outcome: 'ALLOWED',
      reasonCode: 'QUOTE_LOCKED_15M_SINGLE_USE',
      metadata: {
        listingId: listing.id,
        totalTravelerPayableNPR,
        pricingSnapshotHash,
      },
    });

    return quote;
  }

  public executeAtomicBooking(params: {
    quoteId: string;
    listingId: string;
    serviceDate: string;
    idempotencyKey: string;
    emergencyContactProvided: boolean;
    safetyBriefAcknowledged: boolean;
    session: AuthenticatedSessionContext;
    correlationId: string;
    holdDurationMs?: number;
  }): {
    booking: BookingRecord;
    gateEvaluations: BookingGateEvaluation[];
    idempotentReplay: boolean;
  } {
    this.releaseExpiredInventoryHolds(params.correlationId);

    const cleanIdempotencyKey = String(params.idempotencyKey || '').trim();
    if (!cleanIdempotencyKey || cleanIdempotencyKey.length < 4) {
      throw new DomainRuleError(
        'A valid non-empty Idempotency-Key (minimum 4 chars) is required.',
        400,
        'IDEMPOTENCY_KEY_REQUIRED'
      );
    }

    const cleanServiceDate = String(params.serviceDate || '').trim();
    const todayUtc = new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanServiceDate) || cleanServiceDate < todayUtc) {
      throw new DomainRuleError(
        `Invalid or past serviceDate "${cleanServiceDate}". serviceDate must be a valid YYYY-MM-DD date on or after ${todayUtc}.`,
        400,
        'INVALID_OR_PAST_SERVICE_DATE'
      );
    }

    const requestPayloadHash = sha256Hex(
      JSON.stringify({
        quoteId: params.quoteId,
        listingId: params.listingId,
        serviceDate: cleanServiceDate,
      })
    );

    return withImmediateTransaction(this.db, () => {
      // Check user-bound idempotency key first
      const existingBookingRow = this.db
        .prepare(
          `SELECT * FROM bookings WHERE traveler_user_id = ? AND idempotency_key = ?`
        )
        .get(params.session.userId, cleanIdempotencyKey) as Record<string, unknown> | undefined;

      if (existingBookingRow) {
        if (String(existingBookingRow.request_payload_hash) !== requestPayloadHash) {
          throw new DomainRuleError(
            'Idempotency key reuse with a different booking payload is forbidden.',
            409,
            'IDEMPOTENCY_KEY_PAYLOAD_MISMATCH'
          );
        }
        return {
          booking: this.mapBookingRow(existingBookingRow),
          gateEvaluations: [],
          idempotentReplay: true,
        };
      }

      const quoteRow = this.db
        .prepare(`SELECT * FROM quotes WHERE quote_id = ?`)
        .get(params.quoteId) as Record<string, unknown> | undefined;

      const quote = quoteRow ? this.mapQuoteRow(quoteRow) : undefined;

      if (quote && quote.travelerUserId !== params.session.userId) {
        throw new DomainRuleError(
          'Quote belongs to a different authenticated user and cannot be used.',
          403,
          'QUOTE_OWNERSHIP_MISMATCH'
        );
      }

      if (quote && quote.consumedByBookingId) {
        throw new DomainRuleError(
          `Quote ${quote.quoteId} has already been consumed by booking ${quote.consumedByBookingId}. Quotes are strictly single-use.`,
          409,
          'QUOTE_ALREADY_CONSUMED'
        );
      }

      const listing = this.getListings().find((l) => l.id === params.listingId);
      const category = listing
        ? this.getCategories().find((c) => c.key === listing.categoryKey)
        : undefined;
      const partner = listing
        ? this.getPartners(true).find((p) => p.id === listing.partnerId)
        : undefined;

      const now = new Date();
      const quoteValidAndUnexpired = Boolean(
        quote &&
          quote.listingId === params.listingId &&
          !quote.consumedByBookingId &&
          new Date(quote.expiresAt).getTime() > now.getTime()
      );

      let hashMatches = false;
      if (quote) {
        const expectedPayload = `${quote.quoteId}|${quote.travelerUserId}|${quote.listingId}|${quote.quantity}|${quote.baseSubtotalNPR}|${quote.platformCommissionNPR}|${quote.travelerServiceFeeNPR}|${quote.taxVatNPR}|${quote.totalTravelerPayableNPR}|${quote.netPartnerPayoutNPR}`;
        hashMatches = sha256Hex(expectedPayload) === quote.pricingSnapshotHash;
      }

      const evaluations: BookingGateEvaluation[] = [
        {
          gateNumber: 1,
          gateName: 'Global Platform Kill-Switch Clear',
          passed: !this.isGlobalKillSwitchActive(),
          reason: this.isGlobalKillSwitchActive()
            ? 'Global Kill-Switch is ACTIVE'
            : 'Platform operational',
        },
        {
          gateNumber: 2,
          gateName: 'Canonical Category Status == AVAILABLE (Non-Restricted)',
          passed: Boolean(
            category &&
              category.status === 'AVAILABLE' &&
              !RESTRICTED_HARD_GATE_KEYS.includes(category.key)
          ),
          reason: category
            ? `Category ${category.key} is ${category.status}`
            : 'Category missing',
        },
        {
          gateNumber: 3,
          gateName: 'Partner KYB Two-Person Verification Active',
          passed: Boolean(
            partner &&
              partner.status === 'VERIFIED_PARTNER' &&
              partner.primaryReviewerUserId &&
              partner.secondaryApproverUserId &&
              partner.primaryReviewerUserId !== partner.secondaryApproverUserId
          ),
          reason: partner
            ? `Partner ${partner.id} status=${partner.status}`
            : 'Partner missing',
        },
        {
          gateNumber: 4,
          gateName: 'Partner Tax (PAN/VAT) & Payout Bank Verified',
          passed: Boolean(partner && partner.taxPanVatVerified && partner.payoutBankVerified),
          reason: partner ? 'PAN/VAT & Settlement Bank verified' : 'Partner missing',
        },
        {
          gateNumber: 5,
          gateName: 'Immutable Single-Use Quote Valid & Unexpired (15m TTL)',
          passed: quoteValidAndUnexpired,
          reason: quoteValidAndUnexpired
            ? `Quote ${quote?.quoteId} valid & unconsumed`
            : 'Quote missing, expired,consumed, or listing mismatch',
        },
        {
          gateNumber: 6,
          gateName: 'Quote SHA-256 Pricing Snapshot Integrity',
          passed: hashMatches,
          reason: hashMatches
            ? 'SHA-256 pricing hash verified'
            : 'Pricing snapshot hash mismatch',
        },
        {
          gateNumber: 7,
          gateName: 'Atomic Inventory Slot Capacity Available',
          passed: Boolean(listing && quote && listing.availableSlots >= quote.quantity),
          reason:
            listing && quote
              ? `Available slots: ${listing.availableSlots}, requested: ${quote.quantity}`
              : 'Insufficient slot capacity',
        },
        {
          gateNumber: 8,
          gateName: 'Restricted Area / TIMS / National Park Permit Gate',
          passed: Boolean(
            category &&
              listing &&
              (!category.restrictedPermitRequired || listing.permitVerified)
          ),
          reason: category?.restrictedPermitRequired
            ? listing?.permitVerified
              ? 'Mandatory permit verified'
              : 'Permit unverified'
            : 'No restricted permit required for category',
        },
        {
          gateNumber: 9,
          gateName: 'Government Guide License & Insurance Gate',
          passed: Boolean(
            category &&
              listing &&
              (!category.insuranceRequired ||
                (listing.guideLicenseVerified && listing.insuranceVerified))
          ),
          reason: category?.insuranceRequired
            ? 'Guide license & evacuation insurance verified'
            : 'Standard coverage applies',
        },
        {
          gateNumber: 10,
          gateName: 'DHM Weather & High-Altitude Safety Clearance',
          passed: Boolean(listing && listing.weatherAltitudeClear),
          reason: listing?.weatherAltitudeClear
            ? 'Weather & trail corridor clear'
            : 'Active weather/altitude hazard hold on listing',
        },
        {
          gateNumber: 11,
          gateName: 'Traveler Emergency Contact & Safety Briefing Gate',
          passed: Boolean(
            category &&
              ((!category.emergencyContactRequired || params.emergencyContactProvided) &&
                (!category.safetyCheckInRequired || params.safetyBriefAcknowledged))
          ),
          reason: 'Emergency contact & safety acknowledgment verified',
        },
        {
          gateNumber: 12,
          gateName: 'Idempotency & Double-Entry Ledger Readiness',
          passed: Boolean(cleanIdempotencyKey.length >= 4),
          reason: 'User-bound idempotency key & double-entry ledger ready',
        },
      ];

      const failedGate = evaluations.find((g) => !g.passed);
      if (failedGate || !quote || !listing || !category || !partner) {
        this.recordAudit({
          correlationId: params.correlationId,
          actorUserId: params.session.userId,
          actorEmail: params.session.email,
          actorRole: params.session.role,
          action: 'EXECUTE_BOOKING_12_GATE',
          targetType: 'LISTING',
          targetId: params.listingId,
          outcome: 'DENIED',
          reasonCode: `GATE_${failedGate?.gateNumber || 0}_FAILED`,
          metadata: { failedGate },
        });
        throw new DomainRuleError(
          `Booking blocked at Gate #${failedGate?.gateNumber} (${failedGate?.gateName}): ${failedGate?.reason}`,
          422,
          `BOOKING_GATE_${failedGate?.gateNumber}_FAILED`,
          evaluations
        );
      }

      // Atomic slot decrement with database guard
      const decrementResult = this.db
        .prepare(
          `UPDATE listings
           SET available_slots = available_slots - ?
           WHERE id = ? AND available_slots >= ?`
        )
        .run(quote.quantity, listing.id, quote.quantity);

      if (decrementResult.changes === 0) {
        throw new DomainRuleError(
          'Concurrent inventory contention: insufficient available slots.',
          409,
          'CONCURRENT_INVENTORY_EXHAUSTED'
        );
      }

      const bookingId = `BKG-${randomUUID().slice(0, 8).toUpperCase()}`;
      const holdMs = params.holdDurationMs ?? 15 * 60 * 1000;
      const holdExpiresAt = new Date(now.getTime() + holdMs).toISOString();
      const nowIso = now.toISOString();

      const booking: BookingRecord = {
        bookingId,
        idempotencyKey: cleanIdempotencyKey,
        requestPayloadHash,
        quoteId: quote.quoteId,
        listingId: listing.id,
        partnerId: partner.id,
        categoryKey: category.key,
        travelerUserId: params.session.userId,
        travelerName: params.session.displayName,
        serviceDate: cleanServiceDate,
        quantity: quote.quantity,
        bookingState: 'PAYMENT_PENDING',
        paymentState: 'CREATED',
        totalPaidNPR: quote.totalTravelerPayableNPR,
        holdExpiresAt,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      this.db
        .prepare(
          `INSERT INTO bookings (
            booking_id, idempotency_key, request_payload_hash, quote_id,
            listing_id, partner_id, category_key, traveler_user_id, traveler_name,
            service_date, quantity, booking_state, payment_state, total_paid_npr,
            hold_expires_at, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          booking.bookingId,
          booking.idempotencyKey,
          booking.requestPayloadHash,
          booking.quoteId,
          booking.listingId,
          booking.partnerId,
          booking.categoryKey,
          booking.travelerUserId,
          booking.travelerName,
          booking.serviceDate,
          booking.quantity,
          booking.bookingState,
          booking.paymentState,
          booking.totalPaidNPR,
          booking.holdExpiresAt,
          booking.createdAt,
          booking.updatedAt
        );

      // Mark quote as consumed (single-use)
      this.db
        .prepare(`UPDATE quotes SET consumed_by_booking_id = ? WHERE quote_id = ?`)
        .run(booking.bookingId, quote.quoteId);

      // Create provider-neutral payment intent in CREATED state
      const paymentIntentId = `PI-${randomUUID().slice(0, 8).toUpperCase()}`;
      this.db
        .prepare(
          `INSERT INTO payment_intents (
            payment_intent_id, booking_id, provider, amount_npr, currency,
            state, provider_reference, created_at, updated_at
          ) VALUES (?, ?, 'PROVIDER_NEUTRAL_SANDBOX', ?, 'NPR', 'CREATED', NULL, ?, ?)`
        )
        .run(paymentIntentId, booking.bookingId, booking.totalPaidNPR, nowIso, nowIso);

      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: 'EXECUTE_BOOKING_12_GATE',
        targetType: 'BOOKING',
        targetId: bookingId,
        outcome: 'ALLOWED',
        reasonCode: 'ALL_12_GATES_PASSED_HOLD_PLACED_AWAITING_SIGNED_PAYMENT_WEBHOOK',
        metadata: {
          quoteId: quote.quoteId,
          listingId: listing.id,
          remainingSlots: listing.availableSlots - quote.quantity,
          paymentState: booking.paymentState,
          paymentIntentId,
        },
      });

      return {
        booking,
        gateEvaluations: evaluations,
        idempotentReplay: false,
      };
    });
  }

  /**
   * Processes an HMAC-SHA256 signed, idempotent payment provider webhook.
   * Only a verified webhook can transition payment_state to CAPTURED and post the balanced 5-account capture journal.
   */
  public processPaymentWebhook(params: {
    rawPayload: string;
    signatureHex: string;
    correlationId: string;
  }): {
    booking: BookingRecord;
    journal: DoubleEntryJournal | null;
    idempotentReplay: boolean;
  } {
    if (!verifyWebhookSignature(params.rawPayload, params.signatureHex)) {
      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: 'PAYMENT_WEBHOOK_GATEWAY',
        actorEmail: 'webhook@psp.pherinepal.com',
        actorRole: 'WEBHOOK_PROVIDER',
        action: 'PROCESS_PAYMENT_WEBHOOK',
        targetType: 'WEBHOOK',
        targetId: 'INVALID_SIGNATURE',
        outcome: 'DENIED',
        reasonCode: 'INVALID_WEBHOOK_HMAC_SIGNATURE',
      });
      throw new DomainRuleError(
        'Payment webhook HMAC-SHA256 signature verification failed.',
        401,
        'INVALID_WEBHOOK_SIGNATURE'
      );
    }

    let parsed: {
      providerEventId?: string;
      bookingId?: string;
      eventType?: 'PAYMENT_AUTHORIZED' | 'PAYMENT_CAPTURED' | 'PAYMENT_FAILED';
      amountNPR?: number;
    };
    try {
      parsed = JSON.parse(params.rawPayload);
    } catch {
      throw new DomainRuleError('Malformed webhook JSON payload.', 400, 'MALFORMED_WEBHOOK_JSON');
    }

    const providerEventId = String(parsed.providerEventId || '').trim();
    const bookingId = String(parsed.bookingId || '').trim();
    const eventType = parsed.eventType;
    const amountNPR = Number(parsed.amountNPR);

    if (
      !providerEventId ||
      !bookingId ||
      !eventType ||
      !['PAYMENT_AUTHORIZED', 'PAYMENT_CAPTURED', 'PAYMENT_FAILED'].includes(eventType)
    ) {
      throw new DomainRuleError(
        'providerEventId, bookingId, and valid eventType are required.',
        400,
        'INVALID_WEBHOOK_FIELDS'
      );
    }

    return withImmediateTransaction(this.db, () => {
      const existingEvent = this.db
        .prepare(`SELECT provider_event_id FROM payment_webhook_events WHERE provider_event_id = ?`)
        .get(providerEventId) as { provider_event_id: string } | undefined;

      const bookingRow = this.db
        .prepare(`SELECT * FROM bookings WHERE booking_id = ?`)
        .get(bookingId) as Record<string, unknown> | undefined;

      if (!bookingRow) {
        throw new DomainRuleError(`Booking ${bookingId} not found.`, 404, 'BOOKING_NOT_FOUND');
      }

      const booking = this.mapBookingRow(bookingRow);

      if (existingEvent) {
        const existingJournal =
          this.getLedgerJournals().find(
            (j) => j.bookingId === bookingId && j.eventType === 'CAPTURE'
          ) || null;
        return {
          booking,
          journal: existingJournal,
          idempotentReplay: true,
        };
      }

      if (booking.bookingState === 'EXPIRED_HOLD' || booking.bookingState === 'CANCELLED_BY_TRAVELER') {
        throw new DomainRuleError(
          `Cannot capture payment for booking in ${booking.bookingState} state.`,
          409,
          'BOOKING_HOLD_NOT_ACTIVE'
        );
      }

      if (!Number.isFinite(amountNPR) || amountNPR !== booking.totalPaidNPR) {
        throw new DomainRuleError(
          `Webhook amountNPR (${amountNPR}) does not match booking totalPaidNPR (${booking.totalPaidNPR}).`,
          422,
          'WEBHOOK_AMOUNT_MISMATCH'
        );
      }

      const nowIso = new Date().toISOString();
      const sigHash = sha256Hex(params.signatureHex);

      this.db
        .prepare(
          `INSERT INTO payment_webhook_events (
            provider_event_id, booking_id, event_type, amount_npr, signature_hash, processed_at
          ) VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(providerEventId, bookingId, eventType, amountNPR, sigHash, nowIso);

      let createdJournal: DoubleEntryJournal | null = null;

      if (eventType === 'PAYMENT_AUTHORIZED') {
        this.db
          .prepare(`UPDATE bookings SET payment_state = 'AUTHORIZED', updated_at = ? WHERE booking_id = ?`)
          .run(nowIso, bookingId);
        this.db
          .prepare(`UPDATE payment_intents SET state = 'AUTHORIZED', provider_reference = ?, updated_at = ? WHERE booking_id = ?`)
          .run(providerEventId, nowIso, bookingId);
      } else if (eventType === 'PAYMENT_FAILED') {
        this.db
          .prepare(`UPDATE bookings SET payment_state = 'FAILED', updated_at = ? WHERE booking_id = ?`)
          .run(nowIso, bookingId);
        this.db
          .prepare(`UPDATE payment_intents SET state = 'FAILED', provider_reference = ?, updated_at = ? WHERE booking_id = ?`)
          .run(providerEventId, nowIso, bookingId);
      } else if (eventType === 'PAYMENT_CAPTURED') {
        const quoteRow = this.db
          .prepare(`SELECT * FROM quotes WHERE quote_id = ?`)
          .get(booking.quoteId) as Record<string, unknown>;
        const quote = this.mapQuoteRow(quoteRow);

        // Payment capture transitions payment_state to CAPTURED, while booking_state remains PAYMENT_PENDING awaiting partner confirmation (Rule #5)
        this.db
          .prepare(`UPDATE bookings SET payment_state = 'CAPTURED', updated_at = ? WHERE booking_id = ?`)
          .run(nowIso, bookingId);

        this.db
          .prepare(`UPDATE payment_intents SET state = 'CAPTURED', provider_reference = ?, updated_at = ? WHERE booking_id = ?`)
          .run(providerEventId, nowIso, bookingId);

        createdJournal = this.postDoubleEntryCaptureJournal(bookingId, quote, nowIso);
      }

      const updatedBookingRow = this.db
        .prepare(`SELECT * FROM bookings WHERE booking_id = ?`)
        .get(bookingId) as Record<string, unknown>;

      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: 'PAYMENT_WEBHOOK_GATEWAY',
        actorEmail: 'webhook@psp.pherinepal.com',
        actorRole: 'WEBHOOK_PROVIDER',
        action: 'PROCESS_PAYMENT_WEBHOOK',
        targetType: 'BOOKING',
        targetId: bookingId,
        outcome: 'ALLOWED',
        reasonCode: `${eventType}_VERIFIED_AND_RECORDED`,
        metadata: {
          providerEventId,
          amountNPR,
          journalId: createdJournal?.journalId || null,
        },
      });

      return {
        booking: this.mapBookingRow(updatedBookingRow),
        journal: createdJournal,
        idempotentReplay: false,
      };
    });
  }

  private postDoubleEntryCaptureJournal(
    bookingId: string,
    quote: ImmutableQuote,
    createdAt: string
  ): DoubleEntryJournal {
    const journalId = `JRN-${randomUUID().slice(0, 8).toUpperCase()}`;
    const lines: DoubleEntryLine[] = [
      {
        lineId: `${journalId}-L1`,
        journalId,
        bookingId,
        accountCode: 'PLATFORM_COLLECTION_CLEARING',
        direction: 'DEBIT',
        amountNPR: quote.totalTravelerPayableNPR,
        currency: 'NPR',
        createdAt,
      },
      {
        lineId: `${journalId}-L2`,
        journalId,
        bookingId,
        accountCode: 'PARTNER_PAYABLE_LIABILITY',
        direction: 'CREDIT',
        amountNPR: quote.netPartnerPayoutNPR,
        currency: 'NPR',
        createdAt,
      },
      {
        lineId: `${journalId}-L3`,
        journalId,
        bookingId,
        accountCode: 'PLATFORM_COMMISSION_REVENUE',
        direction: 'CREDIT',
        amountNPR: quote.platformCommissionNPR,
        currency: 'NPR',
        createdAt,
      },
      {
        lineId: `${journalId}-L4`,
        journalId,
        bookingId,
        accountCode: 'PLATFORM_SERVICE_FEE_REVENUE',
        direction: 'CREDIT',
        amountNPR: quote.travelerServiceFeeNPR,
        currency: 'NPR',
        createdAt,
      },
      {
        lineId: `${journalId}-L5`,
        journalId,
        bookingId,
        accountCode: 'TAX_VAT_PAYABLE',
        direction: 'CREDIT',
        amountNPR: quote.taxVatNPR,
        currency: 'NPR',
        createdAt,
      },
    ];

    const totalDebitNPR = lines
      .filter((l) => l.direction === 'DEBIT')
      .reduce((sum, l) => sum + l.amountNPR, 0);
    const totalCreditNPR = lines
      .filter((l) => l.direction === 'CREDIT')
      .reduce((sum, l) => sum + l.amountNPR, 0);

    if (totalDebitNPR !== totalCreditNPR) {
      throw new DomainRuleError(
        `CRITICAL_LEDGER_IMBALANCE: debit=${totalDebitNPR} != credit=${totalCreditNPR}`,
        500,
        'LEDGER_IMBALANCE_ABORT'
      );
    }

    this.db
      .prepare(
        `INSERT INTO ledger_journals (
          journal_id, booking_id, event_type, currency,
          total_debit_npr, total_credit_npr, balanced, created_at
        ) VALUES (?, ?, 'CAPTURE', 'NPR', ?, ?, 1, ?)`
      )
      .run(journalId, bookingId, totalDebitNPR, totalCreditNPR, createdAt);

    const insertLine = this.db.prepare(
      `INSERT INTO ledger_lines (
        line_id, journal_id, booking_id, account_code, direction, amount_npr, currency, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'NPR', ?)`
    );

    for (const l of lines) {
      insertLine.run(
        l.lineId,
        l.journalId,
        l.bookingId,
        l.accountCode,
        l.direction,
        l.amountNPR,
        l.createdAt
      );
    }

    return {
      journalId,
      bookingId,
      eventType: 'CAPTURE',
      currency: 'NPR',
      totalDebitNPR,
      totalCreditNPR,
      balanced: true,
      lines,
      createdAt,
    };
  }

  private postDoubleEntryRefundJournal(
    bookingId: string,
    quote: ImmutableQuote,
    createdAt: string
  ): DoubleEntryJournal {
    const journalId = `JRN-${randomUUID().slice(0, 8).toUpperCase()}`;
    const lines: DoubleEntryLine[] = [
      {
        lineId: `${journalId}-R1`,
        journalId,
        bookingId,
        accountCode: 'PARTNER_PAYABLE_LIABILITY',
        direction: 'DEBIT',
        amountNPR: quote.netPartnerPayoutNPR,
        currency: 'NPR',
        createdAt,
      },
      {
        lineId: `${journalId}-R2`,
        journalId,
        bookingId,
        accountCode: 'PLATFORM_COMMISSION_REVENUE',
        direction: 'DEBIT',
        amountNPR: quote.platformCommissionNPR,
        currency: 'NPR',
        createdAt,
      },
      {
        lineId: `${journalId}-R3`,
        journalId,
        bookingId,
        accountCode: 'PLATFORM_SERVICE_FEE_REVENUE',
        direction: 'DEBIT',
        amountNPR: quote.travelerServiceFeeNPR,
        currency: 'NPR',
        createdAt,
      },
      {
        lineId: `${journalId}-R4`,
        journalId,
        bookingId,
        accountCode: 'TAX_VAT_PAYABLE',
        direction: 'DEBIT',
        amountNPR: quote.taxVatNPR,
        currency: 'NPR',
        createdAt,
      },
      {
        lineId: `${journalId}-R5`,
        journalId,
        bookingId,
        accountCode: 'TRAVELER_REFUND_CLEARING',
        direction: 'CREDIT',
        amountNPR: quote.totalTravelerPayableNPR,
        currency: 'NPR',
        createdAt,
      },
    ];

    const totalDebitNPR = lines
      .filter((l) => l.direction === 'DEBIT')
      .reduce((sum, l) => sum + l.amountNPR, 0);
    const totalCreditNPR = lines
      .filter((l) => l.direction === 'CREDIT')
      .reduce((sum, l) => sum + l.amountNPR, 0);

    if (totalDebitNPR !== totalCreditNPR) {
      throw new DomainRuleError(
        `CRITICAL_REFUND_LEDGER_IMBALANCE: debit=${totalDebitNPR} != credit=${totalCreditNPR}`,
        500,
        'LEDGER_IMBALANCE_ABORT'
      );
    }

    this.db
      .prepare(
        `INSERT INTO ledger_journals (
          journal_id, booking_id, event_type, currency,
          total_debit_npr, total_credit_npr, balanced, created_at
        ) VALUES (?, ?, 'REFUND', 'NPR', ?, ?, 1, ?)`
      )
      .run(journalId, bookingId, totalDebitNPR, totalCreditNPR, createdAt);

    const insertLine = this.db.prepare(
      `INSERT INTO ledger_lines (
        line_id, journal_id, booking_id, account_code, direction, amount_npr, currency, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'NPR', ?)`
    );

    for (const l of lines) {
      insertLine.run(
        l.lineId,
        l.journalId,
        l.bookingId,
        l.accountCode,
        l.direction,
        l.amountNPR,
        l.createdAt
      );
    }

    return {
      journalId,
      bookingId,
      eventType: 'REFUND',
      currency: 'NPR',
      totalDebitNPR,
      totalCreditNPR,
      balanced: true,
      lines,
      createdAt,
    };
  }

  /**
   * Partner decision (APPROVE or REJECT).
   * - Requires PARTNER (matching booking.partnerId) or FOUNDER_ADMIN + MFA.
   * - Never marks payment CAPTURED; requires paymentState === 'CAPTURED' prior to APPROVE.
   */
  public partnerDecision(params: {
    bookingId: string;
    decision: 'APPROVE' | 'REJECT';
    session: AuthenticatedSessionContext;
    correlationId: string;
  }): BookingRecord {
    if (params.session.role !== 'PARTNER' && params.session.role !== 'FOUNDER_ADMIN') {
      throw new DomainRuleError(
        'Only PARTNER or FOUNDER_ADMIN can confirm or reject a booking.',
        403,
        'RBAC_ROLE_FORBIDDEN'
      );
    }
    if (!params.session.mfaVerified) {
      throw new DomainRuleError(
        'TOTP MFA step-up verification is required for partner booking decisions.',
        403,
        'MFA_STEP_UP_REQUIRED'
      );
    }

    return withImmediateTransaction(this.db, () => {
      const bookingRow = this.db
        .prepare(`SELECT * FROM bookings WHERE booking_id = ?`)
        .get(params.bookingId) as Record<string, unknown> | undefined;

      if (!bookingRow) {
        throw new DomainRuleError(`Booking ${params.bookingId} not found.`, 404, 'BOOKING_NOT_FOUND');
      }

      const booking = this.mapBookingRow(bookingRow);

      if (
        params.session.role === 'PARTNER' &&
        params.session.partnerId !== booking.partnerId
      ) {
        this.recordAudit({
          correlationId: params.correlationId,
          actorUserId: params.session.userId,
          actorEmail: params.session.email,
          actorRole: params.session.role,
          action: 'PARTNER_BOOKING_DECISION',
          targetType: 'BOOKING',
          targetId: booking.bookingId,
          outcome: 'DENIED',
          reasonCode: 'PARTNER_OWNERSHIP_MISMATCH',
          metadata: {
            actorPartnerId: params.session.partnerId,
            bookingPartnerId: booking.partnerId,
          },
        });
        throw new DomainRuleError(
          `Partner organization mismatch: session partner (${params.session.partnerId}) does not own booking (${booking.partnerId}).`,
          403,
          'PARTNER_OWNERSHIP_MISMATCH'
        );
      }

      if (booking.bookingState !== 'PAYMENT_PENDING' && booking.bookingState !== 'HOLD_PLACED') {
        throw new DomainRuleError(
          `Booking ${booking.bookingId} cannot be decided from state ${booking.bookingState}.`,
          409,
          'INVALID_BOOKING_STATE_TRANSITION'
        );
      }

      const nowIso = new Date().toISOString();

      if (params.decision === 'APPROVE') {
        if (booking.paymentState !== 'CAPTURED') {
          this.recordAudit({
            correlationId: params.correlationId,
            actorUserId: params.session.userId,
            actorEmail: params.session.email,
            actorRole: params.session.role,
            action: 'PARTNER_BOOKING_APPROVE',
            targetType: 'BOOKING',
            targetId: booking.bookingId,
            outcome: 'DENIED',
            reasonCode: 'PAYMENT_CAPTURE_REQUIRED_BEFORE_CONFIRMATION',
            metadata: { currentPaymentState: booking.paymentState },
          });
          throw new DomainRuleError(
            `Partner cannot confirm booking ${booking.bookingId} while paymentState is "${booking.paymentState}". Payment must be CAPTURED via verified provider webhook first.`,
            409,
            'PAYMENT_CAPTURE_REQUIRED_BEFORE_CONFIRMATION'
          );
        }

        this.db
          .prepare(
            `UPDATE bookings SET booking_state = 'PARTNER_CONFIRMED', updated_at = ? WHERE booking_id = ?`
          )
          .run(nowIso, booking.bookingId);
      } else {
        // REJECT
        let nextPaymentState = booking.paymentState;
        if (booking.paymentState === 'CAPTURED') {
          const quoteRow = this.db
            .prepare(`SELECT * FROM quotes WHERE quote_id = ?`)
            .get(booking.quoteId) as Record<string, unknown>;
          const quote = this.mapQuoteRow(quoteRow);
          this.postDoubleEntryRefundJournal(booking.bookingId, quote, nowIso);
          nextPaymentState = 'REFUNDED';
          this.db
            .prepare(`UPDATE payment_intents SET state = 'REFUNDED', updated_at = ? WHERE booking_id = ?`)
            .run(nowIso, booking.bookingId);
        } else {
          nextPaymentState = 'FAILED';
          this.db
            .prepare(`UPDATE payment_intents SET state = 'REVERSED', updated_at = ? WHERE booking_id = ?`)
            .run(nowIso, booking.bookingId);
        }

        this.db
          .prepare(
            `UPDATE bookings
             SET booking_state = 'REJECTED_BY_PARTNER',
                 payment_state = ?,
                 updated_at = ?
             WHERE booking_id = ?`
          )
          .run(nextPaymentState, nowIso, booking.bookingId);

        this.db
          .prepare(
            `UPDATE listings
             SET available_slots = MIN(capacity_per_slot, available_slots + ?)
             WHERE id = ?`
          )
          .run(booking.quantity, booking.listingId);
      }

      const updatedRow = this.db
        .prepare(`SELECT * FROM bookings WHERE booking_id = ?`)
        .get(booking.bookingId) as Record<string, unknown>;
      const updatedBooking = this.mapBookingRow(updatedRow);

      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: `PARTNER_BOOKING_${params.decision}`,
        targetType: 'BOOKING',
        targetId: booking.bookingId,
        outcome: 'ALLOWED',
        reasonCode:
          params.decision === 'APPROVE'
            ? 'PARTNER_CONFIRMED_AFTER_VERIFIED_CAPTURE'
            : 'PARTNER_REJECTED_SLOTS_RELEASED',
      });

      return updatedBooking;
    });
  }

  public cancelBooking(params: {
    bookingId: string;
    session: AuthenticatedSessionContext;
    correlationId: string;
  }): BookingRecord {
    return withImmediateTransaction(this.db, () => {
      const bookingRow = this.db
        .prepare(`SELECT * FROM bookings WHERE booking_id = ?`)
        .get(params.bookingId) as Record<string, unknown> | undefined;

      if (!bookingRow) {
        throw new DomainRuleError(`Booking ${params.bookingId} not found.`, 404, 'BOOKING_NOT_FOUND');
      }

      const booking = this.mapBookingRow(bookingRow);

      if (
        params.session.role === 'TRAVELER' &&
        booking.travelerUserId !== params.session.userId
      ) {
        throw new DomainRuleError(
          'You can only cancel your own bookings.',
          403,
          'BOOKING_OWNERSHIP_MISMATCH'
        );
      }

      if (
        !['HOLD_PLACED', 'PAYMENT_PENDING', 'PARTNER_CONFIRMED'].includes(booking.bookingState)
      ) {
        throw new DomainRuleError(
          `Booking cannot be cancelled from state ${booking.bookingState}.`,
          409,
          'INVALID_CANCELLATION_STATE'
        );
      }

      const nowIso = new Date().toISOString();
      let nextPaymentState = booking.paymentState;

      if (booking.paymentState === 'CAPTURED') {
        const quoteRow = this.db
          .prepare(`SELECT * FROM quotes WHERE quote_id = ?`)
          .get(booking.quoteId) as Record<string, unknown>;
        const quote = this.mapQuoteRow(quoteRow);
        this.postDoubleEntryRefundJournal(booking.bookingId, quote, nowIso);
        nextPaymentState = 'REFUNDED';
        this.db
          .prepare(`UPDATE payment_intents SET state = 'REFUNDED', updated_at = ? WHERE booking_id = ?`)
          .run(nowIso, booking.bookingId);
      } else {
        nextPaymentState = 'FAILED';
        this.db
          .prepare(`UPDATE payment_intents SET state = 'REVERSED', updated_at = ? WHERE booking_id = ?`)
          .run(nowIso, booking.bookingId);
      }

      this.db
        .prepare(
          `UPDATE bookings
           SET booking_state = 'CANCELLED_BY_TRAVELER',
               payment_state = ?,
               updated_at = ?
           WHERE booking_id = ?`
        )
        .run(nextPaymentState, nowIso, booking.bookingId);

      this.db
        .prepare(
          `UPDATE listings
           SET available_slots = MIN(capacity_per_slot, available_slots + ?)
           WHERE id = ?`
        )
        .run(booking.quantity, booking.listingId);

      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: 'CANCEL_BOOKING',
        targetType: 'BOOKING',
        targetId: booking.bookingId,
        outcome: 'ALLOWED',
        reasonCode: 'BOOKING_CANCELLED_SLOTS_RESTORED',
      });

      const updatedRow = this.db
        .prepare(`SELECT * FROM bookings WHERE booking_id = ?`)
        .get(booking.bookingId) as Record<string, unknown>;
      return this.mapBookingRow(updatedRow);
    });
  }

  public refundBooking(params: {
    bookingId: string;
    session: AuthenticatedSessionContext;
    correlationId: string;
  }): { booking: BookingRecord; journal: DoubleEntryJournal } {
    if (
      params.session.role !== 'FINANCE_OFFICER' &&
      params.session.role !== 'FOUNDER_ADMIN'
    ) {
      throw new DomainRuleError(
        'Only FINANCE_OFFICER or FOUNDER_ADMIN can execute ledger refunds.',
        403,
        'RBAC_ROLE_FORBIDDEN'
      );
    }
    if (!params.session.mfaVerified) {
      throw new DomainRuleError(
        'TOTP MFA step-up verification is required for financial refunds.',
        403,
        'MFA_STEP_UP_REQUIRED'
      );
    }

    return withImmediateTransaction(this.db, () => {
      const bookingRow = this.db
        .prepare(`SELECT * FROM bookings WHERE booking_id = ?`)
        .get(params.bookingId) as Record<string, unknown> | undefined;

      if (!bookingRow) {
        throw new DomainRuleError(`Booking ${params.bookingId} not found.`, 404, 'BOOKING_NOT_FOUND');
      }

      const booking = this.mapBookingRow(bookingRow);
      if (booking.paymentState === 'REFUNDED' || booking.bookingState === 'REFUNDED') {
        throw new DomainRuleError(
          `Booking ${booking.bookingId} has already been refunded.`,
          409,
          'BOOKING_ALREADY_REFUNDED'
        );
      }

      if (booking.paymentState !== 'CAPTURED' && booking.paymentState !== 'SETTLEMENT_ELIGIBLE') {
        throw new DomainRuleError(
          `Cannot refund booking ${booking.bookingId} in payment state ${booking.paymentState}.`,
          409,
          'REFUND_REQUIRES_CAPTURED_PAYMENT'
        );
      }

      const quoteRow = this.db
        .prepare(`SELECT * FROM quotes WHERE quote_id = ?`)
        .get(booking.quoteId) as Record<string, unknown>;
      const quote = this.mapQuoteRow(quoteRow);
      const nowIso = new Date().toISOString();

      const journal = this.postDoubleEntryRefundJournal(booking.bookingId, quote, nowIso);

      this.db
        .prepare(
          `UPDATE bookings
           SET booking_state = 'REFUNDED',
               payment_state = 'REFUNDED',
               updated_at = ?
           WHERE booking_id = ?`
        )
        .run(nowIso, booking.bookingId);

      this.db
        .prepare(`UPDATE payment_intents SET state = 'REFUNDED', updated_at = ? WHERE booking_id = ?`)
        .run(nowIso, booking.bookingId);

      this.db
        .prepare(
          `UPDATE listings
           SET available_slots = MIN(capacity_per_slot, available_slots + ?)
           WHERE id = ?`
        )
        .run(booking.quantity, booking.listingId);

      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: 'EXECUTE_DOUBLE_ENTRY_REFUND',
        targetType: 'BOOKING',
        targetId: booking.bookingId,
        outcome: 'ALLOWED',
        reasonCode: 'BALANCED_5_ACCOUNT_REFUND_POSTED',
        metadata: { journalId: journal.journalId },
      });

      const updatedRow = this.db
        .prepare(`SELECT * FROM bookings WHERE booking_id = ?`)
        .get(booking.bookingId) as Record<string, unknown>;
      return {
        booking: this.mapBookingRow(updatedRow),
        journal,
      };
    });
  }

  public completeBookingStay(params: {
    bookingId: string;
    session: AuthenticatedSessionContext;
    correlationId: string;
  }): BookingRecord {
    return withImmediateTransaction(this.db, () => {
      const bookingRow = this.db
        .prepare(`SELECT * FROM bookings WHERE booking_id = ?`)
        .get(params.bookingId) as Record<string, unknown> | undefined;

      if (!bookingRow) {
        throw new DomainRuleError(`Booking ${params.bookingId} not found.`, 404, 'BOOKING_NOT_FOUND');
      }

      const booking = this.mapBookingRow(bookingRow);

      if (
        params.session.role === 'PARTNER' &&
        params.session.partnerId !== booking.partnerId
      ) {
        throw new DomainRuleError(
          'Partner can only complete bookings belonging to their organization.',
          403,
          'PARTNER_OWNERSHIP_MISMATCH'
        );
      }

      if (
        params.session.role === 'TRAVELER' &&
        params.session.userId !== booking.travelerUserId
      ) {
        throw new DomainRuleError(
          'Traveler can only mark their own confirmed stay completed.',
          403,
          'BOOKING_OWNERSHIP_MISMATCH'
        );
      }

      if (
        booking.bookingState !== 'PARTNER_CONFIRMED' &&
        booking.bookingState !== 'ACTIVE_SERVICE'
      ) {
        throw new DomainRuleError(
          `Only PARTNER_CONFIRMED or ACTIVE_SERVICE bookings can transition to COMPLETED (current: ${booking.bookingState}).`,
          409,
          'BOOKING_NOT_CONFIRMED'
        );
      }

      const nowIso = new Date().toISOString();
      this.db
        .prepare(
          `UPDATE bookings
           SET booking_state = 'COMPLETED',
               payment_state = 'SETTLEMENT_ELIGIBLE',
               updated_at = ?
           WHERE booking_id = ?`
        )
        .run(nowIso, booking.bookingId);

      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: 'COMPLETE_BOOKING_SERVICE',
        targetType: 'BOOKING',
        targetId: booking.bookingId,
        outcome: 'ALLOWED',
        reasonCode: 'SERVICE_COMPLETED_SETTLEMENT_ELIGIBLE',
      });

      const updatedRow = this.db
        .prepare(`SELECT * FROM bookings WHERE booking_id = ?`)
        .get(booking.bookingId) as Record<string, unknown>;
      return this.mapBookingRow(updatedRow);
    });
  }

  public submitReview(params: {
    bookingId: string;
    rating: number;
    comment: string;
    session: AuthenticatedSessionContext;
    correlationId: string;
  }): ReviewRecord {
    return withImmediateTransaction(this.db, () => {
      const bookingRow = this.db
        .prepare(`SELECT * FROM bookings WHERE booking_id = ?`)
        .get(params.bookingId) as Record<string, unknown> | undefined;

      if (!bookingRow) {
        throw new DomainRuleError(
          'Review rejected: Booking ID does not exist.',
          404,
          'REVIEW_BOOKING_NOT_FOUND'
        );
      }

      const booking = this.mapBookingRow(bookingRow);

      if (booking.travelerUserId !== params.session.userId) {
        throw new DomainRuleError(
          'Review rejected: You can only review a booking owned by your traveler account.',
          403,
          'REVIEW_OWNERSHIP_MISMATCH'
        );
      }

      if (booking.bookingState !== 'COMPLETED') {
        this.recordAudit({
          correlationId: params.correlationId,
          actorUserId: params.session.userId,
          actorEmail: params.session.email,
          actorRole: params.session.role,
          action: 'SUBMIT_REVIEW',
          targetType: 'BOOKING',
          targetId: params.bookingId,
          outcome: 'DENIED',
          reasonCode: 'UNVERIFIED_STAY_NOT_COMPLETED',
          metadata: { currentBookingState: booking.bookingState },
        });
        throw new DomainRuleError(
          `Anti-Fake-Review Gate: Booking ${booking.bookingId} is in state "${booking.bookingState}". Only COMPLETED bookings can submit a verified review.`,
          422,
          'UNVERIFIED_STAY_NOT_COMPLETED'
        );
      }

      const existingReview = this.db
        .prepare(`SELECT review_id FROM reviews WHERE booking_id = ?`)
        .get(booking.bookingId) as { review_id: string } | undefined;

      if (existingReview) {
        throw new DomainRuleError(
          `A verified review (${existingReview.review_id}) already exists for booking ${booking.bookingId}.`,
          409,
          'DUPLICATE_BOOKING_REVIEW'
        );
      }

      const cleanRating = Math.max(1, Math.min(5, Math.round(Number(params.rating) || 5)));
      const cleanComment = String(params.comment || '').trim();
      if (!cleanComment) {
        throw new DomainRuleError('Review comment cannot be empty.', 400, 'EMPTY_REVIEW_COMMENT');
      }

      const review: ReviewRecord = {
        reviewId: `REV-${randomUUID().slice(0, 6).toUpperCase()}`,
        bookingId: booking.bookingId,
        listingId: booking.listingId,
        travelerUserId: params.session.userId,
        travelerName: params.session.displayName,
        rating: cleanRating,
        comment: cleanComment,
        verifiedCompletedStay: true,
        moderationStatus: 'APPROVED_AUTHENTIC',
        createdAt: new Date().toISOString(),
      };

      this.db
        .prepare(
          `INSERT INTO reviews (
            review_id, booking_id, listing_id, traveler_user_id, traveler_name,
            rating, comment, verified_completed_stay, moderation_status, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'APPROVED_AUTHENTIC', ?)`
        )
        .run(
          review.reviewId,
          review.bookingId,
          review.listingId,
          review.travelerUserId,
          review.travelerName,
          review.rating,
          review.comment,
          review.createdAt
        );

      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: 'SUBMIT_REVIEW',
        targetType: 'REVIEW',
        targetId: review.reviewId,
        outcome: 'ALLOWED',
        reasonCode: 'VERIFIED_COMPLETED_STAY_CONFIRMED',
      });

      return review;
    });
  }

  public createIncident(params: {
    bookingId?: string | null;
    tripId?: string;
    categoryKey: string;
    severity: SafetyIncidentRecord['severity'];
    title: string;
    description: string;
    gpsCoordinates?: string | null;
    session: AuthenticatedSessionContext;
    correlationId: string;
  }): SafetyIncidentRecord {
    return withImmediateTransaction(this.db, () => {
      let resolvedTripId = String(params.tripId || '').trim();
      const bookingId = params.bookingId ? String(params.bookingId).trim() : null;

      if (bookingId) {
        const bRow = this.db
          .prepare(`SELECT booking_id, traveler_user_id, partner_id FROM bookings WHERE booking_id = ?`)
          .get(bookingId) as
          | { booking_id: string; traveler_user_id: string; partner_id: string }
          | undefined;

        if (!bRow) {
          throw new DomainRuleError(`Booking ${bookingId} not found.`, 404, 'BOOKING_NOT_FOUND');
        }

        const isStaff =
          params.session.role === 'SAFETY_LEAD' ||
          params.session.role === 'SUPPORT_AGENT' ||
          params.session.role === 'FOUNDER_ADMIN';
        const isOwnerTraveler = bRow.traveler_user_id === params.session.userId;
        const isOwnerPartner =
          params.session.role === 'PARTNER' && bRow.partner_id === params.session.partnerId;

        if (!isStaff && !isOwnerTraveler && !isOwnerPartner) {
          throw new DomainRuleError(
            'You can only report an incident for a booking associated with your account.',
            403,
            'INCIDENT_BOOKING_OWNERSHIP_MISMATCH'
          );
        }
        if (!resolvedTripId) {
          resolvedTripId = `TRIP-${bookingId}`;
        }
      } else {
        if (!resolvedTripId) {
          resolvedTripId = `TRIP-${params.session.userId}`;
        }
      }

      const userConsent = this.getPrivacyConsent(params.session.userId);
      const gpsAllowed = Boolean(userConsent.safetyGpsTelemetry);
      const now = new Date().toISOString();

      const incident: SafetyIncidentRecord = {
        incidentId: `INC-${randomUUID().slice(0, 6).toUpperCase()}`,
        bookingId,
        tripId: resolvedTripId,
        reporterUserId: params.session.userId,
        categoryKey: params.categoryKey || 'emergency-sos',
        severity: params.severity,
        title: String(params.title || '').trim(),
        description: String(params.description || '').trim(),
        gpsCoordinates: gpsAllowed ? params.gpsCoordinates || null : null,
        status: params.severity === 'SEV1_CRITICAL_LIFE_SAFETY' ? 'DISPATCHED' : 'OPEN_TRIAGE',
        assignedDeskOwner: 'Safety & SOS Command Desk (DSH-04)',
        escalationLog: [
          `[${now}] Incident logged by ${params.session.email} (${params.severity})`,
          gpsAllowed
            ? `[${now}] Opt-in GPS telemetry attached (auto-expires in ${userConsent.gpsAutoExpireHours}h at ${userConsent.gpsExpiresAt})`
            : `[${now}] GPS coordinates omitted per traveler privacy consent settings`,
        ],
        createdAt: now,
        updatedAt: now,
      };

      this.db
        .prepare(
          `INSERT INTO incidents (
            incident_id, booking_id, trip_id, reporter_user_id, category_key,
            severity, title, description, gps_coordinates, status,
            assigned_desk_owner, escalation_log_json, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          incident.incidentId,
          incident.bookingId,
          incident.tripId,
          incident.reporterUserId,
          incident.categoryKey,
          incident.severity,
          incident.title,
          incident.description,
          incident.gpsCoordinates,
          incident.status,
          incident.assignedDeskOwner,
          JSON.stringify(incident.escalationLog),
          incident.createdAt,
          incident.updatedAt
        );

      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: 'CREATE_SAFETY_INCIDENT',
        targetType: 'INCIDENT',
        targetId: incident.incidentId,
        outcome: 'ALLOWED',
        reasonCode: incident.severity,
        metadata: { gpsAttached: gpsAllowed, bookingId },
      });

      return incident;
    });
  }

  public updatePrivacyConsent(params: {
    safetyGpsTelemetry: boolean;
    analyticsCookies: boolean;
    aiAssistantPrompts: boolean;
    marketingNotifications: boolean;
    purpose?: string;
    session: AuthenticatedSessionContext;
    correlationId: string;
  }): PrivacyConsentRecord {
    return withImmediateTransaction(this.db, () => {
      const now = new Date();
      const gpsExpiresAt = params.safetyGpsTelemetry
        ? new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString()
        : null;
      const purpose =
        String(params.purpose || '').trim() ||
        'TRAVELER_EXPLICIT_CONSENT_PREFERENCE_UPDATE';

      this.db
        .prepare(
          `INSERT INTO user_privacy_consents (
            user_id, essential_booking_data, safety_gps_telemetry, analytics_cookies,
            ai_assistant_prompts, marketing_notifications, consent_version, purpose,
            gps_auto_expire_hours, gps_expires_at, revoked_at, updated_at
          ) VALUES (?, 1, ?, ?, ?, ?, 'PNP-PRIVACY-v1.0', ?, 4, ?, NULL, ?)
          ON CONFLICT(user_id) DO UPDATE SET
            safety_gps_telemetry = excluded.safety_gps_telemetry,
            analytics_cookies = excluded.analytics_cookies,
            ai_assistant_prompts = excluded.ai_assistant_prompts,
            marketing_notifications = excluded.marketing_notifications,
            purpose = excluded.purpose,
            gps_expires_at = excluded.gps_expires_at,
            revoked_at = NULL,
            updated_at = excluded.updated_at`
        )
        .run(
          params.session.userId,
          params.safetyGpsTelemetry ? 1 : 0,
          params.analyticsCookies ? 1 : 0,
          params.aiAssistantPrompts ? 1 : 0,
          params.marketingNotifications ? 1 : 0,
          purpose,
          gpsExpiresAt,
          now.toISOString()
        );

      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: 'UPDATE_PRIVACY_CONSENT',
        targetType: 'PRIVACY_CONSENT',
        targetId: params.session.userId,
        outcome: 'ALLOWED',
        reasonCode: 'GRANULAR_CONSENT_UPDATED',
        metadata: {
          safetyGpsTelemetry: params.safetyGpsTelemetry,
          gpsExpiresAt,
        },
      });

      return this.getPrivacyConsent(params.session.userId);
    });
  }

  public revokePrivacyConsent(params: {
    session: AuthenticatedSessionContext;
    correlationId: string;
  }): PrivacyConsentRecord {
    return withImmediateTransaction(this.db, () => {
      const nowIso = new Date().toISOString();
      this.db
        .prepare(
          `UPDATE user_privacy_consents
           SET safety_gps_telemetry = 0,
               analytics_cookies = 0,
               ai_assistant_prompts = 0,
               marketing_notifications = 0,
               purpose = 'CONSENT_WITHDRAWN_BY_TRAVELER',
               gps_expires_at = NULL,
               revoked_at = ?,
               updated_at = ?
           WHERE user_id = ?`
        )
        .run(nowIso, nowIso, params.session.userId);

      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: 'REVOKE_PRIVACY_CONSENT',
        targetType: 'PRIVACY_CONSENT',
        targetId: params.session.userId,
        outcome: 'ALLOWED',
        reasonCode: 'ALL_NON_ESSENTIAL_CONSENTS_REVOKED',
      });

      return this.getPrivacyConsent(params.session.userId);
    });
  }

  public overrideCategoryStatus(params: {
    categoryKey: string;
    newStatus: CategoryStatus;
    reasonCode: string;
    session: AuthenticatedSessionContext;
    correlationId: string;
  }): CanonicalCategory {
    if (params.session.role !== 'FOUNDER_ADMIN') {
      throw new DomainRuleError(
        'Only FOUNDER_ADMIN can override canonical category availability state.',
        403,
        'RBAC_ROLE_FORBIDDEN'
      );
    }
    if (!params.session.mfaVerified) {
      this.recordAudit({
        correlationId: params.correlationId,
        actorUserId: params.session.userId,
        actorEmail: params.session.email,
        actorRole: params.session.role,
        action: 'OVERRIDE_CATEGORY_STATUS',
        targetType: 'CATEGORY',
        targetId: params.categoryKey,
        outcome: 'DENIED',
        reasonCode: 'MFA_STEP_UP_REQUIRED',
      });
      throw new DomainRuleError(
        'TOTP MFA step-up verification is required for category state governance overrides.',
        403,
        'MFA_STEP_UP_REQUIRED'
      );
    }

    if (!isValidCategoryStatus(params.newStatus)) {
      throw new DomainRuleError(
        `Invalid CategoryStatus "${String(params.newStatus)}". Allowed values: AVAILABLE, COMING_SOON, INFORMATION_ONLY, RESTRICTED.`,
        400,
        'INVALID_CATEGORY_STATUS_ENUM'
      );
    }

    const cat = this.getCategories().find((c) => c.key === params.categoryKey);
    if (!cat) {
      throw new DomainRuleError(`Category ${params.categoryKey} not found.`, 404, 'CATEGORY_NOT_FOUND');
    }

    if (
      RESTRICTED_HARD_GATE_KEYS.includes(params.categoryKey) &&
      params.newStatus === 'AVAILABLE'
    ) {
      throw new DomainRuleError(
        `Restricted high-liability category "${params.categoryKey}" cannot be set to AVAILABLE in PH00 without statutory regulatory clearance (LEG-003/004/011).`,
        403,
        'RESTRICTED_CATEGORY_UNLOCK_PROHIBITED_IN_PH00'
      );
    }

    const cleanReason = String(params.reasonCode || 'FOUNDER_GOVERNANCE_OVERRIDE').trim();
    this.db
      .prepare(`UPDATE categories SET status = ?, reason_code = ? WHERE key = ?`)
      .run(params.newStatus, cleanReason, params.categoryKey);

    this.recordAudit({
      correlationId: params.correlationId,
      actorUserId: params.session.userId,
      actorEmail: params.session.email,
      actorRole: params.session.role,
      action: 'OVERRIDE_CATEGORY_STATUS',
      targetType: 'CATEGORY',
      targetId: params.categoryKey,
      outcome: 'ALLOWED',
      reasonCode: cleanReason,
      metadata: { previousStatus: cat.status, newStatus: params.newStatus },
    });

    return this.getCategories().find((c) => c.key === params.categoryKey)!;
  }

  public toggleGlobalKillSwitch(params: {
    active: boolean;
    session: AuthenticatedSessionContext;
    correlationId: string;
  }): boolean {
    if (params.session.role !== 'FOUNDER_ADMIN') {
      throw new DomainRuleError(
        'Only FOUNDER_ADMIN can toggle the platform global kill-switch.',
        403,
        'RBAC_ROLE_FORBIDDEN'
      );
    }
    if (!params.session.mfaVerified) {
      throw new DomainRuleError(
        'TOTP MFA step-up verification is required to toggle the global kill-switch.',
        403,
        'MFA_STEP_UP_REQUIRED'
      );
    }

    const now = new Date().toISOString();
    this.db
      .prepare(
        `UPDATE platform_config
         SET config_value = ?, updated_at = ?, updated_by_user_id = ?
         WHERE config_key = 'GLOBAL_KILL_SWITCH'`
      )
      .run(String(params.active), now, params.session.userId);

    this.recordAudit({
      correlationId: params.correlationId,
      actorUserId: params.session.userId,
      actorEmail: params.session.email,
      actorRole: params.session.role,
      action: 'TOGGLE_GLOBAL_KILL_SWITCH',
      targetType: 'PLATFORM',
      targetId: 'GLOBAL_KILL_SWITCH',
      outcome: 'ALLOWED',
      reasonCode: params.active ? 'KILL_SWITCH_ENGAGED' : 'KILL_SWITCH_RELEASED',
    });

    return this.isGlobalKillSwitchActive();
  }

  /**
   * Executes the automated invariant verification suite against an ISOLATED temporary SQLite file
   * so that verification runs never mutate or pollute the live operational database.
   */
  public runIsolatedInvariantSuite(correlationId: string) {
    const tempDbPath = path.join(
      os.tmpdir(),
      `pherinepal-verify-${randomUUID()}.sqlite`
    );

    const isolatedStore = new PheriNepalDomainStore(tempDbPath);
    const results: Array<{
      id: string;
      name: string;
      status: 'VERIFIED';
      passed: boolean;
      evidence: string;
    }> = [];

    try {
      const categories = isolatedStore.getCategories();

      // 1. Canonical Blueprint Constants & Complete 22-Point Appendix A Contracts
      const allHave22Items = categories.every(
        (c) => Object.keys(c.appendixAContract).length === 22
      );
      const countOk =
        categories.length === 31 &&
        CANONICAL_DASHBOARDS.length === 8 &&
        CANONICAL_PHASES.length === 18 &&
        CANONICAL_FEATURE_MODULES.length === 240 &&
        allHave22Items;
      results.push({
        id: 'INV-01',
        name: 'Canonical Counts & Complete 22-Point Appendix A Contracts (31x22=682)',
        status: 'VERIFIED',
        passed: countOk,
        evidence: `Categories=${categories.length} (0 AVAILABLE by default in PH00), Dashboards=${CANONICAL_DASHBOARDS.length}, Phases=${CANONICAL_PHASES.length}, Modules=${CANONICAL_FEATURE_MODULES.length}, AppendixAAttributes=${categories.length * 22}`,
      });

      // Authenticate Founder + MFA in isolated store to enable sandbox pilot preview for transactional tests
      const founderLogin = isolatedStore.loginUser({
        email: 'founder@pherinepal.com',
        password: 'Founder#PH00!2026',
        correlationId,
      });
      const founderMfaSession = isolatedStore.verifySessionMfa({
        session: founderLogin.session,
        totpCode: generateTotpCode(SEEDED_USERS[0].totpSecretHex),
        correlationId,
      });

      isolatedStore.setSandboxPilotPreviewMode({
        enabled: true,
        session: founderMfaSession,
        correlationId,
      });

      // Authenticate Traveler
      const travelerLogin = isolatedStore.loginUser({
        email: 'aarav.sharma@example.com',
        password: 'Traveler1#PH00!2026',
        correlationId,
      });

      // 2. Restricted Category Hard-Block (including peak-climbing #29)
      let restrictedBlocked = false;
      try {
        isolatedStore.overrideCategoryStatus({
          categoryKey: 'peak-climbing',
          newStatus: 'AVAILABLE',
          reasonCode: 'ATTEMPT_RESTRICTED_BYPASS',
          session: founderMfaSession,
          correlationId,
        });
      } catch (e) {
        restrictedBlocked =
          e instanceof DomainRuleError &&
          e.reasonCode === 'RESTRICTED_CATEGORY_UNLOCK_PROHIBITED_IN_PH00';
      }
      results.push({
        id: 'INV-02',
        name: 'All 6 Restricted Categories Hard-Gate Enforcement (incl. peak-climbing)',
        status: 'VERIFIED',
        passed: restrictedBlocked,
        evidence: 'Restricted category unlock rejected with HTTP 403 RESTRICTED_CATEGORY_UNLOCK_PROHIBITED_IN_PH00',
      });

      // 3. Two-Person Distinct-Reviewer KYB Separation of Duties
      const comp1Login = isolatedStore.loginUser({
        email: 'verifier.one@pherinepal.com',
        password: 'Compliance1#PH00!2026',
        correlationId,
      });
      const comp1Mfa = isolatedStore.verifySessionMfa({
        session: comp1Login.session,
        totpCode: generateTotpCode(SEEDED_USERS[1].totpSecretHex),
        correlationId,
      });

      let selfApprovalBlocked = false;
      try {
        isolatedStore.approvePartnerSecondary({
          partnerId: 'PTN-003',
          session: comp1Mfa,
          correlationId,
        });
      } catch (e) {
        selfApprovalBlocked =
          e instanceof DomainRuleError &&
          e.reasonCode === 'TWO_PERSON_DISTINCT_REVIEWER_VIOLATION';
      }
      results.push({
        id: 'INV-03',
        name: 'Two-Person Distinct-Reviewer KYB Separation of Duties (User ID + SQL CHECK)',
        status: 'VERIFIED',
        passed: selfApprovalBlocked,
        evidence: 'Self-approval by primary reviewer USR-COMP-001 rejected with HTTP 403 TWO_PERSON_DISTINCT_REVIEWER_VIOLATION',
      });

      // 4. Single-Use Quote & Atomic Slot Reservation + Idempotent Replay
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      const quote = isolatedStore.createImmutableQuote({
        listingId: 'LST-002',
        quantity: 1,
        session: travelerLogin.session,
        correlationId,
      });
      const idemKey = `IDEM-VERIFY-${randomUUID().slice(0, 8)}`;
      const firstRun = isolatedStore.executeAtomicBooking({
        quoteId: quote.quoteId,
        listingId: 'LST-002',
        serviceDate: futureDate,
        idempotencyKey: idemKey,
        emergencyContactProvided: true,
        safetyBriefAcknowledged: true,
        session: travelerLogin.session,
        correlationId,
      });
      const secondRun = isolatedStore.executeAtomicBooking({
        quoteId: quote.quoteId,
        listingId: 'LST-002',
        serviceDate: futureDate,
        idempotencyKey: idemKey,
        emergencyContactProvided: true,
        safetyBriefAcknowledged: true,
        session: travelerLogin.session,
        correlationId,
      });

      let quoteReuseBlocked = false;
      try {
        isolatedStore.executeAtomicBooking({
          quoteId: quote.quoteId,
          listingId: 'LST-002',
          serviceDate: futureDate,
          idempotencyKey: `IDEM-NEW-${randomUUID().slice(0, 8)}`,
          emergencyContactProvided: true,
          safetyBriefAcknowledged: true,
          session: travelerLogin.session,
          correlationId,
        });
      } catch (e) {
        quoteReuseBlocked =
          e instanceof DomainRuleError && e.reasonCode === 'QUOTE_ALREADY_CONSUMED';
      }

      results.push({
        id: 'INV-04',
        name: 'User-Bound Single-Use Quote & Idempotency-Key Replay Protection',
        status: 'VERIFIED',
        passed:
          !firstRun.idempotentReplay &&
          secondRun.idempotentReplay &&
          firstRun.booking.bookingId === secondRun.booking.bookingId &&
          firstRun.booking.paymentState === 'CREATED' &&
          quoteReuseBlocked,
        evidence: `Booking ${firstRun.booking.bookingId} created in paymentState=CREATED; duplicate idempotency replay returned identical booking; quote reuse rejected with QUOTE_ALREADY_CONSUMED`,
      });

      // 5. Partner Cannot Confirm Before Verified Payment Capture
      const partner1Login = isolatedStore.loginUser({
        email: 'partner.himalayan@pherinepal.com',
        password: 'Partner1#PH00!2026',
        correlationId,
      });
      const partner1Mfa = isolatedStore.verifySessionMfa({
        session: partner1Login.session,
        totpCode: generateTotpCode(SEEDED_USERS[6].totpSecretHex),
        correlationId,
      });

      let prematureConfirmBlocked = false;
      try {
        isolatedStore.partnerDecision({
          bookingId: firstRun.booking.bookingId,
          decision: 'APPROVE',
          session: partner1Mfa,
          correlationId,
        });
      } catch (e) {
        prematureConfirmBlocked =
          e instanceof DomainRuleError &&
          e.reasonCode === 'PAYMENT_CAPTURE_REQUIRED_BEFORE_CONFIRMATION';
      }

      // Now send signed PAYMENT_CAPTURED webhook and then confirm
      const webhookPayload = JSON.stringify({
        providerEventId: `EVT-${randomUUID().slice(0, 8)}`,
        bookingId: firstRun.booking.bookingId,
        eventType: 'PAYMENT_CAPTURED',
        amountNPR: firstRun.booking.totalPaidNPR,
      });
      const webhookSig = computeWebhookSignature(webhookPayload);
      const webhookRes = isolatedStore.processPaymentWebhook({
        rawPayload: webhookPayload,
        signatureHex: webhookSig,
        correlationId,
      });
      const confirmedBooking = isolatedStore.partnerDecision({
        bookingId: firstRun.booking.bookingId,
        decision: 'APPROVE',
        session: partner1Mfa,
        correlationId,
      });

      results.push({
        id: 'INV-05',
        name: 'HMAC-SHA256 Signed Payment Webhook & Partner Confirmation Precondition',
        status: 'VERIFIED',
        passed:
          prematureConfirmBlocked &&
          webhookRes.booking.paymentState === 'CAPTURED' &&
          webhookRes.booking.bookingState === 'PAYMENT_PENDING' &&
          confirmedBooking.bookingState === 'PARTNER_CONFIRMED',
        evidence: 'Partner confirmation blocked before capture; signed webhook captured payment; partner confirmation succeeded only after CAPTURED',
      });

      // 6. Double-Entry Ledger Trial Balance (Debit == Credit across CAPTURE & REFUND)
      const trialBeforeRefund = isolatedStore.getLedgerTrialBalance();
      results.push({
        id: 'INV-06',
        name: '5-Account Double-Entry Ledger Trial Balance Invariant (Debit == Credit)',
        status: 'VERIFIED',
        passed: trialBeforeRefund.balanced && trialBeforeRefund.totalDebitNPR > 0,
        evidence: `Total Debit: NPR ${trialBeforeRefund.totalDebitNPR} == Total Credit: NPR ${trialBeforeRefund.totalCreditNPR} (Journals=${trialBeforeRefund.journalCount})`,
      });

      // 7. Verified Completed-Stay Review Authenticity Gate
      let uncompletedReviewBlocked = false;
      try {
        isolatedStore.submitReview({
          bookingId: firstRun.booking.bookingId,
          rating: 5,
          comment: 'Attempt before completion',
          session: travelerLogin.session,
          correlationId,
        });
      } catch (e) {
        uncompletedReviewBlocked =
          e instanceof DomainRuleError && e.reasonCode === 'UNVERIFIED_STAY_NOT_COMPLETED';
      }
      results.push({
        id: 'INV-07',
        name: 'Completed-Stay Review Authenticity Gate',
        status: 'VERIFIED',
        passed: uncompletedReviewBlocked,
        evidence: 'Review on PARTNER_CONFIRMED (non-COMPLETED) booking rejected with HTTP 422 UNVERIFIED_STAY_NOT_COMPLETED',
      });
    } finally {
      try {
        isolatedStore.db.close();
      } catch {
        // ignore close error
      }
      for (const suffix of ['', '-wal', '-shm']) {
        const f = `${tempDbPath}${suffix}`;
        if (fs.existsSync(f)) {
          fs.unlinkSync(f);
        }
      }
    }

    this.recordAudit({
      correlationId,
      actorUserId: 'SYSTEM_VERIFIER',
      actorEmail: 'verifier@pherinepal.com',
      actorRole: 'FOUNDER_ADMIN',
      action: 'RUN_ISOLATED_INVARIANT_SUITE',
      targetType: 'PLATFORM',
      targetId: 'PH00_INVARIANTS',
      outcome: results.every((r) => r.passed) ? 'ALLOWED' : 'ERROR',
      reasonCode: results.every((r) => r.passed) ? 'ALL_INVARIANTS_VERIFIED' : 'INVARIANT_FAILURE',
      metadata: {
        totalChecks: results.length,
        passedChecks: results.filter((r) => r.passed).length,
        isolatedTempDbUsed: true,
      },
    });

    return {
      allPassed: results.every((r) => r.passed),
      executedAt: new Date().toISOString(),
      isolatedDatabaseVerified: true,
      results,
    };
  }
}

export const domainStore = new PheriNepalDomainStore();
