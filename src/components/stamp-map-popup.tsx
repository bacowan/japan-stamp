import { useEffect, useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import dynamic from "next/dynamic";
import Stamp from "@/app/api-response-types/stamp";
import getTranslation from "@/utils/get-translation";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/utils/firebase-init-client";

const Popup = dynamic(() => import('react-leaflet').then((module) => module.Popup), { ssr: false });

interface StampMapPopupProps {
    isOpen: boolean,
    stamp: Stamp,
    lang: string
}

export default function StampMapPopup({isOpen, stamp, lang}: StampMapPopupProps) {
    //const [name, setName] = useState("loading...");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [image, setImage] = useState<JSX.Element | null>(null);

    useEffect(() => {
        (async function() {
            try {
                setImageUrl(await getDownloadURL(ref(storage, stamp.imageUrl))); // TODO: Use react cache
            }
            catch {
                // TODO: Logging
            }
        })();
    }, [stamp]);

    useEffect(() => {
        if (isOpen && imageUrl !== null) {
            setImage(<Image style={{maxWidth: "none"}} src={imageUrl} alt="hi" height={100} width={100}/>);
        }
    }, [isOpen, imageUrl]);

    return <Popup>
        <Link href={"/stamp/" + stamp.id}>
            <h3>{getTranslation(lang, stamp.name)}</h3>
            {image}
        </Link>
    </Popup>
}