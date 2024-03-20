import request from 'supertest'

import app from '../src/server'

describe('server', () => {
  describe('basic routes', () => {
    it('GET / - should return OK', async () => {
      await request(app)
        .get('/')
        .expect('Content-Type', /text/)
        .expect(200)
        .then(response => {
          expect(response.text).toEqual('OK')
        })
    })

    it('GET /health - should return OK', async () => {
      await request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200)
        .then(response => {
          expect(response.text).toEqual('OK')
        })
    })

    it('GET /not-found - should return 404', async () => {
      await request(app)
        .get('/not-found')
        .expect('Content-Type', /text/)
        .expect(404)
        .then(response => {
          expect(response.text).toEqual('Not Found')
        })
    })

    it('GET /temp-error - should return 500', async () => {
      await request(app)
        .get('/temp-error')
        .expect('Content-Type', /text/)
        .expect(500)
        .then(response => {
          expect(response.text).toEqual('Internal Server Error')
        })
    })
  })
})
