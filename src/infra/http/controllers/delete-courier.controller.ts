import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteCourierUseCase } from '@/domain/app/application/use-cases/delete-courier'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'
import {
  BadRequestException,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'

@Controller('/courier/:courierId')
@UseGuards(RolesGuard)
export class DeleteCourierController {
  constructor(private readonly deleteCourier: DeleteCourierUseCase) {}

  @Delete()
  @Roles('admin')
  async handle(@Param('courierId') courierId: string) {
    const result = await this.deleteCourier.execute({
      courierId,
    })

    if (result.isLeft()) {
      if (result.value instanceof ResourceNotFoundError) {
        throw new NotFoundException()
      }
      throw new BadRequestException()
    }

    return {
      message: 'Entregador deletado com sucesso!',
    }
  }
}
