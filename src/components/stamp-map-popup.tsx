import { useEffect, useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import dynamic from "next/dynamic";

const Popup = dynamic(() => import('react-leaflet').then((module) => module.Popup), { ssr: false });

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