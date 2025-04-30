import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { AuthenticateAdminUseCase } from '@/domain/app/application/use-cases/authenticate-admin'
import { WrongCredentialsError } from '@/domain/app/application/use-cases/errors/wrong-credentials-error'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { SkipAuth } from '@/infra/auth/skip-auth.decorator'

const authenticateAdminBodySchema = z.object({
  email: z.string(),
  password: z.string(),
})

type AuthenticateAdminBodySchema = z.infer<typeof authenticateAdminBodySchema>

@Controller('/sessions/admin')
@SkipAuth()
export class AuthenticateAdminController {
  constructor(private readonly authenticateAdmin: AuthenticateAdminUseCase) { }

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateAdminBodySchema))
  async handle(@Body() body: AuthenticateAdminBodySchema) {
    const { email, password } = body

    const admin = await this.authenticateAdmin.execute({ email, password })

    if (admin.isLeft()) {
      if (admin.value instanceof WrongCredentialsError) {
        throw new UnauthorizedException()
      } else {
        throw new BadRequestException()
      }
    }

    const { accessToken } = admin.value

    return {
      access_token: accessToken,
    }
  }
}
