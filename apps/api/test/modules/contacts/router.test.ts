import request from 'supertest'

import { client, db } from '../../../src/database/connection'
import app from '../../../src/app'

import fixturesContacts from '../../fixtures/contacts.json'

describe('contactRouter', () => {
  let contactId: string

  beforeAll(async() => {
    try {
      await client.connect()
      await db.contacts.insertMany(fixturesContacts)
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

  describe('POST /contacts', () => {
    it('should create a contact using required values', async () => {
      await request(app)
        .post('/contacts')
        .send({ firstname: 'luke' })
        .expect(201)
        .then(res => {
          contactId = res.body._id

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
          contactId = res.body._id

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

  describe('GET /contacts/:id', () => {
    it('should return a contact', async () => {
      await request(app)
        .get(`/contacts/${contactId}`)
        .expect(200)
        .then(res => {
          expect(res.body.firstname).toEqual('luke')
        })
    })

    it('should return invalid id', async () => {
      await request(app)
        .get('/contacts/123')
        .expect(400)
        .then(res => {
          expect(res.error).toBeTruthy()
        })
    })

    it('should fail to get a non-existent contact', async () => {
      await request(app)
        .get('/contacts/con_000000000000000000000000')
        .expect(404)
        .then(res => {
          expect(res.error).toBeTruthy()
        })
    })
  })

  describe('LIST /contacts', () => {
    it('should fetch contacts - page 1', async () => {
      await request(app)
        .get('/contacts')
        .expect(200)
        .then(res => {
          expect(res.body.results).toHaveLength(10)
          expect(res.body.size).toEqual(10)
          expect(res.body.total).toEqual(12)
          expect(res.body.page).toEqual(1)
          expect(res.body.hasMore).toEqual(true)
          expect(res.body.totalPages).toEqual(2)
          expect(res.body.nextPage).toEqual(2)
          expect(res.body.prevPage).toEqual(undefined)
        })
    })

    it('should fetch contacts - page 2', async () => {
      await request(app)
        .get('/contacts?p=2')
        .expect(200)
        .then(res => {
          expect(res.body.results).toHaveLength(2)
          expect(res.body.size).toEqual(2)
          expect(res.body.total).toEqual(12)
          expect(res.body.page).toEqual(2)
          expect(res.body.hasMore).toEqual(false)
          expect(res.body.totalPages).toEqual(2)
          expect(res.body.nextPage).toEqual(undefined)
          expect(res.body.prevPage).toEqual(1)
        })
    })

    it('should return 0 results for incorrect page', async () => {
      await request(app)
        .get('/contacts?p=0')
        .expect(200)
        .then(res => {
          expect(res.body.results).toHaveLength(0)
          expect(res.body.size).toEqual(0)
          expect(res.body.total).toEqual(0)
          expect(res.body.page).toEqual(0)
          expect(res.body.hasMore).toEqual(false)
          expect(res.body.totalPages).toEqual(0)
          expect(res.body.nextPage).toEqual(undefined)
          expect(res.body.prevPage).toEqual(undefined)
        })
    })

    it('should fail to return results for invalid page', async () => {
      await request(app)
        .get('/contacts?p=abc')
        .expect(400)
        .then(res => {
          expect(res.error).toBeTruthy()
        })
    })
  })

  describe('PATCH /contacts/:id', () => {
    it('should update a contact', async () => {
      await request(app)
        .patch(`/contacts/${contactId}`)
        .send({ firstname: 'anakin' })
        .expect(200)
        .then(res => {
          expect(res.body.firstname).toEqual('anakin')
        })
    })

    it('should fail with empty payload', async () => {
      await request(app)
        .patch(`/contacts/${contactId}`)
        .send({})
        .expect(400)
        .then(res => {
          expect(res.error).toBeTruthy()
        })
    })

    it('should fail with incorrect values', async () => {
      await request(app)
        .patch(`/contacts/${contactId}`)
        .send({ firstname: 1 })
        .expect(400)
        .then(res => {
          expect(res.error).toBeTruthy()
        })
    })

    it('should fail validation with incorrect keys', async () => {
      await request(app)
        .patch(`/contacts/${contactId}`)
        .send({ invalid: 1 })
        .expect(400)
        .then(res => {
          expect(res.error).toBeTruthy()
        })
    })

    it('should fail to update a non-existent contact', async () => {
      await request(app)
        .patch('/contacts/con_000000000000000000000000')
        .send({ firstname: 'anakin' })
        .expect(404)
        .then(res => {
          expect(res.error).toBeTruthy()
        })
    })
  })

  describe('DELETE /contacts/:id', () => {
    it('should delete a contact', async () => {
      await request(app)
        .delete(`/contacts/${contactId}`)
        .expect(200)
        .then(res => {
          expect(res.body).toEqual({ _id: contactId, acknowledged: true, deletedCount: 1 })
        })
    })

    it('should return no content when deleting a non-existent contact', async () => {
      await request(app)
        .delete(`/contacts/${contactId}`)
        .expect(204)
        .then(res => {
          expect(res.body).toEqual({})
        })
    })
  })
})
