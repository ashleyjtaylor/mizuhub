import request from 'supertest'

import app from '../src/app'

describe('app', () => {
  describe('basic routes', () => {
    it('GET / - 200 OK', async () => {
      await request(app)
        .get('/')
        .expect('Content-Type', /text/)
        .expect(200)
        .then(response => {
          expect(response.text).toEqual('OK')
        })
    })

    it('GET /health - 200 OK', async () => {
      await request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200)
        .then(response => {
          expect(response.text).toEqual('OK')
        })
    })

    it('GET /not-found - 404 Not Found', async () => {
      await request(app)
        .get('/not-found')
        .expect('Content-Type', /json/)
        .expect(404)
        .then(response => {
          expect(response.error).toBeTruthy()
        })
    })

    it('500 Internal Server Error', async () => {
      await request(app)
        .get('/500')
        .expect('Content-Type', /json/)
        .expect(500)
        .then(res => {
          expect(res.error).toBeTruthy()
          expect(res.body.statusCode).toEqual(500)
          expect(res.body.reason).toEqual('Internal Server Error')
          expect(res.body.message).toEqual('Internal Server Error')
        })
    })
  })
})
