import { number, string, z } from 'zod'

export const databaseSchema = z.object({
  _id: string(),
  _created: number(),
  _updated: number(),
  object: string()
})
