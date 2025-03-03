/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `adms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "adms_email_key" ON "adms"("email");
