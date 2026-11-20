import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { AuthenticatedSessionContext, ServerRole, verifySessionToken } from '../db/database';

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
      session?: AuthenticatedSessionContext;
      rawBody?: string;
    }
  }
}

export const CORRELATION_ID_REGEX = /^[A-Za-z0-9._-]{8,64}$/;

export const FORBIDDEN_CLIENT_SECURITY_FIELDS = [
  'mfaVerified',
  'simulatePaymentSuccess',
  'actor',
  'actorRole',
  'reviewerEmail',
  'partnerActor',
] as const;

export function sanitizeCorrelationId(candidate: unknown): string {
  if (typeof candidate === 'string' && CORRELATION_ID_REGEX.test(candidate.trim())) {
    return candidate.trim();
  }
  return `corr-${randomUUID()}`;
}

export function parseCookies(cookieHeader?: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx > 0) {
      const k = part.slice(0, idx).trim();
      const v = part.slice(idx + 1).trim();
      result[k] = decodeURIComponent(v);
    }
  }
  return result;
}

export function extractRawSessionToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim();
    if (token) return token;
  }
  const cookies = parseCookies(req.headers.cookie);
  if (cookies.pnp_session) {
    return cookies.pnp_session;
  }
  return null;
}

export function correlationAndSecurityHeadersMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const correlationId = sanitizeCorrelationId(req.headers['x-correlation-id']);
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-Id', correlationId);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-store');
  next();
}

export function rejectForbiddenClientSecurityFields(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.body && typeof req.body === 'object') {
    for (const forbiddenField of FORBIDDEN_CLIENT_SECURITY_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(req.body, forbiddenField)) {
        res.status(400).json({
          error: true,
          code: 'FORBIDDEN_CLIENT_SECURITY_FIELD',
          message: `Client-supplied security/identity field "${forbiddenField}" is strictly forbidden. Identity, role, MFA, and payment status are derived exclusively on the server.`,
          correlationId: req.correlationId,
        });
        return;
      }
    }
  }
  next();
}

export function createSessionAuthMiddleware(
  lookupSessionById: (sessionId: string) => AuthenticatedSessionContext | null
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const rawToken = extractRawSessionToken(req);
    if (!rawToken) {
      next();
      return;
    }
    const verified = verifySessionToken(rawToken);
    if (!verified.valid || !verified.sessionId) {
      next();
      return;
    }
    const session = lookupSessionById(verified.sessionId);
    if (session) {
      req.session = session;
    }
    next();
  };
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session) {
    res.status(401).json({
      error: true,
      code: 'AUTHENTICATION_REQUIRED',
      message: 'A valid, non-expired authenticated session is required for this endpoint.',
      correlationId: req.correlationId,
    });
    return;
  }
  next();
}

export function requireRole(...allowedRoles: ServerRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.session) {
      res.status(401).json({
        error: true,
        code: 'AUTHENTICATION_REQUIRED',
        message: 'Authentication required before role authorization check.',
        correlationId: req.correlationId,
      });
      return;
    }
    if (!allowedRoles.includes(req.session.role)) {
      res.status(403).json({
        error: true,
        code: 'RBAC_ROLE_FORBIDDEN',
        message: `Role "${req.session.role}" is not permitted to perform this operation. Required: ${allowedRoles.join(', ')}.`,
        correlationId: req.correlationId,
      });
      return;
    }
    next();
  };
}

export function requireMfa(req: Request, res: Response, next: NextFunction): void {
  if (!req.session) {
    res.status(401).json({
      error: true,
      code: 'AUTHENTICATION_REQUIRED',
      message: 'Authentication required before MFA verification check.',
      correlationId: req.correlationId,
    });
    return;
  }
  if (!req.session.mfaVerified) {
    res.status(403).json({
      error: true,
      code: 'MFA_STEP_UP_REQUIRED',
      message: 'Privileged operation denied: current server session has not completed TOTP MFA step-up verification (/api/v1/auth/mfa/verify).',
      correlationId: req.correlationId,
    });
    return;
  }
  next();
}

interface RateBucket {
  count: number;
  resetAtMs: number;
}

export function createRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}) {
  const buckets = new Map<string, RateBucket>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const clientIdentity =
      req.session?.userId ||
      (typeof req.headers['x-rate-limit-client'] === 'string'
        ? req.headers['x-rate-limit-client']
        : req.ip || 'anon');
    const key = `${options.keyPrefix}:${clientIdentity}`;

    const existing = buckets.get(key);
    if (!existing || now >= existing.resetAtMs) {
      buckets.set(key, { count: 1, resetAtMs: now + options.windowMs });
      res.setHeader('X-RateLimit-Limit', String(options.maxRequests));
      res.setHeader('X-RateLimit-Remaining', String(Math.max(0, options.maxRequests - 1)));
      next();
      return;
    }

    existing.count += 1;
    const remaining = Math.max(0, options.maxRequests - existing.count);
    res.setHeader('X-RateLimit-Limit', String(options.maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(remaining));

    if (existing.count > options.maxRequests) {
      const retryAfterSec = Math.max(1, Math.ceil((existing.resetAtMs - now) / 1000));
      res.setHeader('Retry-After', String(retryAfterSec));
      res.status(429).json({
        error: true,
        code: 'TOO_MANY_REQUESTS',
        message: `Rate limit exceeded for ${options.keyPrefix}. Please retry after ${retryAfterSec} seconds.`,
        retryAfterSeconds: retryAfterSec,
        correlationId: req.correlationId,
      });
      return;
    }

    next();
  };
}
