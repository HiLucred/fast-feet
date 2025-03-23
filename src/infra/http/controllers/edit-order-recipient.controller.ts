import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { EditOrderUseCase } from '@/domain/app/application/use-cases/edit-order-recipient'
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { OrderPresenter } from '../presenters/order-presenter'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles.decorator'

const editOrderBodySchema = z.object({
  courierId: z.string().optional(),
  state: z.enum(['Pending', 'Available']),
  recipient: z
    .object({
      name: z.string().optional(),
      phoneNumber: z.string().optional(),
      zipCode: z.string().optional(),
      street: z.string().optional(),
      number: z.string().optional(),
      neighborhood: z.string().optional(),
      state: z.string().optional(),
      city: z.string().optional(),
    })
    .optional(),
})

type EditOrderBodySchema = z.infer<typeof editOrderBodySchema>

@Controller('/order/:orderId')
@UseGuards(RolesGuard)
export class EditOrderController {
  constructor(private readonly editOrder: EditOrderUseCase) {}

  @Patch()
  @Roles('admin')
  async handle(
    @Body(new ZodValidationPipe(editOrderBodySchema)) body: EditOrderBodySchema,
    @Param('orderId') orderId: string,
  ) {
    const { state, courierId, recipient } = body

    const result = await this.editOrder.execute({
      orderId,
      recipient,
      courierId,
      state,
    })

    if (result.isLeft()) {
      if (result.value instanceof ResourceNotFoundError) {
        throw new NotFoundException()
      }
      if (result.value instanceof NotAllowedError) {
        throw new UnauthorizedException()
      }
      throw new BadRequestException()
    }

    return {
      order: OrderPresenter.toHttp(result.value.order),
    }
  }
}
