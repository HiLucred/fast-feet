import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcrypt'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'

describe('Create Order (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = app.get(PrismaService)
    jwt = app.get(JwtService)
    adminFactory = app.get(AdminFactory)

    await app.init()
  })

  test('[POST] /order', async () => {
    const admin = await adminFactory.makeAdmin()
    const accessToken = await jwt.signAsync({ sub: admin.id, role: 'admin' })

    const response = await request(app.getHttpServer())
      .post('/order')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientName: faker.person.firstName(),
        recipientPhoneNumber: faker.phone.number(),
        address: {
          zipCode: faker.location.zipCode(),
          street: faker.location.street(),
          neighborhood: 'Hauer',
          city: faker.location.city(),
          number: faker.location.buildingNumber(),
          state: faker.location.state(),
        },
      })

    expect(response.status).toEqual(201)

    const database = await prisma.order.findMany()

    expect(database.length).toEqual(1)
  })
})
