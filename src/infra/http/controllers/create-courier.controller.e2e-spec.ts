import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcrypt'
import request from 'supertest'

describe('Create courier (E2E)', () => {
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

  test('[POST] /courier', async () => {
    const user = await prisma.adm.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: await hash('mystrongpassword', 8),
      },
    })

    const accessToken = await jwt.signAsync({ sub: user.id, role: 'admin' })

    const response = await request(app.getHttpServer())
      .post('/courier')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Mark',
        cpf: '81888118188',
        password: 'courierpassword',
      })

    expect(response.status).toEqual(201)
  })
})
