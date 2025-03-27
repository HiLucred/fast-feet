import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(EnvService) // Pego um serviço do modulo de app (Config Service)
  const port = configService.get('PORT') // Pego o valor do Env 'PORT'

  await app.listen(port)
}
bootstrap()
