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
import { GetOrderByIdController } from './controllers/get-order-by-id.controller'
import { GetOrderByIdUseCase } from '@/domain/app/application/use-cases/get-order-by-id'
import { MarkOrderPickupController } from './controllers/mark-order-pickup.controller'
import { MarkOrderPickupUseCase } from '@/domain/app/application/use-cases/mark-order-pickup'
import { MarkOrderPendingController } from './controllers/mark-order-pending.controller'
import { MarkOrderPendingUseCase } from '@/domain/app/application/use-cases/mark-order-pending'
import { DeleteCourierController } from './controllers/delete-courier.controller'
import { DeleteCourierUseCase } from '@/domain/app/application/use-cases/delete-courier'
import { EditCourierController } from './controllers/edit-courier.controller'
import { EditCourierUseCase } from '@/domain/app/application/use-cases/edit-courier'
import { EditOrderController } from './controllers/edit-order-recipient.controller'
import { EditOrderUseCase } from '@/domain/app/application/use-cases/edit-order-recipient'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateAdminController,
    AuthenticateCourierController,
    CreateCourierController,
    CreateOrderController,
    GetOrderByIdController,
    MarkOrderPickupController,
    MarkOrderPendingController,
    DeleteCourierController,
    EditCourierController,
    EditOrderController,
  ],
  providers: [
    AuthenticateAdminUseCase,
    CreateCourierUseCase,
    AuthenticateCourierUseCase,
    CreateOrderUseCase,
    GetOrderByIdUseCase,
    MarkOrderPickupUseCase,
    MarkOrderPendingUseCase,
    DeleteCourierUseCase,
    EditCourierUseCase,
    EditOrderUseCase,
  ],
})
export class HttpModule {}
