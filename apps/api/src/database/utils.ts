import { type Collection, type Document } from 'mongodb'

export const list = async <T extends Document>(collection: Collection<T>, page: number, resultsPerPage: number = 10) => {
  if (page === 0) {
    return {
      page,
      results: [],
      size: 0,
      total: 0,
      totalPages: 0,
      hasMore: false
    }
  }

  const skip = (page - 1) * resultsPerPage

  const search = collection
    .find()
    .sort({ _created: 1 })
    .skip(skip)
    .limit(resultsPerPage)

  const total = await collection.countDocuments()
  const results = await search.toArray()
  const hasMore = total > (skip + results.length)
  const totalPages = Math.ceil(total / resultsPerPage)
  const nextPage = hasMore ? page + 1 : undefined
  const prevPage = page !== 1 ? page - 1 : undefined

  return {
    results,
    size: results.length,
    page,
    total,
    totalPages,
    hasMore,
    nextPage,
    prevPage
  }
}
