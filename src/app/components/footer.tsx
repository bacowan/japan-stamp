import Link from "next/link";

export default function Footer() {
    return <footer className="border-t border-border text-primary flex flex-row">
        <a className="flex-grow text-center p-1">About</a>
        <Link href="/privacy-policy" className="flex-grow text-center p-1">Privacy Policy</Link>
        <a className="flex-grow text-center p-1">Github</a>
    </footer>
}