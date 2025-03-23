'use client'

import StampDto from "@/database/dtos/stampDto"
import { useEffect, useState } from "react";
import { StampResults } from "./stamp-results";
import Dictionary from "@/localization/dictionaries/dictionary";
import { SupportedLocale } from "@/localization/localization";
import usePermissions from "@/hooks/use-permissions";

interface StampResultsWithLocationParams {
    stamps: StampDto[],
    dictionary: Dictionary["stamp-list"],
    locale: SupportedLocale
}

export function StampResultsWithLocation({ stamps, dictionary, locale }: StampResultsWithLocationParams) {
    const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
    const hasLocationPermissions = usePermissions("use_location_data");

    useEffect(() => {
        if (hasLocationPermissions === true && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(pos => {
                const coords = pos.coords;
                setUserLocation({
                    lat: coords.latitude,
                    lon: coords.longitude
                });
            });
        }
    }, [hasLocationPermissions]);

    return <StampResults stamps={stamps} userLocation={userLocation ?? undefined} dictionary={dictionary} locale={locale}/>
}