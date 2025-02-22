import { Encrypter } from '@/domain/app/application/cryptography/encrypter'

export class FakeEncrypter extends Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
