import Script from "next/script";
import { useMapEvents } from "react-leaflet";
import { useState } from "react";
import { renderToString } from "react-dom/server";
import { PrefectureLocations } from "@/utils/constant-data";
import StampMapPopup from "@/components/stamp-map-popup";
import L from "leaflet";
import dynamic from "next/dynamic";
import PageClient from "./page-client";


function LoadPrefectureData() {

}


export default async function Home() {
  const markers = PrefectureLocations.map(l => ({
    id: l.id,
    name: l.name,
    lat: l.lat,
    lon: l.lon,
    count: l.id
  }));

  return <PageClient markers={markers}/>
}
