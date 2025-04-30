import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/make-recipient'
import { OrderFactory } from 'test/factories/make-order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('Upload Photo Delivery (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let courierFactory: CourierFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = app.get(JwtService)
    courierFactory = app.get(CourierFactory)
    orderFactory = app.get(OrderFactory)

    await app.init()
  })

  it('[POST] /order/delivery-photo/:orderId', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const accessToken = await jwt.signAsync({
      sub: courier.id,
      role: 'courier',
    })

    const order = await orderFactory.makePrismaOrder({
      courierId: new UniqueEntityId(courier.id),
    })

    const response = await request(app.getHttpServer())
      .post(`/order/delivery-photo/${order.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/photo-delivery.jpg')

    expect(response.body).toEqual({
      url: expect.any(String),
    })
  })
})
