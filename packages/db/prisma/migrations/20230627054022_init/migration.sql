-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isTfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "school42Id" INTEGER,
    "secretsId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Secrets" (
    "id" SERIAL NOT NULL,
    "password" TEXT,
    "tfaSecret" TEXT,

    CONSTRAINT "Secrets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_secretsId_key" ON "User"("secretsId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_secretsId_fkey" FOREIGN KEY ("secretsId") REFERENCES "Secrets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
