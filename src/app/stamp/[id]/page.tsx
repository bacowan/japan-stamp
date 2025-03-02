import Stamp from "@/database/database_types/stamp";
import mongodb_client from "@/database/mongodb_client";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import Image from "next/image";

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

    return <div className="flex flex-col items-center">
        <h1 className="text-4xl text-center">{stamp.name}</h1>
        <h2 className="text-xl text-center p-3">Stamp Preview</h2>
        <Image src={stamp.image_url} width={500} height={500} alt="picture"
            className="w-full max-w-2xl"/>
        <h2 className="text-xl text-center p-3">Map</h2>
        <Image src="https://placehold.jp/150x150.png" width={500} height={500} alt="map"
            className="w-full max-w-2xl"/>
        <h2 className="text-xl text-center p-3">Details</h2>
        <p className="pl-3 pr-3 pb-3">{stamp.description}</p>
    </div>
}