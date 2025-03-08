import Link from "next/link"
import LangIcon from "./lang-icon"
import { TbLanguageHiragana } from "react-icons/tb";

interface NavbarParams {
    lang: 'en-US' | 'ja'
}

export default function Navbar({ lang }: NavbarParams) {
    return <nav className="border-b border-border text-primary">
        <ul className="flex flex-row h-10 items-stretch">
            <li><Link href="/" className="block flex flex-row items-center pr-3 pl-3"><span>Japan Stamp</span></Link></li>
            <div className="grow"></div>
            <li className="cursor-pointer h-full"><TbLanguageHiragana className="mr-3 ml-3"/></li>
        </ul>
    </nav>
}