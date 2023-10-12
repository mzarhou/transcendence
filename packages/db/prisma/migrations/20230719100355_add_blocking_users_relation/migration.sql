-- CreateTable
CREATE TABLE "_blockingUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_blockingUsers_AB_unique" ON "_blockingUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_blockingUsers_B_index" ON "_blockingUsers"("B");

-- AddForeignKey
ALTER TABLE "_blockingUsers" ADD CONSTRAINT "_blockingUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blockingUsers" ADD CONSTRAINT "_blockingUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
