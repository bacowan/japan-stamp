'use client'

import StampDto from "@/database/dtos/stampDto"
import { useEffect, useState } from "react";
import { StampResults } from "./stamp-results";
import Dictionary from "@/localization/dictionaries/dictionary";

interface StampResultsWithLocationParams {
    stamps: StampDto[],
    dictionary: Dictionary["stamp-list"]
}

export function StampResultsWithLocation({ stamps, dictionary }: StampResultsWithLocationParams) {
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

    return <StampResults stamps={stamps} userLocation={userLocation ?? undefined} dictionary={dictionary}/>
}