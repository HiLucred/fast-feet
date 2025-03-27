import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { CourierFactory } from 'test/factories/make-courier'

describe('Delete Courier (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let courierFactory: CourierFactory
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = app.get(PrismaService)
    jwt = app.get(JwtService)
    courierFactory = app.get(CourierFactory)
    adminFactory = app.get(AdminFactory)

    await app.init()
  })

  test('[DELETE] /courier/:courierId', async () => {
    const courier = await courierFactory.makePrismaCourier()

    const admin = await adminFactory.makeAdmin()

    const accessToken = await jwt.signAsync({
      sub: admin.id,
      role: 'admin',
    })

    const result = await request(app.getHttpServer())
      .delete(`/courier/${courier.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(result.statusCode).toEqual(200)
  })
})
