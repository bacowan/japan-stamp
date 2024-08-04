import validateUser from "@/utils/header-validation";
import { v4 as uuidv4 } from 'uuid';
import { Result } from "@/utils/Result";
import { isLocaleText, LocaleText } from "@/utils/translation/locale-text";
import { prepareImageForUpload } from "../common";
import { ClientSession, MongoClient, ObjectId, TransactionOptions } from "mongodb";
import { getStorage } from "firebase-admin/storage";

function isLocation(input: any): input is GeoLocation {
    return typeof input.lat === "number" && typeof input.lon === "number";
}

interface GeoLocation {
    lat: number,
    lon: number
}

interface PostFields {
    name?: LocaleText,
    location?: GeoLocation,
    description?: LocaleText
}

type ParsedForm = {
    fields: PostFields,
    image?: File
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
    let name: LocaleText | undefined;
    if (nameString !== null && typeof nameString !== 'string') {
        return {
            type: "failure",
            message: "name not supplied correctly"
        }
    }
    else if (nameString !== null) {
        name = JSON.parse(nameString);
        if (!isLocaleText(name)) {
            return {
                type: "failure",
                message: "name requires a valid language"
            }
        }
    }

    const locationString = formData.get("location");
    let location: GeoLocation | undefined;
    if (locationString !== null && typeof locationString !== 'string') {
        return {
            type: "failure",
            message: "location not supplied correctly"
        }
    }
    else if (locationString !== null) {
        location = JSON.parse(locationString);
        if (!isLocation(location)) {
            return {
                type: "failure",
                message: "location not supplied correctly"
            }
        }
    }

    const descriptionString = formData.get("description");
    let description: LocaleText | undefined;
    if (descriptionString !== null && typeof descriptionString !== 'string') {
        return {
            type: "failure",
            message: "description not supplied correctly"
        }
    }
    else if (descriptionString !== null) {
        description = JSON.parse(descriptionString);
        if (!isLocaleText(description)) {
            return {
                type: "failure",
                message: "name requires a valid language"
            }
        }
    }

    const image = formData.get("image");
    if (image === null || image instanceof File) {
        return {
            type: "success",
            value: {
                fields: {
                    name: name,
                    location: location,
                    description: description
                },
                image: image ?? undefined
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

async function uploadDatabaseData(stampId: string, fields: PostFields, newImagePath: string | undefined, dbPath: string, userId: string, client: MongoClient, session: ClientSession): Promise<void> {
    const database = client.db('japan_stamp');
    const collection = database.collection('stamps');
    const setFields: { [key: string]: any } = {
        "updated-on": new Date(),
        "updated-by": userId
    };
    if (fields.name !== undefined) {
        setFields["name"] = fields.name;
    }
    if (fields.location !== undefined) {
        setFields["location"] = {
            coordinates: [fields.location.lon, fields.location.lat],
            type: "Point"
        };
    }
    if (fields.description !== undefined) {
        setFields["description"] = fields.description;
    }
    if (newImagePath !== undefined) {
        setFields["image-path"] = newImagePath;
    }
    const result = await collection.findOneAndUpdate(
        new ObjectId(stampId),
        {
            $set: setFields,
            session
        }
    );
}

export default async function patchRequest(request: Request, stampId: string) {
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

    let image: Buffer | undefined;
    let newImagePath: string | undefined;
    if (formData.value.image) {
        const imageResult = await prepareImageForUpload(formData.value.image);
        if (imageResult.type === "failure") {
            return new Response(
                JSON.stringify({ error: imageResult.message }),
                {
                    status: 400
                }
            );
        }
        else {
            image = imageResult.value;
            const newImageId = uuidv4();
            newImagePath = 'images/stamps/' + newImageId + ".jpg";
        }
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
            await uploadDatabaseData(stampId, formData.value.fields, newImagePath, mongodbUri, validatedUser.value, client, session);
            if (image !== undefined && newImagePath !== undefined) {
                const bucket = getStorage().bucket();
                await bucket.file(newImagePath).save(image);
            }
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