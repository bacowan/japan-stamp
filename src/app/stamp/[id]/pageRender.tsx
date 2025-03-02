'use client'

import StampDto from "@/database/dtos/stampDto";
import useLeaflet from "@/hooks/use-leaflet";
import dynamic from "next/dynamic";
import Image from "next/image";
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'

interface StampRenderProps {
    stamp: StampDto
}

const DynamicMap = dynamic(() => import("./components/stamp-page-map"), { ssr: false });

export default function StampPageRender({ stamp }: StampRenderProps) {
    useLeaflet();
    return (<div className="flex flex-col items-center">
        <h1 className="text-4xl text-center">{stamp.name}</h1>
        <h2 className="text-xl text-center p-3">Stamp Preview</h2>
        <Image src={stamp.image_url} width={500} height={500} alt="picture"
            className="w-full max-w-2xl p-2"/>
        <h2 className="text-xl text-center p-3">Map</h2>
        <DynamicMap stamp={stamp}/>
        <h2 className="text-xl text-center p-3">Details</h2>
        <p className="pl-3 pr-3 pb-3">{stamp.description}</p>
    </div>);
}