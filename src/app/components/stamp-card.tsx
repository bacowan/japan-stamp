import Stamp from "@/database/collection_types/stamp";
import Image from 'next/image'

export interface StampCardParams {
    stamp: Stamp
}

export default function StampCard({ stamp }: StampCardParams ) {
    return <div className="border rounded-lg m-3 flex flex-row">
        <Image src={stamp.image_url}
            alt="Stamp image"
            width={150} height={150}
            className="p-1"/>
        <div className="p-2">
            <h3 className="text-xl">{stamp.name}</h3>
            <p>distance</p>
        </div>
    </div>
}