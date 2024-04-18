import { db } from '../../database/connection'
import { CreateProduct, Product, UpdateProduct, productIdPrefix } from './schema'

import { NotFoundError } from '../../errors/NotFound'
import { createId } from '../../utils/create-id'

const getById = async (id: string) => {
  return await db.products.findOne<Product>({ _id: id })
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
    _id: createId(productIdPrefix),
    _created: Date.now(),
    _updated: Date.now()
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
    { _id: id },
    { $set: { ...data, _updated: Date.now() } },
    { returnDocument: 'after' }
  ) as Product
}

export default {
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
}
