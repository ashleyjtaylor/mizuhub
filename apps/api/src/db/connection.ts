import { MongoClient, type Db } from 'mongodb'

const client = new MongoClient(process.env.MONGO_URL ?? '')

let db: Db

const connect = async () => {
  if (db) return { db, client }

  await client.connect()

  db = client.db(process.env.MONGO_DB_NAME)

  return { db, client }
}

export default connect
