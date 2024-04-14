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
  const product = await productService.createProduct(req.body)

  productLogger.info({ product }, 'Product created')

  res.json(product)
}))

export default router
