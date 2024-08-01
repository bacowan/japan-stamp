import { PrefectureLocations } from "@/utils/constant-data";
import PageClient from "./page-client";
import { getTranslations } from "@/utils/translation/translate";
import { MongoClient } from "mongodb";

function isLocation(input: any): input is {location: {coordinates: number[]}} {
  return Array.isArray(input.location.coordinates)
    && input.location.coordinates.length === 2
    && typeof input.location.coordinates[0] === "number"
    && typeof input.location.coordinates[1] === "number";
}

async function LoadHeatmapData(): Promise<{lat: number, lon: number}[]> {
  if (process.env.MONGODB_URI) {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
      await client.connect();
      const database = client.db('japan_stamp');
      const collection = database.collection('stamps');
      const locationsCursor = await collection.find({}).project({location: 1, _id: 0});
      const locations = await locationsCursor.toArray();

      return locations.map(l => {
        if (isLocation(l)) {
          return {lat: l.location.coordinates[1], lon: l.location.coordinates[0]};
        }
        else {
          return null;
        }
      }).filter(l => l !== null);
    }
    catch (e) {
      // TODO: Logging
      return [];
    }
    finally {
      client.close();
    }
  }
  else {
    // TODO: Logging
    return [];
  }
}

export default async function Home({ params }: { params: { lang: string } }) {
  //const prefectureData = await LoadPrefectureData();
  const heatmapData = await LoadHeatmapData();

  return <PageClient
    heatmapData={heatmapData}
    translations={(await getTranslations(params.lang))["common"]}
    lang={params.lang}/>
}
