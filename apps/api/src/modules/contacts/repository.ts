import { db } from '@/database/connection'
import { list } from '@/database/utils'

import { createId } from '@/utils/create-id'
import { NotFoundError } from '@/errors/NotFound'

import { Contact, CreateContact, UpdateContact, contactIdPrefix, contactObjectName } from './schema'

const SEARCH_RESULTS_PER_PAGE = 10

const getById = async (id: string) => {
  return await db.contacts.findOne({ _id: id })
}

const getContact = async (id: string) => {
  const contact =  await getById(id)

  if (!contact) {
    throw new NotFoundError('Contact does not exist')
  }

  return contact
}

const createContact = async (contact: CreateContact) => {
  const result = await db.contacts.insertOne({
    ...contact,
    _id: createId(contactIdPrefix),
    _created: Date.now(),
    _updated: Date.now(),
    object: contactObjectName
  })

  return await db.contacts.findOne({ _id: result.insertedId })
}

const deleteContact = async (id: string) => {
  const contact = await getById(id)

  if (contact) {
    const result = await db.contacts.deleteOne({ _id: contact._id })

    return {
      _id: id,
      acknowledged: result.acknowledged,
      deletedCount: result.deletedCount
    }
  }

  return contact
}

const updateContact = async (id: string, data: UpdateContact) => {
  await getContact(id)

  return await db.contacts.findOneAndUpdate(
    { _id: id },
    { $set: { ...data, _updated: Date.now() } },
    { returnDocument: 'after' }
  )
}

const listContacts = async (page: number) => await list<Contact>(db.contacts, page, SEARCH_RESULTS_PER_PAGE)

export default {
  getContact,
  createContact,
  deleteContact,
  updateContact,
  listContacts
}
