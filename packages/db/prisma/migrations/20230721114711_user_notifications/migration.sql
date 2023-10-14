-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "event" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "recipientId" INTEGER NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
