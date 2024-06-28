'use client'

import { LatLngExpression } from "leaflet"
import styled from "styled-components"
import Image from 'next/image';
import { MapContainer, Marker, TileLayer } from "react-leaflet";

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
export type TodoResponse = {
  content: string | null;
  isDone: boolean | null;
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface StampPageClientParams {
    id: string,
    todos: TodoResponse[]
  }

  
export default function PageClient({id, todos}: StampPageClientParams) {
    const name = "Test stamp";
    const imageUrl = "https://leafletjs.com/docs/images/logo.png";
    const description = "stuff";
    const location: LatLngExpression = [35.6764, 139.6500];

    console.log(todos);

    return <>
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
    </>
}