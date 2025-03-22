import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { OrderWithoutCourierError } from '@/domain/app/application/use-cases/errors/order-without-courier-error'
import { MarkOrderPickupUseCase } from '@/domain/app/application/use-cases/mark-order-pickup'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common'

@Controller('/order/:orderId/pickup')
export class MarkOrderPickupController {
  constructor(private readonly markOrdePickup: MarkOrderPickupUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const result = await this.markOrdePickup.execute({
      orderId,
      courierId: user.sub,
    })

    if (result.isLeft()) {
      if (result.value instanceof ResourceNotFoundError) {
        throw new NotFoundException(result.value.message)
      }
      if (result.value instanceof OrderWithoutCourierError) {
        throw new ForbiddenException(result.value.message)
      }
      if (result.value instanceof NotAllowedError) {
        throw new UnauthorizedException(result.value.message)
      }

      throw new BadRequestException()
    }

    return {
      message: 'Pedido retirado com sucesso!',
    }
  }
}
