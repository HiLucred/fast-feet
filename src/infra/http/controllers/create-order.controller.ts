import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateOrderUseCase } from '@/domain/app/application/use-cases/create-order'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles.decorator'

const createOrderBodySchema = z.object({
  recipientName: z.string(),
  recipientPhoneNumber: z.string(),
  address: z.object({
    zipCode: z.string(),
    street: z.string(),
    number: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
  }),
})

type CreateOrderBody = z.infer<typeof createOrderBodySchema>

@Controller('/order')
@UseGuards(RolesGuard)
export class CreateOrderController {
  constructor(private readonly createOrder: CreateOrderUseCase) {}

  @Post()
  @Roles('admin')
  async handle(
    @Body(new ZodValidationPipe(createOrderBodySchema)) body: CreateOrderBody,
  ) {
    const { recipientName, recipientPhoneNumber, address } = body

    const order = await this.createOrder.execute({
      recipientName,
      recipientPhoneNumber,
      address,
    })

    if (order.isLeft()) throw new ForbiddenException()

    return {
      message: 'Pedido criado com sucesso!',
    }
  }
}
