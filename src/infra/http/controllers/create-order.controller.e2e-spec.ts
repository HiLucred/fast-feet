import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcrypt'
import request from 'supertest'

describe('Create Order (E2E)', () => {
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

  test('[POST] /order', async () => {
    const user = await prisma.adm.create({
      data: {
        name: 'John Doe',
        email: 'johndoe2@email.com',
        password: await hash('mystrongpassword', 8),
      },
    })

    const accessToken = await jwt.signAsync({ sub: user.id, role: 'admin' })

    const response = await request(app.getHttpServer())
      .post('/order')
      .auth(accessToken, { type: 'bearer' })
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientName: faker.person.firstName(),
        recipientPhoneNumber: faker.phone.number(),
        address: {
          zipCode: faker.location.zipCode(),
          street: faker.location.street(),
          neighborhood: 'Hauer',
          city: faker.location.city(),
          number: faker.location.buildingNumber(),
          state: faker.location.state(),
        },
      })

    expect(response.status).toEqual(201)

    const database = await prisma.order.findMany()

    expect(database.length).toEqual(1)
  })
})
