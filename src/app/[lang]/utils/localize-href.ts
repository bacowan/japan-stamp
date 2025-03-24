import { SupportedLocale } from "@/localization/localization";
import { Url } from "next/dist/shared/lib/router/router";

export default function localizeHref(locale: SupportedLocale, href: Url) {
    return `/${locale}${href}`;
}