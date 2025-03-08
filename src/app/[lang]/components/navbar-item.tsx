import { JSX, PropsWithChildren } from "react";

interface NavbarItemParams {
    menuItems?: JSX.Element[]
}

export default function NavbarItem({ menuItems, children }: PropsWithChildren<NavbarItemParams>) {
    return <li className="group relative">
        {children}
        {
            menuItems !== undefined && menuItems.length > 0 &&
            <ul className="hidden group-hover:block absolute right-[0] flex flex-col border-l border-r border-t text-center bg-background dark:bg-darkBackground">
                {menuItems.map(i =>
                    <li key={i.key} className="border-b p-2 bg-inherit">
                        {i}
                    </li>)}
            </ul>
        }
    </li>
}