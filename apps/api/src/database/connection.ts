import { MongoClient } from 'mongodb'

import { Contact } from '../modules/contacts/schema'
import { Product } from '../modules/products/schema'

export const client = new MongoClient(process.env.MONGO_URL ?? '')

const mongoDb = client.db()

export const db = {
  contacts: mongoDb.collection<Contact>('contacts'),
  products: mongoDb.collection<Product>('products')
}
