/*
  Warnings:

  - You are about to drop the column `secretsId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Secrets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Secrets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_requesterId_fkey";

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMessage" DROP CONSTRAINT "GroupMessage_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMessage" DROP CONSTRAINT "GroupMessage_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_secretsId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnGroups" DROP CONSTRAINT "UsersOnGroups_groupId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnGroups" DROP CONSTRAINT "UsersOnGroups_userId_fkey";

-- DropIndex
DROP INDEX "User_secretsId_key";

-- AlterTable
ALTER TABLE "Secrets" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "secretsId";

-- CreateIndex
CREATE UNIQUE INDEX "Secrets_userId_key" ON "Secrets"("userId");

-- AddForeignKey
ALTER TABLE "Secrets" ADD CONSTRAINT "Secrets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnGroups" ADD CONSTRAINT "UsersOnGroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnGroups" ADD CONSTRAINT "UsersOnGroups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMessage" ADD CONSTRAINT "GroupMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMessage" ADD CONSTRAINT "GroupMessage_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
