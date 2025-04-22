import { FetchActiveOrdersByCourierUseCase } from '@/domain/app/application/use-cases/fetch-active-orders-by-courier'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { BadRequestException, Controller, Get } from '@nestjs/common'
import { OrderPresenter } from '../presenters/order-presenter'

@Controller('/orders/active')
export class FetchActiveOrdersController {
  constructor(
    private readonly fetchActiveOrders: FetchActiveOrdersByCourierUseCase,
  ) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const { sub } = user
    const result = await this.fetchActiveOrders.execute({
      courierId: sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { orders } = result.value

    return {
      orders: orders.map((order) => OrderPresenter.toHttp(order)),
    }
  }
}
