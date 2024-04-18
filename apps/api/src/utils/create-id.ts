import { customAlphabet } from 'nanoid'

const CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const createId = (prefix: string, len: number = 24) => `${prefix}_${customAlphabet(CHARACTERS)(len)}`
