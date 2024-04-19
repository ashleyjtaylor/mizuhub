import { number, string, z } from 'zod'

export const databaseSchema = z.object({
  _id: string(),
  _created: number(),
  _updated: number(),
  object: string()
})

// e.g. con_1234567890abcdefghijklmn
export const ID_REGEX = /^([a-z]{3})_[A-Za-z0-9]{24}$/
