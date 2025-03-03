import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService: ConfigService<Env, true> = app.get(ConfigService) // Pego um serviço do modulo de app (Config Service)
  const port = configService.get('PORT', { infer: true }) // Pego o valor do Env 'PORT'

  await app.listen(port)
}
bootstrap()
