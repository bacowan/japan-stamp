'use client'

import Link from "next/link";
import Image from 'next/image';
import dynamic from "next/dynamic";
import { Stamp } from "@/app/database-structure/stamp"
import { textFromLang } from "@/utils/translation/extract-locale-text";
import { LatLngExpression } from "leaflet";
import useSignedIn from "@/utils/use-signed-in";
import { ChangeEventHandler, useEffect, useState } from "react";
import { LocaleKeys, locales } from "@/utils/translation/locale-text";
import MapEventListener from "@/utils/map-event-listener";
import MapRecenter from "@/components/map-recenter";
import { FaLocationDot } from "react-icons/fa6";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/utils/firebase-init-client";

const defaultCenter: { lat: number, lon: number } = { lat: 35.6764, lon: 139.6500 };

const MapContainer = dynamic(() => import('react-leaflet').then((module) => module.MapContainer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((module) => module.Marker), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((module) => module.TileLayer), { ssr: false });

interface InputParams<T> {
    language: string,
    value: string,
    onChange: ChangeEventHandler<T>
}

function NameInput({ language, value, onChange }: InputParams<HTMLInputElement>) {
    return <label className='p-2 pl-6 flex flex-col'>
        {language}:<input className='m-2' value={value} onChange={onChange}/>
    </label>
}

function DescriptionInput({ language, value, onChange }: InputParams<HTMLTextAreaElement>) {
    return <label className='p-2 pl-6 flex flex-col'>
        { language }:<textarea rows={5} value={value} onChange={onChange}/>
    </label>
}

export interface EditStampPageClientParams {
    id: string,
    stamp: Stamp,
    lang: string
  }

export default function PageClient({id, stamp, lang}: EditStampPageClientParams) {

    const originalName = textFromLang(stamp.name, lang);
    const originalDescription = textFromLang(stamp.description, lang);
    const originalLocation: LatLngExpression = stamp.location.coordinates.length !== 2
      ? [35.6764, 139.6500]
      : [stamp.location.coordinates[1], stamp.location.coordinates[0]];

      const isSignedIn = useSignedIn();
      const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
      const [usedLanguages, setUsedLanguages] = useState(locales.reduce((obj, key) => {
          obj[key] = (stamp.description[key] !== "" && stamp.description[key] !== undefined) ||
            (stamp.name[key] !== "" && stamp.description[key] !== undefined);
          return obj;
      }, {} as { [key: string]: boolean }));
      const [names, setNames] = useState(locales.reduce((obj, key) => {
          obj[key] = stamp.name[key] ?? "";
          return obj;
      }, {} as { [key: string]: string }));
      const [descriptions, setDescriptions] = useState(locales.reduce((obj, key) => {
          obj[key] = stamp.description[key] ?? "";
          return obj;
      }, {} as { [key: string]: string }));
      const [file, setFile] = useState<{asUrl: string, asFile: Blob | null}>({asUrl: "", asFile: null})
      const [newCoords, setNewCoords] = useState<{lat: number, lon: number} | null>(null);
      const [currentLocation, setCurrentLocation] = useState({ 
        lat: stamp.location.coordinates[1],
        lon: stamp.location.coordinates[0]
      });

      useEffect(() => {
        (async function() {
          try {
              setFile({
                asUrl: await getDownloadURL(ref(storage, stamp["image-path"])),
                asFile: null
              }); // TODO: Use react cache
          }
          catch {
              // TODO: Logging
          }
        })();
      }, [stamp]);

      function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (files !== null && files.length > 0) {
            setFile({
                asUrl: URL.createObjectURL(files[0]),
                asFile: files[0]
            });
        }
      }

      function goToCurrentPosition(position: GeolocationPosition) {
        setNewCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude
        });
      }

      function onUseCurrentPosition(e: React.MouseEvent<HTMLElement>) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(goToCurrentPosition);
        } else { 
            alert("Sorry, your browser does not support this feature.")
        }
        e.preventDefault();
    }

      const nameInputs: JSX.Element[] = [];
      const descriptionInputs: JSX.Element[] = [];
      const useLanguageCheckboxes: JSX.Element[] = [];
      for (let i = 0; i < locales.length; i++) {
          const language = locales[i];
  
          useLanguageCheckboxes.push(
              <label key={language}><input
                  checked={usedLanguages[language]}
                  onChange={e => setUsedLanguages(prev => ({
                      ...prev,
                      [language]: !prev[language]
                  }))}
                  type="checkbox"/>
                      {language}
              </label>);
  
          if (usedLanguages[language]) {
              nameInputs.push(<NameInput
                  language={language}
                  key={language}
                  value={names[language]}
                  onChange={e => setNames(prev => ({
                      ...prev,
                      [language]: e.target.value
                  }))}/>);
              descriptionInputs.push(<DescriptionInput
                  language={language}
                  key={language}
                  value={descriptions[language]}
                  onChange={e => setDescriptions(prev => ({
                      ...prev,
                      [language]: e.target.value
                  }))}/>);
          }
      }

    async function onSubmit(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();
    }

    return <div className='self-center w-3/4'>
      <form className='rounded bg-blue-50 border border-blue-100 m-2 flex flex-col relative'>
          <div className='absolute top-0 right-0 flex flex-col p-1'>
              {useLanguageCheckboxes}
          </div>
          <h2 className="text-xl p-4">Stamp Name</h2>
          {nameInputs}
          <div className='flex flex-row items-center'>
              <h2 className="text-xl p-4">Location</h2>
              <button className='text-sm p-1 bg-blue-600 text-white rounded hover:bg-blue-700' onClick={onUseCurrentPosition}>
                  Use Current Position
              </button>
          </div>
          <div className='relative'>
              <MapContainer
                  center={[stamp.location.coordinates[1], stamp.location.coordinates[0]]}
                  scrollWheelZoom={true}
                  zoom={18}
                  style={{
                      "display": "block",
                      "marginLeft": "auto",
                      "marginRight": "auto",
                      "width": "80%",
                      "aspectRatio": "1/1",
                      "maxWidth": "50em",
                      "maxHeight": "50em",
                      "zIndex": "0"
                  }}>
                  <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                  <MapEventListener setLocation={setCurrentLocation}/>
                  {newCoords !== null && <MapRecenter coords={{ lat: newCoords.lat, lon: newCoords.lon }} resetCoords={() => setNewCoords(null)}/>}
              </MapContainer>
              <FaLocationDot 
                  style={{
                      "zIndex": "50",
                      "position": "absolute",
                      "left": "0",
                      "bottom": "50%",
                      "right": "0",
                      "margin": "auto",
                      "pointerEvents": "none"
                  }}/>
          </div>
          <h2 className="text-xl p-4">Image</h2>
          <input type="file" name="img" accept="image/*" onChange={onImageChange} className='pl-6'/>
          { file.asUrl !== "" && 
              <Image
                  src={file.asUrl}
                  alt="uploaded stamp"
                  height={0}
                  width={0}
                  style={{width:'75%', height: "auto" }}/> }
          <h2 className="text-xl p-4">Location Description</h2>
          {descriptionInputs}
          <button className='m-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700' onClick={onSubmit}>
              Submit
          </button>
      </form>
  </div>
}