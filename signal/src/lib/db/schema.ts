import { boolean, index, integer, jsonb, pgTable, primaryKey, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

const id = () => text('id').primaryKey();
const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

export type Role = 'owner' | 'admin' | 'editor' | 'viewer';
export type Plan = 'trial' | 'starter' | 'growth' | 'agency';
export type DataMode = 'sample' | 'live';
export type EngineId = 'chatgpt' | 'perplexity' | 'gemini' | 'claude' | 'ai_overviews' | 'copilot';
export type Intent = 'discovery' | 'comparison' | 'evaluation' | 'brand';
export type Sentiment = 'positive' | 'neutral' | 'negative';
export type ClaimStatus = 'needs_review' | 'accurate' | 'inaccurate' | 'outdated' | 'unverifiable';
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = 'content' | 'technical' | 'schema' | 'authority' | 'accuracy';

export interface EmailPrefs {
  weeklyDigest: boolean;
  runAlerts: boolean;
  accuracyAlerts: boolean;
  productUpdates: boolean;
}

export interface Citation {
  url: string;
  domain: string;
  title?: string;
}

export interface CompetitorMention {
  competitorId: string;
  position: number;
}

export interface CheckResult {
  id: string;
  category: 'crawler' | 'discovery' | 'content' | 'schema' | 'security';
  label: string;
  status: 'pass' | 'warn' | 'fail' | 'info';
  detail: string;
  recommendation?: string;
  evidence?: string;
}

export interface CrawlerAccess {
  agent: string;
  owner: string;
  purpose: string;
  kind: 'retrieval' | 'training' | 'other';
  allowed: boolean;
  /** Older audits predate this field; treat a missing value as allowed/blocked from `allowed`. */
  status?: 'allowed' | 'partial' | 'blocked';
  rule: string | null;
}

export interface AuditSubscores {
  citability: number;
  crawlers: number;
  brand: number;
  eeat: number;
  schema: number;
  platform: number;
}

export interface AuditDetails {
  issues: { severity: 'high' | 'medium' | 'low'; title: string; detail: string; fix: string }[];
  schemas: string[];
  citability: {
    score: number; words: number; paragraphs: number; quotable: number; factRich: number; questionHeadings: number; structured: boolean;
    weakBlocks: { excerpt: string; reason: string; words: number }[];
    recommendations: string[];
  };
  llms: { present: boolean; url: string; bytes: number };
  sitemap: { present: boolean; url: string; urls: number; declared: boolean };
  page: { title: string | null; description: string | null; h1: string | null; lang: string | null; canonical: string | null; words: number; internalLinks: number; externalLinks: number };
}

export interface TaskEvidence {
  kind: 'audit' | 'prompt' | 'claim' | 'source';
  refId: string;
  label: string;
}

export const users = pgTable('users', {
  id: id(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  emailPrefs: jsonb('email_prefs').$type<EmailPrefs>().notNull().default({ weeklyDigest: true, runAlerts: true, accuracyAlerts: true, productUpdates: false }),
  lastWorkspaceId: text('last_workspace_id'),
  createdAt: createdAt(),
}, (t) => [uniqueIndex('users_email_idx').on(t.email)]);

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(), // sha256 of the session token; the raw token only lives in the cookie
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: createdAt(),
}, (t) => [index('sessions_user_idx').on(t.userId)]);

export const tokens = pgTable('tokens', {
  id: text('id').primaryKey(), // sha256 of the emailed token
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  kind: text('kind').$type<'verify_email' | 'reset_password'>().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: createdAt(),
});

