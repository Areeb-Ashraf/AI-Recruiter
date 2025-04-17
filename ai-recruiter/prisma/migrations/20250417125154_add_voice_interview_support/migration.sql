/*
  Warnings:

  - The `duration` column on the `Interview` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Interview` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `score` column on the `Interview` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'PENDING_REVIEW', 'COMPLETED', 'REJECTED', 'APPROVED');

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "improvements" TEXT[],
ADD COLUMN     "strengths" TEXT[],
ADD COLUMN     "transcript" TEXT,
DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "InterviewStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "score",
ADD COLUMN     "score" INTEGER,
ALTER COLUMN "feedback" DROP NOT NULL,
ALTER COLUMN "feedback" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "responsibilities" TEXT;
