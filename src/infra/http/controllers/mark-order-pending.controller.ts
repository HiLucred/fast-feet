import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { OrderAlreadyPendingError } from '@/domain/app/application/use-cases/errors/order-already-pending-error'
import { MarkOrderPendingUseCase } from '@/domain/app/application/use-cases/mark-order-pending'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common'

@Controller('/order/:orderId/pending')
export class MarkOrderPendingController {
  constructor(private readonly markOrderPending: MarkOrderPendingUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const result = await this.markOrderPending.execute({
      courierId: user.sub,
      orderId,
    })

    if (result.isLeft()) {
      if (result.value instanceof ResourceNotFoundError) {
        throw new NotFoundException(result.value.message)
      }
      if (result.value instanceof OrderAlreadyPendingError) {
        throw new UnauthorizedException(result.value.message)
      }
      throw new BadRequestException()
    }

    return {
      message: 'Pedido marcado como pendente!',
    }
  }
}
