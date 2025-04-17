CREATE TABLE "slidir_account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slidir_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "slidir_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "slidir_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"is_premium" boolean NOT NULL,
	CONSTRAINT "slidir_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "slidir_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "slidir_account" ADD CONSTRAINT "slidir_account_user_id_slidir_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."slidir_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slidir_session" ADD CONSTRAINT "slidir_session_user_id_slidir_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."slidir_user"("id") ON DELETE cascade ON UPDATE no action;