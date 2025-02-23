import { Module } from '@nestjs/common'
import { AuthenticateAdminController } from './controllers/authenticate-admin.controller'
import { AuthenticateAdminUseCase } from '@/domain/app/application/use-cases/authenticate-admin'
import { DatabaseModule } from '../database/prisma/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [AuthenticateAdminController],
  providers: [AuthenticateAdminUseCase],
})
export class HttpModule {}
