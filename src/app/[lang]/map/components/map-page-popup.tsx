import StampDto from "@/database/dtos/stampDto";
import Image from "next/image";
import Link from "next/link";
import localizeHref from "../../utils/localize-href";
import { SupportedLocale } from "@/localization/localization";
import getLocalizedText from "../../utils/get-localized-text";

interface MapPagePopupParams {
    stamp: StampDto,
    locale: SupportedLocale
}

export default function MapPagePopup({ stamp, locale }: MapPagePopupParams) {
    return <Link className="w-48 block" href={localizeHref(locale, "/stamp/" + stamp.id)}>
        <h2 className="text-base whitespace-nowrap overflow-hidden text-ellipsis">{getLocalizedText(stamp.name, locale)}</h2>
        <Image src={stamp.image_url} width={150} height={150} alt="Stamp image"
            className="max-w-none w-full"/>
    </Link>
}