'use client'

import auth from '../utils/firebase-init';
import { MouseEventHandler, MutableRefObject, PropsWithChildren, RefObject, useEffect, useRef, useState } from "react";
import {usePathname, useRouter} from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { FaUserCircle } from "react-icons/fa";
import { IconContext } from "react-icons";
import useOutsideAlerter from '@/utils/useOutsideAlerter';

interface StyledLinkProps {
    ref?: MutableRefObject<null>,
    isActive?: boolean,
    href?: string,
    onClick?: MouseEventHandler
}

function StyledLink({ children, isActive = false, href = "", onClick, ref }: PropsWithChildren<StyledLinkProps>) {
    let className = "float-none text-left p-3 no-underline text-lg rounded block sm:float-left sm:text-center";
    if (isActive) {
        className += " bg-blue-600 text-white"
    }
    else {
        className += " text-black"
    }
    return <a href={href} className={className} onClick={onClick} ref={ref}>
        {children}
    </a>
}

export default function Navbar() {
    const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
    const [isUserMenuShown, setIsUserMenuShown] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsSignedIn(true);
            }
            else {
                setIsSignedIn(false);
            }
        });
        return unsubscribe;
    })


    const pathname = usePathname();

    function onUserLinkClick(e: React.MouseEvent<HTMLElement>) {
        setIsUserMenuShown(prev => !prev);
        e.preventDefault();
    }

    let userMenu: JSX.Element;
    if (isUserMenuShown) {
        userMenu = <div className="absolute top-full right-0 z-50 flex flex-col bg-[#f1f1f1] float-none w-full sm:float-right sm:text-center sm:w-auto">
            <a href="/contribute" className='p-2.5 block'>
                Contribute
            </a>
            <a onClick={e => {
                signOut(auth);
                e.preventDefault();
            }} className='cursor-pointer p-2.5 block'>
                Log Out
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
        userLink = <StyledLink isActive={pathname === "/login"} href="login">Login</StyledLink>;
    }
    else {
        userLink = <></>;
    }

    return <>
        <div className="bg-[#f1f1f1] p-2.5 grow-0 shrink-0 basis-[auto] relative">
            <StyledLink href="/">Japan Stamp</StyledLink>
            <div className="float-none sm:float-right">
                <StyledLink isActive={pathname === "/"} href="/">Map</StyledLink>
                <StyledLink isActive={pathname === "/list"} href="list">List</StyledLink>
                <StyledLink isActive={pathname === "/about"} href="about">About</StyledLink>
                {userLink}
            </div>
            {userMenu}
        </div>
        </>
}

