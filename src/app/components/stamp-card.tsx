import Stamp from "@/database/collection_types/stamp"
import { WithId } from "mongodb"

export interface StampCardParams {
    stamp: Stamp
}

export default function StampCard({ stamp }: StampCardParams ) {
    return <div className="border rounded-lg m-3 flex flex-row">
        <img src="https://placehold.jp/150x150.png"/>
        <div className="p-2">
            <h3 className="text-xl">{stamp.name}</h3>
            <p>location</p>
        </div>
    </div>
}