export const workspaces = pgTable('workspaces', {
  id: id(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  brandName: text('brand_name').notNull(),
  brandAliases: jsonb('brand_aliases').$type<string[]>().notNull().default([]),
  domain: text('domain').notNull(),
  description: text('description').notNull().default(''),
  industry: text('industry').notNull().default(''),
  engines: jsonb('engines').$type<EngineId[]>().notNull().default(['chatgpt', 'perplexity', 'gemini', 'claude']),
  dataMode: text('data_mode').$type<DataMode>().notNull().default('sample'),
  runFrequency: text('run_frequency').$type<'daily' | 'weekly' | 'manual'>().notNull().default('weekly'),
  plan: text('plan').$type<Plan>().notNull().default('trial'),
  trialEndsAt: timestamp('trial_ends_at', { withTimezone: true }),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  subscriptionStatus: text('subscription_status'),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
  onboardedAt: timestamp('onboarded_at', { withTimezone: true }),
  /** Public key used by the AI traffic snippet. Not a secret. */
  trackingKey: text('tracking_key'),
  slackWebhookUrl: text('slack_webhook_url'),
  webhookUrl: text('webhook_url'),
  webhookSecret: text('webhook_secret'),
  indexnowKey: text('indexnow_key'),
  /** White-label report branding (Agency plan). */
  reportBrandName: text('report_brand_name'),
  reportAccentColor: text('report_accent_color'),
  reportLogoUrl: text('report_logo_url'),
  hideSignalBranding: boolean('hide_signal_branding').notNull().default(false),
  createdAt: createdAt(),
}, (t) => [uniqueIndex('workspaces_slug_idx').on(t.slug), uniqueIndex('workspaces_tracking_idx').on(t.trackingKey)]);

export const memberships = pgTable('memberships', {
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').$type<Role>().notNull(),
  createdAt: createdAt(),
}, (t) => [primaryKey({ columns: [t.workspaceId, t.userId] }), index('memberships_user_idx').on(t.userId)]);

export const invitations = pgTable('invitations', {
  id: id(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role').$type<Role>().notNull(),
  tokenHash: text('token_hash').notNull(),
  invitedById: text('invited_by_id').references(() => users.id, { onDelete: 'set null' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  acceptedAt: timestamp('accepted_at', { withTimezone: true }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex('invitations_token_idx').on(t.tokenHash), index('invitations_ws_idx').on(t.workspaceId)]);

export const competitors = pgTable('competitors', {
  id: id(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  domain: text('domain').notNull(),
  aliases: jsonb('aliases').$type<string[]>().notNull().default([]),
  createdAt: createdAt(),
}, (t) => [index('competitors_ws_idx').on(t.workspaceId)]);

export const prompts = pgTable('prompts', {
  id: id(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  topic: text('topic').notNull().default('General'),
  intent: text('intent').$type<Intent>().notNull().default('discovery'),
  active: boolean('active').notNull().default(true),
  createdAt: createdAt(),
}, (t) => [index('prompts_ws_idx').on(t.workspaceId)]);

export const runs = pgTable('runs', {
  id: id(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  status: text('status').$type<'queued' | 'running' | 'completed' | 'failed'>().notNull().default('queued'),
  trigger: text('trigger').$type<'manual' | 'scheduled' | 'onboarding'>().notNull(),
  source: text('source').$type<DataMode>().notNull(),
  totalJobs: integer('total_jobs').notNull().default(0),
  completedJobs: integer('completed_jobs').notNull().default(0),
  failedJobs: integer('failed_jobs').notNull().default(0),
  error: text('error'),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
}, (t) => [index('runs_ws_idx').on(t.workspaceId, t.startedAt)]);

export const answers = pgTable('answers', {
  id: id(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  runId: text('run_id').notNull().references(() => runs.id, { onDelete: 'cascade' }),
  promptId: text('prompt_id').notNull().references(() => prompts.id, { onDelete: 'cascade' }),
  engine: text('engine').$type<EngineId>().notNull(),
  source: text('source').$type<DataMode>().notNull(),
  model: text('model'),
  text: text('text').notNull(),
  brandMentioned: boolean('brand_mentioned').notNull(),
  brandPosition: integer('brand_position'),
  brandCited: boolean('brand_cited').notNull(),
  sentiment: text('sentiment').$type<Sentiment>(),
  competitorMentions: jsonb('competitor_mentions').$type<CompetitorMention[]>().notNull().default([]),
  citations: jsonb('citations').$type<Citation[]>().notNull().default([]),
  latencyMs: integer('latency_ms'),
  observedAt: timestamp('observed_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index('answers_ws_idx').on(t.workspaceId, t.observedAt), index('answers_prompt_idx').on(t.promptId)]);

export const facts = pgTable('facts', {
  id: id(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  value: text('value').notNull(),
  createdAt: createdAt(),
}, (t) => [index('facts_ws_idx').on(t.workspaceId)]);

export const claims = pgTable('claims', {
  id: id(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  answerId: text('answer_id').notNull().references(() => answers.id, { onDelete: 'cascade' }),
  factId: text('fact_id').references(() => facts.id, { onDelete: 'set null' }),
  text: text('text').notNull(),
  status: text('status').$type<ClaimStatus>().notNull().default('needs_review'),
  note: text('note'),
  reviewedById: text('reviewed_by_id').references(() => users.id, { onDelete: 'set null' }),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  createdAt: createdAt(),
}, (t) => [index('claims_ws_idx').on(t.workspaceId)]);

export const audits = pgTable('audits', {
  id: id(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  score: integer('score').notNull(),
  results: jsonb('results').$type<CheckResult[]>().notNull(),
  crawlers: jsonb('crawlers').$type<CrawlerAccess[]>().notNull().default([]),
  subscores: jsonb('subscores').$type<AuditSubscores | null>(),
  details: jsonb('details').$type<AuditDetails | null>(),
  durationMs: integer('duration_ms'),
  createdAt: createdAt(),
}, (t) => [index('audits_ws_idx').on(t.workspaceId, t.createdAt)]);

export const tasks = pgTable('tasks', {
  id: id(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  status: text('status').$type<TaskStatus>().notNull().default('todo'),
  priority: text('priority').$type<TaskPriority>().notNull().default('medium'),
  category: text('category').$type<TaskCategory>().notNull().default('content'),
  evidence: jsonb('evidence').$type<TaskEvidence | null>(),
  dedupeKey: text('dedupe_key'),
  assigneeId: text('assignee_id').references(() => users.id, { onDelete: 'set null' }),
  dueDate: timestamp('due_date', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: createdAt(),
}, (t) => [index('tasks_ws_idx').on(t.workspaceId)]);

export const reports = pgTable('reports', {
  id: id(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  periodStart: timestamp('period_start', { withTimezone: true }).notNull(),
  periodEnd: timestamp('period_end', { withTimezone: true }).notNull(),
  summary: text('summary').notNull().default(''),
  snapshot: jsonb('snapshot').notNull(),
  shareToken: text('share_token'),
  createdById: text('created_by_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: createdAt(),
}, (t) => [index('reports_ws_idx').on(t.workspaceId), uniqueIndex('reports_share_idx').on(t.shareToken)]);

export const notifications = pgTable('notifications', {
  id: id(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  workspaceId: text('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }),
  kind: text('kind').$type<'run_completed' | 'run_failed' | 'accuracy' | 'invite' | 'billing' | 'system'>().notNull(),
  title: text('title').notNull(),
  body: text('body').notNull().default(''),
  href: text('href'),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: createdAt(),
}, (t) => [index('notifications_user_idx').on(t.userId, t.createdAt)]);

export const activity = pgTable('activity', {
  id: id(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  actorId: text('actor_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  detail: text('detail').notNull().default(''),
  createdAt: createdAt(),
}, (t) => [index('activity_ws_idx').on(t.workspaceId, t.createdAt)]);

export type TrafficSource = 'chatgpt' | 'perplexity' | 'gemini' | 'claude' | 'copilot' | 'deepseek' | 'meta_ai' | 'other_ai' | 'search' | 'social' | 'referral' | 'direct';

/** Landings recorded by the AI traffic snippet. No IP addresses or cookies are stored. */
export const trafficEvents = pgTable('traffic_events', {
  id: id(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  source: text('source').$type<TrafficSource>().notNull(),
  referrerHost: text('referrer_host'),
  landingPath: text('landing_path').notNull(),
  /** Salted daily hash for unique-visitor counts; cannot be reversed or linked across days. */
  visitorHash: text('visitor_hash'),
  dataSource: text('data_source').$type<DataMode>().notNull().default('live'),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index('traffic_ws_idx').on(t.workspaceId, t.occurredAt)]);

export const contentBriefs = pgTable('content_briefs', {
  id: id(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  promptId: text('prompt_id').references(() => prompts.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  question: text('question').notNull(),
  brief: text('brief').notNull(),
  draft: text('draft'),
  draftModel: text('draft_model'),
  status: text('status').$type<'brief' | 'drafting' | 'in_review' | 'published'>().notNull().default('brief'),
  publishedUrl: text('published_url'),
  createdById: text('created_by_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: createdAt(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index('briefs_ws_idx').on(t.workspaceId)]);

export const rateLimits = pgTable('rate_limits', {
  key: text('key').primaryKey(),
  count: integer('count').notNull(),
  resetAt: timestamp('reset_at', { withTimezone: true }).notNull(),
});

export const inquiries = pgTable('inquiries', {
  id: id(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company').notNull().default(''),
  topic: text('topic').notNull(),
  message: text('message').notNull(),
  createdAt: createdAt(),
});

export type User = typeof users.$inferSelect;
export type Workspace = typeof workspaces.$inferSelect;
export type Membership = typeof memberships.$inferSelect;
export type Competitor = typeof competitors.$inferSelect;
export type Prompt = typeof prompts.$inferSelect;
export type Run = typeof runs.$inferSelect;
export type Answer = typeof answers.$inferSelect;
export type Fact = typeof facts.$inferSelect;
export type Claim = typeof claims.$inferSelect;
export type Audit = typeof audits.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type TrafficEvent = typeof trafficEvents.$inferSelect;
export type ContentBrief = typeof contentBriefs.$inferSelect;
