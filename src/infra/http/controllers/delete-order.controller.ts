import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteOrderUseCase } from '@/domain/app/application/use-cases/delete-order'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'
import {
  BadRequestException,
  Controller,
  Delete,
  NotFoundException,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'

@Controller('/order/:orderId')
@UseGuards(RolesGuard)
export class DeleteOrderController {
  constructor(private readonly deleteOrder: DeleteOrderUseCase) {}

  @Delete()
  @Roles('admin')
  async handle(@Param('orderId') orderId: string) {
    const result = await this.deleteOrder.execute({
      orderId,
    })

    if (result.isLeft()) {
      if (result.value instanceof ResourceNotFoundError) {
        throw new NotFoundException(result.value.message)
      }
      if (result.value instanceof NotAllowedError) {
        throw new UnauthorizedException(result.value.message)
      }
      throw new BadRequestException()
    }

    return {
      message: 'Pedido deletado com sucesso!',
    }
  }
}
