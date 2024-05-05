import productRepository from './repository'
import { CreateProduct, UpdateProduct } from './schema'

const createProduct = async (product: CreateProduct) => {
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

const listProducts = async (page: number) => {
  return await productRepository.listProducts(page)
}

export default {
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  listProducts
}
