import { PropsWithChildren } from "react";

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
    return <div className="overflow-hidden bg-[#f1f1f1] p-2.5 grow-0 shrink-0 basis-[auto]">
            <StyledLink href="">Japan Stamp</StyledLink>
            <div className="float-none sm:float-right">
                <StyledLink isActive={true} href="#home">Map</StyledLink>
                <StyledLink href="#list">List</StyledLink>
                <StyledLink href="#about">About</StyledLink>
                <StyledLink href="#login">Login</StyledLink>
            </div>
        </div>
}

