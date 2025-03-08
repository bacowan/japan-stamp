'use client'

import StampDto from "@/database/dtos/stampDto";
import StampCard from "./stamp-card";
import { ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import parseLatLonUrl from "../utils/parse-lat-lon-url";

interface StampResultsParams {
    stamps: StampDto[],
    userLocation?: { lat: number, lon: number };
}

export function StampResults({ stamps, userLocation }: StampResultsParams) {
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
      <h2 className="text-xl">Stamps near you</h2>
      <label>
        Sort by:
        <select className="ml-1" value={selectedSortOption} onChange={onSortOptionChanged}>
          <option value="date">Date Added</option>
          { userLocation !== undefined && <option value="nearby">Nearby</option> }
        </select>
      </label>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grow">
        {stamps.map(s => <StampCard key={s.id} stamp={s} userLocation={userLocation}/>)}
    </div>
  </>
}