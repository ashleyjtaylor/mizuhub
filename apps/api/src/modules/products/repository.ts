import { ObjectId } from 'mongodb'

import { db } from '../../database/connection'
import { CreateProduct, Product, UpdateProduct } from './schema'

import { NotFoundError } from '../../errors/NotFound'

const getById = async (id: string) => {
  return await db.products.findOne<Product>({ _id: new ObjectId(id) })
}

const getProduct = async (id: string) => {
  const result = await getById(id)

  if (!result) {
    throw new NotFoundError('Product does not exist')
  }

  return result
}

const createProduct = async (product: CreateProduct) => {
  const result = await db.products.insertOne({
    ...product,
    _created: new Date().toISOString(),
    _updated: new Date().toISOString()
  })

  return await db.products.findOne<Product>({ _id: result.insertedId })
}

const deleteProduct = async (id: string) => {
  const product = await getById(id)

  if (product) {
    const result = await db.products.deleteOne({ _id: product._id })

    return {
      _id: id,
      acknowledged: result.acknowledged,
      deletedCount: result.deletedCount
    }
  }

  return product
}

const updateProduct = async (id: string, data: UpdateProduct) => {
  await getProduct(id)

  return await db.products.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...data, _updated: new Date().toISOString() } },
    { returnDocument: 'after' }
  ) as Product
}

export default {
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
}
