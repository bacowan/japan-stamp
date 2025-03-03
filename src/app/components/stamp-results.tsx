'use client'

import StampDto from "@/database/dtos/stampDto";
import StampCard from "./stamp-card";

interface StampResultsParams {
    stamps: StampDto[],
    userLocation?: { lat: number, lon: number };
}

export function StampResults({ stamps, userLocation }: StampResultsParams) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {stamps.map(s => <StampCard key={s.id} stamp={s} userLocation={userLocation}/>)}
    </div>
  );
}