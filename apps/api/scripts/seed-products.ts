import fs from 'fs'
import path from 'path'
import { fakerEN_GB as faker } from '@faker-js/faker'

import { Product } from '../src/modules/products/schema'

const rand = (max: number) => Math.floor(Math.random() * max)

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

const data: Omit<Product, '_id'>[] = []

const count = Number(process.argv[2]) || 20

for (let i = 0; i < count; ++i) {
  const product: Omit<Product, '_id'> = {
    _created: Date.now(),
    _updated: Date.now(),
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price()),
    description: faker.commerce.productDescription(),
    images: generateImages(rand(8)),
    features: generateFeatures(rand(20)),
    active: faker.datatype.boolean(),
    shippable: faker.datatype.boolean(),
    unit_label: faker.science.unit().name,
    metadata: generateMetadata(rand(20)),
    dimensions: {
      weight: Number((Math.random() * 100).toFixed(2)),
      length: Number((Math.random() * 100).toFixed(2)),
      width: Number((Math.random() * 100).toFixed(2)),
      height: Number((Math.random() * 100).toFixed(2))
    }
  }

  data.push(product)
}

fs.writeFileSync(path.join(__dirname, '../seed/products.json'), JSON.stringify(data, null, 2))

process.exit(0)
