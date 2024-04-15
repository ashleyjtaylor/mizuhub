import { validate } from '../../middlewares/validation'

import { productSchema, updateProductSchema } from './schema'

export const validateCreateProduct = validate(productSchema)

export const validateUpdateProduct = validate(updateProductSchema)
