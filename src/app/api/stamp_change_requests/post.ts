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
    stampId: string,
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

    if (Array.from(formData.keys()).some(k => !["name", "location", "description", "stamp_id"].includes(k))) {
        return {
            type: "failure",
            message: "extra form field was given"
        }
    }

    const stampId = formData.get("stamp_id");
    if (stampId === null || typeof stampId !== 'string') {
        return {
            type: "failure",
            message: "stamp_id not supplied correctly"
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
                    stampId: stampId,
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

async function uploadDatabaseData(fields: PostFields, newImagePath: string | undefined, userId: string, client: MongoClient, session: ClientSession): Promise<void> {
    const database = client.db('japan_stamp');
    const collection = database.collection('stamps_change_requests');

    if (await collection.countDocuments(new ObjectId(fields.stampId), { limit: 1, session }) === 0) {
        throw Error("Given stamp does not exist");
    }

    const setFields: { [key: string]: any } = {
        "stamp-id": fields.stampId,
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
    await collection.insertOne(setFields, { session });
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
        await session.withTransaction(async () => {
            await uploadDatabaseData(formData.value.fields, newImagePath, validatedUser.value, client, session);
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