import { AtLeastOne } from "@/utils/validators/at-least-one";
import { plainToInstance } from "class-transformer";
import { IsNotEmpty, Max, Min, validate, ValidateNested, ValidationError } from "class-validator";
import { MongoClient } from "mongodb";
import { NextRequest } from "next/server";
import { NextApiRequest } from "next";
import { describe } from "node:test";
import PersistentFile from "formidable/PersistentFile";
export const config = {
    api: {
      bodyParser: false,
    },
  };
class LangText {
    @AtLeastOne(["english", "japanese"], {
      message: "Either english or japanese is required"
    }) // class level validator
    english?: string;
    japanese?: string;
  }
  
  class Location {
    @Min(-90)
    @Max(90)
    lat!: number;
  
    @Min(-180)
    @Max(180)
    lon!: number;
  }
  
  interface PostFields {
    name: LangText,
    location: Location,
    description: LangText
  }

type ParsedForm = {
    fields: PostFields,
    image: File
} | string;

async function parseForm(request: Request): Promise<ParsedForm> {
    const formData = await request.formData();

    const nameString = formData.get("name");
    if (typeof nameString !== 'string' || nameString === null) {
        return "name not supplied correctly";
    }
    const name = plainToInstance(LangText, JSON.parse(nameString));
    const nameErrors = await validate(name);
    if (nameErrors.length > 0) {
        return nameErrors.join("; ");
    }

    const locationString = formData.get("location");
    if (typeof locationString !== 'string' || locationString === null) {
        return "location not supplied correctly";
    }
    const location = plainToInstance(Location, JSON.parse(locationString));
    const locationErrors = await validate(name);
    if (locationErrors.length > 0) {
        return locationErrors.join("; ");
    }

    const descriptionString = formData.get("description");
    if (typeof descriptionString !== 'string' || descriptionString === null) {
        return "description not supplied correctly";
    }
    const description = plainToInstance(LangText, JSON.parse(descriptionString));
    const descriptionErrors = await validate(description);
    if (descriptionErrors.length > 0) {
        return descriptionErrors.join("; ");
    }

    const image = formData.get("image");
    if (image instanceof File) {
        return {
            fields: {
                name: name,
                location: location,
                description: description
            },
            image: image
        }
    }
    else {
        return "image was not a proper file";
    }
}

export default async function postRequest(request: Request) {
    if (process.env.MONGODB_URI !== undefined) {
        const formData = await parseForm(request);
        if (typeof formData === 'string') {
            return new Response(formData, {
                status: 400
            });
        }
        else {
            const client = new MongoClient(process.env.MONGODB_URI);
            try {
                await client.connect(); 
                const database = client.db('japan_stamp');
                const collection = database.collection('stamps');
                const result = await collection.insertOne(formData.fields);
                // TODO: insert image and url
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