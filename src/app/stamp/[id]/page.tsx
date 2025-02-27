import Stamp from "@/database/database_types/stamp";
import mongodb_client from "@/database/mongodb_client";
import { ObjectId } from "mongodb";

interface StampPageParams {
    params: Promise<{ id: string }>
}

export default async function StampPage({ params }: StampPageParams)  {
    if (!mongodb_client) {
        throw "Could not connect to database";
    }

    const id = (await params).id;

    const database = mongodb_client.db('JapanStamp');
    const collection = database.collection<Stamp>('Stamps');
    const stamp = await collection.findOne({ _id: new ObjectId(id) });
    return <div>{stamp?.name}</div>
}