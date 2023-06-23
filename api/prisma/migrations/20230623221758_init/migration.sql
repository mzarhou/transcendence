-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "isTfaEnabled" TEXT NOT NULL,
    "tfaSecret" TEXT,
    "school42Id" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
