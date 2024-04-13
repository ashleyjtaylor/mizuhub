import contactRepository from './repository'
import { Contact, UpdateContact } from './schema'

const createContact = async (contact: Contact) => {
  return await contactRepository.createContact(contact)
}

const getContact = async (id: string) => {
  return await contactRepository.getContact(id)
}

const deleteContact = async (id: string) => {
  return await contactRepository.deleteContact(id)
}

const updateContact = async (id: string, data: UpdateContact) => {
  return await contactRepository.updateContact(id, data)
}

const listContacts = async (page: number) => {
  return await contactRepository.listContacts(page)
}

export default {
  getContact,
  createContact,
  deleteContact,
  updateContact,
  listContacts
}
