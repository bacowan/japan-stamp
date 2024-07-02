'use client'

import useSignedIn from '@/utils/use-signed-in';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { LegacyRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { FaLocationDot } from "react-icons/fa6";
import { useMap } from 'react-leaflet';
import { Map } from 'leaflet'

const MapContainer = dynamic(() => import('react-leaflet').then((module) => module.MapContainer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((module) => module.Marker), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((module) => module.TileLayer), { ssr: false });

function NameInput({ language }: { language: string }) {
    return <label className='p-2 pl-6 flex flex-col'>
        {language}:<input className='m-2'/>
    </label>
}

function DescriptionInput({ language }: { language: string }) {
    return <label className='p-2 pl-6 flex flex-col'>
        { language }:<textarea rows={5}/>
    </label>
}

function Recenter({coords, resetCoords}: {coords: {lat: number, lon: number} | null, resetCoords: () => void}) {
    const map = useMap();
    useEffect(() => {
        if (coords !== null) {
            map.setView([coords.lat, coords.lon], 18);
            resetCoords();
        }
    }, [coords, map, resetCoords]);
    return null;
}

export default function AddStampPage() {
    const isSignedIn = useSignedIn();
    const [useEnglish, setUseEnglish] = useState(true);
    const [useJapanese, setUseJapanese] = useState(false);
    const [fileAsUrl, setFileAsUrl] = useState("");
    const [newCoords, setNewCoords] = useState<{lat: number, lon: number} | null>(null);

    if (isSignedIn === false) {
        redirect("/login?from=/add-stamp")
    }

    function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (files !== null && files.length > 0) {
            setFileAsUrl(URL.createObjectURL(files[0]));
        }
    }

    function onSubmit(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();
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
    if (useEnglish) {
        nameInputs.push(<NameInput language='English' key='English'/>);
        descriptionInputs.push(<DescriptionInput language='English' key='English'/>);
    }
    if (useJapanese) {
        nameInputs.push(<NameInput language='Japanese' key='Japanese'/>);
        descriptionInputs.push(<DescriptionInput language='Japanese' key='Japanese'/>);
    }

    return <div className='self-center w-3/4'>
        <form className='rounded bg-slate-200 m-2 flex flex-col relative'>
            <div className='absolute top-0 right-0 flex flex-col p-1'>
                <label><input checked={useEnglish} onChange={e => setUseEnglish(x => !x)} type="checkbox"/>English</label>
                <label><input checked={useJapanese} onChange={e => setUseJapanese(x => !x)} type="checkbox"/>Japanese</label>
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
                    center={[35.6764, 139.6500]}
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
                    {newCoords !== null && <Recenter coords={{ lat: newCoords.lat, lon: newCoords.lon }} resetCoords={() => setNewCoords(null)}/>}
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
            { fileAsUrl !== "" && 
                <Image
                    src={fileAsUrl}
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