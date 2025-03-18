import Stamp from "@/database/database_types/stamp";
import MapPageRender from "./pageRender"
import mongodb_client from "@/database/mongodb_client";
import { Document } from "mongodb";
import { SupportedLocale } from "@/localization/localization";

interface MapPageParams {
    params: Promise<{ lang: SupportedLocale }>
}

export default async function MapPage({ params }: MapPageParams) {
    if (!mongodb_client) {
        throw "Could not connect to database";
    }

    const resolvedParams = await params;

    const aggregationPipeline: Document[] = [
        {
            $project: {
                lat: { $round: [{ $arrayElemAt: [ "$location", 0 ] }, 1] },
                lon: { $round: [{ $arrayElemAt: [ "$location", 1 ] }, 1] }
            }
        },
        {
            $group: {
                _id: {
                    lat: "$lat",
                    lon: "$lon"
                },
                weight: { $sum: 1 }
            }
        }
    ];

    const database = mongodb_client.db('JapanStamp');
    const collection = database.collection<Stamp>('Stamps');

    const heatmapPointDocuments = await collection.aggregate(aggregationPipeline).toArray();
    const heatmapPoints = heatmapPointDocuments.map(d => ({
        lat: d._id.lat,
        lon: d._id.lon,
        weight: d.weight
    }));

    return <MapPageRender heatmapPoints={heatmapPoints} locale={resolvedParams.lang}/>
}