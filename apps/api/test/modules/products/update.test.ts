import request from 'supertest'

import { Product } from '../../../src/modules/products/schema'
import { client, db } from '../../../src/database/connection'
import app from '../../../src/app'

import fixturesProducts from '../../fixtures/products.json'

describe('PATCH /products/:id', () => {
  let productId: string

  beforeAll(async() => {
    try {
      await client.connect()
      await db.products.insertMany(fixturesProducts as Product[])

      productId = fixturesProducts?.[0]?._id ?? ''
    } catch (err) {
      console.error(err)
    }
  })

  afterAll(async () => {
    try {
      await client.db().dropDatabase({ dbName: process.env.MONGO_DB_NAME })
      await client.close()
    } catch (err) {
      console.error(err)
    }
  })

  it('should update a product', async () => {
    await request(app)
      .patch(`/products/${productId}`)
      .send({ price: 700 })
      .expect(200)
      .then(res => {
        expect(res.body.price).toEqual(700)
      })
  })

  it('should fail with empty payload', async () => {
    await request(app)
      .patch(`/products/${productId}`)
      .send({})
      .expect(400)
      .then(res => {
        expect(res.error).toBeTruthy()
      })
  })

  it('should fail with incorrect values', async () => {
    await request(app)
      .patch(`/products/${productId}`)
      .send({ name: 1 })
      .expect(400)
      .then(res => {
        expect(res.error).toBeTruthy()
      })
  })

  it('should fail validation with incorrect keys', async () => {
    await request(app)
      .patch(`/products/${productId}`)
      .send({ invalid: 1 })
      .expect(400)
      .then(res => {
        expect(res.error).toBeTruthy()
      })
  })

  it('should fail to update a non-existent contact', async () => {
    await request(app)
      .patch('/products/pro_000000000000000000000000')
      .send({ price: 200 })
      .expect(404)
      .then(res => {
        expect(res.error).toBeTruthy()
      })
  })
})

