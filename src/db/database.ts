import { createHmac, randomBytes, scryptSync, timingSafeEqual, createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';

export type ServerRole =
  | 'TRAVELER'
  | 'PARTNER'
  | 'SUPPORT_AGENT'
  | 'COMPLIANCE_REVIEWER'
  | 'FINANCE_OFFICER'
  | 'SAFETY_LEAD'
  | 'FOUNDER_ADMIN';

export interface AuthenticatedSessionContext {
  sessionId: string;
  userId: string;
  email: string;
  displayName: string;
  role: ServerRole;
  partnerId: string | null;
  mfaVerified: boolean;
  expiresAt: string;
}

export interface SeedUserCredential {
  userId: string;
  email: string;
  displayName: string;
  role: ServerRole;
  partnerId: string | null;
  defaultPassword: string;
  totpSecretHex: string;
  mfaEnrolled: boolean;
}

const SESSION_HMAC_SECRET =
  process.env.SESSION_HMAC_SECRET || 'ph00-local-dev-hmac-secret-change-in-production-32b';

const PAYMENT_WEBHOOK_SECRET =
  process.env.PAYMENT_WEBHOOK_SECRET || 'ph00-local-dev-payment-webhook-hmac-secret-32b';

export const SEEDED_USERS: SeedUserCredential[] = [
  {
    userId: 'USR-FOUNDER-001',
    email: 'founder@pherinepal.com',
    displayName: 'Founder & Super Admin',
    role: 'FOUNDER_ADMIN',
    partnerId: null,
    defaultPassword: 'Founder#PH00!2026',
    totpSecretHex: '3132333435363738393031323334353637383930',
    mfaEnrolled: true,
  },
  {
    userId: 'USR-COMP-001',
    email: 'verifier.one@pherinepal.com',
    displayName: 'Primary Compliance Reviewer',
    role: 'COMPLIANCE_REVIEWER',
    partnerId: null,
    defaultPassword: 'Compliance1#PH00!2026',
    totpSecretHex: '4142434445464748494a31323334353637383930',
    mfaEnrolled: true,
  },
  {
    userId: 'USR-COMP-002',
    email: 'verifier.two@pherinepal.com',
    displayName: 'Secondary Compliance Approver',
    role: 'COMPLIANCE_REVIEWER',
    partnerId: null,
    defaultPassword: 'Compliance2#PH00!2026',
    totpSecretHex: '5152535455565758595a31323334353637383930',
    mfaEnrolled: true,
  },
  {
    userId: 'USR-SAFETY-001',
    email: 'safety.lead@pherinepal.com',
    displayName: 'Emergency & Safety Desk Lead',
    role: 'SAFETY_LEAD',
    partnerId: null,
    defaultPassword: 'SafetyLead#PH00!2026',
    totpSecretHex: '6162636465666768696a31323334353637383930',
    mfaEnrolled: true,
  },
  {
    userId: 'USR-FIN-001',
    email: 'finance.officer@pherinepal.com',
    displayName: 'Settlement & Finance Officer',
    role: 'FINANCE_OFFICER',
    partnerId: null,
    defaultPassword: 'Finance#PH00!2026',
    totpSecretHex: '7172737475767778797a31323334353637383930',
    mfaEnrolled: true,
  },
  {
    userId: 'USR-SUP-001',
    email: 'support.agent@pherinepal.com',
    displayName: 'Operations Support Specialist',
    role: 'SUPPORT_AGENT',
    partnerId: null,
    defaultPassword: 'Support#PH00!2026',
    totpSecretHex: '3938373635343332313031323334353637383930',
    mfaEnrolled: true,
  },
  {
    userId: 'USR-PTN-001',
    email: 'partner.himalayan@pherinepal.com',
    displayName: 'Himalayan Eco Lodge Partner',
    role: 'PARTNER',
    partnerId: 'PTN-001',
    defaultPassword: 'Partner1#PH00!2026',
    totpSecretHex: '3131323233333434353536363737383839393030',
    mfaEnrolled: true,
  },
  {
    userId: 'USR-PTN-002',
    email: 'partner.sherpa@pherinepal.com',
    displayName: 'Sherpa Alpine Guides Partner',
    role: 'PARTNER',
    partnerId: 'PTN-002',
    defaultPassword: 'Partner2#PH00!2026',
    totpSecretHex: '3030393938383737363635353434333332323131',
    mfaEnrolled: true,
  },
  {
    userId: 'USR-PTN-003',
    email: 'partner.skyline@pherinepal.com',
    displayName: 'Skyline Heli & Expedition Partner',
    role: 'PARTNER',
    partnerId: 'PTN-003',
    defaultPassword: 'Partner3#PH00!2026',
    totpSecretHex: '3535343433333232313130303939383837373636',
    mfaEnrolled: true,
  },
  {
    userId: 'USR-TRV-001',
    email: 'aarav.sharma@example.com',
    displayName: 'Aarav Sharma',
    role: 'TRAVELER',
    partnerId: null,
    defaultPassword: 'Traveler1#PH00!2026',
    totpSecretHex: '3234363831333537393032343638313335373930',
    mfaEnrolled: false,
  },
  {
    userId: 'USR-TRV-002',
    email: 'maya.gurung@example.com',
    displayName: 'Maya Gurung',
    role: 'TRAVELER',
    partnerId: null,
    defaultPassword: 'Traveler2#PH00!2026',
    totpSecretHex: '3133353739323436383031333537393234363830',
    mfaEnrolled: false,
  },
];

export function sha256Hex(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

export function hashPassword(password: string, saltHex?: string): { saltHex: string; hashHex: string } {
  const salt = saltHex || randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return { saltHex: salt, hashHex: derived };
}

export function verifyPassword(password: string, saltHex: string, expectedHashHex: string): boolean {
  const derived = scryptSync(password, saltHex, 64);
  const expected = Buffer.from(expectedHashHex, 'hex');
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

/**
 * RFC 6238 TOTP (HMAC-SHA1, 6 digits, 30-second step)
 */
export function generateTotpCode(secretHex: string, timestampMs = Date.now(), stepSeconds = 30): string {
  const counter = Math.floor(timestampMs / 1000 / stepSeconds);
  const counterBuf = Buffer.alloc(8);
  counterBuf.writeBigUInt64BE(BigInt(counter));
  const key = Buffer.from(secretHex, 'hex');
  const hmac = createHmac('sha1', key).update(counterBuf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  const otp = binary % 1_000_000;
  return String(otp).padStart(6, '0');
}

export function verifyTotpCode(secretHex: string, candidateCode: string, timestampMs = Date.now()): boolean {
  if (!/^\d{6}$/.test(String(candidateCode || '').trim())) {
    return false;
  }
  const cleanCandidate = Buffer.from(String(candidateCode).trim(), 'utf8');
  for (const windowOffset of [-1, 0, 1]) {
    const expected = Buffer.from(
      generateTotpCode(secretHex, timestampMs + windowOffset * 30_000),
      'utf8'
    );
    if (expected.length === cleanCandidate.length && timingSafeEqual(expected, cleanCandidate)) {
      return true;
    }
  }
  return false;
}

export function signSessionToken(sessionId: string): string {
  const mac = createHmac('sha256', SESSION_HMAC_SECRET).update(sessionId).digest('hex');
  return `${sessionId}.${mac}`;
}

export function verifySessionToken(rawToken: string): { valid: boolean; sessionId?: string } {
  if (!rawToken || typeof rawToken !== 'string') return { valid: false };
  const parts = rawToken.trim().split('.');
  if (parts.length !== 2) return { valid: false };
  const [sessionId, providedMac] = parts;
  if (!sessionId || !/^[0-9a-f]{64}$/i.test(providedMac)) return { valid: false };
  const expectedMac = createHmac('sha256', SESSION_HMAC_SECRET).update(sessionId).digest('hex');
  const a = Buffer.from(providedMac.toLowerCase(), 'hex');
  const b = Buffer.from(expectedMac.toLowerCase(), 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false };
  }
  return { valid: true, sessionId };
}

export function computeWebhookSignature(rawPayload: string, secret = PAYMENT_WEBHOOK_SECRET): string {
  return createHmac('sha256', secret).update(rawPayload).digest('hex');
}

export function verifyWebhookSignature(
  rawPayload: string,
  signatureHex: string,
  secret = PAYMENT_WEBHOOK_SECRET
): boolean {
  if (!signatureHex || !/^[0-9a-f]{64}$/i.test(signatureHex.trim())) {
    return false;
  }
  const expectedHex = computeWebhookSignature(rawPayload, secret);
  const providedBuf = Buffer.from(signatureHex.trim().toLowerCase(), 'hex');
  const expectedBuf = Buffer.from(expectedHex.toLowerCase(), 'hex');
  if (providedBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(providedBuf, expectedBuf);
}

export function redactPiiFromText(input: string): string {
  return input
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[REDACTED_EMAIL]')
    .replace(/\b(?:\+?977[-\s]?)?(?:98|97)\d{8}\b/g, '[REDACTED_PHONE]')
    .replace(/\b[A-Z]{1,2}\d{7,9}\b/g, '[REDACTED_PASSPORT_ID]');
}

const SCHEMA_SQL_V1 = `
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN (
    'TRAVELER',
    'PARTNER',
    'SUPPORT_AGENT',
    'COMPLIANCE_REVIEWER',
    'FINANCE_OFFICER',
    'SAFETY_LEAD',
    'FOUNDER_ADMIN'
  )),
  partner_id TEXT,
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  totp_secret_hex TEXT NOT NULL,
  mfa_enrolled INTEGER NOT NULL DEFAULT 0 CHECK (mfa_enrolled IN (0, 1)),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  mfa_verified INTEGER NOT NULL DEFAULT 0 CHECK (mfa_verified IN (0, 1)),
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS platform_config (
  config_key TEXT PRIMARY KEY,
  config_value TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by_user_id TEXT
);

CREATE TABLE IF NOT EXISTS categories (
  key TEXT PRIMARY KEY,
  number INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('AVAILABLE', 'COMING_SOON', 'INFORMATION_ONLY', 'RESTRICTED')),
  reason_code TEXT NOT NULL,
  target_pilot_status TEXT NOT NULL CHECK (target_pilot_status IN ('AVAILABLE', 'COMING_SOON', 'INFORMATION_ONLY', 'RESTRICTED')),
  commission_rate REAL NOT NULL CHECK (commission_rate >= 0 AND commission_rate <= 1),
  service_fee_rate REAL NOT NULL CHECK (service_fee_rate >= 0 AND service_fee_rate <= 1),
  tax_rate REAL NOT NULL CHECK (tax_rate >= 0 AND tax_rate <= 1),
  verification_required INTEGER NOT NULL CHECK (verification_required IN (0, 1)),
  restricted_permit_required INTEGER NOT NULL CHECK (restricted_permit_required IN (0, 1)),
  insurance_required INTEGER NOT NULL CHECK (insurance_required IN (0, 1)),
  safety_check_in_required INTEGER NOT NULL CHECK (safety_check_in_required IN (0, 1)),
  emergency_contact_required INTEGER NOT NULL CHECK (emergency_contact_required IN (0, 1)),
  offline_pack_supported INTEGER NOT NULL CHECK (offline_pack_supported IN (0, 1)),
  lifecycle_stages_json TEXT NOT NULL,
  contract_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_key TEXT NOT NULL REFERENCES categories(key),
  status TEXT NOT NULL CHECK (status IN (
    'DRAFT_APPLICANT',
    'UNDER_PRIMARY_REVIEW',
    'AWAITING_SECOND_APPROVER',
    'VERIFIED_PARTNER',
    'SUSPENDED',
    'REVOKED'
  )),
  primary_reviewer_user_id TEXT REFERENCES users(user_id),
  primary_reviewer_email TEXT,
  primary_reviewed_at TEXT,
  secondary_approver_user_id TEXT REFERENCES users(user_id),
  secondary_approver_email TEXT,
  secondary_approved_at TEXT,
  documents_verified INTEGER NOT NULL CHECK (documents_verified IN (0, 1)),
  tax_pan_vat_verified INTEGER NOT NULL CHECK (tax_pan_vat_verified IN (0, 1)),
  payout_bank_verified INTEGER NOT NULL CHECK (payout_bank_verified IN (0, 1)),
  suspension_reason TEXT,
  CHECK (
    primary_reviewer_user_id IS NULL
    OR secondary_approver_user_id IS NULL
    OR primary_reviewer_user_id <> secondary_approver_user_id
  )
);

CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  partner_id TEXT NOT NULL REFERENCES partners(id),
  category_key TEXT NOT NULL REFERENCES categories(key),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  base_price_npr INTEGER NOT NULL CHECK (base_price_npr > 0),
  capacity_per_slot INTEGER NOT NULL CHECK (capacity_per_slot > 0),
  available_slots INTEGER NOT NULL CHECK (available_slots >= 0 AND available_slots <= capacity_per_slot),
  permit_verified INTEGER NOT NULL CHECK (permit_verified IN (0, 1)),
  guide_license_verified INTEGER NOT NULL CHECK (guide_license_verified IN (0, 1)),
  insurance_verified INTEGER NOT NULL CHECK (insurance_verified IN (0, 1)),
  weather_altitude_clear INTEGER NOT NULL CHECK (weather_altitude_clear IN (0, 1)),
  cancellation_policy TEXT NOT NULL,
  refund_policy TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quotes (
  quote_id TEXT PRIMARY KEY,
  traveler_user_id TEXT NOT NULL REFERENCES users(user_id),
  listing_id TEXT NOT NULL REFERENCES listings(id),
  category_key TEXT NOT NULL REFERENCES categories(key),
  partner_id TEXT NOT NULL REFERENCES partners(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  currency TEXT NOT NULL CHECK (currency = 'NPR'),
  base_subtotal_npr INTEGER NOT NULL CHECK (base_subtotal_npr >= 0),
  platform_commission_npr INTEGER NOT NULL CHECK (platform_commission_npr >= 0),
  traveler_service_fee_npr INTEGER NOT NULL CHECK (traveler_service_fee_npr >= 0),
  tax_vat_npr INTEGER NOT NULL CHECK (tax_vat_npr >= 0),
  total_traveler_payable_npr INTEGER NOT NULL CHECK (total_traveler_payable_npr >= 0),
  net_partner_payout_npr INTEGER NOT NULL CHECK (net_partner_payout_npr >= 0),
  pricing_snapshot_hash TEXT NOT NULL,
  cancellation_policy_snapshot TEXT NOT NULL,
  refund_policy_snapshot TEXT NOT NULL,
  consumed_by_booking_id TEXT,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  booking_id TEXT PRIMARY KEY,
  idempotency_key TEXT NOT NULL,
  request_payload_hash TEXT NOT NULL,
  quote_id TEXT NOT NULL UNIQUE REFERENCES quotes(quote_id),
  listing_id TEXT NOT NULL REFERENCES listings(id),
  partner_id TEXT NOT NULL REFERENCES partners(id),
  category_key TEXT NOT NULL REFERENCES categories(key),
  traveler_user_id TEXT NOT NULL REFERENCES users(user_id),
  traveler_name TEXT NOT NULL,
  service_date TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  booking_state TEXT NOT NULL CHECK (booking_state IN (
    'DRAFT',
    'QUOTED',
    'HOLD_PLACED',
    'PAYMENT_PENDING',
    'PARTNER_CONFIRMED',
    'ACTIVE_SERVICE',
    'COMPLETED',
    'CANCELLED_BY_TRAVELER',
    'REJECTED_BY_PARTNER',
    'EXPIRED_HOLD',
    'DISPUTED',
    'REFUNDED'
  )),
  payment_state TEXT NOT NULL CHECK (payment_state IN (
    'CREATED',
    'AUTHORIZED',
    'CAPTURED',
    'SETTLEMENT_ELIGIBLE',
    'PAYOUT_SCHEDULED',
    'PAID_OUT',
    'REFUND_PENDING',
    'REFUNDED',
    'CHARGEBACK_HOLD',
    'FAILED'
  )),
  total_paid_npr INTEGER NOT NULL CHECK (total_paid_npr >= 0),
  hold_expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (traveler_user_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS payment_intents (
  payment_intent_id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE REFERENCES bookings(booking_id),
  provider TEXT NOT NULL,
  amount_npr INTEGER NOT NULL CHECK (amount_npr >= 0),
  currency TEXT NOT NULL CHECK (currency = 'NPR'),
  state TEXT NOT NULL CHECK (state IN ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'REVERSED')),
  provider_reference TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS payment_webhook_events (
  provider_event_id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL REFERENCES bookings(booking_id),
  event_type TEXT NOT NULL CHECK (event_type IN ('PAYMENT_AUTHORIZED', 'PAYMENT_CAPTURED', 'PAYMENT_FAILED', 'PAYMENT_REFUNDED')),
  amount_npr INTEGER NOT NULL CHECK (amount_npr >= 0),
  signature_hash TEXT NOT NULL,
  processed_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ledger_journals (
  journal_id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL REFERENCES bookings(booking_id),
  event_type TEXT NOT NULL CHECK (event_type IN ('CAPTURE', 'REFUND', 'REVERSAL')),
  currency TEXT NOT NULL CHECK (currency = 'NPR'),
  total_debit_npr INTEGER NOT NULL CHECK (total_debit_npr >= 0),
  total_credit_npr INTEGER NOT NULL CHECK (total_credit_npr >= 0),
  balanced INTEGER NOT NULL CHECK (balanced = 1 AND total_debit_npr = total_credit_npr),
  created_at TEXT NOT NULL,
  UNIQUE (booking_id, event_type)
);

CREATE TABLE IF NOT EXISTS ledger_lines (
  line_id TEXT PRIMARY KEY,
  journal_id TEXT NOT NULL REFERENCES ledger_journals(journal_id),
  booking_id TEXT NOT NULL REFERENCES bookings(booking_id),
  account_code TEXT NOT NULL CHECK (account_code IN (
    'PLATFORM_COLLECTION_CLEARING',
    'PARTNER_PAYABLE_LIABILITY',
    'PLATFORM_COMMISSION_REVENUE',
    'PLATFORM_SERVICE_FEE_REVENUE',
    'TAX_VAT_PAYABLE',
    'TRAVELER_REFUND_CLEARING'
  )),
  direction TEXT NOT NULL CHECK (direction IN ('DEBIT', 'CREDIT')),
  amount_npr INTEGER NOT NULL CHECK (amount_npr >= 0),
  currency TEXT NOT NULL CHECK (currency = 'NPR'),
  created_at TEXT NOT NULL
);

CREATE TRIGGER IF NOT EXISTS trg_ledger_lines_no_update
BEFORE UPDATE ON ledger_lines
BEGIN
  SELECT RAISE(ABORT, 'LEDGER_IMMUTABLE_VIOLATION: ledger_lines cannot be updated');
END;

CREATE TRIGGER IF NOT EXISTS trg_ledger_lines_no_delete
BEFORE DELETE ON ledger_lines
BEGIN
  SELECT RAISE(ABORT, 'LEDGER_IMMUTABLE_VIOLATION: ledger_lines cannot be deleted');
END;

CREATE TABLE IF NOT EXISTS user_privacy_consents (
  user_id TEXT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  essential_booking_data INTEGER NOT NULL DEFAULT 1 CHECK (essential_booking_data = 1),
  safety_gps_telemetry INTEGER NOT NULL DEFAULT 0 CHECK (safety_gps_telemetry IN (0, 1)),
  analytics_cookies INTEGER NOT NULL DEFAULT 0 CHECK (analytics_cookies IN (0, 1)),
  ai_assistant_prompts INTEGER NOT NULL DEFAULT 0 CHECK (ai_assistant_prompts IN (0, 1)),
  marketing_notifications INTEGER NOT NULL DEFAULT 0 CHECK (marketing_notifications IN (0, 1)),
  consent_version TEXT NOT NULL,
  purpose TEXT NOT NULL,
  gps_auto_expire_hours INTEGER NOT NULL DEFAULT 4,
  gps_expires_at TEXT,
  revoked_at TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS incidents (
  incident_id TEXT PRIMARY KEY,
  booking_id TEXT REFERENCES bookings(booking_id),
  trip_id TEXT NOT NULL,
  reporter_user_id TEXT NOT NULL REFERENCES users(user_id),
  category_key TEXT NOT NULL REFERENCES categories(key),
  severity TEXT NOT NULL CHECK (severity IN ('SEV1_CRITICAL_LIFE_SAFETY', 'SEV2_HIGH_OPERATIONAL', 'SEV3_MODERATE_SUPPORT')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  gps_coordinates TEXT,
  status TEXT NOT NULL CHECK (status IN ('OPEN_TRIAGE', 'DISPATCHED', 'RESOLVED')),
  assigned_desk_owner TEXT NOT NULL,
  escalation_log_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  review_id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE REFERENCES bookings(booking_id),
  listing_id TEXT NOT NULL REFERENCES listings(id),
  traveler_user_id TEXT NOT NULL REFERENCES users(user_id),
  traveler_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  verified_completed_stay INTEGER NOT NULL CHECK (verified_completed_stay = 1),
  moderation_status TEXT NOT NULL CHECK (moderation_status IN ('APPROVED_AUTHENTIC', 'REJECTED_UNVERIFIED')),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_events (
  event_id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  correlation_id TEXT NOT NULL,
  actor_user_id TEXT NOT NULL,
  actor_email TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('ALLOWED', 'DENIED', 'ERROR')),
  reason_code TEXT NOT NULL,
  metadata_json TEXT NOT NULL
);

CREATE TRIGGER IF NOT EXISTS trg_audit_events_no_update
BEFORE UPDATE ON audit_events
BEGIN
  SELECT RAISE(ABORT, 'AUDIT_LOG_IMMUTABLE_VIOLATION: audit_events cannot be updated');
END;

CREATE TRIGGER IF NOT EXISTS trg_audit_events_no_delete
BEFORE DELETE ON audit_events
BEGIN
  SELECT RAISE(ABORT, 'AUDIT_LOG_IMMUTABLE_VIOLATION: audit_events cannot be deleted');
END;
`;

export function createDatabaseConnection(customDbPath?: string): { db: DatabaseSync; dbPath: string } {
  const resolvedPath =
    customDbPath ||
    process.env.SQLITE_DB_PATH ||
    path.resolve(process.cwd(), 'data', 'pherinepal.sqlite');

  if (resolvedPath !== ':memory:') {
    const dir = path.dirname(resolvedPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const db = new DatabaseSync(resolvedPath);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA synchronous = NORMAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA busy_timeout = 5000;');

  applyDatabaseMigrations(db);
  return { db, dbPath: resolvedPath };
}

export function applyDatabaseMigrations(db: DatabaseSync): void {
  db.exec(SCHEMA_SQL_V1);

  const existing = db
    .prepare('SELECT version FROM schema_migrations WHERE version = 1')
    .get() as { version: number } | undefined;

  if (!existing) {
    db.prepare(
      'INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)'
    ).run(1, '001_ph00_governance_and_transactional_foundation', new Date().toISOString());
  }
}

export function withImmediateTransaction<T>(db: DatabaseSync, fn: () => T): T {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    try {
      db.exec('ROLLBACK');
    } catch {
      // Ignore rollback errors if transaction already aborted by SQLite constraint
    }
    throw error;
  }
}
