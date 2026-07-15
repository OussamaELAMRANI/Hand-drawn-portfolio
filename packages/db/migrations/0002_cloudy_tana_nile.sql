DROP INDEX "bookings_date_slot_confirmed_idx";--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "read" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_date_slot_confirmed_idx" ON "bookings" USING btree ("date","slot") WHERE "bookings"."status" = 'conf' ||
      'irmed';