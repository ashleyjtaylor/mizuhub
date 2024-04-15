import z, { boolean, number, object, string, union } from 'zod'

export type Product = z.infer<typeof productSchema>


const dimensionsItemSchema = z.number().nonnegative().finite()

const metadataKeySchema = z.string().max(32, {
  message: 'Metadata key must not exceed 32 characters'
})

const metadataValueSchema = union([
  number(),
  boolean(),
  string().max(300, {
    message: 'Metadata value must not exceed 32 characters'
  })
])

const metadataSchema = z.record(metadataKeySchema, metadataValueSchema).refine(obj => Object.keys(obj).length <= 20, {
  message: 'Metadata must not exceed 20 items'
})

const dimensionsSchema = object({
  width: dimensionsItemSchema,
  height: dimensionsItemSchema,
  length: dimensionsItemSchema,
  weight: dimensionsItemSchema
})

export const productSchema = object({
  name: string().min(1).max(32),
  price: number().int().nonnegative().finite().multipleOf(1).max(1000000000),
  description: string().max(300).nullable().optional(),
  active: boolean().optional(),
  shippable: boolean().default(false).optional(),
  metadata: metadataSchema.nullable().optional(),
  dimensions: dimensionsSchema.nullable().optional()
}).strict()
