'use client'

import { auth } from '../utils/firebase-init-client';
import { MouseEventHandler, MutableRefObject, PropsWithChildren, useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaUserCircle } from "react-icons/fa";
import { IconContext } from "react-icons";
import useSignedIn from '@/utils/use-signed-in';
import Locale from '@/locales/locale';
import "/node_modules/flag-icons/css/flag-icons.min.css";

interface StyledLinkProps {
    ref?: MutableRefObject<null>,
    isActive?: boolean,
    href?: string,
    onClick?: MouseEventHandler
}

function StyledLink({ children, isActive = false, href = "", onClick, ref }: PropsWithChildren<StyledLinkProps>) {
    let className = "float-none text-left p-3 no-underline text-lg rounded block sm:float-left sm:text-center relative";
    if (isActive) {
        className += " bg-blue-600 text-white hover:bg-blue-700"
    }
    else {
        className += " text-black hover:bg-slate-400"
    }
    return <a href={href} className={className} onClick={onClick} ref={ref}>
        {children}
    </a>
}

interface NavbarProps {
    translations: Locale["navbar"],
    lang: string
}

export default function Navbar({ translations, lang }: NavbarProps) {
    const [isUserMenuShown, setIsUserMenuShown] = useState(false);
    const isSignedIn = useSignedIn();
    const pathname = usePathname();
    const pathnameNoLang = pathname.slice(lang.length + 1);

    let otherLang: string;
    let flagIcon: JSX.Element;
    if (lang === "jp") {
        flagIcon = <span className="fi fi-jp fis rounded-full text-xl border border-black"></span>
        otherLang = "en-US";
    }
    else {
        flagIcon = <>
            <span className="fi fi-us fis rounded-full text-xl border border-black diagonal-cut-top-left"></span>
            <span className="fi fi-gb fis rounded-full text-xl border border-black diagonal-cut-bottom-right ml-[-1em]"></span>
        </>
        otherLang = "jp";
    }

    function onUserLinkClick(e: React.MouseEvent<HTMLElement>) {
        setIsUserMenuShown(prev => !prev);
        e.preventDefault();
    }

    let userMenu: JSX.Element;
    if (isUserMenuShown) {
        userMenu = <div className="absolute top-full right-0 z-50 flex flex-col bg-[#f1f1f1] float-none w-full sm:float-right sm:text-center sm:w-auto">
            <a onClick={e => {
                signOut(auth);
                setIsUserMenuShown(false);
                e.preventDefault();
            }} className='cursor-pointer p-2.5 block hover:bg-slate-400'>
                {translations["log-out"]}
            </a>
        </div>
    }
    else {
        userMenu = <></>
    }
    
    let userLink: JSX.Element;
    if (isSignedIn === true) {
        userLink = <StyledLink onClick={onUserLinkClick}>
                <IconContext.Provider value={{ size: "1.5em" }}>
                    <FaUserCircle />
                </IconContext.Provider>
            </StyledLink>
    }
    else if (isSignedIn === false) {
        userLink = <StyledLink isActive={pathnameNoLang === "/login"} href="login">Login</StyledLink>;
    }
    else {
        userLink = <></>;
    }

    return <>
        <div className="bg-[#f1f1f1] p-2.5 grow-0 shrink-0 basis-[auto] relative">
            <StyledLink href="/">Japan Stamp</StyledLink>
            <div className="float-none sm:float-right">
                <StyledLink isActive={pathnameNoLang === "/"} href={"/" + lang}>{translations["map"]}</StyledLink>
                <StyledLink isActive={pathnameNoLang === "/list"} href={"/" + lang + "/list"}>{translations["list"]}</StyledLink>
                <StyledLink isActive={pathnameNoLang === "/add-stamp"} href={"/" + lang + "/add-stamp"}>{translations["add-stamp"]}</StyledLink>
                <StyledLink isActive={pathnameNoLang === "/about"} href={"/" + lang + "/about"}>{translations["about"]}</StyledLink>
                {userLink}
                <StyledLink isActive={false} href={"/" + otherLang + pathnameNoLang}>{flagIcon}</StyledLink>
            </div>
            {userMenu}
        </div>
        </>
}

