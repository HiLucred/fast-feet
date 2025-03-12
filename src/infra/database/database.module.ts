import { Module } from '@nestjs/common'
import { AdminsRepository } from '@/domain/app/application/repositories/admins-repository'
import { CouriersRepository } from '@/domain/app/application/repositories/couriers-repository'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCouriersRepository } from './prisma/repositories/prisma-couriers-repository'

@Module({
  providers: [
    PrismaService,
    { provide: AdminsRepository, useClass: PrismaAdminsRepository },
    { provide: CouriersRepository, useClass: PrismaCouriersRepository },
  ],
  exports: [PrismaService, AdminsRepository, CouriersRepository],
})
export class DatabaseModule {}
