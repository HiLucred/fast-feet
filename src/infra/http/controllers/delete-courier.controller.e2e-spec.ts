import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcrypt'
import request from 'supertest'

describe('Delete Courier (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = app.get(PrismaService)
    jwt = app.get(JwtService)

    await app.init()
  })

  test('[DELETE] /courier/:courierId', async () => {
    const courier = await prisma.courier.create({
      data: {
        name: 'Daniel Smith',
        cpf: '81818181999',
        password: await hash('mystrongpassword', 8),
      },
    })

    const admin = await prisma.adm.create({
      data: {
        email: 'johndoe@email.com',
        name: 'John Doe',
        password: await hash('admin', 8),
      },
    })

    const accessToken = await jwt.signAsync({
      sub: admin.id,
      role: 'admin',
    })

    const result = await request(app.getHttpServer())
      .delete(`/courier/${courier.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.statusCode).toEqual(200)
  })
})
