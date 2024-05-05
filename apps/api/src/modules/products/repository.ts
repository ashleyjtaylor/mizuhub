import { db } from '@/database/connection'
import { list } from '@/database/utils'
import { createId } from '@/utils/create-id'
import { NotFoundError } from '@/errors/NotFound'

import { CreateProduct, Product, UpdateProduct, productIdPrefix, productObjectName } from './schema'

const SEARCH_RESULTS_PER_PAGE = 10

const getById = async (id: string) => {
  return await db.products.findOne({ _id: id })
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
    _updated: Date.now(),
    object: productObjectName
  })

  return await db.products.findOne({ _id: result.insertedId })
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
  )
}

const listProducts = async (page: number) => await list<Product>(db.products, page, SEARCH_RESULTS_PER_PAGE)

export default {
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  listProducts
}
