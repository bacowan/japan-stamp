'use server'

import mongodb_client from "@/database/mongodb_client";
import StampDto, { StampMongoToDto } from "@/database/dtos/stampDto";
import Stamp from "@/database/database_types/stamp";

export default async function GetStampsForLatLonSquare(lat: number, lon: number): Promise<StampDto[]> {
    if (!mongodb_client) {
        throw "Could not connect to database";
    }

    const database = mongodb_client.db('JapanStamp');
    const collection = database.collection<Stamp>('Stamps');
    const stampsArray = await collection.find({
        location: {
            $geoWithin: {
                $box: [[lon, lat], [lon + 1, lat + 1]]
            }
        }
    }).toArray();
    return stampsArray.map<StampDto>(s => StampMongoToDto(s));
}