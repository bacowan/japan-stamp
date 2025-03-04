'use client'

import StampDto from "@/database/dtos/stampDto"
import { useEffect, useState } from "react";
import { StampResults } from "./stamp-results";

interface StampResultsWithLocationParams {
    stamps: StampDto[]
}

export function StampResultsWithLocation({ stamps }: StampResultsWithLocationParams) {
    const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(pos => {
                const coords = pos.coords;
                setUserLocation({
                    lat: coords.latitude,
                    lon: coords.longitude
                });
            });
        } else {
            /* geolocation IS NOT available */
        }
    }, []);

    return <StampResults stamps={stamps} userLocation={userLocation ?? undefined}/>
}