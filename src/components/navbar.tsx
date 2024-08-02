'use client'

import { auth } from '../utils/firebase-init-client';
import { MouseEventHandler, MutableRefObject, PropsWithChildren, RefObject, useEffect, useRef, useState } from "react";
import { usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { IconContext } from "react-icons";
import useSignedIn from '@/utils/use-signed-in';
import Locale from '@/locales/locale';
import "/node_modules/flag-icons/css/flag-icons.min.css";

interface StyledLinkProps {
    isActive?: boolean,
    href?: string,
    onClick?: MouseEventHandler
}

function StyledLink({ children, isActive = false, href = "", onClick }: PropsWithChildren<StyledLinkProps>) {
    let className = "float-none text-left p-3 no-underline text-lg rounded block relative sm:float-left sm:text-center";
    if (isActive) {
        className += " bg-blue-600 text-white hover:bg-blue-700"
    }
    else {
        className += " text-black hover:bg-slate-400"
    }
    return <a href={href} className={className} onClick={onClick}>
        {children}
    </a>
};

interface NavbarLinkProps {
    isActive?: boolean,
    href?: string,
    onClick?: MouseEventHandler,
    extraClasses?: string
}

function NavbarLink({ children, isActive = false, href = "", onClick, extraClasses }: PropsWithChildren<NavbarLinkProps>) {
    let className = "text-left sm:text-center p-4 no-underline text-lg rounded transition-all ease-in-out hover:text-xl duration-150 ";
    if (extraClasses) {
        className += extraClasses;
    }
    return <a className={className} href={href} onClick={onClick}>
        {children}
    </a>
}

interface SubMenuLinkProps {
    onClick?: MouseEventHandler,
    href?: string
}

function SubMenuLink({children, onClick, href = ""}: PropsWithChildren<SubMenuLinkProps>) {
    return <a href={href} onClick={onClick} className='cursor-pointer p-2.5 block hover:bg-slate-400'>
        {children}
    </a>
}

interface NavbarProps {
    translations: Locale["navbar"],
    lang: string
}

interface MenuItem {
    value: any,
    href?: string
}

interface ResponsiveNavbarProps {
    title: MenuItem,
    items: MenuItem[]
    menuItems: MenuItem[],
}

function ResponsiveNavbar({title, items, menuItems}: ResponsiveNavbarProps) {
    const [isMenuShown, setIsMenuShown] = useState(false);
    
    function onMenuClick(e: React.MouseEvent<HTMLElement>) {
        setIsMenuShown(prev => !prev);
        e.preventDefault();
    }

    const itemElementClasses = isMenuShown ? "" : 'hidden sm:block';

    const titleElement = <NavbarLink href={title.href}>{title.value}</NavbarLink>
    const itemElements = items.map(i => <NavbarLink href={i.href} key={i.href} extraClasses={itemElementClasses}>{i.value}</NavbarLink>);
    const smallMenuItemElements = menuItems.map(i => <NavbarLink href={i.href} key={i.href} extraClasses='block sm:hidden'>{i.value}</NavbarLink>);
    const largeMenuItemElements = <div className='hidden sm:flex absolute top-full right-0 z-50 flex-col bg-blue-950 text-white border-l border-b border-blue-600 float-none'>
        {menuItems.map(i => <NavbarLink href={i.href} key={i.href}>{i.value}</NavbarLink>)}
    </div>

    return <div className='relative'>
        <div className="bg-gradient-to-r from-blue-950 via-blue-800 to-blue-950 border-b border-blue-600 text-white grow-0 shrink-0 basis-[auto] relative flex flex-col sm:flex-row"
            onClick={e => {
                if (e.target === e.currentTarget) {
                    setIsMenuShown(false);
                    e.preventDefault();
                }
            }}>
            {titleElement}
            <div className='ml-0 sm:ml-auto'></div>
            {itemElements}
            {isMenuShown && smallMenuItemElements}
            <a href="#!" className='block p-4 absolute top-0 right-0 sm:relative sm:float-right' onClick={onMenuClick}>
                <IconContext.Provider value={{ size: "1.75em" }}>
                    <FaBars />
                </IconContext.Provider>
            </a>
        </div>
        {isMenuShown && largeMenuItemElements}
    </div>
}

export default function Navbar({ translations, lang }: NavbarProps) {
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

    const title = {
        href: "/" + lang,
        value: "Japan Stamp"
    };
    const items = [
        {
            href: "/" + lang,
            value: translations["map"]
        },
        {
            href: "/" + lang + "/list",
            value: translations["list"]
        },
        {
            href: "/" + lang + "/add-stamp",
            value: translations["add-stamp"]
        },
        {
            href: "/" + lang + "/about",
            value: translations["about"]
        }
    ];
    const menuItems = [
        {
            href: "/" + lang + "/login",
            value: translations["log-in"]
        },
        {
            href: "/" + otherLang + pathnameNoLang,
            value: flagIcon
        },
    ]
    return <ResponsiveNavbar
        title={title}
        items={items}
        menuItems={menuItems}/>

    /*return <>
        <div className="bg-[#f1f1f1] grow-0 shrink-0 basis-[auto] relative">
            <a className="float-none text-left p-4 no-underline text-lg rounded block relative sm:float-left" href={"/" + lang}>
                Test
            </a>
            <a href="javascript:void(0);" className='block float-right p-4 absolute top-0 right-0 sm:relative sm:float-right' onClick={onMenuClick}>
                <IconContext.Provider value={{ size: "1.75em" }}>
                    <FaBars />
                </IconContext.Provider>
            </a>
            <a className="float-none text-left p-4 no-underline text-lg rounded block relative sm:float-right" href={"/" + lang}>
                {translations["map"]}
            </a>
            <a className="float-none text-left p-4 no-underline text-lg rounded block relative sm:float-right" href={"/" + lang}>
                {translations["add-stamp"]}
            </a>
            <a className="float-none text-left p-4 no-underline text-lg rounded block relative sm:float-right" href={"/" + lang}>
                {translations["about"]}
            </a>
        </div>
    </>*/

    /*return <>
        <div className="bg-[#f1f1f1] p-2.5 grow-0 shrink-0 basis-[auto] relative"
            onClick={e => {
                if (e.target === e.currentTarget) {
                    setIsMenuShown(false);
                    e.preventDefault();
                }
            }}>
            <StyledLink href="/">Japan Stamp</StyledLink>
            <div className="float-none sm:float-right">
                <StyledLink isActive={pathnameNoLang === ""} href={"/" + lang}>{translations["map"]}</StyledLink>
                {/*<StyledLink isActive={pathnameNoLang === "/list"} href={"/" + lang + "/list"}>{translations["list"]}</StyledLink>*//*}
                <StyledLink isActive={pathnameNoLang === "/add-stamp"} href={"/" + lang + "/add-stamp"}>{translations["add-stamp"]}</StyledLink>
                <StyledLink isActive={pathnameNoLang === "/about"} href={"/" + lang + "/about"}>{translations["about"]}</StyledLink>
                <StyledLink onClick={onMenuClick}>
                    <IconContext.Provider value={{ size: "1.5em" }}>
                        <FaBars />
                    </IconContext.Provider>
                </StyledLink>
            </div>
            {menu}
        </div>
        </>*/
}

