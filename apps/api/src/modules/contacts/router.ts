import { Router, Request, Response } from 'express'

import { logger } from '@/utils/logger'
import { asyncFn } from '@/middlewares/async-handler'
import { validateId, validateBody, validateListQueryParams } from '@/middlewares/validation'

import contactService from './service'
import { CreateContact, UpdateContact } from './schema'
import { validateCreateContact, validateUpdateContact } from './validator'

const router = Router()
const contactLogger = logger.child({ service: 'contact' })

router.get('/', validateListQueryParams, asyncFn(async (req: Request, res: Response) => {
  const page = Number(req.query.p || 1)

  const results = await contactService.listContacts(page)

  contactLogger.info({ results }, `Contact list - page: ${page}`)

  res.json(results)
}))

router.get('/:id', validateId, asyncFn(async (req: Request, res: Response) => {
  const contact = await contactService.getContact(req.params.id as string)

  contactLogger.info({ contact }, `Contact fetched: ${req.params.id}`)

  res.json(contact)
}))

router.post('/', validateCreateContact, asyncFn(async (req: Request, res: Response) => {
  const data: CreateContact = {
    firstname: req.body.firstname,
    lastname: req.body.lastname ?? null,
    email: req.body.email ?? null,
    phone: req.body.phone ?? null,
    description: req.body.description ?? null,
    address: req.body.address ?? null,
    shipping: req.body.shipping ?? null
  }

  const contact = await contactService.createContact(data)

  contactLogger.info({ contact }, 'Contact created')

  res.status(201).json(contact)
}))

router.delete('/:id', validateId, asyncFn(async (req: Request, res: Response) => {
  const result = await contactService.deleteContact(req.params.id as string)

  contactLogger.info({ result }, `Contact deleted: ${req.params.id}`)

  const statusCode = result ? 200 : 204
  res.status(statusCode).json(result)
}))

router.patch('/:id', validateId, validateBody, validateUpdateContact, asyncFn(async (req: Request, res: Response) => {
  const data: UpdateContact = req.body

  const result = await contactService.updateContact(req.params.id as string, data)

  contactLogger.info({ result }, `Contact upadted: ${req.params.id}`)

  res.json(result)
}))

export default router
