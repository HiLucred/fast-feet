import { FetchOrdersByNeighborhoodUseCase } from '@/domain/app/application/use-cases/fetch-orders-by-neighborhood'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { OrderPresenter } from '../presenters/order-presenter'

@Controller('/orders/neighborhood/:neighborhood')
export class FetchOrdersByNeighborhoodController {
  constructor(
    private readonly fetchOrdersByNeighborhood: FetchOrdersByNeighborhoodUseCase,
  ) {}

  @Get()
  async execute(
    @CurrentUser() user: UserPayload,
    @Param('neighborhood') neighborhood: string,
  ) {
    const { sub } = user
    const result = await this.fetchOrdersByNeighborhood.execute({
      courierId: sub,
      neighborhood,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const orders = result.value.orders

    return orders.map((order) => OrderPresenter.toHttp(order))
  }
}
