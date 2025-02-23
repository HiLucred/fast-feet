-- CreateEnum
CREATE TYPE "OrderState" AS ENUM ('PENDING', 'PICKEDUP', 'DELIVERED');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "courierId" TEXT,
    "state" "OrderState" NOT NULL,
    "pickedUpDate" TIMESTAMP(3),
    "deliveryDate" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "couriers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "recipients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "zipCode" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "adms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_key" ON "orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "couriers_id_key" ON "couriers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "couriers_cpf_key" ON "couriers"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "recipients_id_key" ON "recipients"("id");

-- CreateIndex
CREATE UNIQUE INDEX "recipients_phoneNumber_key" ON "recipients"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "recipients_zipCode_key" ON "recipients"("zipCode");

-- CreateIndex
CREATE UNIQUE INDEX "adms_id_key" ON "adms"("id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "recipients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "couriers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
