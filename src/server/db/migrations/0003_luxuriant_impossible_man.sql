CREATE TABLE "slidir_presentation" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slidir_slides" (
	"id" text PRIMARY KEY NOT NULL,
	"presentation_id" text NOT NULL,
	"index" integer NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "slidir_presentation" ADD CONSTRAINT "slidir_presentation_user_id_slidir_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."slidir_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slidir_slides" ADD CONSTRAINT "slidir_slides_presentation_id_slidir_presentation_id_fk" FOREIGN KEY ("presentation_id") REFERENCES "public"."slidir_presentation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_presentation_order" ON "slidir_slides" USING btree ("presentation_id","index");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_slide_index" ON "slidir_slides" USING btree ("presentation_id","index");