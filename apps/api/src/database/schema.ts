import { ObjectId } from 'mongodb'
import { number, z } from 'zod'

export const databaseSchema = z.object({
  _id: z.instanceof(ObjectId),
  _created: number(),
  _updated: number()
})
