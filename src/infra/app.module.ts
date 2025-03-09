import { Module } from '@nestjs/common'
import { HttpModule } from './http/http-module'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env), // Configura o modulo para validar se contém as variáveis de ambiente
      isGlobal: true,
    }),
    DatabaseModule,
    HttpModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
