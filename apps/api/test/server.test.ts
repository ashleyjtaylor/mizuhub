import request from 'supertest'

import app from '../src/server'

describe('server', () => {
  describe('/', () => {
    it('should return OK', async () => {
      await request(app)
        .get('/')
        .expect('Content-Type', /text/)
        .expect(200)
        .then(response => {
          expect(response.text).toEqual('OK')
        })
    })
  })
})
