import { MongoClient } from 'mongodb'

export const client = new MongoClient(process.env.MONGO_URL ?? '')

const mongoDb = client.db()

export const db = {
  contacts: mongoDb.collection('contacts')
}
