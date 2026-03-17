/*
  Warnings:

  - Added the required column `contestId` to the `Questions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContestStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "Contest" ADD COLUMN     "status" "ContestStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "Questions" ADD COLUMN     "contestId" TEXT NOT NULL,
ADD COLUMN     "correctAnswer" TEXT;

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
