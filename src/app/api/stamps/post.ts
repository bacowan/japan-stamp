import { ClientSession, MongoClient, ObjectId, TransactionOptions } from "mongodb";
import { NextRequest } from "next/server";
import { NextApiRequest } from "next";
import { describe } from "node:test";
import PersistentFile from "formidable/PersistentFile";
import { ref, uploadBytes, UploadResult } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { fileTypeFromBlob } from "file-type";
import sharp from "sharp";
import { auth } from "../../../utils/firebase-init-server";
import { Stamp } from "@/app/database-structure/stamp";
import { isLocaleText, LocaleText } from "@/utils/translation/locale-text";
import { Result } from "@/utils/Result";
import validateUser from "@/utils/header-validation";
import { prepareImageForUpload } from "../common";
import { getStorage } from "firebase-admin/storage";


function isLocation(input: any): input is GeoLocation {
    return typeof input.lat === "number" && typeof input.lon === "number";
}

interface GeoLocation {
    lat: number,
    lon: number
}

interface PostFields {
    name: LocaleText,
    location: GeoLocation,
    description: LocaleText
}

type ParsedForm = {
    fields: PostFields,
    image: File
};


async function parseForm(request: Request): Promise<Result<ParsedForm>> {
    const formData = await request.formData();

    if (Array.from(formData.keys()).some(k => !["name", "location", "description"].includes(k))) {
        return {
            type: "failure",
            message: "extra form field was given"
        }
    }

    const nameString = formData.get("name");
    if (typeof nameString !== 'string' || nameString === null) {
        return {
            type: "failure",
            message: "name not supplied correctly"
        }
    }
    const name = JSON.parse(nameString);
    if (!isLocaleText(name)) {
        return {
            type: "failure",
            message: "name requires a valid language"
        }
    }

    const locationString = formData.get("location");
    if (typeof locationString !== 'string' || locationString === null) {
        return {
            type: "failure",
            message: "location not supplied correctly"
        }
    }

    const location = JSON.parse(locationString);
    if (!isLocation(location)) {
        return {
            type: "failure",
            message: "location not supplied correctly"
        }
    }

    const descriptionString = formData.get("description");
    if (typeof descriptionString !== 'string' || descriptionString === null) {
        return {
            type: "failure",
            message: "description not supplied correctly"
        }
    }
    const description = JSON.parse(descriptionString);
    if (!isLocaleText(description)) {
        return {
            type: "failure",
            message: "name requires a valid language"
        }
    }

    const image = formData.get("image");
    if (image instanceof File) {
        return {
            type: "success",
            value: {
                fields: {
                    name: name,
                    location: location,
                    description: description
                },
                image: image
            }
        }
    }
    else {
        return {
            type: "failure",
            message: "image was not a proper file"
        }
    }
}

async function uploadDatabaseData(fields: PostFields, imagePath: string, dbPath: string, userId: string, client: MongoClient, session: ClientSession): Promise<string> {
    const database = client.db('japan_stamp');
    const collection = database.collection('stamps');
    const createdOn = new Date();
    const dataToWrite: Stamp = {
        name: fields.name,
        location: {
            coordinates: [fields.location.lon, fields.location.lat],
            type: "Point"
        },
        description: fields.description,
        "image-path": imagePath,
        "updated-by": userId,
        "created-by": userId,
        "updated-on": createdOn,
        "created-on": createdOn
    }
    const result = await collection.insertOne(dataToWrite, { session });
    return result.insertedId.toString()
}

async function undoDatabaseUpload(id: string, dbPath: string) {
    const client = new MongoClient(dbPath);
    try {
        await client.connect();
        const database = client.db('japan_stamp');
        const collection = database.collection('stamps');
        await collection.deleteOne({_id: new ObjectId(id)});
    }
    finally {
        await client.close();
    }
}

export default async function postRequest(request: Request) {
    if (process.env.MONGODB_URI === undefined) {
        return new Response(
            JSON.stringify({ error: "The server has been incorrectly configured" }),
            {
                status: 500
            }
        );
    }
    
    const validatedUser = await validateUser(request.headers);

    if (validatedUser.type === "failure") {
        return new Response(
            JSON.stringify({ error: validatedUser.message }),
            {
                status: 401
            }
        );
    }

    const formData = await parseForm(request);
    if (formData.type === "failure") {
        return new Response(formData.message, {
            status: 400
        });
    }

    const image = await prepareImageForUpload(formData.value.image);
    if (image.type === "failure") {
        return new Response(
            JSON.stringify({ error: image.message }),
            {
                status: 400
            }
        );
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const session = client.startSession();

    const transactionOptions: TransactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority', j: true }
    };

    try {
        const mongodbUri = process.env.MONGODB_URI;
        await session.withTransaction(async () => {
            const imageId = uuidv4();
            const imagePath = 'images/stamps/' + imageId + ".jpg";
            const uploadedId = await uploadDatabaseData(formData.value.fields, imagePath, mongodbUri, validatedUser.value, client, session);
        
            const bucket = getStorage().bucket();
            await bucket.file(imagePath).save(image.value);

            return new Response(
                JSON.stringify({ id: uploadedId }),
                { status: 200 }
            )
        }, transactionOptions);
    }
    catch (e) {
        return new Response(
            JSON.stringify({ error: "Failed to upload data" }),
            {
                status: 400
            }
        );
    }
    finally {
        await session.endSession();
        await client.close();
    }

    
    
}