import { SupportedLocale } from "@/localization/localization";

export default function localizeHref(locale: SupportedLocale, href: string) {
    return `/${locale}${href}`;
}