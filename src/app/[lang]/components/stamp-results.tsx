'use client'

import StampDto from "@/database/dtos/stampDto";
import StampCard from "./stamp-card";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Dictionary from "@/localization/dictionaries/dictionary";
import { SupportedLocale } from "@/localization/localization";
import Translation from "./translation";
import usePermissions from "@/hooks/use-permissions";

interface StampResultsParams {
    stamps: StampDto[],
    dictionary: Dictionary["stamp-list"],
    locale: SupportedLocale
}

export function StampResults({ stamps, dictionary, locale }: StampResultsParams) {
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const hasLocationPermissions = usePermissions("use_location_data");
  const searchParams = useSearchParams();
  const router = useRouter();

  const onSortOptionChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value === "date") {
      params.set("sort", "date");
    }
    else if (e.target.value === "nearby" && userLocation) {
      document.cookie = `lat=${userLocation.lat}`;
      document.cookie = `lon=${userLocation.lon}`;
      params.set("sort", "nearby");
    }
    else {
      return;
    }

    router.push(`?${params.toString()}`);
  }

  let selectedSortOption: "date" | "nearby";
  const sortSearchParam = searchParams.get("sort");
  if (sortSearchParam === "nearby") {
    selectedSortOption = "nearby";
  }
  else {
    selectedSortOption = "date";
  }
  
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

  return <>
    <div className="w-full flex flex-col items-center">
      <h2 className="text-xl">
          <Translation text={dictionary["near-you-header"]}/>
        </h2>
      <label>
      <Translation text={dictionary["sort-by"]}/>
        <select className="ml-1 text-black border" value={selectedSortOption} onChange={onSortOptionChanged}>
          <option value="date">
            <Translation text={dictionary["date-added-sort"]}/>
          </option>
          {
            userLocation !== null &&
            <option value="nearby">
              <Translation text={dictionary["nearby-sort"]}/>
            </option>
          }
        </select>
      </label>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grow">
        {stamps.map(s => <StampCard key={s.id} stamp={s} userLocation={userLocation} locale={locale}/>)}
    </div>
  </>
}