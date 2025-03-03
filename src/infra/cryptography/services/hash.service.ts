import { HashComparer } from '@/domain/app/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/app/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class HashService implements HashComparer, HashGenerator {
  private hashSaltLength = 8

  async compare(plain: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plain, hash)
  }

  async hash(plain: string): Promise<string> {
    return await bcrypt.hash(plain, this.hashSaltLength)
  }
}
