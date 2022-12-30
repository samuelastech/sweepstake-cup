/*
  Warnings:

  - You are about to drop the `Pool` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `poolId` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `sweepstakeId` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Pool_code_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Pool";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Sweepstake" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT,
    CONSTRAINT "Sweepstake_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sweepstakeId" TEXT NOT NULL,
    CONSTRAINT "Participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Participant_sweepstakeId_fkey" FOREIGN KEY ("sweepstakeId") REFERENCES "Sweepstake" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Participant" ("id", "userId") SELECT "id", "userId" FROM "Participant";
DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";
CREATE UNIQUE INDEX "Participant_userId_sweepstakeId_key" ON "Participant"("userId", "sweepstakeId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Sweepstake_code_key" ON "Sweepstake"("code");
