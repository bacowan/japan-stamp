'use client'

import Link from "next/link"
import { TbLanguageHiragana } from "react-icons/tb";
import { SupportedLocale } from "@/localization/localization";
import { usePathname, useSearchParams } from "next/navigation";
import Dictionary from "@/localization/dictionaries/dictionary";
import localizeHref from "../utils/localize-href";
import { LuMenu } from "react-icons/lu";
import { useState } from "react";

interface NavbarParams {
    lang: SupportedLocale,
    showMapHeader: boolean,
    dictionary: Dictionary["navbar"] & Dictionary["common"]
}

export default function Navbar({ lang, dictionary, showMapHeader }: NavbarParams) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const languageMenuItems = [
        { name: dictionary["en-US"], lang: "en-US" },
        { name: dictionary.jp, lang: "ja" }
    ].map(l =>
        <Link
            key={l.lang}
            className="cursor-pointer whitespace-nowrap"
            href={`/${l.lang}${pathname.slice(lang.length + 1)}?${searchParams.toString()}`}
            prefetch={false}>
                {l.name}
        </Link>);

    function onHamburgerClick() {
        setIsMenuOpen(o => !o);
    }

    return <ul className="border-b border-border text-primary flex flex-col sm:flex-row">
        <Link href={localizeHref(lang, "/")} className="flex flex-row items-center pr-3 pl-3 h-10 hover:bg-backgroundHover hover:dark:bg-darkBackgroundHover" prefetch={false}>
            ekistamp.net
        </Link>
        <div className="grow"></div>
        <Link href={localizeHref(lang, "/map")} className={"sm:flex flex-row items-center pr-3 pl-3 h-10 hover:bg-backgroundHover hover:dark:bg-darkBackgroundHover " + (isMenuOpen ? "flex" : "hidden")} prefetch={false}>
            Map
        </Link>
        <div className={"cursor-pointer pr-3 pl-3 h-10 sm:flex flex-row items-center hover:bg-backgroundHover hover:dark:bg-darkBackgroundHover " + (isMenuOpen ? "flex" : "hidden")}>
            <TbLanguageHiragana/>
        </div>
        <div className="sm:hidden cursor-pointer absolute right-[0] top-[0] h-10 hover:bg-backgroundHover hover:dark:bg-darkBackgroundHover" onClick={onHamburgerClick}>
            <LuMenu className="h-full mr-5 ml-5"/>
        </div>
    </ul>
}