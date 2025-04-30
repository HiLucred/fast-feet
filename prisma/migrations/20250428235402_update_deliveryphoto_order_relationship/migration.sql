/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `delivery_photos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "delivery_photos_order_id_key" ON "delivery_photos"("order_id");
