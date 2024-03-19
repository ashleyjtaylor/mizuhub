import { MongoClient } from 'mongodb'

const connect = async () => {
  const client = new MongoClient(process.env.MONGO_URI ?? '')

  const connection = await client.connect()

  return connection?.db(process.env.MONGO_DBNAME)
}

export default connect
