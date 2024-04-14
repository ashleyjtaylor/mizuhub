import z, { boolean, number, object, string } from 'zod'

export type Product = z.infer<typeof productSchema>

export const productSchema = object({
  name: string().min(1).max(32),
  price: number().nonnegative(),
  description: string().max(255).optional(),
  active: boolean().default(false).optional(),
  shippable: boolean().default(false).optional()
}).strict()
