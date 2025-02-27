import { MongoClient } from "mongodb";
import { stampListPageFlag, forceJpFlag } from "../../flags";
import { headers } from "next/headers";
import { StampResultsWithLocation } from "./components/stamp-results-with-location";
import { StampResults } from "./components/stamp-results";
import StampValue from "@/database/value_types/stampValue";
import Stamp from "@/database/database_types/stamp";
import mongodb_client from "@/database/mongodb_client";

export default async function Home() {
  if (!await stampListPageFlag()) {
    return <div>Coming soon</div>
  }

  if (!mongodb_client) {
    throw "Could not connect to database";
  }
  
  const database = mongodb_client.db('JapanStamp');
  const collection = database.collection<Stamp>('Stamps');
  const stampsArray = await collection.find().toArray();
  const stampCards = stampsArray
  .map<StampValue>(s => ({
    key: s._id.toString(),
    id: s._id.toString(),
    name: s.name,
    image_url: s.image_url,
    lon: +s.location[0].toString(),
    lat: +s.location[1].toString()
  }));
  
  const country = (await headers()).get('x-country') || 'unknown';

  if (country === 'JP' || await forceJpFlag()) {
    return <StampResultsWithLocation stamps={stampCards}/>
  }
  else {
    return <StampResults stamps={stampCards}/>
  }
}
