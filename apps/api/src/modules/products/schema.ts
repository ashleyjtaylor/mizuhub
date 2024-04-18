import z, { boolean, number, object, string, union, record, array } from 'zod'

import { databaseSchema } from '@/database/schema'

export type Product = z.infer<typeof productSchema>
export type CreateProduct = z.infer<typeof createProductSchema>
export type UpdateProduct = z.infer<typeof updateProductSchema>

export const productIdPrefix = 'pro'
export const productObjectName = 'product'

const metadataKeySchema = string().max(32, {
  message: 'Metadata key must not exceed 32 characters'
})

const metadataValueSchema = union([
  number(),
  boolean(),
  string().max(300, {
    message: 'Metadata value must not exceed 32 characters'
  })
])

const metadataSchema = record(metadataKeySchema, metadataValueSchema).refine(obj => Object.keys(obj).length <= 20, {
  message: 'Metadata must not exceed 20 items'
})

const dimensionsItemSchema = number().nonnegative().finite()

const dimensionsSchema = object({
  width: dimensionsItemSchema,
  height: dimensionsItemSchema,
  length: dimensionsItemSchema,
  weight: dimensionsItemSchema
})

export const createProductSchema = object({
  name: string()
    .min(1)
    .max(32),
  price: number()
    .int()
    .nonnegative()
    .finite()
    .multipleOf(1)
    .max(1000000000),
  description: string()
    .max(300)
    .nullable()
    .optional(),
  images: array(string())
    .max(8)
    .optional(),
  features: array(string())
    .max(20)
    .optional(),
  active: boolean()
    .nullable()
    .optional(),
  shippable: boolean()
    .nullable()
    .optional(),
  metadata: metadataSchema
    .nullable()
    .optional(),
  dimensions: dimensionsSchema
    .nullable()
    .optional(),
  unit_label: string()
    .max(16)
    .nullable()
    .optional()
}).strict()

export const productSchema = databaseSchema.merge(createProductSchema)
export const updateProductSchema = createProductSchema.partial()
