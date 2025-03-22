import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcrypt'
import { faker } from '@faker-js/faker/locale/pt_BR'
import request from 'supertest'

describe('Mark Order Pending (E2E)', () => {
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

  test('[GET] /order/:orderId/pending', async () => {
    const courier = await prisma.courier.create({
      data: {
        name: 'Daniel Smith',
        cpf: '81888118188',
        password: await hash('mystrongpassword', 8),
      },
    })

    const accessToken = await jwt.signAsync({
      sub: courier.id,
      role: 'courier',
    })

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
        state: 'AVAILABLE',
        recipientId: recipient.id,
      },
    })

    const result = await request(app.getHttpServer())
      .get(`/order/${order.id}/pending`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.statusCode).toEqual(200)
  })
})
