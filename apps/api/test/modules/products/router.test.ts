import request from 'supertest'
import { ObjectId } from 'mongodb'

import { client } from '../../../src/database/connection'
import app from '../../../src/app'

describe('productRouter', () => {
  let productId: ObjectId

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
        .send({ name: 'product', price: 3000 })
        .expect(201)
        .then(res => {
          productId = res.body._id

          expect(res.body).toEqual({
            _id: res.body._id,
            _created: res.body._created,
            _updated: res.body._updated,
            name: 'product',
            price: 3000,
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
          active: true,
          shippable: true,
          description: 'a new product',
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
            name: 'product',
            price: 40020,
            active: true,
            shippable: true,
            description: 'a new product',
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

    it('should return no content when deleting a non-existent product', async () => {
      await request(app)
        .get('/products/1111a1111a1a1aa1a11a1a11')
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
        .patch('/products/1111a1111a1a1aa1a11a1a11')
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

