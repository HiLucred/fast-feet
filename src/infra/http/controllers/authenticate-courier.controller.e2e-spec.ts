import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcrypt'
import request from 'supertest'

describe('Authenticate Courier (E2E)', () => {
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

  test('[POST] /sessions', async () => {
    await prisma.courier.create({
      data: {
        name: 'Daniel Smith',
        cpf: '81888118188',
        password: await hash('mystrongpassword', 8),
      },
    })

    const result = await request(app.getHttpServer())
      .post('/sessions')
      .send({ cpf: '81888118188', password: 'mystrongpassword' })

    expect(result.statusCode).toEqual(201)
  })
})
