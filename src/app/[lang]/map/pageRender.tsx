'use client'

import useLeaflet from "@/hooks/use-leaflet"
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useMapEvent } from "react-leaflet";
import { MapViewValues } from "./components/map-page-map";
import StampDto from "@/database/dtos/stampDto";
import GetStampsForLatLonSquare from "./functions/getMarkers";

const tokyoLatLon = { lat: 35.6764, lon: 139.6500 };

function MapLoadingComponent() {
    return <div className="w-full h-full flex justify-center items-center">
        <AiOutlineLoading className="animate-spin"/>
    </div>; 
}

const DynamicMap = dynamic(
    () => import("./components/map-page-map"),
    {
        ssr: false,
        loading: () => <MapLoadingComponent/>
    });

interface MapPageRenderProps {
    heatmapPoints: { lat: number, lon: number, weight: number }[]
}

const zoomCutoff = parseInt(process.env.NEXT_PUBLIC_MAP_ZOOM_DETAIL_CUTOFF ?? "");

export default function MapPageRender({ heatmapPoints }: MapPageRenderProps) {
    useLeaflet();
    const [initialMapViewValues, setInitialMapViewValues] = useState<MapViewValues | null>(null);
    const [loadedStampsByLocation, setLoadedStampsByLocation] = useState<{[key: string]: StampDto[]}>({});
    const loadingStampsByLocation = useRef<{[key: string]: Promise<StampDto[]>}>({});

    const loadedStamps = Object.values(loadedStampsByLocation).flatMap(s => s);

    async function onMapViewValuesChanged(mapViewValues: MapViewValues) {
        if (mapViewValues.zoom < zoomCutoff) return;
        
        const lat = Math.floor(mapViewValues.center.lat);
        const lon = Math.floor(mapViewValues.center.lon);
        const latLon = `${lat},${lon}`;

        if (!(latLon in loadedStampsByLocation) && !(latLon in loadingStampsByLocation)) {
            loadingStampsByLocation.current[latLon] =
                (async function() {
                    const stamps = await GetStampsForLatLonSquare(lat, lon);
                    delete loadingStampsByLocation.current[latLon];
                    setLoadedStampsByLocation(s => ({
                        ...s,
                        [latLon]: stamps
                    }));
                    return stamps;
                })();
        }
    }

    function onGetCurrentPositionSuccess(pos: GeolocationPosition) {
        const coords = pos.coords;
        setInitialMapViewValues({
            center: { lat: coords.latitude, lon: coords.longitude },
            zoom: 14
        });
    }

    function onGetCurrentPositionError(err: GeolocationPositionError) {
        setInitialMapViewValues({
            center: tokyoLatLon,
            zoom: 14
        });
    }

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                onGetCurrentPositionSuccess,
                onGetCurrentPositionError
            );
        } else {
            /* geolocation IS NOT available */
        }
    }, []);

    if (initialMapViewValues === null) {
        return <MapLoadingComponent/>
    }
    else {
        return <DynamicMap
            initialMapViewValues={initialMapViewValues}
            onMapViewChanged={onMapViewValuesChanged}
            stamps={loadedStamps}
            heatmapPoints={heatmapPoints}
            />
    }
}