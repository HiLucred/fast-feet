import { AuthenticateCourierUseCase } from '@/domain/app/application/use-cases/authenticate-courier'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { WrongCredentialsError } from '@/domain/app/application/use-cases/errors/wrong-credentials-error'

const authenticateCourierBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

type AuthencateCourierBody = z.infer<typeof authenticateCourierBodySchema>

@Controller('/sessions')
export class AuthenticateCourierController {
  constructor(
    private readonly authenticateCourier: AuthenticateCourierUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateCourierBodySchema))
  async handle(@Body() body: AuthencateCourierBody) {
    const { cpf, password } = body

    const account = await this.authenticateCourier.execute({
      cpf,
      password,
    })

    if (account.isLeft()) {
      const error = account.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = account.value

    return {
      access_token: accessToken,
    }
  }
}
