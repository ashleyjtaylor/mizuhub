import { Router, Request, Response } from 'express'

import productService from './service'
import { validateCreateProduct, validateUpdateProduct } from './validator'

import { validateId, validateBody } from '../../middlewares/validation'
import { asyncFn } from '../../middlewares/async-handler'

import { logger } from '../../utils/logger'

const router = Router()
const productLogger = logger.child({ service: 'product' })

router.get('/:id', validateId, asyncFn(async (req: Request, res: Response) => {
  const product = await productService.getProduct(req.params.id as string)

  productLogger.info({ product }, `Product fetched: ${req.params.id}`)

  res.json(product)
}))

router.post('/', validateCreateProduct, asyncFn(async (req: Request, res: Response) => {
  const data = {
    _created: new Date().toISOString(),
    _updated: new Date().toISOString(),
    name: req.body.name,
    price: req.body.price,
    description: req.body.description ?? null,
    active: req.body.active ?? null,
    shippable: req.body.shippable ?? null,
    metadata: req.body.metadata ?? null,
    dimensions: req.body.dimensions ?? null
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

router.patch('/:id', validateId, validateBody, validateUpdateProduct, asyncFn(async (req: Request, res: Response) => {
  const data = {
    ...req.body,
    _updated: new Date().toISOString()
  }

  const result = await productService.updateProduct(req.params.id as string, data)

  productLogger.info({ result }, `Product upadted: ${req.params.id}`)

  res.json(result)
}))

export default router
