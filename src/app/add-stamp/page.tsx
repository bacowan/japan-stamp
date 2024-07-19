'use client'

import useSignedIn from '@/utils/use-signed-in';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ChangeEventHandler, LegacyRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { FaLocationDot } from "react-icons/fa6";
import { useMap } from 'react-leaflet';
import { Map } from 'leaflet'
import MapEventListener from '@/utils/map-event-listener';
import { auth } from '../../utils/firebase-init-client';

const defaultCenter: { lat: number, lon: number } = { lat: 35.6764, lon: 139.6500 };
const languages = ["English", "Japanese"];

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
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
    const [usedLanguages, setUsedLanguages] = useState(languages.reduce((obj, key) => {
        obj[key] = key === "English";
        return obj;
    }, {} as { [key: string]: boolean }));
    const [names, setNames] = useState(languages.reduce((obj, key) => {
        obj[key] = "";
        return obj;
    }, {} as { [key: string]: string }));
    const [descriptions, setDescriptions] = useState(languages.reduce((obj, key) => {
        obj[key] = "";
        return obj;
    }, {} as { [key: string]: string }));
    const [file, setFile] = useState<{asUrl: string, asFile: Blob | null}>({asUrl: "", asFile: null})
    const [newCoords, setNewCoords] = useState<{lat: number, lon: number} | null>(null);
    const [currentLocation, setCurrentLocation] = useState(defaultCenter);
    
    if (isSignedIn === false) {
        redirect("/login?from=/add-stamp");
    }
    else if (redirectUrl !== null) {
        redirect(redirectUrl);
    }

    function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (files !== null && files.length > 0) {
            setFile({
                asUrl: URL.createObjectURL(files[0]),
                asFile: files[0]
            });
        }
    }

    async function onSubmit(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();
        const formData = new FormData();
        const name: {[key: string]: string} = {};
        const description: {[key: string]: string} = {};
        for (let i = 0; i < languages.length; i++) {
            const language = languages[i];
            if (usedLanguages[language]) {
                if (names[language]) {
                    name[language.toLowerCase()] = names[language];
                }
                if (descriptions[language]) {
                    description[language.toLowerCase()] = descriptions[language];
                }
            }
        }
        // TODO: It should really check that each language is filled out completely.
        // With the way it's set up now, you could end up with an english name and a
        // Japanese description but that's it

        if (Object.keys(name).length === 0) {
            // TODO: Proper error handling
            alert("Need to supply at least one name");
            return;
        }
        else if (Object.keys(description).length === 0) {
            // TODO: Proper error handling
            alert("Need to supply at least one description");
            return;
        }
        else if (file.asFile === null) {
            // TODO: Proper error handling
            alert("Need to supply a file");
            return;
        }
        
        formData.append("name", JSON.stringify(name));
        formData.append("description", JSON.stringify(description));
        formData.append("location", JSON.stringify(currentLocation));
        formData.append("image", file.asFile);

        if (auth.currentUser === null) {
            // TODO: Error handling
            return;
        }

        try {
            const idToken = await auth.currentUser.getIdToken(true);
            const response = await fetch('/api/stamps', {
                method: 'POST',
                headers: { "Authorization": idToken },
                body: formData,
                });
            if (response.ok) {
                const jsonResponse = JSON.parse(await response.text());
                if ("id" in jsonResponse) {
                    setRedirectUrl("/stamp/" + jsonResponse["id"]);
                }
                else {
                    // TODO: Proper error handling
                    console.log("Request appears to have succeeded, but response from the server was incorrect: " + jsonResponse);
                    return;
                }
            }
            else {
                // TODO: Proper error handling
                console.log("Failed. " + response.status + ". " + await response.text());
                return;
            }
        }
        catch (e) {
            // TODO: Proper error handling
            console.log(e);
            return;
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
    for (let i = 0; i < languages.length; i++) {
        const language = languages[i];

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

    return <div className='self-center w-3/4'>
        <form className='rounded bg-slate-200 m-2 flex flex-col relative'>
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
                    center={[defaultCenter.lat, defaultCenter.lon]}
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