import request from 'supertest'

import { Product } from '../../../src/modules/products/schema'
import { client, db } from '../../../src/database/connection'
import app from '../../../src/app'

import fixturesProducts from '../../fixtures/products.json'

describe('DELETE /products/:id', () => {
  let productId: string

  beforeAll(async() => {
    try {
      await client.connect()
      await db.products.insertMany(fixturesProducts as Product[])

      productId = fixturesProducts?.[0]?._id ?? ''
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
      .delete(`/products/${productId}`)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          _id: productId,
          acknowledged: true,
          deletedCount: 1
        })
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

