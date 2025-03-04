'use client'

import Image from 'next/image';
import haversine from 'haversine-distance';
import StampDto from '@/database/dtos/stampDto';
import { JSX } from 'react';
import Link from 'next/link';

export interface StampCardParams {
    stamp: StampDto,
    userLocation?: { lat: number, lon: number };
}

const readableDistance = (meters: number): string => {
    if (meters < 100) {
        return Math.floor(meters).toString() + "m";
    }
    else if (meters < 100000) {
        return (Math.floor(meters / 100) / 10).toString() + "Km";
    }
    else {
        return (Math.floor(meters / 1000)).toString() + "Km";
    }
}

export default function StampCard({ stamp, userLocation }: StampCardParams ) {
    let distanceElement: JSX.Element | undefined;
    if (userLocation) {
        const distance = haversine(
            { lat: stamp.lat, lon: stamp.lon },
            { lat: userLocation.lat, lon: userLocation.lon });
        distanceElement = <p>{readableDistance(distance)}</p>
    }

    return <Link className="border rounded-lg m-3 flex flex-row" href={"/stamp/" + stamp.id}>
        <Image src={stamp.image_url}
            alt="Stamp image"
            width={150} height={150}
            className="p-1"/>
        <div className="p-2">
            <h3 className="text-xl">{stamp.name}</h3>
            {distanceElement}
        </div>
    </Link>
}