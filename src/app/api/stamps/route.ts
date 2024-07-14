import Stamp, { toStampArray } from "@/app/api-response-types/stamp";
import checkAttribute from "@/utils/check-attribute";
import { MongoClient } from "mongodb";
import { IsEmail, IsNotEmpty, Max, Min, validate, ValidateNested, ValidationArguments, ValidatorConstraintInterface } from "class-validator";
import { AtLeastOne } from "@/utils/validators/at-least-one";
import { plainToClass, plainToInstance } from "class-transformer";
import { PostBody } from "./classes"

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

export async function POST(request: Request) {
  if (process.env.MONGODB_URI !== undefined) {

    const body = plainToInstance(PostBody, JSON.parse(await request.text()))

    const validation_errors = await validate(body);
    if (validation_errors.length > 0) {
      return new Response(validation_errors.toString(), {
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