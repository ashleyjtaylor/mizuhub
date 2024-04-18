import { validate } from '../../middlewares/validation'

import { createContactSchema, updateContactSchema } from './schema'

export const validateCreateContact = validate(createContactSchema)

export const validateUpdateContact = validate(updateContactSchema)
