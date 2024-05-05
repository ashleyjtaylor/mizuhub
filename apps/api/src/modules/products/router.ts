import { Router, Request, Response } from 'express'

import { logger } from '@/utils/logger'
import { asyncFn } from '@/middlewares/async-handler'
import { validateId, validateListQueryParams } from '@/middlewares/validation'

import productService from './service'
import { CreateProduct, UpdateProduct } from './schema'
import { validateCreateProduct, validateUpdateProduct } from './validator'

const router = Router()
const productLogger = logger.child({ service: 'product' })

router.get('/:id', validateId, asyncFn(async (req: Request, res: Response) => {
  const product = await productService.getProduct(req.params.id as string)

  productLogger.info({ product }, `Product fetched: ${req.params.id}`)

  res.json(product)
}))

router.get('/', validateListQueryParams, asyncFn(async (req: Request, res: Response) => {
  const page = Number(req.query.p || 1)

  const results = await productService.listProducts(page)

  productLogger.info({ results }, `Product list - page: ${page}`)

  res.json(results)
}))

router.post('/', validateCreateProduct, asyncFn(async (req: Request, res: Response) => {
  const data: CreateProduct = {
    name: req.body.name,
    price: req.body.price,
    currency: req.body.currency,
    description: req.body.description ?? null,
    images: req.body.images ?? [],
    features: req.body.features ?? [],
    active: req.body.active ?? null,
    shippable: req.body.shippable ?? null,
    metadata: req.body.metadata ?? null,
    dimensions: req.body.dimensions ?? null,
    unit_label: req.body.unit_label ?? null
  }

  const product = await productService.createProduct(data)

  productLogger.info({ product }, 'Product created')

  res.status(201).json(product)
}))

router.delete('/:id', validateId, asyncFn(async (req: Request, res: Response) => {
  const result = await productService.deleteProduct(req.params.id as string)

  productLogger.info({ result }, `Product deleted: ${req.params.id}`)

  const statusCode = result ? 200 : 204
  res.status(statusCode).json(result)
}))

router.patch('/:id', validateId, validateUpdateProduct, asyncFn(async (req: Request, res: Response) => {
  const data: UpdateProduct = req.body

  const result = await productService.updateProduct(req.params.id as string, data)

  productLogger.info({ result }, `Product upadted: ${req.params.id}`)

  res.json(result)
}))

export default router
