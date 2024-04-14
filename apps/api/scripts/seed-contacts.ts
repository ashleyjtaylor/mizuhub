import fs from 'fs'
import path from 'path'
import { fakerEN_GB as faker } from '@faker-js/faker'

import { Contact } from '../src/modules/contacts/schema'

interface IContact extends Contact {
  _created: number;
}

const data: IContact[] = []

const count = Number(process.argv[2]) || 20

for (let i = 0; i < count; ++i) {
  const contact: IContact = {
    _created: Date.now(),
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    description: faker.person.bio(),
    address: {
      line1: faker.location.buildingNumber(),
      line2: faker.location.streetAddress({ useFullAddress: true }),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      postcode: faker.location.zipCode()
    }
  }

  data.push(contact)
}

fs.writeFileSync(path.join(__dirname, '../seed/contacts.json'), JSON.stringify(data, null, 2))

process.exit(0)
