import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { GetOrderByIdUseCase } from '@/domain/app/application/use-cases/get-order-by-id'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common'

@Controller('/order/:id')
export class GetOrderByIdController {
  constructor(private readonly getOrderById: GetOrderByIdUseCase) {}

  @Get()
  @Roles('courier')
  async handle(@CurrentUser() user: UserPayload, @Param('id') orderId: string) {
    const order = await this.getOrderById.execute({
      orderId,
      courierId: user.sub,
    })

    if (order.isLeft()) {
      if (order.value instanceof ResourceNotFoundError) {
        throw new NotFoundException(order.value.message)
      }

      if (order.value instanceof NotAllowedError) {
        throw new UnauthorizedException(order.value.message)
      }

      throw new BadRequestException()
    }

    return {
      order: order.value,
    }
  }
}
