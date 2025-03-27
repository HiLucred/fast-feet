import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { hash } from 'bcrypt'
import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'
import { AdminFactory } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'
import { OrderFactory } from 'test/factories/make-order'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Edit Order Recipient (E2E)', () => {
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

  test('[PATCH] /order/:orderId', async () => {
    const order = await orderFactory.makePrismaOrder({
      state: 'Pending',
    })

    const admin = await adminFactory.makeAdmin()
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
