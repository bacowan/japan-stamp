'use client'

import StampDto from "@/database/dtos/stampDto";
import useLeaflet from "@/hooks/use-leaflet";
import Image from "next/image";

interface StampRenderProps {
    stamp: StampDto
}

export default function StampPageRender({ stamp }: StampRenderProps) {
    useLeaflet();
    return (<div className="flex flex-col items-center">
        <h1 className="text-4xl text-center">{stamp.name}</h1>
        <h2 className="text-xl text-center p-3">Stamp Preview</h2>
        <Image src={stamp.image_url} width={500} height={500} alt="picture"
            className="w-full max-w-2xl"/>
        <h2 className="text-xl text-center p-3">Map</h2>
        <Image src="https://placehold.jp/150x150.png" width={500} height={500} alt="map"
            className="w-full max-w-2xl"/>
        <h2 className="text-xl text-center p-3">Details</h2>
        <p className="pl-3 pr-3 pb-3">{stamp.description}</p>
    </div>);
}