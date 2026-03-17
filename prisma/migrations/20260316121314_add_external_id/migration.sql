/*
  Warnings:

  - You are about to drop the column `scoreTeamA` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `scoreTeamB` on the `Match` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "scoreTeamA",
DROP COLUMN "scoreTeamB",
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "scoreAway" INTEGER,
ADD COLUMN     "scoreHome" INTEGER;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "externalId" TEXT;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "externalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Match_externalId_key" ON "Match"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_externalId_key" ON "Team"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_externalId_key" ON "Tournament"("externalId");
