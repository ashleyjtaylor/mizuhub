import { ObjectId } from 'mongodb'

import { db } from '../../database/connection'
import { Contact, UpdateContact } from './schema'

import { NotFoundError } from '../../errors/NotFound'

const CONTACTS_SEARCH_PER_PAGE = 2

const getById = async (id: string) => {
  return await db.contacts.findOne({ _id: new ObjectId(id) })
}

const getContact = async (id: string) => {
  const contact =  await getById(id)

  if (!contact) {
    throw new NotFoundError('Contact does not exist')
  }

  return contact
}

const createContact = async (contact: Contact) => {
  const result = await db.contacts.insertOne({ ...contact, _created: new Date().toISOString() })

  return await db.contacts.findOne({ _id: result.insertedId })
}

const deleteContact = async (id: string) => {
  const contact = await getContact(id)

  const result = await db.contacts.deleteOne({ _id: contact._id })

  return { ...result, _id: id }
}

const updateContact = async (id: string, data: UpdateContact) => {
  await getContact(id)

  return await db.contacts.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...data, _updated: new Date().toISOString() } },
    { returnDocument: 'after' }
  )
}

const listContacts = async (page: number) => {
  if (page === 0) {
    return { results: [], size: 0, total: 0, totalPages: 0, hasMore: false, page }
  }

  const skip = (page - 1) * CONTACTS_SEARCH_PER_PAGE

  const search = db.contacts
    .find()
    .sort({ _created: 1 })
    .skip(skip)
    .limit(CONTACTS_SEARCH_PER_PAGE)

  const total = await db.contacts.countDocuments()
  const results = await search.toArray()
  const hasMore = total > (skip + results.length)
  const totalPages = Math.ceil(total / CONTACTS_SEARCH_PER_PAGE)

  return {
    results,
    size: results.length,
    page,
    total,
    totalPages,
    hasMore
  }
}

export default {
  getById,
  getContact,
  createContact,
  deleteContact,
  updateContact,
  listContacts
}
