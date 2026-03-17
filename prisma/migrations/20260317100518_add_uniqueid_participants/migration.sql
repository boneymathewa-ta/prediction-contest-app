/*
  Warnings:

  - A unique constraint covering the columns `[userId,contestId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Participant_userId_contestId_key" ON "Participant"("userId", "contestId");
