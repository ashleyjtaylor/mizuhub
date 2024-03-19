import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGO_URL ?? '')

const connect = async () => {
  const connection = await client.connect()

  return {
    client: connection,
    db: connection?.db(process.env.MONGO_DB_NAME)
  }
}

export default connect
