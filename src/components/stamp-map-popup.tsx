import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import Image from 'next/image'
import Link from "next/link";

interface StampMapPopupProps {
    isOpen: boolean,
    id: string
}

export default function StampMapPopup({isOpen, id}: StampMapPopupProps) {
    const [name, setName] = useState("loading...");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        if (isOpen) {
            setName("test");
            setImageUrl("https://leafletjs.com/docs/images/logo.png"); // TODO: Use react cache
        }
    }, [isOpen]);

    return <Popup>
        <Link href={"/stamp/" + id}>
            <h3>{name}</h3>
            <Image src={imageUrl} alt="hi" height={100} width={100}></Image>
        </Link>
    </Popup>
}