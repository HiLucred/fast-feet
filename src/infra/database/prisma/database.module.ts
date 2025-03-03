import { Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { PrismaAdminsRepository } from './repositories/prisma-admins-repository'
import { AdminsRepository } from '@/domain/app/application/repositories/admins-repository'
import { CouriersRepository } from '@/domain/app/application/repositories/couriers-repository'
import { PrismaCouriersRepository } from './repositories/prisma-couriers-repository'

@Module({
  providers: [
    PrismaService,
    { provide: AdminsRepository, useClass: PrismaAdminsRepository },
    { provide: CouriersRepository, useClass: PrismaCouriersRepository },
  ],
  exports: [PrismaService, AdminsRepository, CouriersRepository],
})
export class DatabaseModule {}
