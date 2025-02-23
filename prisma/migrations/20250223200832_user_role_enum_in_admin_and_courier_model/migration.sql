-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'COURIER');

-- AlterTable
ALTER TABLE "adms" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE "couriers" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'COURIER';
