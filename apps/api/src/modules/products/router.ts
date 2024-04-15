import { Router, Request, Response } from 'express'

import productService from './service'
import { productSchema } from './schema'

import { validate, validateId } from '../../middlewares/validation'
import { asyncFn } from '../../middlewares/asyncHandler'

import { logger } from '../../utils/logger'

const router = Router()
const productLogger = logger.child({ service: 'product' })

router.get('/:id', validateId, asyncFn(async (req: Request, res: Response) => {
  const product = await productService.getProduct(req.params.id as string)

  productLogger.info({ product }, `Product fetched: ${req.params.id}`)

  res.json(product)
}))

router.post('/', validate(productSchema), asyncFn(async (req: Request, res: Response) => {
  const data = {
    _created: new Date().toISOString(),
    name: req.body.name,
    price: req.body.price,
    description: req.body.description ?? null,
    active: req.body.active ?? false,
    shippable: req.body.shippable ?? false,
    metadata: req.body.metadata ?? null,
    dimensions: req.body.dimensions ?? null
  }

  const product = await productService.createProduct(data)

  productLogger.info({ product }, 'Product created')

  res.json(product)
}))

export default router
