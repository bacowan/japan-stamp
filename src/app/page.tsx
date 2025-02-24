import Stamp from "@/database/collection_types/stamp";
import { MongoClient } from "mongodb";
import StampCard from "./components/stamp-card";

const mongodbClient = process.env.MONGODB_CONNECTION_STRING === undefined
  ? null
  : new MongoClient(process.env.MONGODB_CONNECTION_STRING);

export default async function Home() {
  if (!mongodbClient) {
    throw "Could not connect to database";
  }

  const database = mongodbClient.db('JapanStamp');
  const collection = database.collection<Stamp>('Stamps');
  const stampsArray = await collection.find().toArray();
  const stampCards = stampsArray
    .map(s => ({
      _id: s._id.toString(),
      name: s.name,
      description: s.description,
      location: s.location,
      image_url: s.image_url
    }))
    .map(s => <StampCard key={s._id.toString()} stamp={s}/>);


  return (
    <div>
      {stampCards}
    </div>
  );
}
