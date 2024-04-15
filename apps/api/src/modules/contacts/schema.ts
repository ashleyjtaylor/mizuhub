import z, { object, string } from 'zod'

export type Contact = z.infer<typeof contactSchema>
export type UpdateContact = z.infer<typeof updateContactSchema>

const addressSchema = object({
  line1: string(),
  line2: string(),
  city: string(),
  state: string(),
  country: string(),
  postcode: string()
})

export const contactSchema = object({
  firstname: string()
    .min(1)
    .max(32),
  lastname: string()
    .min(1)
    .max(32)
    .nullable()
    .optional(),
  email: string()
    .email()
    .nullable()
    .optional(),
  phone: string()
    .nullable()
    .optional(),
  description: string()
    .max(255)
    .nullable()
    .optional(),
  address: addressSchema
    .nullable()
    .optional(),
  shipping: addressSchema
    .nullable()
    .optional()
}).strict()

export const updateContactSchema = contactSchema.partial()
