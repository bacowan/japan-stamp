'use client'

import StampDto from "@/database/dtos/stampDto";
import StampCard from "./stamp-card";
import { ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import parseLatLonUrl from "../utils/parse-lat-lon-url";
import Dictionary from "@/localization/dictionaries/dictionary";
import { SupportedLocale } from "@/localization/localization";
import Translation from "./translation";

interface StampResultsParams {
    stamps: StampDto[],
    userLocation?: { lat: number, lon: number },
    dictionary: Dictionary["stamp-list"],
    locale: SupportedLocale
}

export function StampResults({ stamps, userLocation, dictionary, locale }: StampResultsParams) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const onSortOptionChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value === "date") {
      params.set("sort", "date");
    }
    else if (e.target.value === "nearby" && userLocation) {
      params.set("sort", `${userLocation.lon},${userLocation.lat}`);
    }
    else {
      return;
    }

    router.push(`?${params.toString()}`);
  }

  let selectedSortOption: "date" | "nearby";
  const sortSearchParam = searchParams.get("sort");
  if (sortSearchParam === null || sortSearchParam === "date") {
    selectedSortOption = "date";
  }
  else if (parseLatLonUrl(sortSearchParam)) {
    selectedSortOption = "nearby";
  }
  else {
    selectedSortOption = "date";
  }

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
            userLocation !== undefined &&
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