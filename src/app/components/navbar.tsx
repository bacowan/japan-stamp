import Link from "next/link"

export default function Navbar() {
    return <nav className="border-b border-border text-primary">
        <ul>
            <li className="p-4"><Link href="/">Japan Stamp</Link></li>
        </ul>
    </nav>
}