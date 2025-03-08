'use client'

import Link from "next/link"
import { TbLanguageHiragana } from "react-icons/tb";
import NavbarItem from "./navbar-item";
import { SupportedLocale } from "@/localization/localization";
import { usePathname, useSearchParams } from "next/navigation";
import Dictionary from "@/localization/dictionaries/dictionary";
import localizeHref from "../utils/localize-href";

interface NavbarParams {
    lang: SupportedLocale,
    dictionary: Dictionary["navbar"] & Dictionary["common"]
}

export default function Navbar({ lang, dictionary }: NavbarParams) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const languageMenuItems = [
        { name: dictionary["en-US"], lang: "en-US" },
        { name: dictionary.jp, lang: "ja" }
    ].map(l =>
        <Link
            key={l.lang}
            className="cursor-pointer whitespace-nowrap"
            href={`/${l.lang}${pathname.slice(lang.length + 1)}?${searchParams.toString()}`}>
                {l.name}
        </Link>);

    return <nav className="border-b border-border text-primary">
        <ul className="flex flex-row h-10 items-stretch">
            <NavbarItem>
                <Link href={localizeHref(lang, "/")} className="flex flex-row items-center pr-3 pl-3 h-full"><span>Japan Stamp</span></Link>
            </NavbarItem>
            <div className="grow"></div>
            <NavbarItem menuItems={languageMenuItems}>
                <TbLanguageHiragana className="mr-3 ml-3 h-full"/>
            </NavbarItem>
        </ul>
    </nav>
}