CREATE TABLE "content_briefs" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"prompt_id" text,
	"title" text NOT NULL,
	"question" text NOT NULL,
	"brief" text NOT NULL,
	"draft" text,
	"draft_model" text,
	"status" text DEFAULT 'brief' NOT NULL,
	"published_url" text,
	"created_by_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "traffic_events" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"source" text NOT NULL,
	"referrer_host" text,
	"landing_path" text NOT NULL,
	"visitor_hash" text,
	"data_source" text DEFAULT 'live' NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "tracking_key" text;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "slack_webhook_url" text;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "webhook_url" text;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "webhook_secret" text;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "indexnow_key" text;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "report_brand_name" text;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "report_accent_color" text;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "report_logo_url" text;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "hide_signal_branding" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "content_briefs" ADD CONSTRAINT "content_briefs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_briefs" ADD CONSTRAINT "content_briefs_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_briefs" ADD CONSTRAINT "content_briefs_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traffic_events" ADD CONSTRAINT "traffic_events_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "briefs_ws_idx" ON "content_briefs" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "traffic_ws_idx" ON "traffic_events" USING btree ("workspace_id","occurred_at");--> statement-breakpoint
CREATE UNIQUE INDEX "workspaces_tracking_idx" ON "workspaces" USING btree ("tracking_key");