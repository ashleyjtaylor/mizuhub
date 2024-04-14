import productRepository from './repository'
import { Product } from './schema'

const createProduct = async (product: Product) => {
  return await productRepository.createProduct(product)
}

const getProduct = async (id: string) => {
  return await productRepository.getProduct(id)
}

export default {
  getProduct,
  createProduct
}
