import { Router, Request, Response } from 'express'

import contactService from './service'
import { contactSchema } from './schema'

import { validate, validateId, validateSearch } from '../../middlewares/validation'
import { asyncFn } from '../../middlewares/asyncHandler'

import { logger } from '../../utils/logger'

const router = Router()
const contactLogger = logger.child({ service: 'contact' })

router.get('/', validateSearch, asyncFn(async (req: Request, res: Response) => {
  const page = Number(req.query.p || 1)

  const results = await contactService.listContacts(page)

  contactLogger.info({ results }, `Contact search - page: ${page}`)

  res.json(results)
}))

router.get('/:id', validateId, asyncFn(async (req: Request, res: Response) => {
  const contact = await contactService.getContact(req.params.id as string)

  contactLogger.info({ contact }, `Contact fetched: ${req.params.id}`)

  res.json(contact)
}))

router.post('/', validate(contactSchema), asyncFn(async (req: Request, res: Response) => {
  const contact = await contactService.createContact(req.body)

  contactLogger.info({ contact }, 'Contact created')

  res.json(contact)
}))

router.delete('/:id', validateId, asyncFn(async (req: Request, res: Response) => {
  const result = await contactService.deleteContact(req.params.id as string)

  contactLogger.info({ result }, `Contact deleted: ${req.params.id}`)

  res.json(result)
}))

router.put('/:id', validateId, validate(contactSchema), asyncFn(async (req: Request, res: Response) => {
  const result = await contactService.updateContact(req.params.id as string, req.body)

  contactLogger.info({ result }, `Contact upadted: ${req.params.id}`)

  res.json(result)
}))

export default router
