import { CreateCourierUseCase } from '@/domain/app/application/use-cases/create-courier'
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { AuthGuard } from '@nestjs/passport'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'

const courierBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
})

type CourierBodySchema = z.infer<typeof courierBodySchema>

@Controller('/courier')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Verifica se a pessoa está autenticada
export class CreateCourierController {
  constructor(private readonly createCourier: CreateCourierUseCase) {}

  @Post()
  @Roles('admin')
  @HttpCode(409)
  @UsePipes(new ZodValidationPipe(courierBodySchema)) // Verifica se a pessoa está passando o body correto
  async handle(@Body() body: CourierBodySchema) {
    const { name, cpf, password } = body

    const courier = await this.createCourier.execute({
      name,
      cpf,
      password,
    })

    if (courier.isLeft()) return new ConflictException(courier.value)

    return {
      message: 'Courier criado com sucesso!',
    }
  }
}
