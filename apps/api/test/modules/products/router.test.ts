import request from 'supertest'
import { ObjectId } from 'mongodb'

import { client } from '../../../src/database/connection'
import app from '../../../src/app'

describe('productRouter', () => {
  let productId: ObjectId

  beforeAll(async() => {
    try {
      await client.connect()
      await client.db().dropDatabase({ dbName: process.env.MONGO_DB_NAME })
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

  describe('POST /products', () => {
    it('should create a contact', async () => {
      await request(app)
        .post('/products')
        .send({ name: 'Test product', price: 12.00 })
        .expect(200)
        .then(res => {
          productId = res.body._id
          expect(res.body).toEqual({ name: 'Test product', price: 12.00, _id: res.body._id, _created: res.body._created })
        })
    })
  })

  describe('GET /products', () => {
    it('should return a contact', async () => {
      await request(app)
        .get(`/products/${productId}`)
        .expect(200)
        .then(res => {
          expect(res.body.name).toEqual('Test product')
        })
    })
  })
})

