const { client } = require('./src/database/connection')

beforeAll(async() => {
  await client.connect()
  await client.db().dropDatabase({ dbName: process.env.MONGO_DB_NAME })
})

afterAll(async () => {
  await client.db().dropDatabase({ dbName: process.env.MONGO_DB_NAME })
  await client.close()
})
