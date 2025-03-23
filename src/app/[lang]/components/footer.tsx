import Dictionary from "@/localization/dictionaries/dictionary";
import Link from "next/link";
import localizeHref from "../utils/localize-href";
import { SupportedLocale } from "@/localization/localization";
import Translation from "./translation";

interface FooterParams {
    dictionary: Dictionary["footer"],
    locale: SupportedLocale
}

export default function Footer({ dictionary, locale }: FooterParams) {
    return <footer className="border-t border-border text-primary flex flex-row">
        <Link href={localizeHref(locale, "/about")} className="flex-grow text-center p-1" prefetch={false}>
            <Translation text={dictionary["about"]}/>
        </Link>
        <Link href={localizeHref(locale, "/privacy-policy")} className="flex-grow text-center p-1" prefetch={false}>
            <Translation text={dictionary["privacy-policy"]}/>
        </Link>
        <Link href={localizeHref(locale, "/privacy-preferences")} className="flex-grow text-center p-1" prefetch={false}>
            <Translation text={dictionary["privacy-preferences"]}/>
        </Link>
        <Link href="https://github.com/bacowan/japan-stamp" className="flex-grow text-center p-1" prefetch={false}>
            <Translation text={dictionary["github"]}/>
        </Link>
    </footer>
}