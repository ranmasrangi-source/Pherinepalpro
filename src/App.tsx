/**
 * PHERINEPAL — MASTER APPLICATION & 8-DASHBOARD WORKSPACE
 * Blueprint Reference: PNP-MASTER-ARCH-001 (Parts I–V)
 */

import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  Lock,
  CheckCircle2,
  XCircle,
  Globe,
  Moon,
  Sun,
  Compass,
  FileText,
  BookOpen,
  Scale,
  PhoneCall,
  RefreshCw,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';
import type {
  CategoryStatus,
  DashboardDefinition,
  DashboardId,
  LifecycleStage,
  PhaseSummary,
  ServiceCategory,
} from './domain/catalogue.ts';
import type {
  AuditEvent,
  BookingRecord,
  GateCheckResult,
  ImmutableQuoteSnapshot,
  InventoryListing,
  LedgerJournalEntry,
  OfficialSourceRecord,
  PartnerVerificationRecord,
  SupportIncidentRecord,
  VerifiedReviewRecord,
} from './domain/store.ts';
import type {
  AssumptionItem,
  DependencyItem,
  LegalQuestionItem,
  LifecycleJourneyMap,
  OwnerDecisionFullRecord,
  PersonaRecord,
  Ph00FeatureAuditRecord,
  PilotCandidateEvaluation,
  RiskItem,
} from './domain/ph00Governance.ts';

interface BootstrapData {
  correlationId: string;
  documentId: string;
  version: string;
  globalBookingSwitch: boolean;
  supportOperatingHours: string;
  counts: {
    categoriesCount: number;
    dashboardsCount: number;
    lifecycleStagesCount: number;
    phasesCount: number;
    totalFeatureModulesCount: number;
    ownerDecisionsCount: number;
    legalQuestionsCount: number;
    personasCount: number;
  };
  categories: ServiceCategory[];
  dashboards: DashboardDefinition[];
  phases: PhaseSummary[];
  partners: PartnerVerificationRecord[];
  listings: InventoryListing[];
  bookings: BookingRecord[];
  ledgerEntries: LedgerJournalEntry[];
  officialSources: OfficialSourceRecord[];
  incidents: SupportIncidentRecord[];
  reviews: VerifiedReviewRecord[];
  decisions: OwnerDecisionFullRecord[];
  ph00Governance: {
    featureAuditMatrix: Ph00FeatureAuditRecord[];
    personas: PersonaRecord[];
    journeyMaps: LifecycleJourneyMap[];
    decisions: OwnerDecisionFullRecord[];
    risks: RiskItem[];
    dependencies: DependencyItem[];
    assumptions: AssumptionItem[];
    legalRegister: LegalQuestionItem[];
    pilotFramework: PilotCandidateEvaluation[];
  };
  auditEvents: AuditEvent[];
  travelerPrivacyConsent: {
    travelerId: string;
    essentialServiceTermsAccepted: boolean;
    duringTripGpsSharingOptIn: boolean;
    gpsSharingExpiresAtUtc: string | null;
    aiPromptPiiRedactionEnabled: boolean;
    marketingNotificationsOptIn: boolean;
    updatedAtUtc: string;
  };
}

interface InvariantResult {
  testId: string;
  name: string;
  passed: boolean;
  evidence: string;
}

