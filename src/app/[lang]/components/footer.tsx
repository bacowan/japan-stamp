import Dictionary from "@/localization/dictionaries/dictionary";
import Link from "next/link";
import localizeHref from "../utils/localize-href";
import { SupportedLocale } from "@/localization/localization";

interface FooterParams {
    dictionary: Dictionary["footer"],
    locale: SupportedLocale
}

export default function Footer({ dictionary, locale }: FooterParams) {
    return <footer className="border-t border-border text-primary flex flex-row">
        <Link href={localizeHref(locale, "/about")} className="flex-grow text-center p-1">{dictionary["about"]}</Link>
        <Link href={localizeHref(locale, "/privacy-policy")} className="flex-grow text-center p-1">{dictionary["privacy-policy"]}</Link>
        <Link href="https://github.com/bacowan/japan-stamp" className="flex-grow text-center p-1">{dictionary["github"]}</Link>
    </footer>
}