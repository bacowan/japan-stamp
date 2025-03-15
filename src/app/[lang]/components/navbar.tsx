'use client'

import Link from "next/link"
import { TbLanguageHiragana } from "react-icons/tb";
import { SupportedLocale } from "@/localization/localization";
import { usePathname, useSearchParams } from "next/navigation";
import Dictionary from "@/localization/dictionaries/dictionary";
import localizeHref from "../utils/localize-href";
import { LuMenu } from "react-icons/lu";
import { useState } from "react";
import Modal from "./modal";

interface NavbarParams {
    lang: SupportedLocale,
    showMapHeader: boolean,
    dictionary: Dictionary["navbar"] & Dictionary["common"]
}

export default function Navbar({ lang, dictionary, showMapHeader }: NavbarParams) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLanguageSelectionOpen, setIsLanguageSelectionOpen] = useState(false);
    const languageMenuItems = [
        { name: dictionary["en-US"], lang: "en-US" },
        { name: dictionary.jp, lang: "ja" }
    ].map(l =>
        <li className="border flex hover:bg-backgroundHover hover:dark:bg-darkBackgroundHover" key={l.lang}>
            <Link
                className="cursor-pointer whitespace-nowrap p-4 w-full"
                href={`/${l.lang}${pathname.slice(lang.length + 1)}?${searchParams.toString()}`}
                prefetch={false}>
                    {l.name}
            </Link>
        </li>);

    function onHamburgerClick() {
        setIsMenuOpen(o => !o);
    }

    function onLanguageClick() {
        setIsLanguageSelectionOpen(true);
    }

    return <>
        <ul className="border-b border-border text-primary flex flex-col sm:flex-row">
            <Link href={localizeHref(lang, "/")} className="flex flex-row items-center pr-3 pl-3 h-10 hover:bg-backgroundHover hover:dark:bg-darkBackgroundHover" prefetch={false}>
                ekistamp.net
            </Link>
            <div className="grow"></div>
            <Link href={localizeHref(lang, "/map")} className={"sm:flex flex-row items-center pr-3 pl-3 h-10 hover:bg-backgroundHover hover:dark:bg-darkBackgroundHover " + (isMenuOpen ? "flex" : "hidden")} prefetch={false}>
                Map
            </Link>
            <div className={"cursor-pointer pr-3 pl-3 h-10 sm:flex flex-row items-center hover:bg-backgroundHover hover:dark:bg-darkBackgroundHover " + (isMenuOpen ? "flex" : "hidden")}
                    onClick={onLanguageClick}>
                <TbLanguageHiragana/>
            </div>
            <div className="sm:hidden cursor-pointer absolute right-[0] top-[0] h-10 hover:bg-backgroundHover hover:dark:bg-darkBackgroundHover"
                    onClick={onHamburgerClick}>
                <LuMenu className="h-full mr-5 ml-5"/>
            </div>
        </ul>
        {
            isLanguageSelectionOpen &&
            <Modal closeModal={() => setIsLanguageSelectionOpen(false)}>
                <h4 className="p-4">Select a language:</h4>
                <ul className="flex flex-col">
                    {languageMenuItems}
                </ul>
            </Modal>
        }
    </>
}