function formatNprFromMinor(minorPaisa: number): string {
  const npr = minorPaisa / 100;
  return `NPR ${npr.toLocaleString('en-NP', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export default function App() {
  const [data, setData] = useState<BootstrapData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Localization & Theme (Phase 01: English/Nepali + Light/Dark Mode)
  const [locale, setLocale] = useState<'en' | 'ne'>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Active Top Navigation Section & Active Dashboard (8 Dashboards per Section 6)
  const [activeSection, setActiveSection] = useState<'catalogue' | 'dashboards' | 'lifecycle' | 'phases' | 'safety'>('catalogue');
  const [activeDashboard, setActiveDashboard] = useState<DashboardId>('traveler');
  const [mfaVerifiedSession, setMfaVerifiedSession] = useState<boolean>(true);

  // Catalogue Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | CategoryStatus>('ALL');
  const [lifecycleFilter, setLifecycleFilter] = useState<'ALL' | LifecycleStage>('ALL');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('hotels');

  // Booking & Quote Engine State (Phase 07 & 08)
  const [selectedListingId, setSelectedListingId] = useState<string>('LST-HTL-101');
  const [bookingQuantity, setBookingQuantity] = useState<number>(1);
  const [activeQuote, setActiveQuote] = useState<ImmutableQuoteSnapshot | null>(null);
  const [activeGateResult, setActiveGateResult] = useState<GateCheckResult | null>(null);
  const [bookingFeedback, setBookingFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [simulatePaymentSuccess, setSimulatePaymentSuccess] = useState<boolean>(true);

  // Verification & Compliance Secondary Reviewer Email
  const [secondaryReviewerEmail, setSecondaryReviewerEmail] = useState<string>('safety.pemba@pherinepal.np');
  const [complianceFeedback, setComplianceFeedback] = useState<string | null>(null);

  // Admin Category Transition State
  const [adminStatusTarget, setAdminStatusTarget] = useState<CategoryStatus>('TEMPORARILY_UNAVAILABLE');
  const [adminReason, setAdminReason] = useState<string>('Scheduled partner license re-verification window');
  const [adminFeedback, setAdminFeedback] = useState<string | null>(null);

  // Automated Invariant Verification Runner
  const [invariantResults, setInvariantResults] = useState<InvariantResult[] | null>(null);
  const [runningInvariants, setRunningInvariants] = useState<boolean>(false);

  // AI Grounded Assistant State (Phase 12)
  const [aiQuestion, setAiQuestion] = useState<string>(
    'What official permits and licensed guide rules apply for trekking in Khumbu / Gokyo?'
  );
  const [aiResponse, setAiResponse] = useState<{
    answer: string;
    guardrailNotice: string;
    mode: string;
  } | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Incident Intake Form State (Phase 13)
  const [incidentLocality, setIncidentLocality] = useState<string>('Namche / Lukla Trail');
  const [incidentDescription, setIncidentDescription] = useState<string>('');
  const [incidentSeverity, setIncidentSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchBootstrap = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/bootstrap');
      if (!res.ok) {
        throw new Error(`Bootstrap request failed with status ${res.status}`);
      }
      const json: BootstrapData = await res.json();
      setData(json);
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to load PheriNepal canonical registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBootstrap();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!data) return [];
    return data.categories.filter((c) => {
      const matchesSearch =
        !searchQuery.trim() ||
        c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.displayNameNe.includes(searchQuery) ||
        c.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.owningPhase.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchesStage = lifecycleFilter === 'ALL' || c.lifecycleStages.includes(lifecycleFilter);
      return matchesSearch && matchesStatus && matchesStage;
    });
  }, [data, searchQuery, statusFilter, lifecycleFilter]);

  const selectedCategory = useMemo(() => {
    return data?.categories.find((c) => c.key === selectedCategoryKey) || data?.categories[0];
  }, [data, selectedCategoryKey]);

  const currentDashboardDef = useMemo(() => {
    return data?.dashboards.find((d) => d.id === activeDashboard) || data?.dashboards[0];
  }, [data, activeDashboard]);

  // Handlers
  const handleCalculateQuote = async (listingId: string, qty: number) => {
    setBookingFeedback(null);
    try {
      const res = await fetch('/api/v1/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          quantity: qty,
          actor: 'Aarav Sharma (TRV-001)'
        })
      });
      const json = await res.json();
      if (!res.ok) {
        setActiveQuote(null);
        setActiveGateResult(json.gateEvaluation || null);
        setBookingFeedback({
          type: 'error',
          text: json.message || 'Mandatory 12-Point Booking Gate rejected this quote.'
        });
        return;
      }
      setActiveQuote(json.quote);
      setActiveGateResult(json.gateEvaluation);
      setBookingFeedback({
        type: 'success',
        text: `Immutable server quote ${json.quote.quoteId} calculated. All 12 Mandatory Booking Gates passed.`
      });
    } catch (err: any) {
      setBookingFeedback({ type: 'error', text: err.message });
    }
  };

  const handleExecuteBooking = async () => {
    if (!activeQuote) return;
    setBookingFeedback(null);
    try {
      const res = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId: activeQuote.quoteId,
          travelerName: 'Aarav Sharma',
          serviceDate: '2026-12-05',
          idempotencyKey: `IDEMP-${activeQuote.quoteId}`,
          simulatePaymentSuccess
        })
      });
      const json = await res.json();
      if (!res.ok) {
        setBookingFeedback({
          type: 'error',
          text: json.message || 'Booking rejected by server.'
        });
        await fetchBootstrap();
        return;
      }
      const b: BookingRecord = json.booking;
      setBookingFeedback({
        type: 'success',
        text: `Booking ${b.bookingId} recorded. Separate States → Booking: ${b.bookingState} | Inventory Hold: ${b.inventoryHoldState} | Payment: ${b.paymentState} | Payout: ${b.payoutState}`
      });
      await fetchBootstrap();
    } catch (err: any) {
      setBookingFeedback({ type: 'error', text: err.message });
    }
  };

  const handlePartnerDecision = async (bookingId: string, decision: 'APPROVE' | 'DECLINE') => {
    try {
      const res = await fetch(`/api/v1/bookings/${bookingId}/partner-decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          partnerActor: 'Khumbu Sherpa Alpine Guides Cooperative'
        })
      });
      if (res.ok) {
        await fetchBootstrap();
      }
    } catch {
      // handled via state refresh
    }
  };

  const handleTwoPersonApprove = async (partnerId: string) => {
    setComplianceFeedback(null);
    try {
      const res = await fetch(`/api/v1/verification/${partnerId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerEmail: secondaryReviewerEmail,
          mfaVerified: mfaVerifiedSession,
          notes: `Second-person compliance & NMA insurance verification completed by ${secondaryReviewerEmail}`
        })
      });
      const json = await res.json();
      if (!res.ok) {
        setComplianceFeedback(`Blocked: ${json.message}`);
        return;
      }
      setComplianceFeedback(
        `Verified: Partner ${partnerId} approved with two distinct reviewers (${json.partner.primaryReviewer} & ${json.partner.secondaryApprover}).`
      );
      await fetchBootstrap();
    } catch (err: any) {
      setComplianceFeedback(err.message);
    }
  };

  const handleAdminCategoryStatusChange = async () => {
    if (!selectedCategory) return;
    setAdminFeedback(null);
    try {
      const res = await fetch(`/api/v1/admin/categories/${selectedCategory.key}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newStatus: adminStatusTarget,
          reason: adminReason,
          actor: 'admin.owner@pherinepal.np',
          mfaVerified: mfaVerifiedSession
        })
      });
      const json = await res.json();
      if (!res.ok) {
        setAdminFeedback(`Blocked (${json.code}): ${json.message}`);
        return;
      }
      setAdminFeedback(
        `Category "${selectedCategory.key}" transitioned to ${json.category.status}. Audit ID: ${json.audit.auditId}`
      );
      await fetchBootstrap();
    } catch (err: any) {
      setAdminFeedback(err.message);
    }
  };

  const handleToggleGlobalSwitch = async () => {
    if (!data) return;
    setAdminFeedback(null);
    try {
      const res = await fetch('/api/v1/admin/global-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: !data.globalBookingSwitch,
          reason: 'Admin manual toggle of Global Booking Gate #1',
          actor: 'admin.owner@pherinepal.np',
          mfaVerified: mfaVerifiedSession
        })
      });
      const json = await res.json();
      if (!res.ok) {
        setAdminFeedback(`Blocked: ${json.message}`);
        return;
      }
      setAdminFeedback(
        `Global Booking Switch is now ${json.globalBookingSwitch ? 'ENABLED' : 'DISABLED (Kill Switch Active)'}.`
      );
      await fetchBootstrap();
    } catch (err: any) {
      setAdminFeedback(err.message);
    }
  };

  const handleRunInvariantSuite = async () => {
    setRunningInvariants(true);
    try {
      const res = await fetch('/api/v1/admin/verify-invariants', {
        method: 'POST'
      });
      const json = await res.json();
      setInvariantResults(json.results || []);
      await fetchBootstrap();
    } finally {
      setRunningInvariants(false);
    }
  };

  const handleAskGroundedAi = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      const res = await fetch('/api/v1/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: aiQuestion, locale })
      });
      const json = await res.json();
      if (res.ok) {
        setAiResponse({
          answer: json.answer,
          guardrailNotice: json.guardrailNotice,
          mode: json.mode
        });
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleToggleGpsConsent = async () => {
    if (!data) return;
    const nextVal = !data.travelerPrivacyConsent.duringTripGpsSharingOptIn;
    await fetch('/api/v1/privacy/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        duringTripGpsSharingOptIn: nextVal,
        aiPromptPiiRedactionEnabled: data.travelerPrivacyConsent.aiPromptPiiRedactionEnabled
      })
    });
    await fetchBootstrap();
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentDescription.trim()) return;
    await fetch('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reporterName: 'Aarav Sharma (TRV-001)',
        category: 'ROUTE_WEATHER_DISRUPTION',
        severity: incidentSeverity,
        locality: incidentLocality,
        description: incidentDescription
      })
    });
    setIncidentDescription('');
    await fetchBootstrap();
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-8">
        <div className="max-w-md w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 rounded-lg">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Loading PheriNepal Canonical Registry (31 Categories · 8 Dashboards · 240 Feature Modules)...
          </p>
        </div>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-8">
        <div className="max-w-lg w-full border border-red-300 dark:border-red-900 bg-white dark:bg-slate-900 p-6 rounded-lg space-y-4">
          <h1 className="text-lg font-semibold text-red-700 dark:text-red-400">
            Platform Registry Unavailable
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">{errorMsg}</p>
          <button
            onClick={fetchBootstrap}
            className="px-4 py-2 text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-md"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* STRICT 3-ZONE TOP BAR CONTRACT (Frontend Design Constitution Section 2) */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveSection('catalogue');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 font-display"
        >
          PheriNepal
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveSection('catalogue')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'catalogue'
                ? 'text-slate-900 dark:text-white underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            {locale === 'ne' ? '३१ सेवा सूची' : '31 Categories'}
          </button>
          <button
            onClick={() => setActiveSection('dashboards')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'dashboards'
                ? 'text-slate-900 dark:text-white underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            {locale === 'ne' ? '८ ड्यासबोर्ड' : '8 Dashboards'}
          </button>
          <button
            onClick={() => setActiveSection('lifecycle')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'lifecycle'
                ? 'text-slate-900 dark:text-white underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            {locale === 'ne' ? 'यात्रा चक्र र बुकिङ' : 'Trip & Booking Gate'}
          </button>
          <button
            onClick={() => setActiveSection('phases')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'phases'
                ? 'text-slate-900 dark:text-white underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            {locale === 'ne' ? '२४० मोड्युल रजिस्टर' : '240-Module Register'}
          </button>
          <button
            onClick={() => setActiveSection('safety')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'safety'
                ? 'text-slate-900 dark:text-white underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            {locale === 'ne' ? 'सुरक्षा र आपतकालीन' : 'Emergency & Safety'}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setActiveSection('phases');
              handleRunInvariantSuite();
            }}
            className="px-4 py-2 text-xs font-medium text-white bg-red-800 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            {locale === 'ne' ? 'गेट र लेजर परीक्षण' : 'Verify Platform Gates'}
          </button>
        </div>
      </header>

      {/* WORKSPACE UTILITY TOOLBAR BELOW HEADER (Locale, Theme, Role Switcher, Blueprint Metadata) */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 px-6 py-3">
        <div className="max-w-[1380px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Clean unboxed metadata with typographic separators (Zero-Pill Rule) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              {locale === 'ne'
                ? 'तपाईंको सम्पूर्ण नेपाल यात्रा साथी'
                : 'Your Complete Nepal Travel Companion'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">Doc: {data.documentId} v{data.version}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {data.counts.categoriesCount} Categories / {data.counts.dashboardsCount} Dashboards / {data.counts.totalFeatureModulesCount} Modules
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Global Booking Switch:{' '}
              <strong className={data.globalBookingSwitch ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}>
                {data.globalBookingSwitch ? 'ENABLED' : 'DISABLED'}
              </strong>
            </span>
          </div>

          {/* Interactive Workspace Controls (Bilingual Toggle, MFA Session Toggle, Dark Mode) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-md">
              <button
                onClick={() => setLocale('en')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  locale === 'en'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLocale('ne')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  locale === 'ne'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                नेपाली
              </button>
            </div>

            <button
              onClick={() => setMfaVerifiedSession(!mfaVerifiedSession)}
              className="px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              title="Toggle simulated MFA verification for Admin, Compliance, and Finance actions (Section 15.1)"
            >
              MFA Session: {mfaVerifiedSession ? 'VERIFIED' : 'UNVERIFIED'}
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Light or Dark Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Section Switcher */}
      <div className="flex md:hidden items-center gap-1 overflow-x-auto px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {(['catalogue', 'dashboards', 'lifecycle', 'phases', 'safety'] as const).map((sec) => (
          <button
            key={sec}
            onClick={() => setActiveSection(sec)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
              activeSection === sec
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {sec === 'catalogue' && '31 Categories'}
            {sec === 'dashboards' && '8 Dashboards'}
            {sec === 'lifecycle' && 'Trip & Booking'}
            {sec === 'phases' && '240 Modules'}
            {sec === 'safety' && 'Emergency & Safety'}
          </button>
        ))}
      </div>

      {/* MAIN VIEWPORT CONTAINER (1440px baseline presence) */}
      <main className="flex-1 max-w-[1380px] w-full mx-auto px-6 py-8 space-y-10">
        {/* HERO PROPOSITION & LIFECYCLE BAR */}
        <section className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>One Account. One Trip. One Support System. Entire Nepal.</span>
                  <span aria-hidden="true">·</span>
                  <span>Before You Go. While You Explore. After You Return.</span>
                </div>
                <h1
                  className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-display"
                  style={{ textWrap: 'balance' }}
                >
                  {locale === 'ne'
                    ? 'फेरीनेपाल: प्रमाणित आपूर्ति, पारदर्शी मूल्य र सुरक्षित यात्रा कार्यस्थल'
                    : 'Truthful Availability, Category-Verified Supply, and Reconciled Trip Operations Across Nepal'}
                </h1>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  {locale === 'ne'
                    ? 'सबै ३१ सेवा श्रेणीहरू तिनीहरूको वास्तविक स्थितिसँग प्रस्तुत गरिएका छन्। कुनै पनि बुकिङ भुक्तानी अनुरोध सफल हुँदैमा मात्र स्वतः स्वीकृत हुँदैन—बुकिङ, इन्भेन्टरी र भुक्तानी अलग-अलग स्टेट मेसिनद्वारा नियन्त्रित हुन्छन्।'
                    : 'Every one of the 31 planned service categories displays its exact operational gate status. No booking is accepted merely because a payment request succeeded: Booking state, Inventory Hold state, Payment state, and Partner Payout state run as separate server-enforced state machines.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveSection('lifecycle')}
                  className="px-4 py-2 text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-md hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 flex items-center gap-2"
                >
                  <span>Inspect 12-Point Mandatory Booking Gate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveSection('dashboards')}
                  className="px-4 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                >
                  Switch Across 8 Role Dashboards
                </button>
                <button
                  onClick={() => setActiveSection('safety')}
                  className="px-4 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                >
                  Public Emergency Directory (No Login Required)
                </button>
              </div>
            </div>

            {/* Right Column: Live Governance & Invariant Summary Table */}
            <div className="lg:col-span-5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 rounded-md p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Authoritative Blueprint Invariants
                </h2>
                <span className="text-xs font-mono tabular-nums text-slate-500">
                  Section 4 & 11.4
                </span>
              </div>

              <dl className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                <div className="py-2 flex items-center justify-between gap-4">
                  <dt className="text-slate-600 dark:text-slate-400">Canonical Categories</dt>
                  <dd className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                    31 / 31 Registered (7 AVAILABLE · 12 INFO_ONLY · 6 RESTRICTED/GATED · 6 COMING_SOON)
                  </dd>
                </div>
                <div className="py-2 flex items-center justify-between gap-4">
                  <dt className="text-slate-600 dark:text-slate-400">Separate State Dimensions</dt>
                  <dd className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
                    Booking · Inventory Hold · Payment · Payout
                  </dd>
                </div>
                <div className="py-2 flex items-center justify-between gap-4">
                  <dt className="text-slate-600 dark:text-slate-400">Financial Ledger Accounting</dt>
                  <dd className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                    Double-Entry Integer Minor Units (Paisa) · No False Escrow Claim
                  </dd>
                </div>
                <div className="py-2 flex items-center justify-between gap-4">
                  <dt className="text-slate-600 dark:text-slate-400">SOS (#21) & 24/7 Promise Rule</dt>
                  <dd className="font-mono tabular-nums text-amber-700 dark:text-amber-400">
                    SOS Hard-GATED · Support Hours: 08:00–20:00 NPT
                  </dd>
                </div>
                <div className="py-2 flex items-center justify-between gap-4">
                  <dt className="text-slate-600 dark:text-slate-400">Two-Person Approval Gate</dt>
                  <dd className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
                    Enforced on Trekking, Peak Climbing, Guides & Transport
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* =====================================================================
            VIEW 1: CANONICAL 31-CATEGORY SERVICE CATALOGUE (Section 5 & 5.1)
           ===================================================================== */}
        {activeSection === 'catalogue' && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">
                  01. Canonical 31-Category Service Registry & State Machine
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Single canonical registry (`src/domain/catalogue.ts`). Categories in `COMING_SOON`, `INFORMATION_ONLY`, or `RESTRICTED` block checkout server-side.
                </p>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter 31 categories or phase..."
                    className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-md">
                  {(['ALL', 'AVAILABLE', 'INFORMATION_ONLY', 'COMING_SOON', 'RESTRICTED'] as const).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                          statusFilter === st
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        {st === 'ALL' ? 'All (31)' : st}
                      </button>
                    )
                  )}
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-md">
                  {(['ALL', 'BEFORE', 'DURING', 'AFTER'] as const).map((stg) => (
                    <button
                      key={stg}
                      onClick={() => setLifecycleFilter(stg)}
                      className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                        lifecycleFilter === stg
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {stg === 'ALL' ? 'All Stages' : stg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* High-Density 31-Category Data Table */}
              <div className="lg:col-span-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        <th className="py-2.5 px-3 w-12 font-mono tabular-nums">#</th>
                        <th className="py-2.5 px-3">Category Key & Display Name</th>
                        <th className="py-2.5 px-3">Blueprint Initial Behaviour</th>
                        <th className="py-2.5 px-3">Live Gate Status</th>
                        <th className="py-2.5 px-3">Phase</th>
                        <th className="py-2.5 px-3 text-right">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                      {filteredCategories.map((cat) => {
                        const isSelected = cat.key === selectedCategory?.key;
                        return (
                          <tr
                            key={cat.key}
                            onClick={() => setSelectedCategoryKey(cat.key)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-slate-100 dark:bg-slate-800/80'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                            }`}
                          >
                            <td className="py-2.5 px-3 font-mono tabular-nums text-slate-500">
                              {String(cat.index).padStart(2, '0')}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-slate-900 dark:text-slate-100">
                                {locale === 'ne' ? cat.displayNameNe : cat.displayName}
                              </div>
                              <div className="text-slate-500 dark:text-slate-400 font-mono">
                                {cat.key} · {cat.transactional ? 'Transactional' : 'Non-Transactional'}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                              {cat.initialBehaviour}
                            </td>
                            <td className="py-2.5 px-3 font-mono">
                              <span
                                className={
                                  cat.status === 'AVAILABLE'
                                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                                    : cat.status === 'RESTRICTED' || cat.status === 'TEMPORARILY_UNAVAILABLE'
                                    ? 'text-red-700 dark:text-red-400 font-semibold'
                                    : cat.status === 'COMING_SOON'
                                    ? 'text-amber-700 dark:text-amber-400 font-medium'
                                    : 'text-slate-700 dark:text-slate-300'
                                }
                              >
                                {cat.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono tabular-nums text-slate-500">
                              {cat.owningPhase}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCategoryKey(cat.key);
                                }}
                                className="px-2.5 py-1 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-700 whitespace-nowrap shrink-0"
                              >
                                Contract
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Appendix A Service-Specific Contract Inspector */}
              {selectedCategory && (
                <div className="lg:col-span-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-5 space-y-5 sticky top-20">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="text-xs text-slate-500 font-mono tabular-nums">
                      Appendix A Service Contract · Category #{String(selectedCategory.index).padStart(2, '0')} · {selectedCategory.owningPhase}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 font-display">
                      {selectedCategory.displayName} ({selectedCategory.displayNameNe})
                    </h3>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Key: <code className="font-mono">{selectedCategory.key}</code> · Status:{' '}
                      <strong className="font-mono">{selectedCategory.status}</strong> · Stages:{' '}
                      {selectedCategory.lifecycleStages.join(' / ')}
                    </div>
                  </div>

                  {/* Honest Status & Gate Behaviour */}
                  <div className="space-y-2 text-xs">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      State Behaviour & Public Disclosure (Rule #4)
                    </h4>
                    {selectedCategory.status === 'AVAILABLE' && (
                      <p className="text-emerald-800 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 p-3 rounded">
                        AVAILABLE: Live verified supply active. Every booking request still passes the 12-point server-side Mandatory Booking Gate before reserving inventory.
                      </p>
                    )}
                    {selectedCategory.status === 'COMING_SOON' && (
                      <p className="text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-3 rounded">
                        COMING SOON (Principle #2): Visible as planned in canonical catalogue. Live price, inventory, checkout, and booking actions are strictly disabled.
                      </p>
                    )}
                    {selectedCategory.status === 'INFORMATION_ONLY' && (
                      <p className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded">
                        INFORMATION ONLY (Principle #6): Non-transactional discovery, planning, or official source directory. Never represented as a bookable product.
                      </p>
                    )}
                    {(selectedCategory.status === 'RESTRICTED' ||
                      selectedCategory.status === 'TEMPORARILY_UNAVAILABLE') && (
                      <p className="text-red-800 dark:text-red-300 bg-red-50/70 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-3 rounded">
                        {selectedCategory.gatedReason ||
                          selectedCategory.publicRestrictionNotice ||
                          'RESTRICTED: Transactions are blocked until operational, legal, and verification readiness gates pass.'}
                      </p>
                    )}
                  </div>

                  <dl className="space-y-3 text-xs border-t border-slate-200 dark:border-slate-800 pt-3">
                    <div>
                      <dt className="font-semibold text-slate-700 dark:text-slate-300">
                        Category Operational & Backup Owners (`PH00-F004`)
                      </dt>
                      <dd className="text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                        Primary: {selectedCategory.operationalOwnerRole} · Backup: {selectedCategory.backupOwnerRole}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-700 dark:text-slate-300">
                        Inventory & Capacity Model (Appendix A)
                      </dt>
                      <dd className="text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                        {selectedCategory.inventoryModel}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-700 dark:text-slate-300">
                        Mandatory Partner Verification Evidence
                      </dt>
                      <dd className="text-slate-600 dark:text-slate-400 mt-1 space-y-1">
                        {selectedCategory.verificationRequirements.map((req) => (
                          <div key={req}>· {req}</div>
                        ))}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-700 dark:text-slate-300">
                        High-Risk Two-Person Approval Gate
                      </dt>
                      <dd className="text-slate-600 dark:text-slate-400 mt-0.5">
                        {selectedCategory.highRiskTwoPersonApproval
                          ? 'REQUIRED (Primary Reviewer + Distinct Secondary Safety/Compliance Approver)'
                          : 'Standard Compliance Review'}
                      </dd>
                    </div>
                  </dl>

                  {/* Admin Quick Status Transition Test */}
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Admin Category State Machine Transition (Section 5.1)
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      <select
                        value={adminStatusTarget}
                        onChange={(e) => setAdminStatusTarget(e.target.value as CategoryStatus)}
                        className="text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded px-2.5 py-1.5"
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="INFORMATION_ONLY">INFORMATION_ONLY</option>
                        <option value="COMING_SOON">COMING_SOON</option>
                        <option value="TEMPORARILY_UNAVAILABLE">TEMPORARILY_UNAVAILABLE</option>
                        <option value="RESTRICTED">RESTRICTED</option>
                      </select>
                      <input
                        type="text"
                        value={adminReason}
                        onChange={(e) => setAdminReason(e.target.value)}
                        placeholder="Audit log reason..."
                        className="text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded px-2.5 py-1.5"
                      />
                      <button
                        onClick={handleAdminCategoryStatusChange}
                        className="px-3 py-2 text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                      >
                        Apply Audited Status Change
                      </button>
                    </div>
                    {adminFeedback && (
                      <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-2.5 rounded font-mono">
                        {adminFeedback}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =====================================================================
            VIEW 2: EIGHT ROLE-MAPPED DASHBOARDS (Section 6)
           ===================================================================== */}
        {activeSection === 'dashboards' && (
          <section className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">
                  02. Eight Role-Mapped Dashboards & Permission Boundaries
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Blueprint Section 6: Access is permission-based and audited. Admin, Verification & Compliance, and Finance dashboards enforce MFA verification.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-500">
                Active Role: <strong className="text-slate-900 dark:text-white">{currentDashboardDef?.targetRole}</strong> · MFA Required: {currentDashboardDef?.requiresMfa ? 'YES' : 'NO'}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Sidebar: 8 Dashboards Selector */}
              <aside className="lg:col-span-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg divide-y divide-slate-200 dark:divide-slate-800">
                {data.dashboards.map((dash) => {
                  const active = dash.id === activeDashboard;
                  return (
                    <button
                      key={dash.id}
                      onClick={() => setActiveDashboard(dash.id)}
                      className={`w-full text-left p-3.5 transition-colors flex items-center justify-between gap-2 ${
                        active
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-mono opacity-75">
                          D0{dash.index} · {dash.targetRole}
                        </div>
                        <div className="text-sm font-semibold mt-0.5">
                          {locale === 'ne' ? dash.nameNe : dash.name}
                        </div>
                      </div>
                      {dash.requiresMfa && (
                        <Lock className="w-3.5 h-3.5 shrink-0 opacity-75" />
                      )}
                    </button>
                  );
                })}
              </aside>

              {/* Right Workspace: Selected Dashboard Operational View */}
              <div className="lg:col-span-9 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-6 space-y-6">
                {currentDashboardDef && (
                  <>
                    <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-xs text-slate-500 font-mono">
                          Dashboard #{currentDashboardDef.index} · Role: {currentDashboardDef.targetRole} · Phases: {currentDashboardDef.owningPhases.join(', ')}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-display">
                          {locale === 'ne' ? currentDashboardDef.nameNe : currentDashboardDef.name}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {currentDashboardDef.description}
                        </p>
                      </div>
                      <div className="text-xs font-mono text-slate-500">
                        Permissions: {currentDashboardDef.permissions.join(' · ')}
                      </div>
                    </div>

                    {/* MFA Enforcement Banner if Dashboard requires MFA and session is unverified */}
                    {currentDashboardDef.requiresMfa && !mfaVerifiedSession && (
                      <div className="border border-red-300 dark:border-red-900 bg-red-50/70 dark:bg-red-950/40 p-4 rounded-md text-xs text-red-800 dark:text-red-300 flex items-center justify-between gap-4">
                        <div>
                          <strong>MFA Verification Required (Section 6 & 15.1):</strong> Privileged mutations in {currentDashboardDef.name} are blocked while MFA is unverified.
                        </div>
                        <button
                          onClick={() => setMfaVerifiedSession(true)}
                          className="px-3 py-1.5 bg-red-800 text-white rounded font-medium whitespace-nowrap shrink-0"
                        >
                          Verify MFA Session Now
                        </button>
                      </div>
                    )}

                    {/* 1. TRAVELER DASHBOARD */}
                    {activeDashboard === 'traveler' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-md">
                            <div className="text-xs text-slate-500">Active Multi-Service Trip ID</div>
                            <div className="text-base font-bold font-mono tabular-nums mt-1">
                              TRP-NEPAL-2026-01
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              Kathmandu · Patan · Pokhara · Khumbu
                            </div>
                          </div>
                          <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-md">
                            <div className="text-xs text-slate-500">Separate Bookings Under Trip ID</div>
                            <div className="text-base font-bold font-mono tabular-nums mt-1">
                              {data.bookings.length} Independent Records
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              Principle #9: Independent state & ledger per booking
                            </div>
                          </div>
                          <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-md">
                            <div className="text-xs text-slate-500">During-Trip Location Sharing (Section 14)</div>
                            <div className="text-base font-bold font-mono mt-1">
                              {data.travelerPrivacyConsent.duringTripGpsSharingOptIn
                                ? 'OPTED-IN (4h Auto-Expiry)'
                                : 'REVOKED / OFF'}
                            </div>
                            <button
                              onClick={handleToggleGpsConsent}
                              className="mt-2 px-3 py-1 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              {data.travelerPrivacyConsent.duringTripGpsSharingOptIn
                                ? 'Revoke GPS Sharing'
                                : 'Opt-In for 4 Hours'}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">
                            Traveler Bookings & 4-Dimension State Records
                          </h4>
                          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                                  <th className="py-2 px-3">Booking ID & Service</th>
                                  <th className="py-2 px-3">Booking State</th>
                                  <th className="py-2 px-3">Inventory State</th>
                                  <th className="py-2 px-3">Payment State</th>
                                  <th className="py-2 px-3 text-right">Total Snapshot</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {data.bookings.map((b) => (
                                  <tr key={b.bookingId}>
                                    <td className="py-2.5 px-3">
                                      <div className="font-semibold">{b.listingTitle}</div>
                                      <div className="font-mono text-slate-500">
                                        {b.bookingId} · Mode: {b.bookingMode} · Voucher: {b.voucherCode || 'Pending Confirmation'}
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-3 font-mono font-semibold">{b.bookingState}</td>
                                    <td className="py-2.5 px-3 font-mono">{b.inventoryHoldState}</td>
                                    <td className="py-2.5 px-3 font-mono">{b.paymentState}</td>
                                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                                      {formatNprFromMinor(b.quoteSnapshot.totalPayableMinor)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. PARTNER DASHBOARD */}
                    {activeDashboard === 'partner' && (
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">
                            Approval Booking Queue (Section 11.2 — Partner Response Window)
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Rule #5: Even when payment is `AUTHORIZED`, an `APPROVAL` mode booking remains `PENDING_PARTNER` with inventory `HELD` until the partner explicitly approves or declines.
                          </p>
                          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                                  <th className="py-2 px-3">Booking ID</th>
                                  <th className="py-2 px-3">Listing & Partner</th>
                                  <th className="py-2 px-3">Current States</th>
                                  <th className="py-2 px-3 text-right">Partner Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {data.bookings.map((b) => (
                                  <tr key={b.bookingId}>
                                    <td className="py-2.5 px-3 font-mono">{b.bookingId}</td>
                                    <td className="py-2.5 px-3">
                                      <div className="font-semibold">{b.listingTitle}</div>
                                      <div className="text-slate-500">{b.partnerName} · Qty: {b.quantity}</div>
                                    </td>
                                    <td className="py-2.5 px-3 font-mono">
                                      Booking: {b.bookingState} · Hold: {b.inventoryHoldState} · Pay: {b.paymentState}
                                    </td>
                                    <td className="py-2.5 px-3 text-right">
                                      {b.bookingState === 'PENDING_PARTNER' ? (
                                        <div className="inline-flex items-center gap-2">
                                          <button
                                            onClick={() => handlePartnerDecision(b.bookingId, 'APPROVE')}
                                            className="px-2.5 py-1 bg-emerald-700 text-white rounded text-xs font-medium"
                                          >
                                            Approve & Capture
                                          </button>
                                          <button
                                            onClick={() => handlePartnerDecision(b.bookingId, 'DECLINE')}
                                            className="px-2.5 py-1 bg-red-700 text-white rounded text-xs font-medium"
                                          >
                                            Decline & Release Hold
                                          </button>
                                        </div>
                                      ) : (
                                        <span className="text-slate-500 font-mono">{b.bookingState}</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. GUIDE & OPERATOR DASHBOARD */}
                    {activeDashboard === 'guide-operator' && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold">
                          Verified Trekking, Guide & Green-Plate Transport Supply (Phase 09)
                        </h4>
                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                                <th className="py-2 px-3">Listing & Altitude</th>
                                <th className="py-2 px-3">Mandatory Permit & Safety Checklist</th>
                                <th className="py-2 px-3 text-right">Remaining Capacity</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                              {data.listings.map((lst) => (
                                <tr key={lst.listingId}>
                                  <td className="py-2.5 px-3">
                                    <div className="font-semibold">{lst.title}</div>
                                    <div className="text-slate-500 font-mono">
                                      {lst.locality}, {lst.district} · Max Alt: {lst.altitudeMeters}m
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                                    {lst.permitRequirements.join(' · ')}
                                  </td>
                                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                                    {lst.availableUnits} / {lst.totalCapacity} ({lst.activeHoldsCount} HELD)
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* 4. ADMIN & GOVERNANCE DASHBOARD */}
                    {activeDashboard === 'admin' && (
                      <div className="space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 border border-slate-200 dark:border-slate-800 p-4 rounded-md bg-slate-50 dark:bg-slate-950/50">
                          <div>
                            <div className="text-sm font-semibold">
                              Mandatory Gate #1: Global Booking Kill Switch
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              Section 5.1 & 11.4: Emergency disable blocks all new quotes and bookings immediately while preserving existing records.
                            </div>
                          </div>
                          <button
                            onClick={handleToggleGlobalSwitch}
                            className={`px-4 py-2 text-xs font-medium rounded-md text-white whitespace-nowrap shrink-0 ${
                              data.globalBookingSwitch ? 'bg-red-700 hover:bg-red-600' : 'bg-emerald-700 hover:bg-emerald-600'
                            }`}
                          >
                            {data.globalBookingSwitch
                              ? 'Trigger Emergency Global Booking Disable'
                              : 'Re-Enable Global Booking Switch'}
                          </button>
                        </div>

                        {adminFeedback && (
                          <div className="p-3 border border-slate-300 dark:border-slate-700 rounded text-xs font-mono">
                            {adminFeedback}
                          </div>
                        )}

                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">
                            Master Register of All 26 Owner Decisions (`DECISIONS.md` — Section 32 · Zero Self-Approvals)
                          </h4>
                          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md max-h-80">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                                  <th className="py-2 px-3">ID</th>
                                  <th className="py-2 px-3">Decision Question & Topic</th>
                                  <th className="py-2 px-3">Status</th>
                                  <th className="py-2 px-3">Approver</th>
                                  <th className="py-2 px-3">Safe Work Continuation Boundary</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {data.decisions.map((d) => (
                                  <tr key={d.id}>
                                    <td className="py-2.5 px-3 font-mono font-semibold">{d.id}</td>
                                    <td className="py-2.5 px-3">
                                      <div className="font-semibold">{d.topic}</div>
                                      <div className="text-slate-500 mt-0.5">{d.question}</div>
                                    </td>
                                    <td className="py-2.5 px-3 font-mono font-semibold text-amber-700 dark:text-amber-400">
                                      {d.status}
                                    </td>
                                    <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                                      {d.approver}
                                    </td>
                                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                                      {d.safeContinuationWork}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">
                            Immutable Privileged Action Audit Log (Rule #8)
                          </h4>
                          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md max-h-64">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                                  <th className="py-2 px-3">Timestamp (UTC)</th>
                                  <th className="py-2 px-3">Actor & Role</th>
                                  <th className="py-2 px-3">Action & Target</th>
                                  <th className="py-2 px-3">Reason & Correlation ID</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                                {data.auditEvents.map((ev) => (
                                  <tr key={ev.auditId}>
                                    <td className="py-2 px-3 tabular-nums text-slate-500">
                                      {ev.timestampUtc.slice(0, 19)}Z
                                    </td>
                                    <td className="py-2 px-3">
                                      {ev.actor} ({ev.actorRole})
                                    </td>
                                    <td className="py-2 px-3">
                                      {ev.action} → {ev.targetId}
                                    </td>
                                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                                      {ev.reason} [{ev.correlationId}]
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 5. VERIFICATION & COMPLIANCE DASHBOARD */}
                    {activeDashboard === 'verification-compliance' && (
                      <div className="space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-4 border border-slate-200 dark:border-slate-800 p-4 rounded-md bg-slate-50 dark:bg-slate-950/40">
                          <div>
                            <h4 className="text-sm font-semibold">
                              Two-Person Separation of Duties Approval (Section 13 & 15.2)
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              High-risk categories require two distinct reviewers. Try approving with the same email as Primary Reviewer (`compliance.anita@pherinepal.np`) to verify server rejection.
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-medium">Acting Secondary Approver:</label>
                            <select
                              value={secondaryReviewerEmail}
                              onChange={(e) => setSecondaryReviewerEmail(e.target.value)}
                              className="text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded px-2.5 py-1.5 font-mono"
                            >
                              <option value="safety.pemba@pherinepal.np">
                                safety.pemba@pherinepal.np (Distinct Approver)
                              </option>
                              <option value="compliance.anita@pherinepal.np">
                                compliance.anita@pherinepal.np (Same as Primary — Test SoD Block)
                              </option>
                            </select>
                          </div>
                        </div>

                        {complianceFeedback && (
                          <div className="p-3 border border-slate-300 dark:border-slate-700 rounded text-xs font-mono">
                            {complianceFeedback}
                          </div>
                        )}

                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                                <th className="py-2 px-3">Partner & Category</th>
                                <th className="py-2 px-3">Licence & Expiry (UTC)</th>
                                <th className="py-2 px-3">Reviewers (SoD)</th>
                                <th className="py-2 px-3">Status & What Was Checked</th>
                                <th className="py-2 px-3 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                              {data.partners.map((p) => (
                                <tr key={p.partnerId}>
                                  <td className="py-2.5 px-3">
                                    <div className="font-semibold">{p.organizationName}</div>
                                    <div className="text-slate-500 font-mono">
                                      {p.partnerId} · {p.categoryKey} · {p.district}
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 font-mono tabular-nums">
                                    <div>{p.licenceNumber}</div>
                                    <div className="text-slate-500">
                                      Exp: {p.licenceExpiryUtc.slice(0, 10)} · Ins: {p.insuranceValid ? 'VALID' : 'EXPIRED'}
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 font-mono">
                                    <div>1st: {p.primaryReviewer || '—'}</div>
                                    <div>2nd: {p.secondaryApprover || 'PENDING'}</div>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <div className="font-mono font-semibold">{p.status}</div>
                                    <div className="text-slate-500">{p.whatWasCheckedSummary}</div>
                                  </td>
                                  <td className="py-2.5 px-3 text-right">
                                    {p.status !== 'VERIFIED' ? (
                                      <button
                                        onClick={() => handleTwoPersonApprove(p.partnerId)}
                                        className="px-3 py-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded text-xs font-medium whitespace-nowrap shrink-0"
                                      >
                                        Record 2nd Approval
                                      </button>
                                    ) : (
                                      <span className="text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                                        VERIFIED
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* 6. FINANCE & LEDGER DASHBOARD */}
                    {activeDashboard === 'finance' && (
                      <div className="space-y-5">
                        <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-md bg-slate-50 dark:bg-slate-950/40 text-xs space-y-1">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            Append-Only Double-Entry Financial Ledger (Section 12.1 & 12.2)
                          </div>
                          <p className="text-slate-600 dark:text-slate-400">
                            All monetary values are stored in integer minor units (paisa: 100 paisa = 1.00 NPR) and reconciled so Total Debits equal Total Credits per journal. Rule #6: Payments are never misrepresented as escrow.
                          </p>
                        </div>

                        <div className="space-y-4">
                          {data.ledgerEntries.map((jrn) => (
                            <div
                              key={jrn.journalId}
                              className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden"
                            >
                              <div className="bg-slate-50 dark:bg-slate-950/60 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                                <div className="font-mono font-semibold">
                                  {jrn.journalId} · Booking: {jrn.bookingId} · {jrn.eventType}
                                </div>
                                <div className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold">
                                  Debits: {formatNprFromMinor(jrn.totalDebitMinor)} == Credits:{' '}
                                  {formatNprFromMinor(jrn.totalCreditMinor)} (BALANCED)
                                </div>
                              </div>
                              <table className="w-full text-left border-collapse text-xs font-mono">
                                <thead>
                                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                                    <th className="py-1.5 px-4">Ledger Account</th>
                                    <th className="py-1.5 px-4">Direction</th>
                                    <th className="py-1.5 px-4 text-right">Minor Units (Paisa)</th>
                                    <th className="py-1.5 px-4 text-right">Formatted NPR</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                  {jrn.lines.map((ln, idx) => (
                                    <tr key={idx}>
                                      <td className="py-1.5 px-4">{ln.accountId}</td>
                                      <td className="py-1.5 px-4">{ln.entryType}</td>
                                      <td className="py-1.5 px-4 text-right tabular-nums">
                                        {ln.amountMinor}
                                      </td>
                                      <td className="py-1.5 px-4 text-right tabular-nums">
                                        {formatNprFromMinor(ln.amountMinor)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 7. SUPPORT & SAFETY DASHBOARD */}
                    {activeDashboard === 'support-safety' && (
                      <div className="space-y-5">
                        <div className="border border-amber-300 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/30 p-4 rounded-md text-xs space-y-1">
                          <div className="font-semibold text-amber-900 dark:text-amber-300">
                            Explicit Support Staffing & SOS Gate Policy (Rule #7 & Section 14)
                          </div>
                          <p className="text-amber-800 dark:text-amber-400">
                            Published Operating Hours: <strong>{data.supportOperatingHours}</strong>. Live SOS emergency dispatch (#21) remains hard-locked to <code>RESTRICTED / GATED</code> until 24/7 staffed response operations and live drills are approved.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div className="md:col-span-7 space-y-3">
                            <h4 className="text-sm font-semibold">Active Support & Incident Triage Queue</h4>
                            <div className="space-y-3">
                              {data.incidents.map((inc) => (
                                <div
                                  key={inc.incidentId}
                                  className="border border-slate-200 dark:border-slate-800 p-3.5 rounded-md text-xs space-y-1.5"
                                >
                                  <div className="flex items-center justify-between font-mono">
                                    <span className="font-semibold">
                                      {inc.incidentId} · {inc.category} · Severity: {inc.severity}
                                    </span>
                                    <span>{inc.status}</span>
                                  </div>
                                  <p className="text-slate-700 dark:text-slate-300">{inc.description}</p>
                                  <div className="text-slate-500">
                                    Locality: {inc.locality} · Assigned: {inc.assignedTeam}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <form onSubmit={handleCreateIncident} className="md:col-span-5 border border-slate-200 dark:border-slate-800 p-4 rounded-md space-y-3">
                            <h4 className="text-sm font-semibold">Log New Support / Disruption Case</h4>
                            <div>
                              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                                Locality / Route Sector
                              </label>
                              <input
                                type="text"
                                value={incidentLocality}
                                onChange={(e) => setIncidentLocality(e.target.value)}
                                className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded px-2.5 py-1.5"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                                Severity Classification
                              </label>
                              <select
                                value={incidentSeverity}
                                onChange={(e) => setIncidentSeverity(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                                className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded px-2.5 py-1.5"
                              >
                                <option value="LOW">LOW — General Inquiry</option>
                                <option value="MEDIUM">MEDIUM — Schedule / Weather Disruption</option>
                                <option value="HIGH">HIGH — Partner Dispute / Lost Document</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                                Incident Details
                              </label>
                              <textarea
                                rows={3}
                                value={incidentDescription}
                                onChange={(e) => setIncidentDescription(e.target.value)}
                                placeholder="Describe route delay, booking dispute, or lost document..."
                                className="w-full text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded p-2"
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full py-2 text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded"
                            >
                              Submit to Staffed Support Queue
                            </button>
                          </form>
                        </div>
                      </div>
                    )}

                    {/* 8. CONTENT & INTELLIGENCE DASHBOARD */}
                    {activeDashboard === 'content-intelligence' && (
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">
                            Official Source Registry & Freshness Schedule (`PH04-F012` & Section 18)
                          </h4>
                          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                                  <th className="py-2 px-3">Source ID & Publisher</th>
                                  <th className="py-2 px-3">Advisory / Policy Summary</th>
                                  <th className="py-2 px-3">Last Verified (UTC)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {data.officialSources.map((src) => (
                                  <tr key={src.sourceId}>
                                    <td className="py-2.5 px-3">
                                      <div className="font-mono font-semibold">{src.sourceId}</div>
                                      <div className="text-slate-500">{src.publisher}</div>
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <div className="font-semibold">
                                        {locale === 'ne' ? src.titleNe : src.title}
                                      </div>
                                      <div className="text-slate-600 dark:text-slate-400 mt-0.5">
                                        {locale === 'ne' ? src.summaryNe : src.summary}
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-500">
                                      <div>Verified: {src.lastVerifiedUtc.slice(0, 10)}</div>
                                      <div>Next Review: {src.nextReviewDate}</div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Grounded AI Travel Intelligence Sandbox (Section 19 & Rule #10) */}
                        <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-md space-y-4 bg-slate-50 dark:bg-slate-950/40">
                          <div>
                            <h4 className="text-sm font-semibold">
                              Grounded AI Travel Intelligence Evaluator (Section 19 & Rule #10)
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Retrieves strictly from the Official Source Registry with citations and timestamps. Never approves partners, confirms bookings, moves money, or dispatches emergency responders.
                            </p>
                          </div>
                          <form onSubmit={handleAskGroundedAi} className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={aiQuestion}
                              onChange={(e) => setAiQuestion(e.target.value)}
                              className="flex-1 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded px-3 py-2"
                              placeholder="Ask about TIMS permits, Visa On-Arrival fees, or Lukla DHM weather..."
                            />
                            <button
                              type="submit"
                              disabled={aiLoading}
                              className="px-4 py-2 text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded whitespace-nowrap shrink-0"
                            >
                              {aiLoading ? 'Evaluating Grounded Sources...' : 'Test Grounded AI Citation'}
                            </button>
                          </form>
                          {aiResponse && (
                            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 rounded space-y-2 text-xs">
                              <div className="text-slate-800 dark:text-slate-200 leading-relaxed">
                                {aiResponse.answer}
                              </div>
                              <div className="text-slate-500 font-mono pt-2 border-t border-slate-200 dark:border-slate-800">
                                {aiResponse.guardrailNotice} · Engine: {aiResponse.mode}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            VIEW 3: TRAVEL LIFECYCLE & 12-POINT MANDATORY BOOKING GATE (Section 7, 11, 12)
           ===================================================================== */}
        {activeSection === 'lifecycle' && (
          <section className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">
                03. Before / During / After Lifecycle & 12-Point Mandatory Booking Gate Simulator
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Blueprint Section 11.4 & 12.4: Test server-calculated immutable quotes, transparent NPR/paisa fee breakdowns, and separate Booking / Inventory Hold / Payment state machines.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Select Listing & Trigger Server Quote / Booking */}
              <div className="lg:col-span-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-6 space-y-5">
                <h3 className="text-base font-bold font-display">
                  Step 1: Select Supply Listing & Request Server-Calculated Quote
                </h3>

                <div className="space-y-3">
                  {data.listings.map((lst) => {
                    const cat = data.categories.find((c) => c.key === lst.categoryKey);
                    const partner = data.partners.find((p) => p.partnerId === lst.partnerId);
                    const isSelected = lst.listingId === selectedListingId;
                    return (
                      <div
                        key={lst.listingId}
                        onClick={() => {
                          setSelectedListingId(lst.listingId);
                          setActiveQuote(null);
                          setBookingFeedback(null);
                        }}
                        className={`p-4 border rounded-md cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-slate-900 dark:border-slate-200 bg-slate-50 dark:bg-slate-800/60'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-mono">
                          <span>
                            {lst.listingId} · Category: {lst.categoryKey} ({cat?.status}) · Mode: {lst.bookingMode}
                          </span>
                          <span className="tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                            {formatNprFromMinor(lst.basePriceMinorNpr)} / {lst.unitLabel}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">
                          {locale === 'ne' ? lst.titleNe : lst.title}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          Partner: {partner?.organizationName} ({partner?.status}) · Remaining Inventory:{' '}
                          <strong className="font-mono tabular-nums">
                            {lst.availableUnits} / {lst.totalCapacity}
                          </strong>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-end gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Quantity / Units
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={bookingQuantity}
                      onChange={(e) => setBookingQuantity(Math.max(1, Number(e.target.value) || 1))}
                      className="w-24 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded px-3 py-2 font-mono tabular-nums"
                    />
                  </div>

                  <button
                    onClick={() => handleCalculateQuote(selectedListingId, bookingQuantity)}
                    className="px-4 py-2 text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-md hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                  >
                    Evaluate 12-Point Gate & Calculate Server Quote
                  </button>
                </div>

                {bookingFeedback && (
                  <div
                    className={`p-3.5 rounded-md border text-xs font-mono ${
                      bookingFeedback.type === 'success'
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300'
                        : 'border-red-300 dark:border-red-800 bg-red-50/70 dark:bg-red-950/40 text-red-900 dark:text-red-300'
                    }`}
                  >
                    {bookingFeedback.text}
                  </div>
                )}

                {/* Customer-Facing Money Transparency & Immutable Quote Breakdown (Section 12.4) */}
                {activeQuote && (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-md p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                      <h4 className="text-xs font-semibold">
                        Immutable Server Quote Snapshot ({activeQuote.quoteId})
                      </h4>
                      <span className="text-xs font-mono text-slate-500">
                        Expires: {activeQuote.expiresAtUtc.slice(11, 19)} UTC
                      </span>
                    </div>

                    <dl className="space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <dt className="text-slate-600 dark:text-slate-400">
                          Base Price ({activeQuote.quantity} unit/slot)
                        </dt>
                        <dd className="tabular-nums">{formatNprFromMinor(activeQuote.baseAmountMinor)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-600 dark:text-slate-400">Mandatory Service Fee</dt>
                        <dd className="tabular-nums">{formatNprFromMinor(activeQuote.mandatoryFeeMinor)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-600 dark:text-slate-400">Nepal VAT (13.00%)</dt>
                        <dd className="tabular-nums">{formatNprFromMinor(activeQuote.taxAmountMinor)}</dd>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1.5 font-bold text-slate-900 dark:text-white">
                        <dt>Total Payable (Integer Minor Units: {activeQuote.totalPayableMinor} paisa)</dt>
                        <dd className="tabular-nums">{formatNprFromMinor(activeQuote.totalPayableMinor)}</dd>
                      </div>
                      <div className="flex justify-between text-slate-500 pt-1">
                        <dt>Platform Commission (10%) / Partner Receivable</dt>
                        <dd className="tabular-nums">
                          {formatNprFromMinor(activeQuote.platformCommissionMinor)} /{' '}
                          {formatNprFromMinor(activeQuote.partnerReceivableMinor)}
                        </dd>
                      </div>
                    </dl>

                    <div className="text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-2">
                      <strong>Snapshotted Policy ({activeQuote.cancellationPolicyVersion}):</strong>{' '}
                      {activeQuote.cancellationPolicySummary}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={simulatePaymentSuccess}
                          onChange={(e) => setSimulatePaymentSuccess(e.target.checked)}
                        />
                        <span>Simulate Payment Provider Success (Uncheck to test failed payment hold release)</span>
                      </label>

                      <button
                        onClick={handleExecuteBooking}
                        className="px-4 py-2 text-xs font-medium bg-red-800 hover:bg-red-700 text-white rounded-md whitespace-nowrap shrink-0"
                      >
                        Execute Atomic Booking & Ledger Entry
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: 12-Point Mandatory Booking Gate Live Checklist (Section 11.4) */}
              <div className="lg:col-span-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-5 space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold font-display">
                    Mandatory 12-Point Server-Side Booking Gate (Section 11.4)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select any listing (including restricted Peak Climbing `LST-PEAK-105`) and click Evaluate to inspect all 12 server checks.
                  </p>
                </div>

                {activeGateResult ? (
                  <div className="space-y-2">
                    {activeGateResult.checks.map((chk) => (
                      <div
                        key={chk.step}
                        className="flex items-start justify-between gap-3 text-xs py-1.5 border-b border-slate-100 dark:border-slate-800/60"
                      >
                        <div className="flex items-start gap-2">
                          {chk.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              #{String(chk.step).padStart(2, '0')}. {chk.name}
                            </div>
                            <div className="text-slate-500 font-mono">{chk.detail}</div>
                          </div>
                        </div>
                        <span
                          className={`font-mono font-semibold shrink-0 ${
                            chk.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
                          }`}
                        >
                          {chk.passed ? 'PASS' : 'BLOCK'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    Click &ldquo;Evaluate 12-Point Gate & Calculate Server Quote&rdquo; on any listing to run the live server-side gate evaluation.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            VIEW 4: PH00 GOVERNANCE AUDIT (PH00-F001..F012) & 240-MODULE REGISTER
           ===================================================================== */}
        {activeSection === 'phases' && (
          <section className="space-y-8">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">
                  04. PH00 Governance & Foundation Audit (`PH00-F001`–`PH00-F012`) & 240-Module Register
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Active Phase Scope: <strong>PH00 ONLY</strong> (`PARTIAL` pending Owner sign-off per Rule #11). Phases `PH01`–`PH17` are strictly `NOT_STARTED`. All 26 Section 32 Owner Decisions are `PENDING` or `GATED`.
                </p>
              </div>
              <button
                onClick={handleRunInvariantSuite}
                disabled={runningInvariants}
                className="px-4 py-2 text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-md flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${runningInvariants ? 'animate-spin' : ''}`} />
                <span>Run Automated PH00 & Invariant Verification Suite</span>
              </button>
            </div>

            {invariantResults && (
              <div className="border border-emerald-300 dark:border-emerald-900 bg-white dark:bg-slate-900 rounded-lg p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Live Automated Verification Suite Output (INV-01 through INV-06)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {invariantResults.map((res) => (
                    <div
                      key={res.testId}
                      className="border border-slate-200 dark:border-slate-800 p-3.5 rounded-md text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-semibold">{res.testId}: {res.name}</span>
                        <span className={res.passed ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-red-700 font-bold'}>
                          {res.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-mono">{res.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PH00-F001 to PH00-F012 Feature Audit & Remediation Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                  A. PH00 Feature-by-Feature Audit & Remediation Matrix (`PH00-F001` to `PH00-F012`)
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  12 / 12 PH00 Modules Remediated · Awaits Owner Sign-Off
                </span>
              </div>
              <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                        <th className="py-2.5 px-3 font-mono">Feature ID</th>
                        <th className="py-2.5 px-3">Blueprint Title & Section</th>
                        <th className="py-2.5 px-3 font-mono">Prior State</th>
                        <th className="py-2.5 px-3 font-mono">Current Status</th>
                        <th className="py-2.5 px-3">Remediation & Acceptance Evidence</th>
                        <th className="py-2.5 px-3">Owner Gate Required</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {data.ph00Governance.featureAuditMatrix.map((item) => (
                        <tr key={item.featureId}>
                          <td className="py-2.5 px-3 font-mono font-bold whitespace-nowrap">{item.featureId}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</div>
                            <div className="text-slate-500 font-mono">{item.blueprintSection}</div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-red-700 dark:text-red-400">
                            {item.preRemediationStatus}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-amber-700 dark:text-amber-400">
                            {item.postRemediationStatus}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                            <div>{item.gapRemediated}</div>
                            <div className="font-mono text-slate-500 mt-0.5">Evidence: {item.evidenceFile}</div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                            {item.ownerApprovalRequired}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* PH00-F010: All 15 Legal, Licensing, Insurance & Tax Questions (Section 22) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                  B. Legal, Licensing, Insurance & Tax Question Register (`PH00-F010` — All 15 Section 22 Domains)
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  15 / 15 Domains · 100% PENDING_COUNSEL_OPINION (Zero Fabricated Legal Approvals)
                </span>
              </div>
              <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                        <th className="py-2 px-3 font-mono">Legal ID</th>
                        <th className="py-2 px-3">Regulatory Domain & Question</th>
                        <th className="py-2 px-3">Authority / Counsel</th>
                        <th className="py-2 px-3 font-mono">Written Response</th>
                        <th className="py-2 px-3 font-mono">Gate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {data.ph00Governance.legalRegister.map((leg) => (
                        <tr key={leg.legalId}>
                          <td className="py-2 px-3 font-mono font-bold">{leg.legalId}</td>
                          <td className="py-2 px-3">
                            <div className="font-semibold text-slate-900 dark:text-slate-100">{leg.domainTitle}</div>
                            <div className="text-slate-600 dark:text-slate-400">{leg.question}</div>
                            <div className="text-slate-500 font-mono mt-0.5">Scope: {leg.categoryScope}</div>
                          </td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-300">{leg.authorityOrCounsel}</td>
                          <td className="py-2 px-3 font-mono text-amber-700 dark:text-amber-400">
                            {leg.writtenResponse}
                          </td>
                          <td className="py-2 px-3 font-mono font-semibold text-red-700 dark:text-red-400">
                            {leg.launchGateStatus}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* PH00-F002 (15 Personas) & PH00-F011 (Pilot Selection Framework) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-bold font-display">
                    C. 15 Traveler, Partner & Staff Personas (`PH00-F002` — Section 3)
                  </h3>
                  <span className="text-xs font-mono text-amber-700 dark:text-amber-400">
                    Field Interviews: VALIDATION_PENDING
                  </span>
                </div>
                <div className="overflow-y-auto max-h-80 divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  {data.ph00Governance.personas.map((prs) => (
                    <div key={prs.personaId} className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {prs.personaId} · {prs.name} ({prs.nameNe})
                        </span>
                        <span className="text-slate-500">Dashboard: {prs.primaryDashboardId}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{prs.workflowScope}</p>
                      <div className="text-slate-500 font-mono">
                        Protocol: {prs.validationProtocolRequired}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-bold font-display">
                    D. Pilot-Region & Category Selection Matrix (`PH00-F011` — Section 30.1)
                  </h3>
                  <span className="text-xs font-mono text-amber-700 dark:text-amber-400">
                    Gated on DEC-001 (PENDING)
                  </span>
                </div>
                <div className="overflow-y-auto max-h-80 divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  {data.ph00Governance.pilotFramework.map((cand) => (
                    <div key={cand.candidateId} className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {cand.candidateId}: {cand.region}
                        </span>
                        <span className="font-semibold text-amber-700 dark:text-amber-400">
                          {cand.disposition}
                        </span>
                      </div>
                      <div className="font-mono text-slate-500">
                        Categories: {cand.categoryKeys.join(', ')} · Gate: {cand.gateStatus}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">
                        {cand.rejectionOrSelectionRationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PH00-F008: Separate Risk, Dependency & Assumption Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-4 space-y-2">
                <div className="text-xs font-mono text-slate-500">PH00-F008 Part A</div>
                <h4 className="text-sm font-bold">Risk Register ({data.ph00Governance.risks.length} Risks)</h4>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 max-h-48 overflow-y-auto">
                  {data.ph00Governance.risks.map((r) => (
                    <div key={r.riskId} className="font-mono">
                      <strong>{r.riskId}</strong> [{r.severity}]: {r.domain} ({r.status})
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-4 space-y-2">
                <div className="text-xs font-mono text-slate-500">PH00-F008 Part B</div>
                <h4 className="text-sm font-bold">Dependency Register ({data.ph00Governance.dependencies.length} Items)</h4>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 max-h-48 overflow-y-auto">
                  {data.ph00Governance.dependencies.map((d) => (
                    <div key={d.dependencyId} className="font-mono">
                      <strong>{d.dependencyId}</strong> [{d.status}]: {d.dependentPhase} — {d.providerOrAuthority}
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-4 space-y-2">
                <div className="text-xs font-mono text-slate-500">PH00-F008 Part C & PH00-F009</div>
                <h4 className="text-sm font-bold">Assumption & Research Lead Register ({data.ph00Governance.assumptions.length} Items)</h4>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 max-h-48 overflow-y-auto">
                  {data.ph00Governance.assumptions.map((a) => (
                    <div key={a.assumptionId} className="font-mono">
                      <strong>{a.assumptionId}</strong> [{a.validationStatus}]: {a.category}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 18-Phase Master Delivery Plan & 240 Feature Modules */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                E. Master Delivery Plan: 18 Phases (`PH00`–`PH17`) & All 240 Feature Modules (`PH00-F006`)
              </h3>
              <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                        <th className="py-2.5 px-3 font-mono">Phase</th>
                        <th className="py-2.5 px-3">Phase Scope & Title</th>
                        <th className="py-2.5 px-3 font-mono text-right">Modules</th>
                        <th className="py-2.5 px-3 font-mono">Feature ID Range</th>
                        <th className="py-2.5 px-3 font-mono">Official Status</th>
                        <th className="py-2.5 px-3">Exit Gate & Phase Boundary Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {data.phases.map((ph) => (
                        <tr key={ph.phaseId}>
                          <td className="py-2.5 px-3 font-mono font-bold">{ph.phaseId}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">
                            {ph.title}
                          </td>
                          <td className="py-2.5 px-3 font-mono tabular-nums text-right font-semibold">
                            {ph.moduleCount}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">
                            {ph.featureIds[0]} – {ph.featureIds[ph.featureIds.length - 1]}
                          </td>
                          <td
                            className={`py-2.5 px-3 font-mono font-semibold ${
                              ph.status === 'PARTIAL'
                                ? 'text-amber-700 dark:text-amber-400'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {ph.status}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                            {ph.exitGateSummary}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            VIEW 5: PUBLIC EMERGENCY DIRECTORY & SAFETY BOUNDARIES (Section 14 & Phase 13)
           ===================================================================== */}
        {activeSection === 'safety' && (
          <section className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">
                05. Public Emergency Information & Safety Governance (Accessible Without Login)
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Blueprint Section 14 & Rule #7: Verified public emergency directory with source timestamps. PheriNepal does not replace emergency services, and live 24/7 SOS dispatch remains explicitly GATED.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold font-display">
                    Verified Official Emergency Contacts (Nepal)
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    Verified: 2026-11-19T08:00:00Z
                  </span>
                </div>
                <dl className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  <div className="py-3 flex justify-between">
                    <dt className="font-semibold">Nepal Police Emergency Control</dt>
                    <dd className="font-mono tabular-nums font-bold">Dial 100</dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="font-semibold">Nepal Tourist Police (Bhrikutimandap HQ)</dt>
                    <dd className="font-mono tabular-nums font-bold">Hotline 1144 / +977-1-4247041</dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="font-semibold">Ambulance / Medical Emergency</dt>
                    <dd className="font-mono tabular-nums font-bold">Dial 102</dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="font-semibold">Himalayan Rescue Association (HRA — Manang / Pheriche Info)</dt>
                    <dd className="font-mono tabular-nums">+977-1-4440292 / 4440293</dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="font-semibold">Tribhuvan International Airport (TIA) Flight Inquiry</dt>
                    <dd className="font-mono tabular-nums">+977-1-4113033</dd>
                  </div>
                </dl>
              </div>

              <div className="border border-red-300 dark:border-red-900 bg-white dark:bg-slate-900 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-red-800 dark:text-red-400 font-display">
                    Category #21 (SOS) & Support Staffing Boundary
                  </h3>
                  <span className="text-xs font-mono font-bold text-red-700 dark:text-red-400">
                    STATUS: RESTRICTED / GATED
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Non-Negotiable Rule #7:</strong> PheriNepal never exposes an active SOS dispatch button or a 24/7 emergency response promise until staffed response operations, verified responder escalation, and live emergency drills are formally approved.
                </p>
                <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-4 rounded text-xs space-y-2">
                  <div>
                    <strong>Current Staffed Support Hours:</strong> {data.supportOperatingHours}
                  </div>
                  <div>
                    <strong>Gated Categories Requiring Operational/Legal Sign-Off:</strong>{' '}
                    <code>sos</code> (#21), <code>travel-wallet</code> (#30), <code>rewards</code> (#26),{' '}
                    <code>companion-matching</code> (#28), <code>offline-maps</code> (#13),{' '}
                    <code>peak-climbing</code> (#5).
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* QUIET FOOTER (No bottom telemetry tickers per Frontend Constitution Section 1.B) */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-6 mt-12">
        <div className="max-w-[1380px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <strong>PheriNepal</strong> · Master Specification <code className="font-mono">PNP-MASTER-ARCH-001</code> · English & नेपाली
          </div>
          <div>
            Support Hours: 08:00–20:00 NPT (UTC+05:45) · Emergency: Nepal Police 100 / Tourist Police 1144
          </div>
        </div>
      </footer>
    </div>
  );
}
