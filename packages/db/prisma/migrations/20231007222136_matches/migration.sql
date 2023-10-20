-- CreateEnum
CREATE TYPE "Division" AS ENUM ('Nooby', 'Bronze', 'Gold', 'Legend');

-- CreateEnum
CREATE TYPE "RankBoard" AS ENUM ('Provisional', 'Established');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "division" "Division" NOT NULL DEFAULT 'Nooby',
ADD COLUMN     "eloRating" INTEGER NOT NULL DEFAULT 1500,
ADD COLUMN     "numOfGames" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rank" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "rankBoard" "RankBoard" NOT NULL DEFAULT 'Provisional';

-- CreateTable
CREATE TABLE "Match" (
    "matchId" SERIAL NOT NULL,
    "homeId" INTEGER NOT NULL,
    "adversaryId" INTEGER NOT NULL,
    "winnerId" INTEGER,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("matchId")
);

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_adversaryId_fkey" FOREIGN KEY ("adversaryId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
