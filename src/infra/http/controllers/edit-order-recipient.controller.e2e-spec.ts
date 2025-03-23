import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { hash } from 'bcrypt'
import request from 'supertest'

describe('Edit Order Recipient (E2E)', () => {
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

  test('[PATCH] /order/:orderId', async () => {
    const recipient = await prisma.recipient.create({
      data: {
        name: faker.person.firstName(),
        phoneNumber: faker.phone.number(),
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        neighborhood: 'Hauer',
        city: faker.location.city(),
        number: faker.location.buildingNumber(),
        state: faker.location.state(),
      },
    })

    const order = await prisma.order.create({
      data: {
        state: 'PENDING',
        recipientId: recipient.id,
      },
    })

    const admin = await prisma.adm.create({
      data: {
        name: 'John Doe',
        email: 'johndoe2@email.com',
        password: await hash('mystrongpassword', 8),
      },
    })

    const accessToken = await jwt.signAsync({
      sub: admin.id,
      role: 'admin',
    })

    const result = await request(app.getHttpServer())
      .patch(`/order/${order.id}`)
      .send({
        state: 'Available',
        recipient: {
          name: 'José',
          phoneNumber: '818888080',
        },
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.statusCode).toEqual(200)
  })
})
