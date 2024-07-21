'use client';

import StampMapPopup from "@/components/stamp-map-popup";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useEffect, useState } from "react";
import Stamp from "./api-response-types/stamp";
import MapEventListener from "@/utils/map-event-listener";

const MapContainer = dynamic(() => import('react-leaflet').then((module) => module.MapContainer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((module) => module.Marker), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((module) => module.TileLayer), { ssr: false });
const LayersControl = dynamic(() => import('react-leaflet').then((module) => module.LayersControl), { ssr: false });
const LayerGroup = dynamic(() => import('react-leaflet').then((module) => module.LayerGroup), { ssr: false });
const LayersControlOverlay = dynamic(() => import('react-leaflet').then((module) => module.LayersControl.Overlay), { ssr: false });
const PrefectureMarker = dynamic(() => import('../components/prefecture-marker'), {
  loading: () => <div>loading...</div>,
  ssr: false,
});

const defaultZoom = 5;
const zoomCutoff = 11;
const defaultCenter: { lat: number, lon: number } = { lat: 35.6764, lon: 139.6500 };

export interface HomePageClientParams {
  markers: {
    id: number,
    name: string,
    lat: number,
    lon: number,
    count: number
  }[]
}

const stampCache = new Map<string, Stamp[]>();
async function getStamps(lat: number, lon: number): Promise<Stamp[]> {
  const latMin = Math.trunc(lat);
  const latMax = latMin + 1;
  const lonMin = Math.trunc(lon);
  const lonMax = lonMin + 1;

  const fetchUrl = new URL(process.env.NEXT_PUBLIC_API_URL + 'stamps');
  fetchUrl.searchParams.append("lat-min", latMin.toString());
  fetchUrl.searchParams.append("lat-max", latMax.toString());
  fetchUrl.searchParams.append("lon-min", lonMin.toString());
  fetchUrl.searchParams.append("lon-max", lonMax.toString());

  const cacheKey = `${latMin}_${lonMin}`;
  const valueInCache = stampCache.get(cacheKey);
  if (valueInCache !== undefined) {
    return valueInCache;
  }

  const response = await fetch(fetchUrl, { cache: 'no-store' }); // TODO: legit caching

  if (response.ok) {
    const stamps: Stamp[] = await response.json();
    console.log(stamps);
    stampCache.set(cacheKey, stamps);
    return stamps;
  }
  else {
    // TODO: Error handling
    console.log("bad response");
    return [];
  }
}

function LoadingDiv() {
  return <div className="absolute z-50 top-0 left-0 bottom-0 right-0 flex flex-col items-center justify-center pointer-events-none">
    <p className="bg-white m-2 p-2 rounded border-solid border-black border-2">
      Loading...
    </p>
  </div>
}

export default function PageClient({ markers }: HomePageClientParams) {

  // TODO: show number markers at a certain size, and the individual pins at another
  // TODO: Load data server side. Also compress/decompress it with gzip and reducing field names.
  const [lastClickedMarkerKey, setLastClickedMarkerKey] = useState<null | number | string>(null);
  const [zoomLevel, setZoomLevel] = useState(defaultZoom);
  const [location, setLocation] = useState(defaultCenter);
  const [displayedMarkers, setDisplayedMarkers] = useState<Stamp[] | "loading">([]);
  const [checkedLayers, setCheckedLayers] = useState({
    "Train Station": true,
    "Roadside Station": true,
    "Shrine": true,
    "Sightseeing Spot": true
  });

  useEffect(() => {
    (async function () {
      if (zoomLevel >= zoomCutoff) {
        setDisplayedMarkers('loading');
        setDisplayedMarkers(await getStamps(location.lat, location.lon));
      }
    })();
  }, [location, zoomLevel]);

  let markerElements: JSX.Element[];
  let isLoading = false;
  if (zoomLevel >= zoomCutoff) {
    if (displayedMarkers === 'loading') {
      markerElements = [];
      isLoading = true;
    }
    else {
      markerElements = displayedMarkers.map(m =>
        <Marker key={m.id} position={[m.location.lat, m.location.lon]}
          eventHandlers={{
            click: (e) => {
              setLastClickedMarkerKey(m.id)
            }
          }}>
          <StampMapPopup isOpen={m.id === lastClickedMarkerKey} id={m.id} />
        </Marker>
      );
    }
  }
  else {
    markerElements = markers.map(p => <PrefectureMarker key={p.name} value={p.count} lat={p.lat} lon={p.lon} />)
  }

  return <main
    style={{
      "flex": "1 1 auto",
      "position": "relative"
    }}>
    <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      crossOrigin=""></Script>
    <MapContainer
      center={[defaultCenter.lat, defaultCenter.lon]}
      zoom={defaultZoom}
      scrollWheelZoom={true}
      style={{
        "height": "100%",
        "zIndex": "0"
      }}>
      <MapEventListener setZoomLevel={setZoomLevel} setLocation={setLocation} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LayersControl position="topright">
        <LayersControlOverlay checked={true} name="Marker with popup">
          <LayerGroup>
            {markerElements}
          </LayerGroup>
        </LayersControlOverlay>
      </LayersControl>
    </MapContainer>
    {isLoading && <LoadingDiv />}
  </main>
}