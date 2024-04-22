import request from 'supertest'

import { Product } from '../../../src/modules/products/schema'
import { client, db } from '../../../src/database/connection'
import app from '../../../src/app'

import fixturesProducts from '../../fixtures/products.json'

describe('GET /products/:id', () => {
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

  it('should return a product', async () => {
    await request(app)
      .get(`/products/${productId}`)
      .expect(200)
      .then(res => {
        expect(res.body.name).toEqual('Elegant Bronze Pizza')
      })
  })

  it('should return invalid id', async () => {
    await request(app)
      .get('/products/123')
      .expect(400)
      .then(res => {
        expect(res.error).toBeTruthy()
      })
  })

  it('should return not found when fetching a non-existent product', async () => {
    await request(app)
      .get('/products/pro_000000000000000000000000')
      .expect(404)
      .then(res => {
        expect(res.error).toBeTruthy()
      })
  })
})

