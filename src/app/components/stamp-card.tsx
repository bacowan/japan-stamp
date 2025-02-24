'use client'

//import Stamp from "@/database/collection_types/stamp";
import Image from 'next/image';
//import haversine from 'haversine-distance';

export interface StampCardParams {
    name: string,
    image_url: string,
    id: string
}

export default function StampCard({ name, image_url }: StampCardParams ) {
    //const distance = haversine()

    return <div className="border rounded-lg m-3 flex flex-row">
        <Image src={image_url}
            alt="Stamp image"
            width={150} height={150}
            className="p-1"/>
        <div className="p-2">
            <h3 className="text-xl">{name}</h3>
            <p>distance</p>
        </div>
    </div>
}