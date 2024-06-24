'use client'

import { LatLngExpression } from 'leaflet';
import Image from 'next/image';
import Script from 'next/script';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import styled from 'styled-components';

const StyledH1 = styled.h1`
  text-align: center;
`

const StyledH2 = styled.h2`
  text-align: center;
`

const StyledEdit = styled.sup`
    font-size: 0.5em;
`

const StyledImage = styled(Image)`
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
`

const StyledContainerDiv = styled.div`
`

export default function StampPage({ params }: { params: { id: string } }) {
    const name = "Test stamp";
    const imageUrl = "https://leafletjs.com/docs/images/logo.png";
    const description = "stuff";
    const location: LatLngExpression = [35.6764, 139.6500];

    return <main
      style={{
          "flex": "1 1 auto",
          "position": "relative",
          "padding": "1em"
        }}>
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""></Script>
          <StyledH1><span>{name}</span><StyledEdit><a href="">Edit</a></StyledEdit></StyledH1>
          <StyledImage src={imageUrl} alt="hi" height={100} width={100}></StyledImage>
          <StyledH2>Location</StyledH2>
          <MapContainer
              center={location}
              scrollWheelZoom={true}
              zoom={15}
              style={{
                  "display": "block",
                  "marginLeft": "auto",
                  "marginRight": "auto",
                  "width": "80%",
                  "maxWidth": "30em",
                  "maxHeight": "30em"
              }}>
              <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
              <Marker position={location}></Marker>
          </MapContainer>
          <StyledH2>Description</StyledH2>
          <p>{description}</p>
    </main>
}