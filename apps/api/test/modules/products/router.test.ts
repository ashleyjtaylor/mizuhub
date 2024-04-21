import request from 'supertest'

import { client } from '../../../src/database/connection'
import app from '../../../src/app'

describe('productRouter', () => {
  let productId: string

  beforeAll(async() => {
    try {
      await client.connect()
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
    it('should create a product using required values', async () => {
      await request(app)
        .post('/products')
        .send({ name: 'product', price: 3000, currency: 'gbp' })
        .expect(201)
        .then(res => {
          productId = res.body._id

          expect(res.body).toEqual({
            _id: res.body._id,
            _created: res.body._created,
            _updated: res.body._updated,
            object: 'product',
            name: 'product',
            price: 3000,
            currency: 'gbp',
            images: [],
            features: [],
            unit_label: null,
            active: null,
            shippable: null,
            description: null,
            dimensions: null,
            metadata: null
          })
        })
    })

    it('should create a product using all values', async () => {
      await request(app)
        .post('/products')
        .send({
          name: 'product',
          price: 40020,
          currency: 'usd',
          active: true,
          shippable: true,
          description: 'a new product',
          images: ['https://jest-image'],
          features: ['10 day free trial', '30mb of storage'],
          unit_label: 'hours',
          dimensions: {
            width: 14.00,
            height: 8.25,
            length: 324.97,
            weight: 590.89
          },
          metadata: {
            creator: 'obi',
            availability: 10,
            external: true
          }
        })
        .expect(201)
        .then(res => {
          productId = res.body._id

          expect(res.body).toEqual({
            _id: res.body._id,
            _created: res.body._created,
            _updated: res.body._updated,
            object: 'product',
            name: 'product',
            price: 40020,
            currency: 'usd',
            active: true,
            shippable: true,
            description: 'a new product',
            images: ['https://jest-image'],
            features: ['10 day free trial', '30mb of storage'],
            unit_label: 'hours',
            dimensions: {
              width: 14.00,
              height: 8.25,
              length: 324.97,
              weight: 590.89
            },
            metadata: {
              creator: 'obi',
              availability: 10,
              external: true
            }
          })
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

    it('should fail validation for "metadata" - key length', async () => {
      await request(app)
        .post('/products')
        .send({
          name: 'product',
          price: 300,
          metadata: {
            ['k'.repeat(33)]: 'value'
          }
        })
        .expect(400)
        .then(res => {
          expect(res.error).toBeTruthy()
        })
    })

    it('should fail validation for "metadata" - value length', async () => {
      await request(app)
        .post('/products')
        .send({
          name: 'product',
          price: 300,
          metadata: {
            k: 'v'.repeat(301)
          }
        })
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
          expect(res.body.name).toEqual('product')
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

  describe('PATCH /products/:id', () => {
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

  describe('DELETE /products/:id', () => {
    it('should delete a contact', async () => {
      await request(app)
        .delete(`/products/${productId}`)
        .expect(200)
        .then(res => {
          expect(res.body).toEqual({ _id: productId, acknowledged: true, deletedCount: 1 })
        })
    })

    it('should return no content when deleting a non-existent contact', async () => {
      await request(app)
        .delete(`/products/${productId}`)
        .expect(204)
        .then(res => {
          expect(res.body).toEqual({})
        })
    })
  })
})

