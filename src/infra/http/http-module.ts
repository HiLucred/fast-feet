import { Module } from '@nestjs/common'
import { AuthenticateAdminController } from './controllers/authenticate-admin.controller'
import { AuthenticateAdminUseCase } from '@/domain/app/application/use-cases/authenticate-admin'
import { DatabaseModule } from '../database/prisma/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateCourierController } from './controllers/create-courier.controller'
import { CreateCourierUseCase } from '@/domain/app/application/use-cases/create-courier'
import { AuthenticateCourierController } from './controllers/authenticate-courier.controller'
import { AuthenticateCourierUseCase } from '@/domain/app/application/use-cases/authenticate-courier'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateAdminController,
    AuthenticateCourierController,
    CreateCourierController,
  ],
  providers: [
    AuthenticateAdminUseCase,
    CreateCourierUseCase,
    AuthenticateCourierUseCase,
  ],
})
export class HttpModule {}
