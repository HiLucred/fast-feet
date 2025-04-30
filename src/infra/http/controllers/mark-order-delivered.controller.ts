import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { DeliveryPhotoNotFoundError } from "@/domain/app/application/use-cases/errors/delivery-photo-not-found-error";
import { MarkOrderDeliveredUseCase } from "@/domain/app/application/use-cases/mark-order-delivered";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, ForbiddenException, NotFoundException, Param, Post } from "@nestjs/common";

@Controller('/order/:orderId/delivered')
export class MarkOrderDeliveredController {
  constructor(private readonly markOrderDelivered: MarkOrderDeliveredUseCase) { }

  @Post()
  async handle(@Param('orderId') orderId: string, @CurrentUser() user: UserPayload) {
    const result = await this.markOrderDelivered.execute({
      orderId,
      courierId: user.sub
    })

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof DeliveryPhotoNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotAllowedError) {
        throw new ForbiddenException(error.message);
      }
      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw new BadRequestException();
    }

    return {
      message: 'Pedido entregue com sucesso!'
    }
  }
}