'use client';

import StampMapPopup from "@/components/stamp-map-popup";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useState } from "react";
import { useMapEvents } from "react-leaflet";

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

interface MapEventListenerProps {
  zoomLevel: number,
  setZoomLevel: (zoomLevel: number) => void
}

function MapEventListener({zoomLevel, setZoomLevel}: MapEventListenerProps) {
  const mapEvents = useMapEvents({
    zoomend: () => {
        setZoomLevel(mapEvents.getZoom());
    },
    overlayadd: (e) => {
      console.log(e);
    },
    overlayremove: (e) => {
      console.log(e);
    }
  });

  return null;
}

export interface HomePageClientParams {
    markers: {
        id: number,
        name: string,
        lat: number,
        lon: number,
        count: number
    }[]
}

export default function PageClient({ markers }: HomePageClientParams) {

    // TODO: show number markers at a certain size, and the individual pins at another
    // TODO: Load data server side. Also compress/decompress it with gzip and reducing field names.
    const [lastClickedMarkerKey, setLastClickedMarkerKey] = useState<null|number|string>(null);
    const [zoomLevel, setZoomLevel] = useState(defaultZoom);
    const [checkedLayers, setCheckedLayers] = useState({
      "Train Station": true,
      "Roadside Station": true,
      "Shrine": true,
      "Sightseeing Spot": true
    });

    let markerElements: JSX.Element[];
    if (zoomLevel >= zoomCutoff) {
        markerElements = [
        <Marker key={0} position={[35.6764, 139.6500]}
          eventHandlers={{
            click: (e) => {
              setLastClickedMarkerKey(0)
            }
          }}>
          <StampMapPopup isOpen={0 === lastClickedMarkerKey} id="0"/>
        </Marker>
      ]; // TODO: Load all stamps for the prefecture in the center and all surrounding prefectures
    }
    else {
        // TODO: Memoize
        markerElements = markers.map(p => <PrefectureMarker key={p.name} value={p.count} lat={p.lat} lon={p.lon}/>)
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
            center={[35.6764, 139.6500]}
            zoom={defaultZoom}
            scrollWheelZoom={true}
            style={{
                "height": "100%",
                "zIndex": "0"
            }}>
        <MapEventListener zoomLevel={zoomLevel} setZoomLevel={setZoomLevel}/>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        <LayersControl position="topright">
            <LayersControlOverlay checked={true} name="Marker with popup">
                <LayerGroup>
                    {markerElements}
                </LayerGroup>
            </LayersControlOverlay>
        </LayersControl>
        </MapContainer>
    </main>
}