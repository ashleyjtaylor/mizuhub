import fs from 'fs'
import path from 'path'
import { fakerEN_GB as faker } from '@faker-js/faker'

import { Contact, contactIdPrefix, contactObjectName } from '../src/modules/contacts/schema'
import { createId } from '../src/utils/create-id'

import { exists } from './seed-utils'

const data: Contact[] = []

const count = Number(process.argv[2]) || 20

for (let i = 0; i < count; ++i) {
  const contact: Contact= {
    _id: createId(contactIdPrefix),
    _created: Date.now(),
    _updated: Date.now(),
    object: contactObjectName,
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: exists() ? faker.internet.email() : null,
    phone: exists() ? faker.phone.number() : null,
    description: exists() ? faker.person.bio() : null,
    address: exists() ? {
      line1: faker.location.streetAddress({ useFullAddress: true }),
      line2: exists() ? faker.location.secondaryAddress() : null,
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      postcode: faker.location.zipCode()
    } : null,
    shipping: exists() ? {
      line1: faker.location.streetAddress({ useFullAddress: true }),
      line2: exists() ? faker.location.secondaryAddress() : null,
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      postcode: faker.location.zipCode()
    } : null
  }

  data.push(contact)
}

fs.writeFileSync(path.join(__dirname, '../seed/contacts.json'), JSON.stringify(data, null, 2))

process.exit(0)
