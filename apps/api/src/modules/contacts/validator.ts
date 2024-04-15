import { validate } from '../../middlewares/validation'

import { contactSchema, updateContactSchema } from './schema'

export const validateCreateContact = validate(contactSchema)

export const validateUpdateContact = validate(updateContactSchema)
