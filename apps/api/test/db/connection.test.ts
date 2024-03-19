import { type Db, type MongoClient } from 'mongodb'
import connect from '../../src/db/connection'

describe('database', () => {
  let db: Db
  let client: MongoClient

  beforeAll(async () => {
    ({ db, client } = await connect())
  })

  afterAll(async () => {
    await client.close()
  })

  it('should connect to "test" database', async () => {
    const stats = await db.stats()

    expect(stats.ok).toEqual(1)
    expect(stats.db).toEqual('test')
  })
})
