import Script from "next/script";
import { useMapEvents } from "react-leaflet";
import { renderToString } from "react-dom/server";
import { PrefectureLocations } from "@/utils/constant-data";
import StampMapPopup from "@/components/stamp-map-popup";
import L from "leaflet";
import dynamic from "next/dynamic";
import PageClient from "./page-client";

async function LoadPrefectureData(): Promise<{[name: string]: number}> {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + 'prefecture-stamps',
    { cache: 'no-cache' }); // TODO: Add caching

  if (response.ok) {
    const asJson = await response.json();
    
    if (Array.isArray(asJson)) {
      const ret: {[name: string]: number} = {};
      for (let i = 0; i < asJson.length; i++) {
        if ("name" in asJson[i] && "count" in asJson[i]) {
          ret[asJson[i].name] = asJson[i].count;
        }
        else {
          // TODO: Error handling
          console.log("missing fields");
          return {};
        }
      }
      return ret;
    }
    else {
      // TODO: Error handling
    console.log("not array");
      return {};
    }
  } else { 
    // TODO: Error handling
    console.log("response not okay");
    return {};
  } 
}


export default async function Home() {
  const prefectureData = await LoadPrefectureData();

  const markers = PrefectureLocations.map(l => ({
    id: l.id,
    name: l.name,
    lat: l.lat,
    lon: l.lon,
    count: l.name in prefectureData ? prefectureData[l.name] : 0
  }));

  return <PageClient markers={markers}/>
}
