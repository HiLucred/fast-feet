import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { CourierFactory } from 'test/factories/make-courier'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/make-recipient'
import { OrderFactory } from 'test/factories/make-order'
import request from 'supertest'
import { DeliveryPhotoFactory } from 'test/factories/make-delivery-photo'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('Mark Order Delivered (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let courierFactory: CourierFactory
  let orderFactory: OrderFactory
  let deliveryPhotoFactory: DeliveryPhotoFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, RecipientFactory, OrderFactory, DeliveryPhotoFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = app.get(JwtService)
    courierFactory = app.get(CourierFactory)
    orderFactory = app.get(OrderFactory)
    deliveryPhotoFactory = app.get(DeliveryPhotoFactory)

    await app.init()
  })

  test('[POST] /order/:orderId/delivered', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const accessToken = await jwt.signAsync({
      sub: courier.id,
      role: 'courier'
    })

    const order = await orderFactory.makePrismaOrder({ state: 'PickedUp', courierId: new UniqueEntityId(courier.id) })
    await deliveryPhotoFactory.makePrismaDeliveryPhoto({ orderId: order.id })

    const response = await request(app.getHttpServer())
      .post(`/order/${order.id}/delivered`)
      .set('Authorization', `Bearer ${accessToken}`)

    console.log(response.body)

    expect(response.status).toEqual(201)
  })
})