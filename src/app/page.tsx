'use client';

import Head from "next/head";
import Script from "next/script";
import styled from "styled-components";
import { Circle, FeatureGroup, LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { FaFilter } from "react-icons/fa";
import L from 'leaflet';
import { renderToString } from "react-dom/server";
import { PrefectureLocations } from "@/lib/constant-data";
import StampMapPopup from "@/components/stamp-map-popup";
import MapFilter from "@/components/map-filter";
//import { main } from "@/lib/database-access";

const defaultZoom = 5;
const zoomCutoff = 11;

const NumberedCircle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: blue; // Circle color
  color: white; // Number color
  font-weight: bold;
  font-size: 16px;
  border: 2px solid white; // Optional: to make the circle more visible
`

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

function LoadPrefectureData() {

}

export default function Home() {
  /*useEffect(() => {
    (async function() {
      const test = await main();
      console.log(test);
    })();
  }, []);*/


  const [zoomLevel, setZoomLevel] = useState(defaultZoom);
  const [checkedLayers, setCheckedLayers] = useState({
    "Train Station": true,
    "Roadside Station": true,
    "Shrine": true,
    "Sightseeing Spot": true
  });
  const [lastClickedMarkerKey, setLastClickedMarkerKey] = useState<null|number|string>(null);
  // TODO: show number markers at a certain size, and the individual pins at another
  // TODO: Load data server side. Also compress/decompress it with gzip and reducing field names.
  const [prefectureData, setPrefectureData] = useState([]);

  let markers: JSX.Element[];
  if (zoomLevel >= zoomCutoff) {
    markers = [
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
    markers = PrefectureLocations.map(p => {
      // TODO: Memoize
      const test = <NumberedCircle>{p.id}</NumberedCircle> //TODO: This is where the number of stamps should appear
      const icon = L.divIcon({
        html: renderToString(test),
        className: '', // We do not want any additional styles applied by default
        iconSize: [30, 30], // Size of the icon (can be adjusted)
        iconAnchor: [15, 15], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -15], // Point from which the popup should open relative to the iconAnchor
      });
      return <Marker key={p.name} position={[p.lat, p.lon]} icon={icon}></Marker>
    })
  }

  const layers = Object.keys(checkedLayers).map(l => {
    <LayersControl.Overlay checked={true} name={l}>
      <LayerGroup>
        {markers}
      </LayerGroup>
    </LayersControl.Overlay>
  });

  return (
    <>
    <main
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
          <LayersControl.Overlay checked={true} name="Marker with popup">
            <LayerGroup>
              {markers}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </main>
    </>
  );
}
