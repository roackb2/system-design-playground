CREATE TABLE "onboarding_application" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "onboarding_application_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"companyId" integer NOT NULL,
	"applicantId" integer,
	CONSTRAINT "onboarding_application_companyId_unique" UNIQUE("companyId")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "companyId" integer;--> statement-breakpoint
ALTER TABLE "onboarding_application" ADD CONSTRAINT "onboarding_application_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_application" ADD CONSTRAINT "onboarding_application_applicantId_users_id_fk" FOREIGN KEY ("applicantId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE no action ON UPDATE no action;