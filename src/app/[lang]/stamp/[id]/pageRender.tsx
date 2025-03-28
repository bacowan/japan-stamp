'use client'

import StampDto from "@/database/dtos/stampDto";
import useLeaflet from "@/hooks/use-leaflet";
import Dictionary from "@/localization/dictionaries/dictionary";
import { SupportedLocale } from "@/localization/localization";
import dynamic from "next/dynamic";
import Image from "next/image";
import { AiOutlineLoading } from "react-icons/ai";
import getLocalizedText from "../../utils/get-localized-text";
import Translation from "../../components/translation";

interface StampRenderProps {
    stamp: StampDto,
    dictionary: Dictionary["stamp-page"],
    locale: SupportedLocale
}

const DynamicMap = dynamic(
    () => import("./components/stamp-page-map"),
    {
        ssr: false,
        loading: () => {
            return <div className="w-full max-w-2xl aspect-square flex justify-center items-center">
                <AiOutlineLoading className="animate-spin"/>
            </div>
        }
    });

export default function StampPageRender({ stamp, dictionary, locale }: StampRenderProps) {
    useLeaflet();
    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl text-center">{getLocalizedText(stamp.name, locale)}</h1>
            <h2 className="text-xl text-center p-3">
                <Translation text={dictionary["stamp-preview"]}/>
            </h2>
            <Image src={stamp.image_url} width={500} height={500} alt="picture"
                className="w-full max-w-2xl p-2"/>
            <h2 className="text-xl text-center p-3">
                <Translation text={dictionary["map"]}/>
            </h2>
            <DynamicMap stamp={stamp}/>
            <h2 className="text-xl text-center p-3">
                <Translation text={dictionary["details"]}/>
            </h2>
            <p className="pl-3 pr-3 pb-3">{getLocalizedText(stamp.description, locale)}</p>
        </div>
    );
}