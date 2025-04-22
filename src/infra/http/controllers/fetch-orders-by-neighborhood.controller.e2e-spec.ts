import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { CourierFactory, makeCourier } from 'test/factories/make-courier'
import { AdminFactory } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'
import { makeOrder, OrderFactory } from 'test/factories/make-order'
import { DatabaseModule } from '@/infra/database/database.module'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('Fetch orders By Neighborhood (E2E)', () => {
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

  test('[GET] /orders/neighborhood/:neighborhood', async () => {
    const courier = makeCourier()
    const order = makeOrder({ courierId: courier.id })
    const neighborhood = order.recipient.address.neighborhood

    const accessToken = await jwt.signAsync({
      sub: courier.id.toString(),
      role: 'courier',
    })

    const response = await request(app.getHttpServer())
      .get(`/orders/neighborhood/${neighborhood}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toEqual(200)
  })
})
