import request from 'supertest'

import { client, db } from '../../../src/database/connection'
import app from '../../../src/app'

import fixturesContacts from '../../fixtures/contacts.json'

describe('GET /contacts/:id', () => {
  let contactId: string

  beforeAll(async() => {
    try {
      await client.connect()
      await db.contacts.insertMany(fixturesContacts)

      contactId = fixturesContacts?.[0]?._id ?? ''
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

  it('should return a contact', async () => {
    await request(app)
      .get(`/contacts/${contactId}`)
      .expect(200)
      .then(res => {
        expect(res.body.firstname).toEqual('Montana')
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
