import { Controller, Get } from '@nestjs/common'

@Controller()
export class GreetingsController {
  @Get()
  async handle() {
    return 'Olá, mundo!'
  }
}
