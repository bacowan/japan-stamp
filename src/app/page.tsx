import Image from "next/image";
import { MongoClient } from "mongodb";

const mongodbClient = process.env.MONGODB_CONNECTION_STRING === undefined
  ? null
  : new MongoClient(process.env.MONGODB_CONNECTION_STRING);

export default async function Home() {
  if (!mongodbClient) {
    throw "Could not connect to database";
  }

  const database = mongodbClient.db('JapanStamp');
  const stamps = database.collection('Stamps');
  const allStamps = await stamps.findOne();

  return (
    <div>
      {JSON.stringify(allStamps)}
    </div>
  );
}
