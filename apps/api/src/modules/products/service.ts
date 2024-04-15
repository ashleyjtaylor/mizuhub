import productRepository from './repository'
import { Product, UpdateProduct } from './schema'

const createProduct = async (product: Product) => {
  return await productRepository.createProduct(product)
}

const getProduct = async (id: string) => {
  return await productRepository.getProduct(id)
}

const deleteProduct = async (id: string) => {
  return await productRepository.deleteProduct(id)
}

const updateProduct = async (id: string, data: UpdateProduct) => {
  return await productRepository.updateProduct(id, data)
}

export default {
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
}
