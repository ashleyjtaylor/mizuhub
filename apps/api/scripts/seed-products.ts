import fs from 'fs'
import path from 'path'
import { fakerEN_GB as faker } from '@faker-js/faker'

import { Product, productIdPrefix } from '../src/modules/products/schema'
import { createId } from '../src/utils/create-id'

import { exists, rand } from './seed-utils'

const generateImages = (count: number) => {
  const images: string[] = []
  for (let i = 0; i < count; ++i) { images.push(faker.image.url()) }
  return images
}

const generateFeatures = (count: number) => {
  const features: string[] = []
  for (let i = 0; i < count; ++i) { features.push(faker.lorem.paragraph({ min: 1, max: 1 })) }
  return features
}

const generateMetadata = (count: number) => {
  const metadata: { [key: string]: string | number | boolean } = {}
  for (let i = 0; i < count; ++i) { metadata[faker.word.sample()] = faker.word.sample() }
  return metadata
}

const data: Product[] = []

const count = Number(process.argv[2]) || 20

for (let i = 0; i < count; ++i) {
  const product: Product = {
    _id: createId(productIdPrefix),
    _created: Date.now(),
    _updated: Date.now(),
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price()),
    description: exists() ? faker.commerce.productDescription() : null,
    images: exists() ? generateImages(rand(8)) : [],
    features: exists() ? generateFeatures(rand(20)) : [],
    active: exists() ? faker.datatype.boolean() : null,
    shippable: exists() ? faker.datatype.boolean() : null,
    unit_label: exists() ? faker.science.unit().name : null,
    metadata: exists() ? generateMetadata(rand(20)) : null,
    dimensions: exists() ? {
      weight: Number((Math.random() * 100).toFixed(2)),
      length: Number((Math.random() * 100).toFixed(2)),
      width: Number((Math.random() * 100).toFixed(2)),
      height: Number((Math.random() * 100).toFixed(2))
    } : null
  }

  data.push(product)
}

fs.writeFileSync(path.join(__dirname, '../seed/products.json'), JSON.stringify(data, null, 2))

process.exit(0)
