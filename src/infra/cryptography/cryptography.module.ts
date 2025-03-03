import { HashComparer } from '@/domain/app/application/cryptography/hash-comparer'
import { Module } from '@nestjs/common'
import { HashService } from './services/hash.service'
import { HashGenerator } from '@/domain/app/application/cryptography/hash-generator'
import { Encrypter } from '@/domain/app/application/cryptography/encrypter'
import { JwtEncrypter } from './services/jwt-encrypter.service'

@Module({
  providers: [
    {
      provide: HashComparer,
      useClass: HashService,
    },
    {
      provide: HashGenerator,
      useClass: HashService,
    },
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
  ],
  exports: [HashComparer, HashGenerator, Encrypter],
})
export class CryptographyModule {}
