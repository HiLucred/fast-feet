import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcrypt'
import { faker } from '@faker-js/faker/locale/pt_BR'
import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'
import { AdminFactory } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'
import { OrderFactory } from 'test/factories/make-order'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Mark Order Pending (E2E)', () => {
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
    orderFactory = app.get(OrderFactory)

    await app.init()
  })

  test('[GET] /order/:orderId/pending', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const accessToken = await jwt.signAsync({
      sub: courier.id,
      role: 'courier',
    })

    const order = await orderFactory.makePrismaOrder({
      state: 'Available',
    })

    const result = await request(app.getHttpServer())
      .get(`/order/${order.id}/pending`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.statusCode).toEqual(200)
  })
})
