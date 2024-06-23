'use client';

import Head from "next/head";
import Script from "next/script";
import styled from "styled-components";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";

function Filter() {

}

export default function Home() {
  return (
    <>
    <main
      style={{
          "flex": "1 1 auto"
        }}>
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""></Script>
        
      <MapContainer
        center={[35.6764, 139.6500]}
        zoom={5}
        scrollWheelZoom={false}
        style={{
          "height": "100%"
        }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </main>
    </>
  );
}
