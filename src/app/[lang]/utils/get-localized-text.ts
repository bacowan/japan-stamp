import { LocalizedText } from "@/database/database_types/localized-text";
import { SupportedLocale, supportedLocales } from "@/localization/localization";

export default function getLocalizedText(text: LocalizedText, locale: SupportedLocale): string {
    return text[locale] ?? text[supportedLocales[0]] ?? "";
}