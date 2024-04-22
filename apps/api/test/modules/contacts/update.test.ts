import request from 'supertest'

import { client, db } from '../../../src/database/connection'
import app from '../../../src/app'

import fixturesContacts from '../../fixtures/contacts.json'

describe('PATCH /contacts/:id', () => {
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
