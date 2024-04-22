import request from 'supertest'

import { client } from '../../../src/database/connection'
import app from '../../../src/app'

describe('POST /products', () => {
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

  it('should create a product using required values', async () => {
    await request(app)
      .post('/products')
      .send({ name: 'product', price: 3000, currency: 'gbp' })
      .expect(201)
      .then(res => {
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
        currency: 'eur',
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
        currency: 'gbp',
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
