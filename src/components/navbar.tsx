'use client'

import { PropsWithChildren } from "react";
import {usePathname, useRouter} from 'next/navigation'; 

function StyledLink({ children, isActive = false, href }: PropsWithChildren<{ isActive?: boolean, href: string }>) {
    let className = "float-none text-left p-3 no-underline text-lg rounded block sm:float-left sm:text-center";
    if (isActive) {
        className += " bg-blue-600 text-white"
    }
    else {
        className += " text-black"
    }
    return <a href={href} className={className}>
        {children}
    </a>
}

export default function Navbar() {
    const pathname = usePathname();
    return <div className="overflow-hidden bg-[#f1f1f1] p-2.5 grow-0 shrink-0 basis-[auto]">
            <StyledLink href="/">Japan Stamp</StyledLink>
            <div className="float-none sm:float-right">
                <StyledLink isActive={pathname === "/"} href="/">Map</StyledLink>
                <StyledLink isActive={pathname === "/list"} href="list">List</StyledLink>
                <StyledLink isActive={pathname === "/about"} href="about">About</StyledLink>
                <StyledLink isActive={pathname === "/login"} href="login">Login</StyledLink>
            </div>
        </div>
}

