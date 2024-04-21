import request from 'supertest'

import { client, db } from '../../../src/database/connection'
import app from '../../../src/app'

import fixturesContacts from '../../fixtures/contacts.json'

describe('LIST /contacts', () => {
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

  it('should fetch contacts - page 1', async () => {
    await request(app)
      .get('/contacts')
      .expect(200)
      .then(res => {
        expect(res.body.results).toHaveLength(10)
        expect(res.body.size).toEqual(10)
        expect(res.body.total).toEqual(15)
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
        expect(res.body.results).toHaveLength(5)
        expect(res.body.size).toEqual(5)
        expect(res.body.total).toEqual(15)
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
