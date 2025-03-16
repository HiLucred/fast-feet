import { Module } from '@nestjs/common'
import { AuthenticateAdminController } from './controllers/authenticate-admin.controller'
import { AuthenticateAdminUseCase } from '@/domain/app/application/use-cases/authenticate-admin'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateCourierController } from './controllers/create-courier.controller'
import { CreateCourierUseCase } from '@/domain/app/application/use-cases/create-courier'
import { AuthenticateCourierController } from './controllers/authenticate-courier.controller'
import { AuthenticateCourierUseCase } from '@/domain/app/application/use-cases/authenticate-courier'
import { DatabaseModule } from '../database/database.module'
import { CreateOrderController } from './controllers/create-order.controller'
import { CreateOrderUseCase } from '@/domain/app/application/use-cases/create-order'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateAdminController,
    AuthenticateCourierController,
    CreateCourierController,
    CreateOrderController,
  ],
  providers: [
    AuthenticateAdminUseCase,
    CreateCourierUseCase,
    AuthenticateCourierUseCase,
    CreateOrderUseCase,
  ],
})
export class HttpModule {}
