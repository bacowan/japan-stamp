import { LatLngExpression } from 'leaflet';
import Image from 'next/image';
import Script from 'next/script';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import styled from 'styled-components';

import { cookies } from 'next/headers';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import PageClient from './page-client';

async function getData(): Promise<TodoResponse[]> {
  return [];
};

type TodoResponse = {
  content: string | null;
  isDone: boolean | null;
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export default async function StampPage({ params }: { params: { id: string } }) {

  const data = await getData();

  return <main
    style={{
        "flex": "1 1 auto",
        "position": "relative",
        "padding": "1em"
      }}>
        <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""></Script>
        <PageClient id={params.id} todos={data}/>
  </main>
}