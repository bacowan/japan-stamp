import { AtLeastOne } from "@/utils/validators/at-least-one";
import { plainToInstance } from "class-transformer";
import { IsNotEmpty, Max, Min, validate, ValidateNested, ValidationError } from "class-validator";
import { MongoClient, ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { NextApiRequest } from "next";
import { describe } from "node:test";
import PersistentFile from "formidable/PersistentFile";
import { ref, uploadBytes, UploadResult } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { fileTypeFromBlob } from "file-type";
import sharp from "sharp";
import { auth } from "../../../utils/firebase-init-server";
import { getStorage } from "firebase-admin/storage";
//const { getStorage } = require('firebase-admin/storage');

//initializeApp();
//storage; // force storage to load

const validFileTypes = ['image/jpeg', 'image/png', 'image/gif'];

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
};


interface Success<T> {
    type: "success"
    value: T
}

interface Failure {
    type: "failure",
    message: string
}

type Result<T> = Success<T> | Failure;

async function parseForm(request: Request): Promise<Result<ParsedForm>> {
    const formData = await request.formData();

    const nameString = formData.get("name");
    if (typeof nameString !== 'string' || nameString === null) {
        return {
            type: "failure",
            message: "name not supplied correctly"
        }
    }
    const name = plainToInstance(LangText, JSON.parse(nameString));
    const nameErrors = await validate(name);
    if (nameErrors.length > 0) {
        return {
            type: "failure",
            message: nameErrors.join("; ")
        }
    }

    const locationString = formData.get("location");
    if (typeof locationString !== 'string' || locationString === null) {
        return {
            type: "failure",
            message: "location not supplied correctly"
        }
    }
    const location = plainToInstance(Location, JSON.parse(locationString));
    const locationErrors = await validate(name);
    if (locationErrors.length > 0) {
        return {
            type: "failure",
            message: locationErrors.join("; ")
        }
    }

    const descriptionString = formData.get("description");
    if (typeof descriptionString !== 'string' || descriptionString === null) {
        return {
            type: "failure",
            message: "description not supplied correctly"
        }
    }
    const description = plainToInstance(LangText, JSON.parse(descriptionString));
    const descriptionErrors = await validate(description);
    if (descriptionErrors.length > 0) {
        return {
            type: "failure",
            message: descriptionErrors.join("; ")
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

async function prepareImageForUpload(image: File): Promise<Result<Buffer>> {
    const fileType = await fileTypeFromBlob(image);
    if (fileType && validFileTypes.includes(fileType.mime)) {
        try {
            const jpegBuffer = await sharp(await image.arrayBuffer())
                .resize(200)
                .jpeg({ quality: 80 })
                .toBuffer();
            return {
                type: "success",
                value: jpegBuffer
            }
        }
        catch (e) {
            return {
                type: "failure",
                message: "failed to format image"
            }
        }
    }
    else {
        return {
            type: "failure",
            message: "invalid file type"
        }
    }
}

async function uploadImage(imagePath: string, image: Buffer): Promise<Result<null>> {
    try {
        const bucket = getStorage().bucket();
        await bucket.file(imagePath).save(image);
        return {
            type: "success",
            value: null
        }
    }
    catch (e) {
        return {
            type: "failure",
            message: e instanceof Error ? "Failed to upload image: " + e.message : "Failed to upload image"
        }
    }
}

async function uploadDatabaseData(fields: PostFields, imagePath: string, dbPath: string): Promise<Result<string>> {
    const client = new MongoClient(dbPath);
    try {
        await client.connect();
        const database = client.db('japan_stamp');
        const collection = database.collection('stamps');
        const dataToWrite: Stamp = {
            name: fields.name,
            location: {
                coordinates: [fields.location.lon, fields.location.lat],
                type: "Point"
            },
            description: fields.description,
            "image-path": imagePath
        }
        const result = await collection.insertOne(dataToWrite);
        return {
            type: "success",
            value: result.insertedId.toString()
        }
    }
    catch (e) {
        return {
            type: "failure",
            message: e instanceof Error ?
                "Failed to upload database data: " + e.message
                : "Failed to upload database data"
        };
    }
    finally {
        await client.close();
    }
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

async function validateUser(headers: Headers): Promise<Result<string>> {
    const authHeader = headers.get("Authorization");
    if (authHeader === null) {
        return {
            type: "failure",
            message: "Authorization header is required"
        }
    }
    
    try {
        const decodedToken = await auth.verifyIdToken(authHeader);
        return {
            type: "success",
            value: decodedToken.uid
        }
    }
    catch (e) {
        return {
            type: "failure",
            message: "Failed to authenticate: " + e
        }
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

    const imageId = uuidv4();
    const imagePath = 'images/stamps/' + imageId + ".jpg";
    const uploadedId = await uploadDatabaseData(formData.value.fields, imagePath, process.env.MONGODB_URI);
    if (uploadedId.type === "failure") {
        return new Response(
            JSON.stringify({ error: uploadedId.message }),
            {
                status: 400
            }
        );
    }

    const imageUploadResult = await uploadImage(imagePath, image.value);
    if (imageUploadResult.type === "failure") {
        await undoDatabaseUpload(uploadedId.value, process.env.MONGODB_URI);
        return new Response(
            JSON.stringify({ error: imageUploadResult.message }),
            {
                status: 400
            }
        );
    }
    
    return new Response(
        JSON.stringify({ id: imageId }),
        { status: 200 }
    )
}