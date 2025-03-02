import Stamp from "@/database/database_types/stamp";
import mongodb_client from "@/database/mongodb_client";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import StampPageRender from "./pageRender";
import { StampMongoToDto } from "@/database/dtos/stampDto";

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

    if (stamp === null) {
        notFound();
    }

    return <StampPageRender stamp={StampMongoToDto(stamp)}/>
}