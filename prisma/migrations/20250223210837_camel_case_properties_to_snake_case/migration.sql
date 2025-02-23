/*
  Warnings:

  - You are about to drop the column `courierId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryDate` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `pickedUpDate` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `recipientId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `recipients` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `recipients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone_number]` on the table `recipients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[zip_code]` on the table `recipients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recipient_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `recipients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `recipients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_courierId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_recipientId_fkey";

-- DropIndex
DROP INDEX "recipients_phoneNumber_key";

-- DropIndex
DROP INDEX "recipients_zipCode_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "courierId",
DROP COLUMN "deliveryDate",
DROP COLUMN "pickedUpDate",
DROP COLUMN "recipientId",
ADD COLUMN     "courier_id" TEXT,
ADD COLUMN     "delivery_date" TIMESTAMP(3),
ADD COLUMN     "picked_up_date" TIMESTAMP(3),
ADD COLUMN     "recipient_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "recipients" DROP COLUMN "phoneNumber",
DROP COLUMN "zipCode",
ADD COLUMN     "phone_number" INTEGER NOT NULL,
ADD COLUMN     "zip_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "recipients_phone_number_key" ON "recipients"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "recipients_zip_code_key" ON "recipients"("zip_code");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "recipients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "couriers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
