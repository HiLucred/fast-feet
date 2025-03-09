import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/services/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcrypt'
import request from 'supertest'

describe('Authenticate admin (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = app.get(PrismaService)

    await app.init()
  })

  test('[POST] /sessions/admin', async () => {
    await prisma.adm.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: await hash('mystrongpassword', 8),
      },
    })

    const response = await request(app.getHttpServer())
      .post('/sessions/admin')
      .send({
        email: 'johndoe@email.com',
        password: 'mystrongpassword',
      })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
