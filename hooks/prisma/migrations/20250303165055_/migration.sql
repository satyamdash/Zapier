/*
  Warnings:

  - You are about to drop the column `triggerId` on the `Zap` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[zapId]` on the table `Trigger` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Zap" DROP COLUMN "triggerId";

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_zapId_key" ON "Trigger"("zapId");
