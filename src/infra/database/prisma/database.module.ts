import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { PrismaAdminsRepository } from './repositories/prisma-admins-repository'
import { AdminsRepository } from '@/domain/app/application/repositories/admins-repository'

@Module({
  providers: [
    PrismaService,
    { provide: AdminsRepository, useClass: PrismaAdminsRepository },
  ],
  exports: [PrismaService, AdminsRepository],
})
export class DatabaseModule {}
