import z, { object, string } from 'zod'

export type Contact = z.infer<typeof contactSchema>

const addressSchema = object({
  line1: string(),
  line2: string(),
  city: string(),
  state: string(),
  country: string(),
  postcode: string()
})

export const contactSchema = object({
  firstname: string().min(1).max(32),
  lastname: string().min(1).max(32).optional(),
  email: string().email().optional(),
  phone: string().optional(),
  description: string().max(255).optional(),
  address: addressSchema.optional(),
  shipping: addressSchema.optional()
})
