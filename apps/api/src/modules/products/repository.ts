import { ObjectId } from 'mongodb'

import { db } from '../../database/connection'
import { Product } from './schema'

import { NotFoundError } from '../../errors/NotFound'

const getById = async (id: string) => {
  return await db.products.findOne({ _id: new ObjectId(id) })
}

const getProduct = async (id: string) => {
  const result = await getById(id)

  if (!result) {
    throw new NotFoundError('Product does not exist')
  }

  return result
}

const createProduct = async (product: Product) => {
  const result = await db.products.insertOne({ ...product, _created: new Date().toISOString() })

  return await db.products.findOne({ _id: result.insertedId })
}

export default {
  getProduct,
  createProduct
}
