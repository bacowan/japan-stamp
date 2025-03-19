'use client'

import StampDto from "@/database/dtos/stampDto"
import { useEffect, useState } from "react";
import { StampResults } from "./stamp-results";
import Dictionary from "@/localization/dictionaries/dictionary";
import { SupportedLocale } from "@/localization/localization";
import constants from "@/constants";

interface StampResultsWithLocationParams {
    stamps: StampDto[],
    dictionary: Dictionary["stamp-list"],
    locale: SupportedLocale
}

export function StampResultsWithLocation({ stamps, dictionary, locale }: StampResultsWithLocationParams) {
    const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
    const [hasLocationPermissions, setHasLocationPermissions] = useState(false);

    function updateLocationPermissions(e: CustomEvent) {
        const detail = JSON.parse(e.detail);
        setHasLocationPermissions(detail.use_location_data);
    }

    useEffect(() => {
        const privacyPreferences = localStorage.getItem(constants.privacyPreferencesKey);
        if (privacyPreferences) {
            const json = JSON.parse(privacyPreferences);
            if (json.use_location_data === true) {
                setHasLocationPermissions(true);
            }
        }

        window.addEventListener(constants.localStorageUpdatedEventName, updateLocationPermissions as EventListener);
        return () => window.removeEventListener(constants.localStorageUpdatedEventName, updateLocationPermissions as EventListener);
    }, []);

    useEffect(() => {
        if (hasLocationPermissions && "geolocation" in navigator) {
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