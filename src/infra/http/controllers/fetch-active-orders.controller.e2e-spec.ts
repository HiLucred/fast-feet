import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'
import { AdminFactory } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'
import { OrderFactory } from 'test/factories/make-order'
import { DatabaseModule } from '@/infra/database/database.module'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('Fetch Active Orders (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let courierFactory: CourierFactory
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, AdminFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = app.get(PrismaService)
    jwt = app.get(JwtService)
    courierFactory = app.get(CourierFactory)
    adminFactory = app.get(AdminFactory)
    recipientFactory = app.get(RecipientFactory)
    orderFactory = app.get(OrderFactory)

    await app.init()
  })

  test('[GET] /orders/pending', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const accessToken = await jwt.signAsync({
      sub: courier.id,
      role: 'courier',
    })

    for (let i = 0; i <= 2; i++) {
      await orderFactory.makePrismaOrder({
        courierId: new UniqueEntityId(courier.id),
        state: 'Pending',
      })
    }

    const result = await request(app.getHttpServer())
      .get('/orders/active')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.statusCode).toEqual(200)
  })
})
