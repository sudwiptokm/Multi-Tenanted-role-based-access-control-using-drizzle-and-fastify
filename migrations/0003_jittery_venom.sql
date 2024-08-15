CREATE TABLE IF NOT EXISTS "usersToRoles" (
	"applicationId" uuid NOT NULL,
	"roledId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "usersToRoles_applicationId_roledId_userId_pk" PRIMARY KEY("applicationId","roledId","userId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_applicationId_applications_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_roledId_roles_id_fk" FOREIGN KEY ("roledId") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
