import request from 'supertest'
import { type ObjectId } from 'mongodb'

import app from '../../../src/app'

import mockContact from '../../fixtures/contacts/contact.fixture.json'

describe('contactRouter', () => {
  let contactId: ObjectId

  describe('POST /contacts', () => {
    it('should return a contact', async () => {
      await request(app)
        .post('/contacts')
        .send(mockContact)
        .expect(200)
        .then(res => {
          contactId = res.body._id
          expect(res.body).toEqual({ _id: res.body._id, _created: res.body._created, ...mockContact })
        })
    })

    it('should fail validation', async () => {
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
          expect(res.body.firstname).toEqual('Luke')
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
  })

  describe('SEARCH /contacts', () => {
    it('should fetch contacts', async () => {
      await request(app)
        .get('/contacts')
        .expect(200)
        .then(res => {
          expect(res.body.results).toHaveLength(1)
          expect(res.body.size).toEqual(1)
          expect(res.body.total).toEqual(1)
          expect(res.body.page).toEqual(1)
          expect(res.body.hasMore).toEqual(false)
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

  describe('PUT /contacts/:id', () => {
    it('should updated a contact', async () => {
      await request(app)
        .put(`/contacts/${contactId}`)
        .send({ firstname: 'Anakin' })
        .expect(200)
        .then(res => {
          expect(res.body.firstname).toEqual('Anakin')
          expect(res.body._updated).toBeTruthy()
        })
    })

    it('should fail validation', async () => {
      await request(app)
        .put(`/contacts/${contactId}`)
        .send({})
        .expect(400)
        .then(res => {
          expect(res.error).toBeTruthy()
        })
    })

    it('should fail to update a non-existent contact', async () => {
      await request(app)
        .put('/contacts/1111a1111a1a1aa1a11a1a11')
        .send({ firstname: 'Anakin' })
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

    it('should fail to delete a non-existent contact', async () => {
      await request(app)
        .delete(`/contacts/${contactId}`)
        .expect(404)
        .then(res => {
          expect(res.error).toBeTruthy()
        })
    })
  })
})
