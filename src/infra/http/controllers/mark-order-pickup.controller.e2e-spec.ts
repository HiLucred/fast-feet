import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { faker } from '@faker-js/faker/locale/pt_BR'
import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/make-recipient'
import { OrderFactory } from 'test/factories/make-order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('Mark Order Pickup (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let courierFactory: CourierFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = app.get(PrismaService)
    jwt = app.get(JwtService)
    courierFactory = app.get(CourierFactory)
    recipientFactory = app.get(RecipientFactory)
    orderFactory = app.get(OrderFactory)

    await app.init()
  })

  test('[GET] /orders/:orderId/pickup', async () => {
    const courier = await courierFactory.makePrismaCourier()

    const accessToken = await jwt.signAsync({
      sub: courier.id,
      role: 'courier',
    })

    const order = await orderFactory.makePrismaOrder({
      state: 'Pending',
      courierId: new UniqueEntityId(courier.id),
    })

    const result = await request(app.getHttpServer())
      .get(`/order/${order.id}/pickup`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.statusCode).toEqual(200)
  })
})
