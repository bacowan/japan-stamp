'use client'

import { LatLngExpression } from "leaflet"
import Image from 'next/image';
import dynamic from "next/dynamic";
import { Stamp } from "@/app/database-structure/stamp";
import { textFromLang } from "@/utils/translation/extract-locale-text";
import { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/utils/firebase-init-client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MapContainer = dynamic(() => import('react-leaflet').then((module) => module.MapContainer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((module) => module.Marker), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((module) => module.TileLayer), { ssr: false });

export type TodoResponse = {
  content: string | null;
  isDone: boolean | null;
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface StampPageClientParams {
    id: string,
    stamp: Stamp | null,
    lang: string
  }

  
export default function PageClient({id, stamp, lang}: StampPageClientParams) {
  const [imageUrl, setImageUrl] = useState(""); // TODO: get placeholder image for default
  const pathname = usePathname();
    
  useEffect(() => {
    (async function() {
      if (stamp !== null) {
        try {
            setImageUrl(await getDownloadURL(ref(storage, stamp["image-path"]))); // TODO: Use react cache
        }
        catch {
            // TODO: Logging
        }
      }
    })();
  }, [stamp]);
  
  const name = stamp === null ? "" : textFromLang(stamp.name, lang);
  const description = stamp === null ? "" : textFromLang(stamp.description, lang);
  const location: LatLngExpression = stamp === null || stamp.location.coordinates.length !== 2
    ? [35.6764, 139.6500]
    : [stamp.location.coordinates[1], stamp.location.coordinates[0]];

  return <>
      <h1 className="text-center text-2xl">
        <span>{name}</span>
        <sup className="text-xs">
          <Link href={pathname + "/edit"}>Edit</Link>
        </sup>
      </h1>
      <div className="flex flex-col sm:flex-row pt-4">
        <Image className="block mx-auto w-3/5 sm:w-2/5 border border-white self-center"
            src={imageUrl} alt="hi" height={100} width={100}></Image>
        <MapContainer
          center={location}
          scrollWheelZoom={true}
          zoom={15}
          className="block ml-auto mr-auto w-3/5 sm:w-2/5 mt-3 sm:mt-0 aspect-square">
          <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          <Marker position={location}></Marker>
        </MapContainer>
      </div>
      <h2 className="text-center text-xl pt-4">
        Instructions
      </h2>
      <p>{description}</p>
  </>
}