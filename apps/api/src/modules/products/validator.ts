import { validate } from '../../middlewares/validation'

import { createProductSchema, updateProductSchema } from './schema'

export const validateCreateProduct = validate(createProductSchema)

export const validateUpdateProduct = validate(updateProductSchema)
