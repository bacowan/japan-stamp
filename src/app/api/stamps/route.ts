import Stamp, { toStampArray } from "@/app/api-response-types/stamp";
import { MongoClient } from "mongodb";

//export const dynamic = 'force-dynamic'; // static by default, unless reading the request
 
export async function GET(request: Request) {
  if (process.env.MONGODB_URI !== undefined) {
    const url = new URL(request.url);
    const latMin = Math.trunc(Number(url.searchParams.get("lat-min") ?? undefined));
    const latMax = Math.trunc(Number(url.searchParams.get("lat-max") ?? undefined));
    const lonMin = Math.trunc(Number(url.searchParams.get("lon-min") ?? undefined));
    const lonMax = Math.trunc(Number(url.searchParams.get("lon-max") ?? undefined));

    if (isNaN(latMin)) {
      return new Response("lat-min parameter is required", {
        status: 400
      });
    }
    else if (isNaN(latMax)) {
      return new Response("lat-max parameter is required", {
        status: 400
      });
    }
    else if (isNaN(lonMin)) {
      return new Response("lon-min parameter is required", {
        status: 400
      });
    }
    else if (isNaN(lonMax)) {
      return new Response("lon-max parameter is required", {
        status: 400
      });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    try { 
      console.log([
        [latMin - 0.5, lonMin - 0.5],
        [latMin - 0.5, lonMax - 0.5],
        [latMax + 0.5, lonMin + 0.5],
        [latMax + 0.5, lonMax + 0.5]])
      await client.connect(); 
      const database = client.db('japan_stamp');
      const collection = database.collection('stamps');
      const allData = await collection.find({
        location: {
          $geoWithin: {
            $geometry: {
              type: "Polygon",
              coordinates: [[
                [lonMin - 0.5, latMin - 0.5],
                [lonMin - 0.5, latMax - 0.5],
                [lonMax + 0.5, latMax + 0.5],
                [lonMax + 0.5, latMin + 0.5],
                [lonMin - 0.5, latMin - 0.5]
              ]]
            }
          }
        }
      }).toArray();

      const asStamps = toStampArray(allData);


      /*const ret: Stamp[] = allData.map<Stamp>(d => ({
        id: d._id.toString(),
        name: d.name,
        location: {
          lat: d.location.coordinates[1].$numberDecimal,
          lon: d.location.coordinates[0].$numberDecimal
        },
        imageUrl: d["image-url"],
        description: d.description
      }));*/
      console.log(asStamps);
      return new Response(JSON.stringify(asStamps));
    } finally {
      await client.close(); 
    }
  }
}