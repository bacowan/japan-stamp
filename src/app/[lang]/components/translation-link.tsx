'use client'

import { Url } from "next/dist/shared/lib/router/router"
import Link from "next/link";
import { useParams } from "next/navigation"
import localizeHref from "../utils/localize-href";
import { SupportedLocale } from "@/localization/localization";

interface TranslationLinkParams {
    text: string,
    href: Url
}

export default function TranslationLink({ text, href }: TranslationLinkParams) {
    const urlParams = useParams();
    const lang = urlParams.lang as SupportedLocale;
    return <Link href={localizeHref(lang, href)}>{text}</Link>
}