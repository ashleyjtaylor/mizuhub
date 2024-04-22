import request from 'supertest'

import { client } from '../../../src/database/connection'
import app from '../../../src/app'

describe('POST /contacts', () => {
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

  it('should create a contact using required values', async () => {
    await request(app)
      .post('/contacts')
      .send({ firstname: 'luke' })
      .expect(201)
      .then(res => {
        expect(res.body).toEqual({
          _id: res.body._id,
          _created: res.body._created,
          _updated: res.body._updated,
          object: 'contact',
          firstname: 'luke',
          lastname: null,
          email: null,
          phone: null,
          description: null,
          address: null,
          shipping: null
        })
      })
  })

  it('should create a contact using all values', async () => {
    await request(app)
      .post('/contacts')
      .send({
        firstname: 'luke',
        lastname: 'skywalker',
        email: 'luke@sw.com',
        phone: '07712345678',
        description: 'Jedi master from tatooine',
        address: {
          line1: 'line1',
          line2: 'line2',
          city: 'city',
          state: 'state',
          country: 'country',
          postcode: 'SW0 4IV'
        },
        shipping: {
          line1: 'line1',
          line2: 'line2',
          city: 'city',
          state: 'state',
          country: 'country',
          postcode: 'SW0 4IV'
        }
      })
      .expect(201)
      .then(res => {
        expect(res.body).toEqual({
          _id: res.body._id,
          _created: res.body._created,
          _updated: res.body._updated,
          object: 'contact',
          firstname: 'luke',
          lastname: 'skywalker',
          email: 'luke@sw.com',
          phone: '07712345678',
          description: 'Jedi master from tatooine',
          address: {
            line1: 'line1',
            line2: 'line2',
            city: 'city',
            state: 'state',
            country: 'country',
            postcode: 'SW0 4IV'
          },
          shipping: {
            line1: 'line1',
            line2: 'line2',
            city: 'city',
            state: 'state',
            country: 'country',
            postcode: 'SW0 4IV'
          }
        })
      })
  })

  it('should fail with empty payload', async () => {
    await request(app)
      .post('/contacts')
      .send({})
      .expect(400)
      .then(res => {
        expect(res.error).toBeTruthy()
      })
  })

  it('should fail with incorrect keys', async () => {
    await request(app)
      .post('/contacts')
      .send({ invalid: 1 })
      .expect(400)
      .then(res => {
        expect(res.error).toBeTruthy()
      })
  })

  it('should fail validation with incorrect values', async () => {
    await request(app)
      .post('/contacts')
      .send({ firstname: null, lastname: 123 })
      .expect(400)
      .then(res => {
        expect(res.error).toBeTruthy()
      })
  })
})
