'use client'

import StampDto from "@/database/dtos/stampDto";
import { Map } from "leaflet";
import dynamic from "next/dynamic";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

function MapLoadingComponent() {
    return <div className="w-full h-full flex justify-center items-center">
        <AiOutlineLoading className="animate-spin"/>
    </div>; 
}

const DynamicHeatmap = dynamic(
    () => import("./heatmap"),
    {
        ssr: false,
        loading: () => <MapLoadingComponent/>
    });

interface MapEventWrapperProps {
    onMapViewChanged: (e: MapViewValues) => void
}

function getMapViewValues(map: Map): MapViewValues {
    const center = map.getCenter();
    return {
        center: {
            lat: center.lat,
            lon: center.lng
        },
        zoom: map.getZoom()
    }
}

function MapEventWrapper({ onMapViewChanged }: MapEventWrapperProps) {
    const map = useMapEvents({
        zoomend: e => {
            onMapViewChanged(getMapViewValues(map));
        },
        moveend: e => {
            onMapViewChanged(getMapViewValues(map));
        }
    });
    return null;
}

interface StampPageMapProps {
    initialMapViewValues: MapViewValues,
    onMapViewChanged: (e: MapViewValues) => void,
    stamps: StampDto[],
    heatmapPoints: { lat: number, lon: number, weight: number }[]
}

export interface MapViewValues {
    center: { lat: number, lon: number },
    zoom: number
}

const zoomCutoff = parseInt(process.env.NEXT_PUBLIC_MAP_ZOOM_DETAIL_CUTOFF ?? "");

export default function MapPageMap({ initialMapViewValues, onMapViewChanged, stamps, heatmapPoints }: StampPageMapProps) {
    const [zoom, setZoom] = useState(initialMapViewValues.zoom);

    function onMapViewChangedInner(e: MapViewValues) {
        setZoom(e.zoom);
        onMapViewChanged(e);
    }

    const stampMarkers = stamps.map(s => <Marker key={s.id} position={[s.lat, s.lon]}/>);

    return (<div className="w-full h-full p-2 flex flex-col items-center">
        <MapContainer center={[initialMapViewValues.center.lat, initialMapViewValues.center.lon]} zoom={initialMapViewValues.zoom} scrollWheelZoom={false}
            className="w-full h-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
                zoom < zoomCutoff ?
                    <DynamicHeatmap points={heatmapPoints}/> :
                    stampMarkers
            }
            <MapEventWrapper onMapViewChanged={onMapViewChangedInner}/>
            
        </MapContainer>
    </div>)
}