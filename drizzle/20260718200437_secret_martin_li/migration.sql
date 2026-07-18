ALTER TABLE "borrow_records" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "borrow_records" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
DROP TYPE "borrow_status";--> statement-breakpoint
CREATE TYPE "borrow_status" AS ENUM('BORROWED', 'RETURNED', 'LATE_RETURN ');--> statement-breakpoint
ALTER TABLE "borrow_records" ALTER COLUMN "status" SET DATA TYPE "borrow_status" USING "status"::"borrow_status";--> statement-breakpoint
ALTER TABLE "borrow_records" ALTER COLUMN "status" SET DEFAULT 'BORROWED'::"borrow_status";