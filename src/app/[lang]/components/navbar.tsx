'use client'

import Link from "next/link"
import { TbLanguageHiragana } from "react-icons/tb";
import NavbarItem from "./navbar-item";
import { SupportedLocale } from "@/localization";
import { usePathname, useSearchParams } from "next/navigation";

interface NavbarParams {
    lang: SupportedLocale
}

export default function Navbar({ lang }: NavbarParams) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const languageMenuItems = [
        { name: "English", lang: "en-US" },
        { name: "Japanese", lang: "ja" }
    ].map(l =>
        <Link
            key={l.lang}
            className="cursor-pointer"
            href={`/${l.lang}${pathname.slice(lang.length + 1)}?${searchParams.toString()}`}>
                {l.name}
        </Link>);

    return <nav className="border-b border-border text-primary">
        <ul className="flex flex-row h-10 items-stretch">
            <NavbarItem>
                <Link href="/" className="flex flex-row items-center pr-3 pl-3 h-full"><span>Japan Stamp</span></Link>
            </NavbarItem>
            <div className="grow"></div>
            <NavbarItem menuItems={languageMenuItems}>
                <TbLanguageHiragana className="mr-3 ml-3 h-full"/>
            </NavbarItem>
        </ul>
    </nav>
}