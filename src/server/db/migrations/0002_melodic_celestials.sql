ALTER TABLE "slidir_user" ADD COLUMN "normalized_email" text;--> statement-breakpoint
ALTER TABLE "slidir_user" ADD CONSTRAINT "slidir_user_normalized_email_unique" UNIQUE("normalized_email");