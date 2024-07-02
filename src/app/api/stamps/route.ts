import Stamp, { toStampArray } from "@/app/api-response-types/stamp";
import checkAttribute from "@/utils/check-attribute";
import { MongoClient } from "mongodb";

// setting it to dynamic makes it get a new response each time. Otherwise it caches.
// TODO: Look into how the caching works
//export const dynamic = 'force-dynamic'; // static by default, unless reading the request

interface GetParams {
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
}

function validateGet(url: string): (GetParams | string) {
  const urlObj = new URL(url);
  const latMin = Math.trunc(Number(urlObj.searchParams.get("lat-min") ?? undefined));
  const latMax = Math.trunc(Number(urlObj.searchParams.get("lat-max") ?? undefined));
  const lonMin = Math.trunc(Number(urlObj.searchParams.get("lon-min") ?? undefined));
  const lonMax = Math.trunc(Number(urlObj.searchParams.get("lon-max") ?? undefined));

  if (isNaN(latMin)) {
    return "lat-min parameter is required";
  }
  else if (isNaN(latMax)) {
    return "lat-max parameter is required";
  }
  else if (isNaN(lonMin)) {
    return "lon-min parameter is required";
  }
  else if (isNaN(lonMax)) {
    return "lon-max parameter is required";
  }
  else {
    return { latMin, latMax, lonMin, lonMax };
  }
}

export async function GET(request: Request) {
  if (process.env.MONGODB_URI !== undefined) {

    const params = validateGet(request.url);
    if (typeof params === 'string') {
      return new Response(params, {
        status: 400
      });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    try {
      await client.connect(); 
      const database = client.db('japan_stamp');
      const collection = database.collection('stamps');
      const allData = await collection.find({
        location: {
          $geoWithin: {
            $geometry: {
              type: "Polygon",
              coordinates: [[
                [params.lonMin - 0.5, params.latMin - 0.5],
                [params.lonMin - 0.5, params.latMax - 0.5],
                [params.lonMax + 0.5, params.latMax + 0.5],
                [params.lonMax + 0.5, params.latMin + 0.5],
                [params.lonMin - 0.5, params.latMin - 0.5]
              ]]
            }
          }
        }
      }).toArray();

      const asStamps = toStampArray(allData);

      console.log(asStamps);
      return new Response(
        JSON.stringify(asStamps),
        {
          status: 200,
          headers: {
            'Cache-Control': 'max-age=3600', // TODO: put this in a better spot
          }
        });
    }
    catch (e) {
      return new Response(
        JSON.stringify({error: e}),
        {
          status: 500
        }
      );
    }
    finally {
      await client.close(); 
    }
  }
  else {
    return new Response(
      JSON.stringify({error: "The server has been incorrectly configured"}),
      {
        status: 500
      }
    );
  }
}

interface PostBody {
  name: {
      english?: string,
      japanese?: string
  },
  location: {
      lat: number,
      lon: number
  },
  imageBase64: string,
  description: {
      english?: string,
      japanese?: string
  }
}

function validatePostBody(body: string): (PostBody | string) {
  const bodyObj = JSON.parse(body);
  if (!("name" in bodyObj)) {
    return "name is required";
  }
  else if (!("english" in bodyObj.name) && !("japanese" in bodyObj.name)) {
    return "either name.english or name.japanese is required";
  }
  else if (!("location" in bodyObj)) {
    return "location is required";
  }
  else if (!("lat" in bodyObj.location)) {
    return "location.lat is required";
  }
  else if (!("lon" in bodyObj.location)) {
    return "location.lon is required";
  }
  else if (!("imageBase64" in bodyObj)) {
    return "imageBase64 is required";
  }
  else if (!("description" in bodyObj)) {
    return "description is required";
  }
  else if (!("english" in bodyObj.description) && !("japanese" in bodyObj.description)) {
    return "either description.english or description.japanese is required";
  }
  else {
    return {
      name: {
        english: bodyObj.name.english,
        japanese: bodyObj.name.japanese
      },
      location: {
          lat: bodyObj.lat,
          lon: bodyObj.lon
      },
      imageBase64: bodyObj.imageBase64,
      description: {
          english: bodyObj.description.english,
          japanese: bodyObj.description.japanese
      }
    }
  }
}

export async function POST(request: Request) {
  if (process.env.MONGODB_URI !== undefined) {

    const body = validatePostBody(await request.text());
    if (typeof body === 'string') {
      return new Response(body, {
        status: 400
      });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    try {
      await client.connect(); 
      const database = client.db('japan_stamp');
      const collection = database.collection('stamps');
      const result = await collection.insertOne(body);
      return new Response(result.insertedId.toString(),
      {
        status: 200
      })
    }
    catch (e) {
      return new Response(
        JSON.stringify({error: e}),
        {
          status: 500
        }
      );
    }
    finally {
      await client.close(); 
    }
  }
  else {
    return new Response(
      JSON.stringify({error: "The server has been incorrectly configured"}),
      {
        status: 500
      }
    );
  }
}