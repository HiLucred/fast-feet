import { Module } from '@nestjs/common'
import { AdminsRepository } from '@/domain/app/application/repositories/admins-repository'
import { CouriersRepository } from '@/domain/app/application/repositories/couriers-repository'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCouriersRepository } from './prisma/repositories/prisma-couriers-repository'
import { OrdersRepository } from '@/domain/app/application/repositories/orders-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'

@Module({
  providers: [
    PrismaService,
    { provide: AdminsRepository, useClass: PrismaAdminsRepository },
    { provide: CouriersRepository, useClass: PrismaCouriersRepository },
    { provide: OrdersRepository, useClass: PrismaOrdersRepository },
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    CouriersRepository,
    OrdersRepository,
  ],
})
export class DatabaseModule {}
