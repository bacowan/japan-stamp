import Stamp from "@/database/collection_types/stamp";
import { MongoClient } from "mongodb";
import StampCard from "./components/stamp-card";
import { stampListPageFlag } from "../../flags";
import { headers } from "next/headers";

const mongodbClient = process.env.MONGODB_URI === undefined
  ? null
  : new MongoClient(process.env.MONGODB_URI);

export default async function Home() {
  if (!await stampListPageFlag()) {
    return <div>Coming soon</div>
  }

  if (!mongodbClient) {
    throw "Could not connect to database";
  }

  const country = (await headers()).get('x-country') || 'unknown';

  const database = mongodbClient.db('JapanStamp');
  const collection = database.collection<Stamp>('Stamps');
  const stampsArray = await collection.find().toArray();
  const stampCards = stampsArray
    .map(s => ({
      id: s._id.toString(),
      name: s.name,
      description: s.description,
      lat: s.location[1],
      lon: s.location[0],
      image_url: s.image_url
    }))
    .map(s => <StampCard key={s.id} name={s.name} image_url={s.image_url} id={s.id}/>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {`country: ${country}`}
      {stampCards}
    </div>
  );
}
