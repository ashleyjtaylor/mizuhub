#!/bin/bash

export $(grep -v '^#' .env | xargs)

mkdir -p seed

seed_contacts() {
  npx ts-node scripts/seed-contacts.ts $1
  mongoimport --uri ${MONGO_URL} --collection contacts --type json --file seed/contacts.json --jsonArray --drop
}

seed_contacts 20

exit 0