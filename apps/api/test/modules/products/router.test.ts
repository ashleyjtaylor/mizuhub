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
    it('should create a product', async () => {
      await request(app)
        .post('/products')
        .send({ name: 'Test product', price: 12.00 })
        .expect(200)
        .then(res => {
          productId = res.body._id
          expect(res.body).toEqual({ name: 'Test product', price: 12.00, _id: res.body._id, _created: res.body._created })
        })
    })

    it('should fail with empty payload', async () => {
      await request(app)
        .post('/products')
        .send({})
        .expect(400)
        .then(res => {
          expect(res.error).toBeTruthy()
        })
    })

    it('should fail with incorrect keys', async () => {
      await request(app)
        .post('/products')
        .send({ invalid: 1 })
        .expect(400)
        .then(res => {
          expect(res.error).toBeTruthy()
        })
    })

    it('should fail validation with incorrect values', async () => {
      await request(app)
        .post('/products')
        .send({ name: 123 })
        .expect(400)
        .then(res => {
          expect(res.error).toBeTruthy()
        })
    })
  })

  describe('GET /products', () => {
    it('should return a product', async () => {
      await request(app)
        .get(`/products/${productId}`)
        .expect(200)
        .then(res => {
          expect(res.body.name).toEqual('Test product')
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

    it('should fail to get a non-existent product', async () => {
      await request(app)
        .get('/products//1111a1111a1a1aa1a11a1a11')
        .expect(404)
        .then(res => {
          expect(res.error).toBeTruthy()
        })
    })
  })
})

