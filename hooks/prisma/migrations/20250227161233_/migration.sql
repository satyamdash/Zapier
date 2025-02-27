-- CreateTable
CREATE TABLE "ZaprunOutbox" (
    "id" TEXT NOT NULL,
    "zaprunId" TEXT NOT NULL,

    CONSTRAINT "ZaprunOutbox_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ZaprunOutbox" ADD CONSTRAINT "ZaprunOutbox_zaprunId_fkey" FOREIGN KEY ("zaprunId") REFERENCES "Zaprun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
