import { EditCourierUseCase } from '@/domain/app/application/use-cases/edit-courier'
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles.decorator'

const courierBodySchema = z.object({
  cpf: z
    .string()
    .length(11, { message: 'Cpf deve conter exatamente 11 caracteres.' })
    .optional(),
  name: z.string().optional(),
  password: z.string().optional(),
})

type CourierBodySchema = z.infer<typeof courierBodySchema>

@Controller('/courier/:courierId')
@UseGuards(RolesGuard)
export class EditCourierController {
  constructor(private readonly editCourier: EditCourierUseCase) {}

  @Patch()
  @Roles('admin')
  async handle(
    @Body(new ZodValidationPipe(courierBodySchema)) body: CourierBodySchema,
    @Param('courierId') courierId: string,
  ) {
    const { cpf, name, password } = body

    const result = await this.editCourier.execute({
      courierId,
      cpf,
      name,
      password,
    })

    if (result.isLeft()) {
      if (result.value instanceof ResourceNotFoundError) {
        throw new NotFoundException()
      }
      throw new BadRequestException()
    }

    return {
      message: 'Entregador editado com sucesso!',
    }
  }
}
