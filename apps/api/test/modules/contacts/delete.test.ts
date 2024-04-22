import request from 'supertest'

import { client, db } from '../../../src/database/connection'
import app from '../../../src/app'

import fixturesContacts from '../../fixtures/contacts.json'

describe('DELETE /contacts/:id', () => {
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
